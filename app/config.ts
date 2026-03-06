export const API_BASE_URL = typeof window === 'undefined'
  ? process.env.API_BASE_URL ?? 'http://127.0.0.1:8000/api'  // server-side
  : process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:8000/api'  // client-side in development
    : '/api';  // client-side in production