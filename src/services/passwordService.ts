/**
 * Password Vault API Service
 * Handles password management operations with zero-knowledge encryption
 */

import api from '@/lib/api';
import { encryptPassword, decryptPassword, getVaultKey } from './encryptionService';

export interface Password {
  id: string;
  vaultId: string;
  encryptedBlob: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedPasswordData {
  website: string;
  username: string;
  password: string;
  notes?: string;
}

export interface CreatePasswordInput {
  vaultId: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
}

export interface UpdatePasswordInput {
  website?: string;
  username?: string;
  password?: string;
  notes?: string;
  category?: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
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
   * Decrypt a password entry
   * @param password Encrypted password object from API
   * @returns Decrypted password data
   */
  async decrypt(password: Password): Promise<DecryptedPasswordData> {
    const vaultKey = getVaultKey();
    return decryptPassword<DecryptedPasswordData>(password.encryptedBlob, vaultKey);
  },

  /**
   * Get all passwords and decrypt them
   * @returns Array of passwords with decrypted data
   */
  async getAllDecrypted(): Promise<Array<Password & { decrypted: DecryptedPasswordData }>> {
    const passwords = await this.getAll();
    const vaultKey = getVaultKey();
    
    return Promise.all(
      passwords.map(async (password) => ({
        ...password,
        decrypted: await decryptPassword<DecryptedPasswordData>(password.encryptedBlob, vaultKey),
      }))
    );
  },

  /**
   * Get a password by ID and decrypt it
   */
  async getByIdDecrypted(id: string): Promise<Password & { decrypted: DecryptedPasswordData }> {
    const password = await this.getById(id);
    const vaultKey = getVaultKey();
    
    return {
      ...password,
      decrypted: await decryptPassword<DecryptedPasswordData>(password.encryptedBlob, vaultKey),
    };
  },

  /**
   * Create new password entry (encrypts data automatically)
   * @param input Plain password data to encrypt and store
   */
  async create(input: CreatePasswordInput): Promise<Password> {
    const vaultKey = getVaultKey();
    
    // Encrypt the password data
    const encryptedBlob = await encryptPassword(
      {
        website: input.website,
        username: input.username,
        password: input.password,
        notes: input.notes,
      },
      vaultKey
    );

    // Send encrypted data to API
    return api.post<Password>('/passwords', {
      vaultId: input.vaultId,
      encryptedBlob,
      category: input.category,
      favorite: input.favorite ?? false,
    });
  },

  /**
   * Update password entry (encrypts data automatically if password data is provided)
   * @param id Password ID to update
   * @param input Password data to update (will be encrypted if provided)
   */
  async update(id: string, input: UpdatePasswordInput): Promise<Password> {
    const updateData: UpdatePasswordData = {
      category: input.category,
      favorite: input.favorite,
    };

    // If any password fields are being updated, encrypt them
    if (input.website || input.username || input.password || input.notes !== undefined) {
      const vaultKey = getVaultKey();
      
      // Get current password to merge with updates
      const currentPassword = await this.getByIdDecrypted(id);
      
      const newData = {
        website: input.website ?? currentPassword.decrypted.website,
        username: input.username ?? currentPassword.decrypted.username,
        password: input.password ?? currentPassword.decrypted.password,
        notes: input.notes !== undefined ? input.notes : currentPassword.decrypted.notes,
      };

      updateData.encryptedBlob = await encryptPassword(newData, vaultKey);
    }

    return api.put<Password>(`/passwords/${id}`, updateData);
  },

  /**
   * Delete password entry
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/passwords/${id}`);
  },
};
