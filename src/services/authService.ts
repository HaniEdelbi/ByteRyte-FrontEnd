/**
 * Authentication API Service
 * Handles user authentication operations
 */

import api, { auth } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  passwordVerifier?: string;
  encryptedVaultKey?: string;
  deviceFingerprint?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Generate password verifier for zero-knowledge authentication
 * This is a simplified version - in production, use proper SRP or similar protocol
 */
async function generatePasswordVerifier(password: string, email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate encrypted vault key
 * This is a simplified version - in production, use proper key derivation
 */
async function generateEncryptedVaultKey(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_vault_key');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate device fingerprint
 * Creates a unique identifier for the device/browser
 */
function generateDeviceFingerprint(): string {
  const navigator = window.navigator;
  const screen = window.screen;
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');
  
  // Create a simple hash of the fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token
    auth.setToken(response.token);
    
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Generate required zero-knowledge fields if not provided
    const passwordVerifier = data.passwordVerifier || await generatePasswordVerifier(data.password, data.email);
    const encryptedVaultKey = data.encryptedVaultKey || await generateEncryptedVaultKey(data.password);
    const deviceFingerprint = data.deviceFingerprint || generateDeviceFingerprint();
    
    const registrationData = {
      email: data.email,
      password: data.password,
      name: data.name,
      passwordVerifier,
      encryptedVaultKey,
      deviceFingerprint,
    };
    
    console.log('Registration data being sent:', registrationData);
    
    const response = await api.post<AuthResponse>('/auth/register', registrationData);
    
    // Store token
    auth.setToken(response.token);
    
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always remove token, even if request fails
      auth.removeToken();
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    auth.setToken(response.token);
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.getToken();
  },
};
