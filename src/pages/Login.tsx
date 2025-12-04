/**
 * Login Page
 * User authentication page with login and registration
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useLogin, useRegister } from "@/hooks/useAuth";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: registerPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      // Registration
      register(
        { email, password, name: name || email.split('@')[0] },
        {
          onSuccess: () => {
            navigate('/'); // Redirect to home after successful registration
          },
          onError: (error: any) => {
            setError(error.message || 'Registration failed. Please try again.');
          }
        }
      );
    } else {
      // Login
      login(
        { email, password },
        {
          onSuccess: () => {
            navigate('/'); // Redirect to home after successful login
          },
          onError: (error: any) => {
            setError(error.message || 'Login failed. Please check your credentials.');
          }
        }
      );
    }
  };

  const isPending = isLoggingIn || registerPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ByteRyte
              </span>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isRegistering 
                ? 'Sign up to secure your passwords' 
                : 'Sign in to access your vault'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Registration Only) */}
            {isRegistering && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password (Login Only) */}
            {!isRegistering && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending 
                ? (isRegistering ? 'Creating Account...' : 'Signing In...') 
                : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Zero-Knowledge Security</p>
                <p>Your password is never sent to our servers. All encryption happens locally in your browser.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
