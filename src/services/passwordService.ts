/**
 * Password Vault API Service
 * Handles password management operations with zero-knowledge encryption
 */

import api from '@/lib/api';

export interface Password {
  id: string;
  vaultId: string;
  encryptedBlob: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasswordData {
  vaultId: string;
  encryptedBlob: string;
}

export interface UpdatePasswordData {
  encryptedBlob: string;
}

/**
 * Password vault service
 */
export const passwordService = {
  /**
   * Get all passwords for a vault
   */
  async getAll(vaultId: string): Promise<Password[]> {
    return api.get<Password[]>(`/vaults/${vaultId}/passwords`);
  },

  /**
   * Get password by ID
   */
  async getById(vaultId: string, id: string): Promise<Password> {
    return api.get<Password>(`/vaults/${vaultId}/passwords/${id}`);
  },

  /**
   * Create new password entry
   */
  async create(data: CreatePasswordData): Promise<Password> {
    return api.post<Password>(`/vaults/${data.vaultId}/passwords`, {
      encryptedBlob: data.encryptedBlob
    });
  },

  /**
   * Update password entry
   */
  async update(vaultId: string, id: string, data: UpdatePasswordData): Promise<Password> {
    return api.patch<Password>(`/vaults/${vaultId}/passwords/${id}`, data);
  },

  /**
   * Delete password entry
   */
  async delete(vaultId: string, id: string): Promise<void> {
    return api.delete(`/vaults/${vaultId}/passwords/${id}`);
  },
};
