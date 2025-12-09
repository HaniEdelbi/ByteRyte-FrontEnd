/**
 * Hook to check vault key status
 * Useful for detecting when re-authentication is needed
 */

import { useState, useEffect } from 'react';
import { hasVaultKey } from '@/services/encryptionService';

export function useVaultKeyStatus() {
  const [isVaultKeyAvailable, setIsVaultKeyAvailable] = useState(hasVaultKey());

  // Check vault key status on mount and when localStorage changes
  useEffect(() => {
    const checkVaultKey = () => {
      setIsVaultKeyAvailable(hasVaultKey());
    };

    // Check initially
    checkVaultKey();

    // Check when window gains focus (in case user logged in another tab)
    window.addEventListener('focus', checkVaultKey);

    return () => {
      window.removeEventListener('focus', checkVaultKey);
    };
  }, []);

  return {
    isVaultKeyAvailable,
    needsReauth: !isVaultKeyAvailable,
  };
}
