import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar el JWT en cada petición
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (['post', 'patch', 'put'].includes(config.method?.toLowerCase() || '')) {
    config.headers['Idempotency-Key'] = uuidv4();
  }
  return config;
});


