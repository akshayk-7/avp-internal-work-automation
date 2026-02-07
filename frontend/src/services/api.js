import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Using Vite proxy
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token
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

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    registerOffice: (data) => api.post('/auth/register-office', data),
};

export const clientService = {
    getAll: (params) => api.get('/clients', { params }),
    create: (data) => api.post('/clients', data),
    update: (id, data) => api.patch(`/clients/${id}`, data),
    delete: (id) => api.delete(`/clients/${id}`),
    bulkAssign: (data) => api.patch('/clients/bulk-assign', data),
};

export const importService = {
    upload: (formData) => api.post('/imports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    confirm: (data) => api.post('/imports/confirm', data),
};

export const dashboardService = {
    getCEO: () => api.get('/dashboard/ceo'),
    getAO: (rangeId) => api.get('/dashboard/ao', { params: { range_id: rangeId } }),
    getOA: () => api.get('/dashboard/oa'),
};

export default api;
