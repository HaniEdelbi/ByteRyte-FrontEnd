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

export const sessionService = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get<SessionsResponse>('/auth/sessions');
    return response.data;
  }
};
