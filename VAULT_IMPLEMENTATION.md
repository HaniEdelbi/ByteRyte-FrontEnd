# Vault Key Implementation Summary

## Overview
Implemented complete zero-knowledge encryption architecture with vault key management, enabling secure password storage and vault sharing capabilities.

## Implementation Date
December 9, 2025

## Components Implemented

### 1. Encryption Service (`src/services/encryptionService.ts`)
**Purpose**: Core cryptographic operations for zero-knowledge architecture

**Key Functions**:
- `deriveKeyFromPassword()` - PBKDF2 key derivation (100,000 iterations)
- `decryptVaultKey()` - Decrypt encrypted vault key using user password
- `importVaultKey()` - Import vault key for AES-GCM operations
- `encryptPassword()` - Encrypt password data with vault key
- `decryptPassword()` - Decrypt password data with vault key
- `reEncryptVaultKeyForSharing()` - Re-encrypt vault key for sharing (uses RSA-OAEP)
- `generateVaultKey()` - Generate new 256-bit random vault key
- `initializeVaultKey()` - Decrypt and store vault key after login
- `getVaultKey()` - Retrieve decrypted vault key from store
- `clearVaultKey()` - Clear vault key on logout

**Security Architecture**:
- AES-GCM-256 for symmetric encryption
- PBKDF2 for key derivation (email as salt)
- RSA-OAEP for public key encryption (vault sharing)
- In-memory vault key storage (cleared on logout/refresh)
- Random 12-byte IV for each encryption operation

**VaultKeyStore Class**:
- Stores decrypted vault key in memory only
- Automatically cleared on logout
- Lost on page refresh (requires re-authentication)
- Methods: `setKey()`, `getKey()`, `clearKey()`, `hasKey()`

---

### 2. Updated Authentication Service (`src/services/authService.ts`)

**Changes to Login Flow**:
```typescript
// After successful login:
1. Store JWT token
2. Store vaultId in localStorage
3. Store encryptedVaultKey in localStorage
4. Decrypt vault key using user password
5. Store decrypted vault key in memory (VaultKeyStore)
6. Store user information
```

**Changes to Register Flow**:
```typescript
// After successful registration:
1. Generate vault key and encrypt it
2. Send to backend during registration
3. Store JWT token
4. Store vault information (same as login)
5. Initialize vault key in memory
```

**Changes to Logout Flow**:
```typescript
// On logout:
1. Call logout endpoint
2. Clear vault key from memory (VaultKeyStore)
3. Remove JWT token
4. Remove user data from localStorage
5. Remove vaultId from localStorage
6. Remove encryptedVaultKey from localStorage
```

**New Imports**:
- `initializeVaultKey` - Initialize vault key after auth
- `clearVaultKey` - Clear vault key on logout

---

### 3. Updated Password Service (`src/services/passwordService.ts`)

**New Interfaces**:
```typescript
// Plain password data (what users work with)
interface DecryptedPasswordData {
  website: string;
  username: string;
  password: string;
  notes?: string;
}

// Input for creating passwords
interface CreatePasswordInput {
  vaultId: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
}

// Input for updating passwords
interface UpdatePasswordInput {
  website?: string;
  username?: string;
  password?: string;
  notes?: string;
  category?: 'login' | 'payment' | 'secure-note' | 'other';
  favorite?: boolean;
}
```

**New Methods**:
- `decrypt(password)` - Decrypt a single password entry
- `getAllDecrypted()` - Get all passwords with decrypted data
- `getByIdDecrypted(id)` - Get password by ID with decrypted data
- `create(input)` - Create password (auto-encrypts data)
- `update(id, input)` - Update password (auto-encrypts if data provided)

**Updated Methods**:
- `create()` - Now accepts plain data, encrypts automatically
- `update()` - Now accepts plain data, merges with existing and encrypts

**Encryption Flow**:
1. User provides plain password data
2. Service retrieves vault key from VaultKeyStore
3. Service encrypts data using `encryptPassword()`
4. Encrypted blob sent to backend
5. Backend stores encrypted data only

**Decryption Flow**:
1. Backend returns encrypted password
2. Service retrieves vault key from VaultKeyStore
3. Service decrypts using `decryptPassword()`
4. Returns plain data to user

---

### 4. Vault Hooks (`src/hooks/useVaults.ts`)

**Query Hooks**:
- `useVaults()` - Get all vaults for current user
- `useVault(vaultId)` - Get specific vault by ID
- `useVaultItems(vaultId)` - Get all passwords in a vault
- `useVaultMembers(vaultId)` - Get all members of a vault

**Mutation Hooks**:
- `useUpdateVaultName()` - Update vault name (owner/admin only)
- `useAddVaultMember()` - Share vault with another user
- `useUpdateVaultMemberRole()` - Change member's role
- `useRemoveVaultMember()` - Revoke member access

**Helper Hooks**:
- `useCurrentVaultId()` - Get current vault ID from localStorage
- `useCurrentVault()` - Get current vault data
- `useIsVaultOwner(vaultId)` - Check if user is vault owner
- `useCanManageVaultMembers(vaultId)` - Check if user can manage members

**Features**:
- Automatic cache invalidation after mutations
- Optimistic UI updates
- React Query integration for caching and refetching
- Conditional enabling based on vaultId presence

---

### 5. Updated Password Hooks (`src/hooks/usePasswords.ts`)

**New Query Hooks**:
- `usePasswordsDecrypted()` - Get all passwords with decrypted data
- `usePasswordDecrypted(id)` - Get single password with decrypted data

**Updated Mutation Hooks**:
- `useCreatePassword()` - Now accepts `CreatePasswordInput` (plain data)
- `useUpdatePassword()` - Now accepts `UpdatePasswordInput` (plain data)

**Changes**:
- Original hooks (`usePasswords()`, `usePassword()`) still return encrypted data
- New hooks with "Decrypted" suffix return decrypted data
- Mutation hooks now work with plain data (auto-encrypt)
- Automatic cache invalidation for both encrypted and decrypted queries

---

## Data Flow

### Complete Authentication Flow
```
1. User enters email + password
   ↓
2. Frontend generates passwordVerifier
   ↓
3. Frontend sends login request (email, passwordVerifier, deviceFingerprint)
   ↓
4. Backend validates and returns: { token, user, vault: { id, encryptedVaultKey } }
   ↓
5. Frontend stores: token, user, vaultId, encryptedVaultKey
   ↓
6. Frontend derives key from password + email
   ↓
7. Frontend decrypts encryptedVaultKey → vaultKey
   ↓
8. Frontend stores vaultKey in memory (VaultKeyStore)
   ↓
9. User authenticated and ready to decrypt passwords
```

### Complete Password Creation Flow
```
1. User enters password data (website, username, password, notes)
   ↓
2. Frontend retrieves vaultKey from VaultKeyStore
   ↓
3. Frontend encrypts data: { website, username, password, notes } → encryptedBlob
   ↓
4. Frontend sends to backend: { vaultId, encryptedBlob, category, favorite }
   ↓
5. Backend stores encrypted blob
   ↓
6. Frontend invalidates password queries
   ↓
7. React Query refetches and decrypts passwords
```

### Complete Password Retrieval Flow
```
1. User requests passwords (usePasswordsDecrypted)
   ↓
2. Frontend fetches from backend: [{ id, vaultId, encryptedBlob, ... }]
   ↓
3. Frontend retrieves vaultKey from VaultKeyStore
   ↓
4. Frontend decrypts each encryptedBlob → { website, username, password, notes }
   ↓
5. Frontend returns decrypted data to UI
   ↓
6. User sees plain password data
```

### Vault Sharing Flow (Future)
```
1. Owner retrieves decrypted vaultKey from VaultKeyStore
   ↓
2. Owner fetches member's public key from backend
   ↓
3. Owner re-encrypts vaultKey with member's public key
   ↓
4. Owner sends to backend: { userEmail, role, encryptedVaultKey }
   ↓
5. Backend stores member record with encrypted vault key
   ↓
6. Member decrypts vault key with their private key
   ↓
7. Member can now decrypt vault passwords
```

---

## Security Considerations

### What Backend Never Sees
- User's actual password (only passwordVerifier)
- Decrypted vault key
- Decrypted password data (website, username, password, notes)
- User's private key (when implemented)

### What Backend Stores
- JWT token
- passwordVerifier (for authentication)
- encryptedVaultKey (encrypted with user's password)
- Encrypted password blobs (encryptedBlob)
- User metadata (email, name, etc.)
- Public keys (when implemented)

### Vault Key Security
- **In Memory**: Stored in VaultKeyStore class instance
- **Lifetime**: Login → Logout or page refresh
- **Cleared**: Automatically on logout, lost on refresh
- **Re-authentication**: Required after page refresh to decrypt vault key again

### Encryption Details
- **Algorithm**: AES-GCM-256 for all symmetric encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: User's email address
- **IV**: 12 random bytes per encryption
- **Public Key Crypto**: RSA-OAEP-2048 for vault sharing

---

## Files Modified

1. **src/services/encryptionService.ts** (NEW)
   - 300+ lines of cryptographic utilities
   - VaultKeyStore class for in-memory key storage

2. **src/services/authService.ts** (MODIFIED)
   - Added vault key initialization in login/register
   - Added vault key clearing in logout
   - Added vault data storage (vaultId, encryptedVaultKey)

3. **src/services/passwordService.ts** (MODIFIED)
   - Added new interfaces for plain data
   - Added encryption/decryption methods
   - Updated create/update to auto-encrypt
   - Added decrypt, getAllDecrypted, getByIdDecrypted methods

4. **src/hooks/useVaults.ts** (NEW)
   - Complete vault management hooks
   - Member management hooks
   - Helper hooks for permissions

5. **src/hooks/usePasswords.ts** (MODIFIED)
   - Added decrypted query hooks
   - Updated mutation hooks for plain data
   - Maintained backward compatibility

---

## Testing Checklist

### ✅ Completed
- [x] Encryption service created
- [x] Auth service updated with vault key handling
- [x] Password service updated with encryption
- [x] Vault hooks created
- [x] Password hooks updated
- [x] TypeScript compilation (0 errors)

### ⏳ Pending Backend
- [ ] Public key endpoint: GET /api/users/by-email/:email
- [ ] Public key storage in User model
- [ ] Public key generation during registration

### 🧪 Manual Testing Required
- [ ] Login → vault key decryption → password decryption
- [ ] Register → vault creation → password creation
- [ ] Password CRUD with encryption/decryption
- [ ] Logout → vault key cleared
- [ ] Page refresh → requires re-authentication
- [ ] Vault sharing (after backend implements public keys)

---

## Next Steps

### Phase 1: Testing (Current)
1. Test login flow with vault key decryption
2. Test password creation with auto-encryption
3. Test password retrieval with auto-decryption
4. Verify logout clears vault key
5. Verify page refresh requires re-auth

### Phase 2: Vault Sharing UI
1. Wait for backend public key endpoint
2. Create ShareVaultModal component
3. Implement vault key re-encryption
4. Create VaultMembers page
5. Add member management UI

### Phase 3: UX Improvements
1. Handle vault key expiration gracefully
2. Add re-authentication modal if vault key lost
3. Add vault key strength indicator
4. Add encryption status indicators
5. Add progress indicators for encryption operations

---

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Returns vault info
- `POST /api/auth/register` - Creates vault
- `POST /api/auth/logout` - Clear session

### Passwords
- `GET /api/passwords` - Get all passwords (encrypted)
- `GET /api/passwords/:id` - Get specific password (encrypted)
- `POST /api/passwords` - Create password (encrypted blob)
- `PUT /api/passwords/:id` - Update password (encrypted blob)
- `DELETE /api/passwords/:id` - Delete password

### Vaults
- `GET /api/vaults` - Get all vaults
- `GET /api/vaults/:id` - Get vault details
- `PUT /api/vaults/:id` - Update vault name
- `GET /api/vaults/:id/items` - Get vault passwords
- `GET /api/vaults/:id/members` - Get vault members
- `POST /api/vaults/:id/members` - Add member (share vault)
- `PUT /api/vaults/:id/members/:memberId` - Update member role
- `DELETE /api/vaults/:id/members/:memberId` - Remove member

### Future (Pending Backend)
- `GET /api/users/by-email/:email` - Get user's public key

---

## Known Limitations

1. **Vault Key Persistence**
   - Lost on page refresh (requires re-login)
   - Consider sessionStorage for better UX (trade-off: security)

2. **Public Key Infrastructure**
   - Not yet implemented in backend
   - Blocks vault sharing feature
   - Requires backend update

3. **Key Rotation**
   - No mechanism to rotate vault keys
   - Should be added in future

4. **Multi-Device Support**
   - Each device needs vault key decryption
   - Works but requires password on each device

5. **Recovery**
   - No vault key recovery mechanism
   - Lost password = lost vault access (by design)

---

## Performance Notes

- Encryption/decryption uses Web Crypto API (hardware-accelerated)
- PBKDF2 iterations (100k) may cause slight delay on low-end devices
- Consider Web Workers for bulk encryption/decryption
- React Query caching minimizes re-decryption

---

## Browser Compatibility

**Requirements**:
- Web Crypto API (`crypto.subtle`)
- HTTPS or localhost (required for Web Crypto)
- Modern browser (Chrome 37+, Firefox 34+, Safari 11+, Edge 79+)

**Fallback**:
- Currently no fallback for non-HTTPS
- Consider warning users on HTTP connections
