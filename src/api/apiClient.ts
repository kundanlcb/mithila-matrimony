const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  data?: any;
}

/**
 * A native fetch wrapper that automatically handles JWT tokens, 
 * JSON parsing, and common HTTP errors.
 */
async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customConfig } = options;
  
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('active_profile');
      window.dispatchEvent(new Event('auth_unauthorized'));
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errData = await response.json();
        errorMessage = errData.message || errorMessage;
      } catch (e) {
        // Not JSON
      }
      throw new ApiError(response.status, errorMessage);
    }

    // Return empty object for 204 No Content or empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {} as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parsing errors
    throw new Error(error instanceof Error ? error.message : 'Network Error');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => fetchClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => fetchClient<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T>(endpoint: string, data?: any, options?: RequestOptions) => fetchClient<T>(endpoint, { ...options, method: 'PUT', data }),
  patch: <T>(endpoint: string, data?: any, options?: RequestOptions) => fetchClient<T>(endpoint, { ...options, method: 'PATCH', data }),
  delete: <T>(endpoint: string, options?: RequestOptions) => fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
