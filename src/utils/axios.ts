import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
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

// Interceptor for handling expired JWT
api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        if (error.response?.status === 401) {
            toast.error('Your session has expired. Redirecting to login.');
            localStorage.removeItem('token'); // Clear expired token
            window.location.href = '/auth'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
