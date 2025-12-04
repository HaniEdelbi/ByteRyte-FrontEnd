import { useActiveSessions } from '../hooks/useSession';
import { Monitor, Smartphone, Tablet, Shield, Clock, AlertCircle } from 'lucide-react';

/**
 * Parse user agent to determine device type and browser info
 */
const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  let deviceIcon = Monitor;
  
  if (ua.includes('mobile')) {
    deviceType = 'mobile';
    deviceIcon = Smartphone;
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
    deviceIcon = Tablet;
  }
  
  // Detect browser
  let browser = 'Unknown Browser';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
  
  // Detect OS
  let os = 'Unknown OS';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { deviceType, deviceIcon, browser, os };
};

/**
 * Format timestamp to relative time
 */
const formatRelativeTime = (timestamp: string) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return then.toLocaleDateString();
};

export default function Sessions() {
  const { data: sessions, isLoading, error } = useActiveSessions();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Active Sessions</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your active sessions across all devices. Sessions are automatically created when you log in.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-primary/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-primary/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-primary/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-500">Failed to load sessions</h3>
            </div>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        )}

        {/* Sessions List */}
        {sessions && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const { deviceIcon: DeviceIcon, browser, os, deviceType } = parseUserAgent(session.userAgent);
              const isCurrentSession = index === 0; // Assume first session is current
              
              return (
                <div 
                  key={session.id} 
                  className={`glass-card p-6 ${isCurrentSession ? 'border-2 border-primary shadow-xl' : ''}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <DeviceIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {session.name ? session.name : `${browser} on ${os}`}
                          {isCurrentSession && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {session.name ? `${deviceType} · ${browser} · ${os}` : `${deviceType} device`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    {/* Device Fingerprint */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span className="font-mono text-xs">
                        {session.fingerprint.substring(0, 16)}...
                      </span>
                    </div>
                    
                    {/* Created At */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        Active since {formatRelativeTime(session.createdAt)}
                      </span>
                    </div>
                    
                    {/* User Agent (collapsed) */}
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Show technical details
                      </summary>
                      <pre className="mt-2 p-3 bg-black/20 rounded-lg text-[10px] overflow-x-auto">
                        {session.userAgent}
                      </pre>
                    </details>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {sessions && sessions.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
            <p className="text-muted-foreground">
              You don't have any active sessions. This page will show all devices where you're logged in.
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="glass-card p-6 mt-8 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Security Information</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Sessions are automatically created when you log in from any device</li>
            <li>• Each session is identified by a unique device fingerprint</li>
            <li>• Logging out will destroy your session on that device</li>
            <li>• Sessions persist until you explicitly log out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

