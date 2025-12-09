import api from '../lib/api';

export interface Session {
  id: string;
  fingerprint: string;
  name: string;
  userAgent: string;
  createdAt: string;
}

export interface SessionsResponse {
  success: boolean;
  data: Session[];
}

export interface Device {
  id: string;
  name: string;
  fingerprint: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastSeen: string;
  createdAt: string;
  isCurrentDevice: boolean;
}

export interface DevicesResponse {
  success: boolean;
  count: number;
  data: Device[];
}

export const sessionService = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get<SessionsResponse>('/auth/sessions');
    // api.get returns the full response: { success: true, data: [...] }
    return response.success ? response.data : [];
  },
  
  getDevices: async (): Promise<Device[]> => {
    const response = await api.get<DevicesResponse>('/devices');
    // api.get returns the full response: { success: true, count: X, data: [...] }
    return response.success ? response.data : [];
  },
  
  revokeDevice: async (deviceId: string): Promise<void> => {
    await api.delete(`/devices/${deviceId}`);
  }
};
