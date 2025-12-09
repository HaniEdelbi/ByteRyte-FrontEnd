/**
 * Vault Management API Service
 * Handles vault operations including member management
 */

import api from '@/lib/api';

export interface Vault {
  id: string;
  name: string;
  type: 'PERSONAL' | 'GROUP' | 'STEALTH' | 'ORGANIZATION';
  itemCount: number;
  isOwner: boolean;
  memberCount: number;
  encryptedVaultKey?: string; // Only returned on login/register
  createdAt: string;
  updatedAt: string;
}

export interface VaultMember {
  userId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'READ_ONLY';
  addedAt: string;
}

export interface AddMemberRequest {
  userEmail: string;
  role: 'ADMIN' | 'MEMBER' | 'READ_ONLY';
  encryptedVaultKey: string; // Vault key encrypted for the member
}

export interface UpdateMemberRequest {
  role: 'ADMIN' | 'MEMBER' | 'READ_ONLY';
}

export interface VaultItem {
  id: string;
  vaultId: string;
  encryptedBlob: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vault management service
 */
export const vaultService = {
  /**
   * Get all vaults for the current user
   */
  async getAll(): Promise<Vault[]> {
    const response = await api.get<{ success: boolean; data: Vault[] }>('/vaults');
    return response.success ? response.data : [];
  },

  /**
   * Get a specific vault by ID
   */
  async getById(id: string): Promise<Vault> {
    const response = await api.get<{ success: boolean; data: Vault }>(`/vaults/${id}`);
    return response.data;
  },

  /**
   * Update vault name
   */
  async updateName(id: string, name: string): Promise<Vault> {
    const response = await api.put<{ success: boolean; data: Vault }>(`/vaults/${id}`, { name });
    return response.data;
  },

  /**
   * Get all items in a vault
   */
  async getItems(vaultId: string): Promise<VaultItem[]> {
    const response = await api.get<{ success: boolean; count: number; data: VaultItem[] }>(
      `/vaults/${vaultId}/items`
    );
    return response.success ? response.data : [];
  },

  /**
   * Get all members of a vault
   */
  async getMembers(vaultId: string): Promise<VaultMember[]> {
    const response = await api.get<{ success: boolean; data: VaultMember[] }>(
      `/vaults/${vaultId}/members`
    );
    return response.success ? response.data : [];
  },

  /**
   * Add a member to a vault
   * Requires: Owner or Admin role
   */
  async addMember(vaultId: string, data: AddMemberRequest): Promise<VaultMember> {
    const response = await api.post<{ success: boolean; data: VaultMember }>(
      `/vaults/${vaultId}/members`,
      data
    );
    return response.data;
  },

  /**
   * Update a member's role
   * Requires: Owner or Admin role
   */
  async updateMemberRole(
    vaultId: string,
    memberId: string,
    data: UpdateMemberRequest
  ): Promise<VaultMember> {
    const response = await api.put<{ success: boolean; data: VaultMember }>(
      `/vaults/${vaultId}/members/${memberId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove a member from a vault
   * Requires: Owner or Admin role
   */
  async removeMember(vaultId: string, memberId: string): Promise<void> {
    await api.delete(`/vaults/${vaultId}/members/${memberId}`);
  },
};
