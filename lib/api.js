import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Always send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for debugging (optional)
// api.interceptors.request.use(
//   (config) => {
//     console.log('Making API request:', config.method?.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor for better error handling (optional)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Authentication failed - redirecting to login');
//       // You can add automatic logout/redirect logic here if needed
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
