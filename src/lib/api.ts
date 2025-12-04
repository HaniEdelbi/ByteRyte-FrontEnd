/**
 * API Configuration and HTTP Client
 * Handles all communication with the ByteRyte backend
 */

// Automatically detect API URL based on current hostname
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If explicitly set in environment, use that
  if (envUrl) {
    return envUrl;
  }
  
  // Auto-detect based on window location
  const hostname = window.location.hostname;
  
  // If accessing via localhost, use localhost backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // If accessing via IP address, use same IP for backend
  return `http://${hostname}:3000/api`;
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

/**
 * HTTP Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return fetchAPI<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> => {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> => {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> => {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return fetchAPI<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

/**
 * Auth utilities
 */
export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
  },
};

export default api;
