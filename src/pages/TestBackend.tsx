/**
 * Backend Test Page
 * Test authentication and password management integration
 */

import { useState, useEffect } from "react";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { toast } from 'sonner';

// Helper function to get API URL (same logic as api.ts)
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  return `http://${hostname}:3000/api`;
};

const TestBackend = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [vaultId, setVaultId] = useState("");
  const [passwords, setPasswords] = useState<any[]>([]);
  const [passwordsLoading, setPasswordsLoading] = useState(false);

  // Auth hooks
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: registerPending } = useRegister();

  // Test password data
  const [testPasswordTitle, setTestPasswordTitle] = useState("");
  const [testPasswordValue, setTestPasswordValue] = useState("");
  const [testPasswordUsername, setTestPasswordUsername] = useState("");
  const [testPasswordNotes, setTestPasswordNotes] = useState("");

  const isAuthenticated = !!localStorage.getItem('authToken');

  // Fetch vault ID after login
  useEffect(() => {
    if (isAuthenticated && !vaultId) {
      fetchVaultId();
    }
  }, [isAuthenticated]);

  const fetchVaultId = async () => {
    try {
      const apiUrl = getApiUrl();
      console.log('Fetching vaults from:', `${apiUrl}/vaults`);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${apiUrl}/vaults`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log('Vault response:', result);
      
      // Handle response wrapped in success/data structure
      const vaults = result.success ? result.data : result;
      
      if (vaults && vaults.length > 0) {
        setVaultId(vaults[0].id);
        fetchPasswords(vaults[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch vault:', error);
    }
  };

  const fetchPasswords = async (vault: string) => {
    try {
      setPasswordsLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = getApiUrl();
      console.log('[TestBackend] Fetching passwords from:', `${apiUrl}/passwords?vaultId=${vault}`);
      
      const response = await fetch(`${apiUrl}/passwords?vaultId=${vault}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log('Passwords response:', result);
      console.log('Response.ok:', response.ok);
      
      // Handle different response structures
      let passwordData;
      if (result.success && result.data) {
        passwordData = result.data;
      } else if (result.items) {
        passwordData = result.items;
      } else if (Array.isArray(result)) {
        passwordData = result;
      } else {
        passwordData = [];
      }
      
      console.log('Extracted password data:', passwordData);
      setPasswords(Array.isArray(passwordData) ? passwordData : []);
    } catch (error) {
      console.error('Failed to fetch passwords:', error);
      setPasswords([]);
    } finally {
      setPasswordsLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaultId) {
      toast.error('No vault found. Please login again.');
      return;
    }

    if (!testPasswordTitle || !testPasswordUsername || !testPasswordValue) {
      toast.error('Please fill in Title, Username, and Password fields');
      return;
    }

    try {
      // Create encrypted blob (in production, this would be properly encrypted)
      const passwordData = {
        title: testPasswordTitle,
        username: testPasswordUsername,
        password: testPasswordValue,
        notes: testPasswordNotes
      };
      
      console.log('=== Creating Password ===');
      console.log('Form state values:');
      console.log('  Title:', testPasswordTitle);
      console.log('  Username:', testPasswordUsername);
      console.log('  Password:', testPasswordValue);
      console.log('  Notes:', testPasswordNotes);
      console.log('Password data object:', passwordData);
      
      const encryptedBlob = btoa(JSON.stringify(passwordData)); // Simple base64 encoding for demo
      console.log('Encrypted blob:', encryptedBlob);
      console.log('Decrypted (verify):', JSON.parse(atob(encryptedBlob)));

      const requestBody = {
        vaultId,
        encryptedBlob
      };
      console.log('Request body:', requestBody);

      const apiUrl = getApiUrl();
      console.log('Creating password at:', `${apiUrl}/passwords`);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${apiUrl}/passwords`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      console.log('Create password response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create password');
      }

      toast.success("Password created successfully!");
      setTestPasswordTitle("");
      setTestPasswordValue("");
      setTestPasswordUsername("");
      setTestPasswordNotes("");
      fetchPasswords(vaultId);
    } catch (error: any) {
      toast.error(`Failed to create password: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setVaultId("");
    setPasswords([]);
    window.location.reload();
  };

  const decryptBlob = (encryptedBlob: string) => {
    try {
      const decrypted = JSON.parse(atob(encryptedBlob));
      return decrypted;
    } catch {
      return { title: 'Encrypted', username: '***' };
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      register(
        { email, password, name: name || email.split('@')[0] },
        {
          onSuccess: (data: any) => {
            toast.success("Registration successful! Now logging in...");
            if (data.token) {
              localStorage.setItem('authToken', data.token);
              setIsRegistering(false);
              fetchVaultId();
            }
          },
          onError: (error: any) => {
            console.error("Registration error:", error);
            const errorMsg = error.message || JSON.stringify(error);
            toast.error(`Registration failed: ${errorMsg}`);
          }
        }
      );
    } else {
      login(
        { email, password },
        {
          onSuccess: () => {
            toast.success("Login successful!");
            fetchVaultId();
          },
          onError: (error: any) => {
            console.error("Login error:", error);
            const errorMsg = error.message || JSON.stringify(error);
            toast.error(`Login failed: ${errorMsg}`);
          }
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Backend Connection Test</h1>
        <p className="text-muted-foreground mb-8">
          Test your backend API integration
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication Section */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              🔐 Authentication
              {isAuthenticated && <span className="text-sm text-green-500">(Logged In)</span>}
            </h2>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    ✅ Successfully authenticated!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Token stored in localStorage
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn || registerPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoggingIn || registerPending ? "Loading..." : isRegistering ? "Register" : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="w-full text-primary hover:underline text-sm"
                >
                  {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                </button>
              </form>
            )}
          </div>

          {/* Password Management Section */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">🔑 Password Vault</h2>
            
            {!isAuthenticated ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-600 dark:text-yellow-400">
                  ⚠️ Please login first to access passwords
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Create Password Form */}
                <form onSubmit={handleCreatePassword} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={testPasswordTitle}
                      onChange={(e) => setTestPasswordTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="My Password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={testPasswordUsername}
                      onChange={(e) => setTestPasswordUsername(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={testPasswordValue}
                      onChange={(e) => setTestPasswordValue(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <textarea
                      value={testPasswordNotes}
                      onChange={(e) => setTestPasswordNotes(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Password
                  </button>
                </form>

                {/* Passwords List */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Your Passwords ({vaultId ? `Vault: ${vaultId.slice(0, 8)}...` : 'Loading...'})</h3>
                    <button
                      onClick={() => vaultId && fetchPasswords(vaultId)}
                      disabled={!vaultId || passwordsLoading}
                      className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {passwordsLoading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  {passwordsLoading ? (
                    <p className="text-muted-foreground">Loading passwords...</p>
                  ) : passwords && passwords.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {passwords.map((pwd: any, index: number) => {
                        const decrypted = decryptBlob(pwd.encryptedBlob);
                        return (
                          <div
                            key={pwd.id || index}
                            className="p-3 bg-primary/5 border border-primary/10 rounded-lg"
                          >
                            <p className="font-medium">{decrypted.title || 'Untitled'}</p>
                            <p className="text-sm text-muted-foreground">
                              Username: {decrypted.username || 'No username'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Password: {decrypted.password || 'No password'}
                            </p>
                            {decrypted.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Notes: {decrypted.notes}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground/50 mt-1">
                              Created: {new Date(pwd.createdAt).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No passwords yet. Create one above!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Connection Info</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Backend URL:</span>{" "}
              <code className="bg-primary/10 px-2 py-1 rounded">
                {getApiUrl()}
              </code>
            </p>
            <p>
              <span className="font-medium">Auth Token:</span>{" "}
              <code className="bg-primary/10 px-2 py-1 rounded">
                {isAuthenticated ? '✅ Present' : '❌ Not set'}
              </code>
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">📝 Test Instructions</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Make sure your backend server is running</li>
            <li>2. Register a new account or login with existing credentials</li>
            <li>3. Create a test password in the vault</li>
            <li>4. Check the passwords list to see your saved passwords</li>
            <li>5. Open browser DevTools (F12) → Network tab to see API calls</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestBackend;
