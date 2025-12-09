/**
 * Vault Management Hooks
 * React Query hooks for vault operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaultService, type Vault, type VaultMember, type AddMemberRequest, type UpdateMemberRequest } from '@/services/vaultService';
import { type Password } from '@/services/passwordService';

/**
 * Get all vaults for the current user
 */
export function useVaults() {
  return useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getAll(),
  });
}

/**
 * Get a specific vault by ID
 */
export function useVault(vaultId: string) {
  return useQuery({
    queryKey: ['vaults', vaultId],
    queryFn: () => vaultService.getById(vaultId),
    enabled: !!vaultId,
  });
}

/**
 * Get all items (passwords) in a vault
 */
export function useVaultItems(vaultId: string) {
  return useQuery({
    queryKey: ['vaults', vaultId, 'items'],
    queryFn: () => vaultService.getItems(vaultId),
    enabled: !!vaultId,
  });
}

/**
 * Get all members of a vault
 */
export function useVaultMembers(vaultId: string) {
  return useQuery({
    queryKey: ['vaults', vaultId, 'members'],
    queryFn: () => vaultService.getMembers(vaultId),
    enabled: !!vaultId,
  });
}

/**
 * Update vault name
 */
export function useUpdateVaultName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaultId, name }: { vaultId: string; name: string }) =>
      vaultService.updateName(vaultId, name),
    onSuccess: (updatedVault) => {
      // Invalidate and refetch vault queries
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      queryClient.invalidateQueries({ queryKey: ['vaults', updatedVault.id] });
    },
  });
}

/**
 * Add a member to a vault (share vault)
 */
export function useAddVaultMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaultId, data }: { vaultId: string; data: AddMemberRequest }) =>
      vaultService.addMember(vaultId, data),
    onSuccess: (_, variables) => {
      // Invalidate vault members query
      queryClient.invalidateQueries({ queryKey: ['vaults', variables.vaultId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['vaults', variables.vaultId] });
    },
  });
}

/**
 * Update a vault member's role
 */
export function useUpdateVaultMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vaultId,
      memberId,
      data,
    }: {
      vaultId: string;
      memberId: string;
      data: UpdateMemberRequest;
    }) => vaultService.updateMemberRole(vaultId, memberId, data),
    onSuccess: (_, variables) => {
      // Invalidate vault members query
      queryClient.invalidateQueries({ queryKey: ['vaults', variables.vaultId, 'members'] });
    },
  });
}

/**
 * Remove a member from a vault
 */
export function useRemoveVaultMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaultId, memberId }: { vaultId: string; memberId: string }) =>
      vaultService.removeMember(vaultId, memberId),
    onSuccess: (_, variables) => {
      // Invalidate vault members query
      queryClient.invalidateQueries({ queryKey: ['vaults', variables.vaultId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['vaults', variables.vaultId] });
    },
  });
}

/**
 * Helper hook to get current vault ID from localStorage
 */
export function useCurrentVaultId(): string | null {
  return localStorage.getItem('vaultId');
}

/**
 * Helper hook to get current vault
 */
export function useCurrentVault() {
  const vaultId = useCurrentVaultId();
  return useVault(vaultId || '');
}

/**
 * Helper hook to check if user is vault owner
 */
export function useIsVaultOwner(vaultId: string): boolean {
  const { data: vault } = useVault(vaultId);
  
  if (!vault) return false;
  
  return vault.isOwner;
}

/**
 * Helper hook to check if user can manage vault members (owner or admin)
 */
export function useCanManageVaultMembers(vaultId: string): boolean {
  const { data: members } = useVaultMembers(vaultId);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!members || !currentUser.id) return false;
  
  const currentMember = members.find(m => m.userId === currentUser.id);
  if (!currentMember) return false;
  
  return currentMember.role === 'OWNER' || currentMember.role === 'ADMIN';
}
