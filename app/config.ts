export const API_BASE_URL = typeof window === 'undefined'
  ? process.env.API_BASE_URL ?? 'http://127.0.0.1:8000/api'  // server-side
  : '/api';                   