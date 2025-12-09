/**
 * Authentication API Service
 * Handles user authentication operations
 */

import api, { auth } from '@/lib/api';
import { initializeVaultKey, clearVaultKey, generateVaultKey, deriveKeyFromPassword } from './encryptionService';

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
  vault?: {
    id: string;
    encryptedVaultKey: string;
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
 * Creates a random vault key and encrypts it with the user's password
 */
async function generateEncryptedVaultKey(password: string, email: string): Promise<string> {
  try {
    console.log('[authService] Generating encrypted vault key...');
    
    // Check if Web Crypto API is available
    if (!crypto?.subtle) {
      throw new Error('Web Crypto API not available. Please use HTTPS or localhost.');
    }
    
    // Generate a random 256-bit vault key
    console.log('[authService] Generating random vault key...');
    const vaultKey = await generateVaultKey();
    console.log('[authService] Vault key generated');
    
    // Derive encryption key from user's password
    console.log('[authService] Deriving encryption key from password...');
    const cryptoKey = await deriveKeyFromPassword(password, email);
    console.log('[authService] Encryption key derived');
    
    // Convert vault key from base64 to bytes
    const vaultKeyBytes = Uint8Array.from(atob(vaultKey), c => c.charCodeAt(0));
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the vault key
    console.log('[authService] Encrypting vault key...');
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      vaultKeyBytes
    );
    console.log('[authService] Vault key encrypted');
    
    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Return as base64
    const result = btoa(String.fromCharCode(...combined));
    console.log('[authService] Encrypted vault key generated successfully, length:', result.length);
    return result;
  } catch (error) {
    console.error('[authService] Failed to generate encrypted vault key:', error);
    console.error('[authService] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error('Failed to generate encrypted vault key: ' + (error instanceof Error ? error.message : String(error)));
  }
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
    
    // Store vault information if present and initialize vault key
    if (response.vault) {
      localStorage.setItem('vaultId', response.vault.id);
      localStorage.setItem('encryptedVaultKey', response.vault.encryptedVaultKey);
      
      // Decrypt and store vault key in memory for this session
      try {
        await initializeVaultKey(
          response.vault.encryptedVaultKey,
          credentials.password,
          credentials.email
        );
      } catch (error) {
        console.error('Failed to initialize vault key:', error);
        // Continue login even if vault key initialization fails
        // User can re-authenticate if needed
      }
    }
    
    // Store user information
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Generate required zero-knowledge fields if not provided
    const passwordVerifier = data.passwordVerifier || await generatePasswordVerifier(data.password, data.email);
    const encryptedVaultKey = data.encryptedVaultKey || await generateEncryptedVaultKey(data.password, data.email);
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
    
    // Store vault information if present and initialize vault key
    if (response.vault) {
      localStorage.setItem('vaultId', response.vault.id);
      localStorage.setItem('encryptedVaultKey', response.vault.encryptedVaultKey);
      
      // Decrypt and store vault key in memory for this session
      try {
        await initializeVaultKey(
          response.vault.encryptedVaultKey,
          data.password,
          data.email
        );
      } catch (error) {
        console.error('Failed to initialize vault key:', error);
        // Continue registration even if vault key initialization fails
      }
    }
    
    // Store user information
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
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
      // Clear vault key from memory
      clearVaultKey();
      
      // Always remove token, user data, and vault data, even if request fails
      auth.removeToken();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('vaultId');
      localStorage.removeItem('encryptedVaultKey');
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
