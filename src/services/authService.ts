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
  try {
    // Try to use Web Crypto API (requires HTTPS or localhost)
    if (crypto?.subtle?.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + email);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (error) {
    console.warn('crypto.subtle.digest not available, using fallback');
  }
  
  // Fallback: Simple hash function for development (NOT secure for production!)
  let hash = 0;
  const str = password + email;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Generate encrypted vault key
 * In production, this would use proper key derivation
 */
async function generateEncryptedVaultKey(password: string): Promise<string> {
  try {
    if (crypto?.subtle?.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'vault-key-salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (error) {
    console.warn('crypto.subtle.digest not available, using fallback');
  }
  
  // Fallback
  let hash = 0;
  const str = password + 'vault-key-salt';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Generate device fingerprint
 */
async function generateDeviceFingerprint(): Promise<string> {
  try {
    if (crypto?.subtle?.digest) {
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage
      ].join('|||');
      
      const encoder = new TextEncoder();
      const data = encoder.encode(fingerprint);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (error) {
    console.warn('crypto.subtle.digest not available, using fallback');
  }
  
  // Fallback
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ].join('|||');
  
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Generate password verifier for login
    const passwordVerifier = await generatePasswordVerifier(credentials.password, credentials.email);
    const deviceFingerprint = await generateDeviceFingerprint();
    
    const loginData = {
      email: credentials.email,
      passwordVerifier,
      deviceFingerprint,
    };
    
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    
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
    const deviceFingerprint = data.deviceFingerprint || await generateDeviceFingerprint();
    
    const registrationData = {
      email: data.email,
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
      // Try to call logout endpoint, but don't fail if it doesn't work
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout endpoint errors - we'll clear local data anyway
      console.log('[authService] Logout endpoint error (ignoring):', error);
    } finally {
      // Always remove token and user data, even if request fails
      auth.removeToken();
      localStorage.removeItem('currentUser');
    }
  },

  /**
   * Get current user profile from localStorage
   * (Backend doesn't have /auth/me endpoint)
   */
  async getCurrentUser(): Promise<User | null> {
    const cachedUser = localStorage.getItem('currentUser');
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    return null;
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
