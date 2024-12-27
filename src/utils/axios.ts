import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://spendtrack.duckdns.org';
if (!apiUrl) {
    console.error('API URL is not defined. Please check the environment variable configuration.');
}

const api = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
});

// Attach token to all requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        return config;
    },
    (error) => {
        // Log request error
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor for handling expired JWT
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Log the response error
        console.error('Response Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
        });

        if (error.response?.status === 401) {
            toast.error('Your session has expired. Redirecting to login.');
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }

        // Handle timeout error
        if (error.code === 'ECONNABORTED') {
            toast.error('The request timed out. Please try again.');
        }

        return Promise.reject(error);
    }
);

export default api;
