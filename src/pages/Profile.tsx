import { Shield, Mail, Calendar, CreditCard, Crown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCurrentUser } from '../hooks/useAuth';

export default function Profile() {
  const { data: user } = useCurrentUser();

  // Mock subscription data - replace with API
  const subscription = {
    plan: 'Free',
    status: 'active',
    nextBilling: null,
    features: [
      'Up to 50 passwords',
      'Basic encryption',
      '1 device',
      'Email support',
    ],
  };

  const premiumFeatures = [
    'Unlimited passwords',
    'Advanced encryption',
    'Unlimited devices',
    'Priority support',
    'Password sharing',
    'Advanced security reports',
    '1GB encrypted file storage',
    'Emergency access',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            View your account information and subscription details
          </p>
        </div>

        {/* User Info Card */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'user@example.com'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/settings'}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Current Subscription */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
              <p className="text-muted-foreground">
                Manage your subscription and billing
              </p>
            </div>
            <div className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold flex items-center gap-2">
              {subscription.plan === 'Premium' && <Crown className="w-4 h-4" />}
              {subscription.plan}
            </div>
          </div>

          {/* Current Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {subscription.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {subscription.plan === 'Free' && (
            <div className="pt-6 border-t border-border">
              <button
                onClick={() => window.location.href = '/pricing'}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Premium
              </button>
            </div>
          )}

          {subscription.plan !== 'Free' && subscription.nextBilling && (
            <div className="pt-6 border-t border-border text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Next billing date: {subscription.nextBilling}</span>
              </div>
            </div>
          )}
        </div>

        {/* Premium Upgrade Card (if free plan) */}
        {subscription.plan === 'Free' && (
          <div className="glass-card p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                <p className="text-muted-foreground">
                  Unlock the full power of ByteRyte
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold">$4.99</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Get Premium Now
              </button>
            </div>
          </div>
        )}

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Security Score</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">85%</p>
            <p className="text-xs text-muted-foreground mt-1">Good</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Total Passwords</h3>
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">of 50 used</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Last Login</h3>
            </div>
            <p className="text-lg font-bold">Today</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
