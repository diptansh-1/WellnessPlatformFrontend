import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const sessionAPI = {
  getSessions: (params = {}) => api.get('/sessions', { params }),
  getMySessions: (params = {}) => api.get('/my-sessions', { params }),
  getMySession: (id) => api.get(`/my-sessions/${id}`),
  saveDraft: (data) => api.post('/my-sessions/save-draft', data),
  
  // Publish session
  publishSession: (data) => api.post('/my-sessions/publish', data),
  
  // Delete session
  deleteSession: (id) => api.delete(`/my-sessions/${id}`)
};

export default api;
