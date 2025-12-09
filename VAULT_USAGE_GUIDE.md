# Vault & Encryption Quick Reference

## For Developers: How to Use the Vault System

### 1. Using Password Hooks (Recommended)

#### Get All Passwords (Decrypted)
```typescript
import { usePasswordsDecrypted } from '@/hooks/usePasswords';

function MyComponent() {
  const { data: passwords, isLoading, error } = usePasswordsDecrypted();
  
  // passwords = [
  //   {
  //     id: "123",
  //     vaultId: "vault-1",
  //     category: "login",
  //     favorite: true,
  //     decrypted: {
  //       website: "example.com",
  //       username: "user@example.com",
  //       password: "secret123",
  //       notes: "My notes"
  //     }
  //   }
  // ]
  
  return (
    <div>
      {passwords?.map(pwd => (
        <div key={pwd.id}>
          {pwd.decrypted.website}: {pwd.decrypted.username}
        </div>
      ))}
    </div>
  );
}
```

#### Create a Password (Auto-Encrypted)
```typescript
import { useCreatePassword } from '@/hooks/usePasswords';

function CreatePasswordForm() {
  const createPassword = useCreatePassword();
  const vaultId = localStorage.getItem('vaultId');
  
  const handleSubmit = (formData) => {
    createPassword.mutate({
      vaultId: vaultId!,
      website: formData.website,
      username: formData.username,
      password: formData.password,
      notes: formData.notes,
      category: 'login',
      favorite: false
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Update a Password (Auto-Encrypted)
```typescript
import { useUpdatePassword } from '@/hooks/usePasswords';

function EditPasswordForm({ passwordId }) {
  const updatePassword = useUpdatePassword();
  
  const handleSubmit = (formData) => {
    updatePassword.mutate({
      id: passwordId,
      data: {
        website: formData.website,    // Optional
        username: formData.username,  // Optional
        password: formData.password,  // Optional
        category: formData.category,  // Optional
        favorite: formData.favorite   // Optional
      }
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 2. Using Vault Hooks

#### Get All Vaults
```typescript
import { useVaults } from '@/hooks/useVaults';

function VaultList() {
  const { data: vaults, isLoading } = useVaults();
  
  // vaults = [
  //   {
  //     id: "vault-1",
  //     name: "Personal",
  //     type: "PERSONAL",
  //     itemCount: 5,
  //     memberCount: 1,
  //     isOwner: true
  //   }
  // ]
  
  return (
    <ul>
      {vaults?.map(vault => (
        <li key={vault.id}>
          {vault.name} ({vault.itemCount} items)
        </li>
      ))}
    </ul>
  );
}
```

#### Get Vault Members
```typescript
import { useVaultMembers, useCanManageVaultMembers } from '@/hooks/useVaults';

function VaultMembersPage({ vaultId }) {
  const { data: members } = useVaultMembers(vaultId);
  const canManage = useCanManageVaultMembers(vaultId);
  
  return (
    <div>
      <h2>Members</h2>
      {members?.map(member => (
        <div key={member.userId}>
          {member.name} ({member.email}) - {member.role}
        </div>
      ))}
      {canManage && <button>Add Member</button>}
    </div>
  );
}
```

#### Share Vault (Add Member)
```typescript
import { useAddVaultMember } from '@/hooks/useVaults';
import { reEncryptVaultKeyForSharing, getVaultKey } from '@/services/encryptionService';

function ShareVaultButton({ vaultId, recipientEmail, role }) {
  const addMember = useAddVaultMember();
  
  const handleShare = async () => {
    // 1. Get decrypted vault key
    const vaultKey = getVaultKey();
    
    // 2. Fetch recipient's public key (REQUIRES BACKEND ENDPOINT)
    const recipientPublicKey = await fetchRecipientPublicKey(recipientEmail);
    
    // 3. Re-encrypt vault key for recipient
    const encryptedVaultKey = await reEncryptVaultKeyForSharing(
      vaultKey,
      recipientPublicKey
    );
    
    // 4. Add member with encrypted vault key
    addMember.mutate({
      vaultId,
      data: {
        userEmail: recipientEmail,
        role: role, // 'ADMIN' | 'MEMBER' | 'READ_ONLY'
        encryptedVaultKey
      }
    });
  };
  
  return <button onClick={handleShare}>Share Vault</button>;
}

// NOTE: Backend needs to implement this endpoint
async function fetchRecipientPublicKey(email: string): Promise<string> {
  const response = await fetch(`/api/users/by-email/${email}`);
  const user = await response.json();
  return user.publicKey;
}
```

---

### 3. Direct Service Usage (Advanced)

#### Manual Password Encryption
```typescript
import { passwordService } from '@/services/passwordService';

async function createPasswordManually() {
  const password = await passwordService.create({
    vaultId: 'vault-123',
    website: 'example.com',
    username: 'user@example.com',
    password: 'secret123',
    notes: 'My secure note',
    category: 'login',
    favorite: false
  });
  
  console.log('Created:', password.id);
}
```

#### Manual Password Decryption
```typescript
import { passwordService } from '@/services/passwordService';

async function getPasswordManually(id: string) {
  // Get encrypted password
  const password = await passwordService.getById(id);
  
  // Decrypt it
  const decrypted = await passwordService.decrypt(password);
  
  console.log('Website:', decrypted.website);
  console.log('Username:', decrypted.username);
  console.log('Password:', decrypted.password);
}
```

#### Get All Decrypted Passwords
```typescript
import { passwordService } from '@/services/passwordService';

async function getAllPasswordsManually() {
  const passwords = await passwordService.getAllDecrypted();
  
  passwords.forEach(pwd => {
    console.log(pwd.decrypted.website);
  });
}
```

---

### 4. Vault Key Management

#### Check if Vault Key is Available
```typescript
import { vaultKeyStore } from '@/services/encryptionService';

function checkVaultKey() {
  if (vaultKeyStore.hasKey()) {
    console.log('Vault key is available');
  } else {
    console.log('Need to re-authenticate');
  }
}
```

#### Re-Initialize Vault Key (After Page Refresh)
```typescript
import { initializeVaultKey } from '@/services/encryptionService';

async function reAuthenticate(password: string) {
  const encryptedVaultKey = localStorage.getItem('encryptedVaultKey');
  const userEmail = JSON.parse(localStorage.getItem('currentUser') || '{}').email;
  
  if (!encryptedVaultKey || !userEmail) {
    throw new Error('No vault key found. Please log in.');
  }
  
  await initializeVaultKey(encryptedVaultKey, password, userEmail);
  
  console.log('Vault key re-initialized!');
}
```

---

### 5. Common Patterns

#### Protected Password Display
```typescript
import { usePasswordDecrypted } from '@/hooks/usePasswords';
import { vaultKeyStore } from '@/services/encryptionService';

function PasswordDetail({ passwordId }) {
  const { data: password, error } = usePasswordDecrypted(passwordId);
  const hasVaultKey = vaultKeyStore.hasKey();
  
  if (!hasVaultKey) {
    return <ReAuthModal />;
  }
  
  if (error) {
    return <div>Failed to decrypt password</div>;
  }
  
  return (
    <div>
      <p>Website: {password?.decrypted.website}</p>
      <p>Username: {password?.decrypted.username}</p>
      <p>Password: {password?.decrypted.password}</p>
    </div>
  );
}
```

#### Bulk Password Operations
```typescript
import { usePasswordsDecrypted } from '@/hooks/usePasswords';

function ExportPasswords() {
  const { data: passwords } = usePasswordsDecrypted();
  
  const exportToJSON = () => {
    const data = passwords?.map(pwd => ({
      website: pwd.decrypted.website,
      username: pwd.decrypted.username,
      password: pwd.decrypted.password,
      notes: pwd.decrypted.notes,
      category: pwd.category,
      favorite: pwd.favorite
    }));
    
    const json = JSON.stringify(data, null, 2);
    // Download JSON file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.json';
    a.click();
  };
  
  return <button onClick={exportToJSON}>Export</button>;
}
```

#### Favorite Passwords
```typescript
import { usePasswordsDecrypted, useUpdatePassword } from '@/hooks/usePasswords';

function FavoritesList() {
  const { data: passwords } = usePasswordsDecrypted();
  const updatePassword = useUpdatePassword();
  
  const favorites = passwords?.filter(pwd => pwd.favorite);
  
  const toggleFavorite = (id: string, currentValue: boolean) => {
    updatePassword.mutate({
      id,
      data: { favorite: !currentValue }
    });
  };
  
  return (
    <div>
      {favorites?.map(pwd => (
        <div key={pwd.id}>
          {pwd.decrypted.website}
          <button onClick={() => toggleFavorite(pwd.id, pwd.favorite)}>
            ⭐
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Error Handling

#### Handle Decryption Errors
```typescript
import { usePasswordsDecrypted } from '@/hooks/usePasswords';

function PasswordList() {
  const { data, error, isLoading } = usePasswordsDecrypted();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    if (error.message.includes('Vault key not initialized')) {
      return <ReAuthModal />;
    }
    
    if (error.message.includes('Failed to decrypt')) {
      return <div>Decryption failed. Please log in again.</div>;
    }
    
    return <div>Error: {error.message}</div>;
  }
  
  return <div>{/* Render passwords */}</div>;
}
```

#### Handle Missing Vault Key
```typescript
import { vaultKeyStore } from '@/services/encryptionService';

function ProtectedRoute({ children }) {
  const hasVaultKey = vaultKeyStore.hasKey();
  
  if (!hasVaultKey) {
    return <Navigate to="/re-auth" />;
  }
  
  return <>{children}</>;
}
```

---

### 7. TypeScript Types

```typescript
import type { Password, DecryptedPasswordData } from '@/services/passwordService';
import type { Vault, VaultMember } from '@/services/vaultService';

// Password with decrypted data
type DecryptedPassword = Password & {
  decrypted: DecryptedPasswordData;
};

// Vault member roles
type VaultRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'READ_ONLY';

// Vault types
type VaultType = 'PERSONAL' | 'GROUP' | 'STEALTH' | 'ORGANIZATION';
```

---

## Important Notes

### ⚠️ Security
- Never log decrypted passwords to console in production
- Always use HTTPS (Web Crypto API requirement)
- Vault key is lost on page refresh (re-auth required)
- Never send decrypted data to backend

### 🔄 Auto-Encryption
- `useCreatePassword()` automatically encrypts data
- `useUpdatePassword()` automatically encrypts data
- `passwordService.create()` automatically encrypts data
- `passwordService.update()` automatically encrypts data

### 📦 Auto-Decryption
- `usePasswordsDecrypted()` automatically decrypts all passwords
- `usePasswordDecrypted(id)` automatically decrypts single password
- `passwordService.getAllDecrypted()` automatically decrypts all
- `passwordService.getByIdDecrypted(id)` automatically decrypts single

### 🔑 Vault Key Lifecycle
```
Login → Decrypt → Store in Memory → Use for Encryption/Decryption → Logout/Refresh → Cleared
```

### 🚫 Backend Pending
- Public key endpoint (`GET /api/users/by-email/:email`)
- Public key storage in User model
- Public key generation during registration

**Until backend implements public keys, vault sharing will not work!**
