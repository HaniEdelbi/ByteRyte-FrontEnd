import { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { initializeVaultKey } from '@/services/encryptionService';

interface ReauthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReauthModal({ isOpen, onSuccess, onCancel }: ReauthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get user info and encrypted vault key from localStorage
      const encryptedVaultKey = localStorage.getItem('encryptedVaultKey');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      if (!encryptedVaultKey) {
        setError('No vault key found. Please log out and log in again.');
        setIsLoading(false);
        return;
      }

      if (!currentUser.email) {
        setError('User information not found. Please log out and log in again.');
        setIsLoading(false);
        return;
      }

      // Try to decrypt the vault key with the provided password
      await initializeVaultKey(encryptedVaultKey, password, currentUser.email);

      // Success! Reset form and call success callback
      setPassword('');
      setError('');
      onSuccess();
    } catch (err) {
      console.error('Vault key decryption failed:', err);
      setError('Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Verify Your Identity</h2>
              <p className="text-sm text-muted-foreground">Enter your password to continue</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Message */}
        <div className="px-6 pt-6">
          <div className="flex gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-500 mb-1">Vault Key Required</p>
              <p className="text-muted-foreground">
                Enter your <strong>account password</strong> (the one you use to log in) to unlock your vault and decrypt your passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Account Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This is the same password you use to log into your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{error}</p>
                {error.includes('Incorrect password') && (
                  <p className="text-xs text-muted-foreground mt-1">
                    If you recently registered or logged in for the first time, try logging out and logging back in.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Unlock Vault'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
