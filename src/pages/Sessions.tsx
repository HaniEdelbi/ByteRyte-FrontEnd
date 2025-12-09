import { useDevices, useRevokeDevice } from '../hooks/useSession';
import { Monitor, Smartphone, Tablet, Shield, Clock, AlertCircle, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';

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
  const { data: devices, isLoading, error } = useDevices();
  const revokeDevice = useRevokeDevice();

  // Debug logging
  console.log('Sessions Page - Loading:', isLoading);
  console.log('Sessions Page - Error:', error);
  console.log('Sessions Page - Devices:', devices);

  const handleRevokeDevice = async (deviceId: string, deviceName: string) => {
    if (confirm(`Are you sure you want to revoke access for "${deviceName}"? You'll need to log in again on that device.`)) {
      try {
        await revokeDevice.mutateAsync(deviceId);
      } catch (error) {
        toast.error(`Failed to revoke device: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Devices & Sessions</h1>
          </div>
          <p className="text-muted-foreground">
            Manage all devices using your email. View device information and revoke access to specific devices.
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
        {error && !isLoading && (
          <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-500">Failed to load devices</h3>
            </div>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        )}

        {/* Devices List */}
        {!isLoading && !error && devices && devices.length > 0 && (
          <div className="space-y-4">
            {devices.map((device) => {
              // Use backend-provided browser/os or fallback to default icon
              const deviceIcon = device.os?.toLowerCase().includes('android') || device.os?.toLowerCase().includes('ios') 
                ? Smartphone 
                : Monitor;
              const DeviceIcon = deviceIcon;
              
              return (
                <div 
                  key={device.id} 
                  className={`glass-card p-6 ${device.isCurrentDevice ? 'border-2 border-primary shadow-xl' : ''}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <DeviceIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {device.name}
                          {device.isCurrentDevice && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {device.browser} · {device.os}
                        </p>
                      </div>
                    </div>
                    
                    {/* Revoke Button */}
                    {!device.isCurrentDevice && (
                      <button
                        onClick={() => handleRevokeDevice(device.id, device.name)}
                        disabled={revokeDevice.isPending}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                        title="Revoke this device"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    {/* Device Fingerprint */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span className="font-mono text-xs">
                        {device.fingerprint.substring(0, 16)}...
                      </span>
                    </div>
                    
                    {/* IP Address */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Monitor className="w-4 h-4" />
                      <span>
                        IP: {device.ipAddress}
                      </span>
                    </div>
                    
                    {/* Last Seen */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        Last seen {formatRelativeTime(device.lastSeen)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && devices && devices.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Devices Found</h3>
            <p className="text-muted-foreground">
              You don't have any registered devices. Devices are automatically registered when you log in.
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
            <li>• Devices are automatically registered when you log in with your email</li>
            <li>• Each device is identified by a unique device fingerprint</li>
            <li>• You can revoke access to any device except your current one</li>
            <li>• Revoking a device will require re-authentication on that device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

