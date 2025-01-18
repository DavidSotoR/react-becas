import axios from 'axios';
import { AuthProvider } from 'context/AuthContext';

const APIURL = process.env.REACT_APP_API_URL;
// Configuración base para Axios
const apiClient = axios.create({
  baseURL: APIURL, // Cambia esto por tu URL base
  timeout: 5000, // Tiempo máximo de espera
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptores (Opcional): Puedes agregar lógica para manejar tokens o errores globales
/* apiClient.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('authToken'); // Cambia esto según tu lógica
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
); */

export const setupApiClient = (logout) => {
    // Interceptor para manejar errores de respuesta
    apiClient.interceptors.response.use(
      (response) => response, // Si no hay errores, retorna la respuesta
      (error) => {
        if (error.response && error.response.status === 401) {
          console.error('Sesión expirada. Cerrando sesión...');
          logout(); // Llama al método de logout
        }
        return Promise.reject(error);
      }
    );
  };

// Función principal para hacer peticiones
const apiService = async (method, url, data = null) => {
  try {
    const response = await apiClient({
      method,
      url,
      data, // Para POST/PUT, incluye el cuerpo de la petición
    });
    return response.data; // Retorna solo los datos de la respuesta
  } catch (error) {
    console.error('Error en la petición:', error);
    // Manejo de errores: puedes personalizar esto
    throw error.response ? error.response.data : error;
  }
};

export default apiService;
