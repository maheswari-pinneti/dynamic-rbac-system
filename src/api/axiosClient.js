import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  // Ensure 304 Not Modified is treated as a valid status without throwing an exception
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

// Request interceptor: attach anti-cache headers and simulated token
apiClient.interceptors.request.use(
  (config) => {
    // Prevent stale 304 Not Modified by enforcing fresh revalidation
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard error response formatter & 304 body fallback
apiClient.interceptors.response.use(
  (response) => {
    // If the server or browser cache returned 304 Not Modified with empty payload, retrieve from local store
    if (response.status === 304 && (!response.data || Object.keys(response.data).length === 0)) {
      try {
        const cached = localStorage.getItem('dynamic_rbac_cached_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          response.data = { products: parsed, total: parsed.length, skip: 0, limit: parsed.length };
        }
      } catch (e) {
        console.warn('Could not read cached products on 304:', e);
      }
    }
    return response;
  },
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred while communicating with the server.',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
