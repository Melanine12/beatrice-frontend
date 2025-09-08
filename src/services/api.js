import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - Token:', token ? 'Present' : 'Missing');
    console.log('API Request - URL:', config.url);
    console.log('API Request - Method:', config.method);
    
    // Si on envoie des FormData (fichiers), supprimer le Content-Type
    // pour que le navigateur puisse définir automatiquement la boundary
    if (config.data instanceof FormData) {
      console.log('📁 FormData détecté, suppression du Content-Type');
      delete config.headers['Content-Type'];
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Authorization header set');
    } else {
      console.log('API Request - No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 