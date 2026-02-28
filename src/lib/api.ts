import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('laceup_current_user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            if (userData && typeof userData === 'object' && userData.token) {
                const { token } = userData;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Error parsing user data for auth header:', error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
