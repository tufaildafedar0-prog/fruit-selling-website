import axios from 'axios';

// UPDATED: Use Railway as fallback (not old Render URL!)
const API_URL = import.meta.env.VITE_API_URL || 'https://fruit-selling-website-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
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

// Handle response errors (FIXED: Don't logout on ALL 401s)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only logout on 401 from actual AUTH endpoints
        // Don't logout on socket errors, payment errors, etc.
        if (error.response?.status === 401) {
            const url = error.config?.url || '';

            // Only logout if it's an auth-related endpoint
            const isAuthEndpoint = url.includes('/auth/') ||
                url.includes('/users/me') ||
                url.includes('/users/profile');

            if (isAuthEndpoint) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            // For other 401s (payments, socket, etc.), just pass the error
        }
        return Promise.reject(error);
    }
);

export default api;
