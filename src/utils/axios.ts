import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Backend API URL
});

// Attach token to all requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
