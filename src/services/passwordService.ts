/**
 * Password Vault API Service
 * Handles password management operations with zero-knowledge encryption
 */

import api from '@/lib/api';

export interface Password {
  id: string;
  vaultId: string;
  encryptedBlob: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasswordData {
  vaultId: string;
  encryptedBlob: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
}

export interface UpdatePasswordData {
  encryptedBlob?: string;
  category?: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
}

/**
 * Password vault service
 */
export const passwordService = {
  /**
   * Get all passwords across all vaults
   */
  async getAll(): Promise<Password[]> {
    const response = await api.get<{ success: boolean; count: number; items: Password[] }>('/passwords');
    return response.success ? response.items || [] : [];
  },

  /**
   * Get password by ID
   */
  async getById(id: string): Promise<Password> {
    return api.get<Password>(`/passwords/${id}`);
  },

  /**
   * Create new password entry
   */
  async create(data: CreatePasswordData): Promise<Password> {
    return api.post<Password>('/passwords', {
      vaultId: data.vaultId,
      encryptedBlob: data.encryptedBlob,
      category: data.category,
      favorite: data.favorite ?? false
    });
  },

  /**
   * Update password entry
   */
  async update(id: string, data: UpdatePasswordData): Promise<Password> {
    return api.put<Password>(`/passwords/${id}`, data);
  },

  /**
   * Delete password entry
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/passwords/${id}`);
  },
};
