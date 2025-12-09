import { useState, useEffect } from 'react';
import { Search, Plus, Eye, EyeOff, Copy, Edit2, Trash2, Shield, Lock, Globe, Mail, CreditCard, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddPasswordModal from '../components/AddPasswordModal';
import ReauthModal from '../components/ReauthModal';
import { usePasswordsDecrypted, useDeletePassword } from '../hooks/usePasswords';
import { hasVaultKey } from '../services/encryptionService';
import { toast } from 'sonner';

// Interfaces for decrypted password data
interface DecryptedPassword {
  id: string;
  vaultId: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  decrypted: {
    website: string;
    username: string;
    password: string;
    notes?: string;
  };
}

const categoryIcons = {
  login: Globe,
  payment: CreditCard,
  'secure-note': Lock,
  other: Key,
};

const categoryColors = {
  login: 'text-blue-500',
  payment: 'text-green-500',
  'secure-note': 'text-purple-500',
  other: 'text-orange-500',
};

export default function Vault() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedPassword, setSelectedPassword] = useState<DecryptedPassword | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showReauth, setShowReauth] = useState(false);
  const [vaultKeyReady, setVaultKeyReady] = useState(false);

  // Check if vault key is initialized
  useEffect(() => {
    const checkVaultKey = () => {
      if (hasVaultKey()) {
        setVaultKeyReady(true);
        setShowReauth(false);
      } else {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const encryptedVaultKey = localStorage.getItem('encryptedVaultKey');
        
        if (token && encryptedVaultKey) {
          // User is logged in but vault key not in memory - show reauth
          setShowReauth(true);
          setVaultKeyReady(false);
        } else {
          // User not logged in - redirect to login
          navigate('/login');
        }
      }
    };

    checkVaultKey();
  }, [navigate]);

  // Fetch real passwords from API only when vault key is ready
  const { data: passwordsData, isLoading, error } = usePasswordsDecrypted({ enabled: vaultKeyReady });
  const deletePassword = useDeletePassword();
  
  const passwords = passwordsData || [];

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${field} copied to clipboard!`);
  };

  const filteredPasswords = passwords.filter(pwd => {
    const matchesSearch = pwd.decrypted.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pwd.decrypted.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pwd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              My Vault
            </h1>
            <p className="text-muted-foreground">
              Manage your passwords securely with zero-knowledge encryption
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            disabled={isLoading}
          >
            <Plus className="w-5 h-5" />
            Add Password
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your passwords...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-12 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-500">Error Loading Passwords</h3>
            <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : 'Failed to load passwords'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Password List */}
        {!isLoading && !error && (
          <>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'login', 'payment', 'secure-note', 'other'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Password List */}
        {filteredPasswords.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No passwords found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try a different search query'
                : 'Start by adding your first password'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Add Your First Password
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPasswords.map((pwd) => {
              const CategoryIcon = categoryIcons[pwd.category];
              const isPasswordVisible = showPasswords[pwd.id];

              return (
                <div
                  key={pwd.id}
                  className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPassword(pwd)}
                >
                  <div className="flex items-start justify-between">
                    {/* Left side - Icon and Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-primary/10 ${categoryColors[pwd.category]}`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{pwd.decrypted.website}</h3>
                          {pwd.favorite && (
                            <span className="text-yellow-500">★</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{pwd.decrypted.username}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pwd.decrypted.username, 'Username');
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span className="font-mono">
                              {isPasswordVisible ? pwd.decrypted.password : '••••••••'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePasswordVisibility(pwd.id);
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pwd.decrypted.password, 'Password');
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <a
                              href={pwd.decrypted.website.startsWith('http') ? pwd.decrypted.website : `https://${pwd.decrypted.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-primary underline"
                            >
                              {pwd.decrypted.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Edit password feature coming soon');
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this password?')) {
                            toast.info('Delete password feature coming soon');
                          }
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Total Passwords</h3>
            </div>
            <p className="text-3xl font-bold">{passwords.length}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Strong Passwords</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">
              {passwords.filter(p => p.decrypted.password.length > 10).length}
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Websites</h3>
            </div>
            <p className="text-3xl font-bold text-blue-500">
              {passwords.filter(p => p.category === 'login').length}
            </p>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Add Password Modal */}
      <AddPasswordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Reauth Modal */}
      <ReauthModal
        isOpen={showReauth}
        onSuccess={() => {
          setVaultKeyReady(true);
          setShowReauth(false);
        }}
        onCancel={() => {
          navigate('/login');
        }}
      />
    </div>
  );
}
