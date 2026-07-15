import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';

/**
 * Creates a centralized Axios instance configured with the application's base API URL.
 * It includes interceptors for automatically attaching auth tokens to requests and 
 * handling global responses (like logging out on 401s).
 */
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

const NO_AUTH_ENDPOINTS = [
  '/auth/token',
  '/users/registration'
];

// Request Interceptor: Attach the JWT token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attempt to retrieve a token from local storage
    const token = localStorage.getItem('access_token');
    
    // Check if the current request URL matches any of the NO_AUTH_ENDPOINTS
    const requiresAuth = !NO_AUTH_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));
    
    if (token && config.headers && requiresAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {    
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    console.log("Error", error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized errors globally (e.g., clear token and redirect to login)
      localStorage.removeItem('access_token');
      
      // Prevent redirect loop if already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
