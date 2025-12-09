import { useState } from 'react';
import { Search, Plus, Eye, EyeOff, Copy, Edit2, Trash2, Shield, Lock, Globe, Mail, CreditCard, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock data - will be replaced with real API calls
interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  lastModified: string;
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
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);

  // Mock passwords - replace with API call
  const passwords: Password[] = [
    {
      id: '1',
      title: 'Gmail',
      username: 'user@gmail.com',
      password: 'SecurePass123!',
      website: 'https://gmail.com',
      category: 'login',
      favorite: true,
      lastModified: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Credit Card',
      username: '4532 **** **** 1234',
      password: '123',
      category: 'payment',
      favorite: false,
      lastModified: new Date().toISOString(),
    },
  ];

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    alert(`${field} copied to clipboard!`);
  };

  const filteredPasswords = passwords.filter(pwd => {
    const matchesSearch = pwd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pwd.username.toLowerCase().includes(searchQuery.toLowerCase());
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
            onClick={() => alert('Add password modal - to be implemented')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Password
          </button>
        </div>

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
              onClick={() => alert('Add password modal - to be implemented')}
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
                          <h3 className="text-lg font-semibold">{pwd.title}</h3>
                          {pwd.favorite && (
                            <span className="text-yellow-500">★</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{pwd.username}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pwd.username, 'Username');
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span className="font-mono">
                              {isPasswordVisible ? pwd.password : '••••••••'}
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
                                copyToClipboard(pwd.password, 'Password');
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          {pwd.website && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe className="w-4 h-4" />
                              <a
                                href={pwd.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-primary underline"
                              >
                                {pwd.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Edit password - to be implemented');
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
                            alert('Delete password - to be implemented');
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
              {passwords.filter(p => p.password.length > 10).length}
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
      </div>
    </div>
  );
}
