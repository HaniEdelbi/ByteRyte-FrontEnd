import { useState } from 'react';
import { X, Eye, EyeOff, Globe, CreditCard, Lock, Key, Sparkles, Star } from 'lucide-react';
import { useCreatePassword } from '@/hooks/usePasswords';
import { hasVaultKey } from '@/services/encryptionService';
import ReauthModal from './ReauthModal';
import { toast } from 'sonner';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  { value: 'login', label: 'Login', icon: Globe, color: 'text-blue-500' },
  { value: 'payment', label: 'Payment', icon: CreditCard, color: 'text-green-500' },
  { value: 'secure-note', label: 'Secure Note', icon: Lock, color: 'text-purple-500' },
  { value: 'other', label: 'Other', icon: Key, color: 'text-orange-500' },
] as const;

export default function AddPasswordModal({ isOpen, onClose }: AddPasswordModalProps) {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<'login' | 'payment' | 'secure-note' | 'other'>('login');
  const [favorite, setFavorite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const createPassword = useCreatePassword();

  const generateStrongPassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let newPassword = '';
    
    // Ensure at least one of each type
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest
    for (let i = newPassword.length; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    const shuffled = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(shuffled);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get current vault ID from localStorage
    const vaultId = localStorage.getItem('vaultId');
    if (!vaultId) {
      toast.error('No vault found. Please log in again.');
      return;
    }

    // Validate required fields
    if (!website.trim()) {
      toast.error('Website/Title is required');
      return;
    }
    if (!username.trim()) {
      toast.error('Username/Email is required');
      return;
    }
    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    // Check if vault key is available
    if (!hasVaultKey()) {
      // Show re-auth modal to decrypt vault key
      setPendingSubmit(true);
      setShowReauthModal(true);
      return;
    }

    // Proceed with creating the password
    await performCreatePassword();
  };

  const performCreatePassword = async () => {
    const vaultId = localStorage.getItem('vaultId');
    if (!vaultId) return;

    try {
      await createPassword.mutateAsync({
        vaultId,
        website: website.trim(),
        username: username.trim(),
        password: password.trim(),
        notes: notes.trim() || undefined,
        category,
        favorite,
      });

      // Reset form and close modal
      setWebsite('');
      setUsername('');
      setPassword('');
      setNotes('');
      setCategory('login');
      setFavorite(false);
      setShowPassword(false);
      setPendingSubmit(false);
      onClose();
    } catch (error) {
      console.error('Failed to create password:', error);
      setPendingSubmit(false);
      // Error notification is handled by the hook
    }
  };

  const handleReauthSuccess = async () => {
    // Vault key is now available, proceed with creating password
    setShowReauthModal(false);
    await performCreatePassword();
  };

  const handleReauthCancel = () => {
    setShowReauthModal(false);
    setPendingSubmit(false);
  };

  const handleCancel = () => {
    // Reset form
    setWebsite('');
    setUsername('');
    setPassword('');
    setNotes('');
    setCategory('login');
    setFavorite(false);
    setShowPassword(false);
    setPendingSubmit(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategoryData = categoryOptions.find(opt => opt.value === category);
  const CategoryIcon = selectedCategoryData?.icon || Globe;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CategoryIcon className={`w-5 h-5 ${selectedCategoryData?.color || 'text-primary'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add New Password</h2>
              <p className="text-sm text-muted-foreground">Securely store your credentials</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categoryOptions.map(option => {
                const Icon = option.icon;
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Website/Title */}
          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-medium">
              Website/Title <span className="text-red-500">*</span>
            </label>
            <input
              id="website"
              type="text"
              placeholder="e.g., gmail.com or My Credit Card"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Username/Email */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Username/Email <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g., user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={generateStrongPassword}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </button>
            </div>
            {password && (
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded-full ${
                    password.length < 8 ? 'bg-red-500' :
                    password.length < 12 ? 'bg-yellow-500' :
                    password.length < 16 ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {password.length < 8 ? 'Weak' :
                     password.length < 12 ? 'Fair' :
                     password.length < 16 ? 'Good' :
                     'Strong'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <label htmlFor="favorite" className="block text-sm font-medium cursor-pointer">
                Mark as Favorite
              </label>
              <p className="text-xs text-muted-foreground">Quick access to this password</p>
            </div>
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                favorite ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  favorite ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={createPassword.isPending}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPassword.isPending}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {createPassword.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Re-authentication Modal */}
      <ReauthModal 
        isOpen={showReauthModal}
        onSuccess={handleReauthSuccess}
        onCancel={handleReauthCancel}
      />
    </div>
  );
}
