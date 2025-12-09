/**
 * Vault Key Encryption Test Utility
 * Run this in browser console to diagnose issues
 */

async function testVaultKeyGeneration() {
  console.log('=== Vault Key Generation Test ===');
  
  // Test 1: Check Web Crypto API
  console.log('\n1. Checking Web Crypto API...');
  if (!crypto) {
    console.error('❌ crypto object not available');
    return;
  }
  console.log('✅ crypto object available');
  
  if (!crypto.subtle) {
    console.error('❌ crypto.subtle not available (need HTTPS or localhost)');
    return;
  }
  console.log('✅ crypto.subtle available');
  
  // Test 2: Generate random vault key
  console.log('\n2. Generating random vault key...');
  try {
    const keyData = crypto.getRandomValues(new Uint8Array(32));
    const vaultKey = btoa(String.fromCharCode(...keyData));
    console.log('✅ Vault key generated:', vaultKey.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Failed to generate vault key:', error);
    return;
  }
  
  // Test 3: Derive key from password
  console.log('\n3. Deriving encryption key from password...');
  try {
    const encoder = new TextEncoder();
    const password = 'TestPassword123';
    const email = 'test@example.com';
    
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(email);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const cryptoKey = await crypto.subtle.deriveKey(
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
    
    console.log('✅ Encryption key derived successfully');
  } catch (error) {
    console.error('❌ Failed to derive key:', error);
    return;
  }
  
  // Test 4: Full encryption process
  console.log('\n4. Testing full vault key encryption...');
  try {
    const password = 'TestPassword123';
    const email = 'test@example.com';
    
    // Generate vault key
    const vaultKeyData = crypto.getRandomValues(new Uint8Array(32));
    const vaultKey = btoa(String.fromCharCode(...vaultKeyData));
    
    // Derive encryption key
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(email);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const cryptoKey = await crypto.subtle.deriveKey(
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
    
    // Encrypt vault key
    const vaultKeyBytes = Uint8Array.from(atob(vaultKey), c => c.charCodeAt(0));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      vaultKeyBytes
    );
    
    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    const encryptedVaultKey = btoa(String.fromCharCode(...combined));
    
    console.log('✅ Vault key encrypted successfully');
    console.log('   Length:', encryptedVaultKey.length);
    console.log('   Preview:', encryptedVaultKey.substring(0, 50) + '...');
    
    // Test decryption
    console.log('\n5. Testing decryption...');
    
    const encryptedData = Uint8Array.from(atob(encryptedVaultKey), c => c.charCodeAt(0));
    const ivDecrypt = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivDecrypt,
      },
      cryptoKey,
      ciphertext
    );
    
    const decryptedArray = new Uint8Array(decryptedBuffer);
    const decryptedVaultKey = btoa(String.fromCharCode(...decryptedArray));
    
    if (decryptedVaultKey === vaultKey) {
      console.log('✅ Decryption successful - vault key matches!');
    } else {
      console.error('❌ Decryption failed - vault key mismatch');
    }
    
  } catch (error) {
    console.error('❌ Full encryption test failed:', error);
    console.error('   Error details:', {
      message: error.message,
      stack: error.stack
    });
    return;
  }
  
  console.log('\n=== All Tests Passed ✅ ===');
  console.log('Your browser supports vault key encryption!');
}

// Auto-run the test
console.log('Running vault key encryption diagnostics...');
testVaultKeyGeneration();
