import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Axios instance configured for backend API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Setup request interceptor to attach Clerk JWT token
 * Call this in App.tsx after ClerkProvider
 */
export const setupAuthInterceptor = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to attach auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

/**
 * Setup response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data);

      if (status === 401) {
        // Handle unauthorized - token may be expired
        console.error('Unauthorized - token may be expired');
      }
    } else if (error.request) {
      // No response received
      console.error('Network error - no response:', error.message);
    } else {
      // Request setup error
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
