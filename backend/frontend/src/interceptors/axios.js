import axios from "axios";
let isRefreshing = false;

axios.interceptors.response.use(
  resp => resp,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          'http://localhost:8000/token/refresh/',
          { refresh: localStorage.getItem('refresh_token') },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        return axios(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);