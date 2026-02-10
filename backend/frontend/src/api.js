import axios from 'axios';

// Replace with your Django API base URL
const BASE_URL = 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
  },
});

// Refresh token logic
client.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If token expired and we haven't retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: localStorage.getItem('refresh_token'),
        });

        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);

        // Update default headers for future requests
        client.defaults.headers['Authorization'] = 'Bearer ' + newAccess;

        // Update headers for the failed request
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;

        return client(originalRequest); // retry original request
      } catch (refreshError) {
        // Refresh token expired or invalid — log out user
        console.warn('Refresh token failed. Logging out.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // or use your router
      }
    }

    return Promise.reject(error);
  }
);

export default client;