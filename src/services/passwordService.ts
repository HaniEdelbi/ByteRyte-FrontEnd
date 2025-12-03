/**
 * Password Vault API Service
 * Handles password management operations
 */

import api from '@/lib/api';

export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasswordData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
}

export interface UpdatePasswordData extends Partial<CreatePasswordData> {
  isFavorite?: boolean;
}

/**
 * Password vault service
 */
export const passwordService = {
  /**
   * Get all passwords
   */
  async getAll(): Promise<Password[]> {
    return api.get<Password[]>('/passwords');
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
    return api.post<Password>('/passwords', data);
  },

  /**
   * Update password entry
   */
  async update(id: string, data: UpdatePasswordData): Promise<Password> {
    return api.patch<Password>(`/passwords/${id}`, data);
  },

  /**
   * Delete password entry
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/passwords/${id}`);
  },

  /**
   * Search passwords
   */
  async search(query: string): Promise<Password[]> {
    return api.get<Password[]>(`/passwords/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get passwords by category
   */
  async getByCategory(category: string): Promise<Password[]> {
    return api.get<Password[]>(`/passwords/category/${encodeURIComponent(category)}`);
  },

  /**
   * Get favorite passwords
   */
  async getFavorites(): Promise<Password[]> {
    return api.get<Password[]>('/passwords/favorites');
  },
};
