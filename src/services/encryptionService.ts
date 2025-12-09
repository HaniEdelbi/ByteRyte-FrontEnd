/**
 * Encryption Service
 * Handles all client-side encryption/decryption operations for zero-knowledge architecture
 */

/**
 * Derive a cryptographic key from user password
 * Uses PBKDF2 for key derivation
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-GCM key from password
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Decrypt the encrypted vault key using the user's password
 * @param encryptedVaultKey Base64 encoded encrypted vault key from server
 * @param userPassword User's password
 * @param userEmail User's email (used as salt)
 * @returns Decrypted vault key as base64 string
 */
export async function decryptVaultKey(
  encryptedVaultKey: string,
  userPassword: string,
  userEmail: string
): Promise<string> {
  try {
    // Derive key from password
    const cryptoKey = await deriveKeyFromPassword(userPassword, userEmail);

    // Decode the encrypted vault key
    const encryptedData = Uint8Array.from(atob(encryptedVaultKey), c => c.charCodeAt(0));

    // Extract IV (first 12 bytes) and ciphertext
    const iv = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      ciphertext
    );

    // Convert decrypted buffer to base64 string
    const decryptedArray = new Uint8Array(decryptedBuffer);
    return btoa(String.fromCharCode(...decryptedArray));
  } catch (error) {
    console.error('Failed to decrypt vault key:', error);
    throw new Error('Failed to decrypt vault key. Invalid password or corrupted data.');
  }
}

/**
 * Import vault key for encryption/decryption operations
 * @param vaultKeyBase64 Base64 encoded vault key
 * @returns CryptoKey for AES-GCM operations
 */
export async function importVaultKey(vaultKeyBase64: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(vaultKeyBase64), c => c.charCodeAt(0));
  
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt password data using the vault key
 * @param data Password object to encrypt
 * @param vaultKey Decrypted vault key (base64)
 * @returns Encrypted data as base64 string
 */
export async function encryptPassword(
  data: { website: string; username: string; password: string; notes?: string },
  vaultKey: string
): Promise<string> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);

    // Import vault key
    const cryptoKey = await importVaultKey(vaultKey);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      dataBuffer
    );

    // Combine IV and ciphertext
    const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    encryptedArray.set(iv, 0);
    encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...encryptedArray));
  } catch (error) {
    console.error('Failed to encrypt password:', error);
    throw new Error('Failed to encrypt password data.');
  }
}

/**
 * Decrypt password data using the vault key
 * @param encryptedData Base64 encoded encrypted password data
 * @param vaultKey Decrypted vault key (base64)
 * @returns Decrypted password object
 */
export async function decryptPassword<T = any>(
  encryptedData: string,
  vaultKey: string
): Promise<T> {
  try {
    // Import vault key
    const cryptoKey = await importVaultKey(vaultKey);

    // Decode encrypted data
    const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Extract IV (first 12 bytes) and ciphertext
    const iv = encryptedArray.slice(0, 12);
    const ciphertext = encryptedArray.slice(12);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      ciphertext
    );

    // Convert buffer to string and parse JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedBuffer);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decrypt password:', error);
    throw new Error('Failed to decrypt password data. Invalid vault key or corrupted data.');
  }
}

/**
 * Re-encrypt vault key for sharing with another user
 * @param vaultKey Decrypted vault key (base64)
 * @param recipientPublicKey Recipient's public key (base64)
 * @returns Encrypted vault key for recipient
 */
export async function reEncryptVaultKeyForSharing(
  vaultKey: string,
  recipientPublicKey: string
): Promise<string> {
  try {
    // Import recipient's public key
    const publicKeyData = Uint8Array.from(atob(recipientPublicKey), c => c.charCodeAt(0));
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );

    // Encrypt vault key with recipient's public key
    const vaultKeyData = Uint8Array.from(atob(vaultKey), c => c.charCodeAt(0));
    const encryptedVaultKey = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      vaultKeyData
    );

    // Convert to base64
    const encryptedArray = new Uint8Array(encryptedVaultKey);
    return btoa(String.fromCharCode(...encryptedArray));
  } catch (error) {
    console.error('Failed to re-encrypt vault key:', error);
    throw new Error('Failed to re-encrypt vault key for sharing.');
  }
}

/**
 * Generate a new random vault key
 * Used during registration
 * @returns Base64 encoded vault key
 */
export async function generateVaultKey(): Promise<string> {
  // Generate 256-bit random key
  const keyData = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...keyData));
}

/**
 * Store decrypted vault key securely in session
 * WARNING: This stores in memory only - will be lost on page refresh
 * User will need to re-enter password to decrypt vault key again
 */
class VaultKeyStore {
  private vaultKey: string | null = null;

  setKey(key: string): void {
    this.vaultKey = key;
  }

  getKey(): string | null {
    return this.vaultKey;
  }

  clearKey(): void {
    this.vaultKey = null;
  }

  hasKey(): boolean {
    return this.vaultKey !== null;
  }
}

export const vaultKeyStore = new VaultKeyStore();

/**
 * Initialize vault key after login
 * Decrypts the encrypted vault key and stores it in memory
 */
export async function initializeVaultKey(
  encryptedVaultKey: string,
  userPassword: string,
  userEmail: string
): Promise<void> {
  const decryptedKey = await decryptVaultKey(encryptedVaultKey, userPassword, userEmail);
  vaultKeyStore.setKey(decryptedKey);
}

/**
 * Get the current vault key from store
 * @throws Error if vault key is not initialized
 */
export function getVaultKey(): string {
  const key = vaultKeyStore.getKey();
  if (!key) {
    throw new Error('Vault key not initialized. Please log in again.');
  }
  return key;
}

/**
 * Check if vault key is available
 * @returns true if vault key is initialized
 */
export function hasVaultKey(): boolean {
  return vaultKeyStore.hasKey();
}

/**
 * Clear vault key from store
 * Should be called on logout
 */
export function clearVaultKey(): void {
  vaultKeyStore.clearKey();
}
