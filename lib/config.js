// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Frontend URL configuration
const FRONTEND_URL = isDevelopment 
  ? process.env.NEXT_PUBLIC_FRONTEND_URL_DEV 
  : process.env.NEXT_PUBLIC_FRONTEND_URL_PROD;

// Backend URL configuration
const BACKEND_URL = isDevelopment 
  ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV 
  : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

// Socket.io configuration
const SOCKET_URL = isDevelopment 
  ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV 
  : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

// Export all configurations
export default {
  FRONTEND_URL,
  BACKEND_URL,
  SOCKET_URL,
  isDevelopment
}; 