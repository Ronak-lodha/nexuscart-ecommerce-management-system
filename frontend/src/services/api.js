import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
                    localStorage.setItem('access_token', res.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/token/', credentials),
    register: (userData) => api.post('/register/', userData),
};

export const productAPI = {
    getAll: (params) => api.get('/products/', { params }),
    getById: (id) => api.get(`/products/${id}/`),
    create: (data) => api.post('/products/', data),
    update: (id, data) => api.put(`/products/${id}/`, data),
    delete: (id) => api.delete(`/products/${id}/`),
};

export const categoryAPI = {
    getAll: () => api.get('/categories/'),
    create: (data) => api.post('/categories/', data),
    update: (id, data) => api.put(`/categories/${id}/`, data),
    delete: (id) => api.delete(`/categories/${id}/`),
};

export const customerAPI = {
    getAll: () => api.get('/customers/'),
    getById: (id) => api.get(`/customers/${id}/`),
    getOrders: (id) => api.get(`/customers/${id}/orders/`),
    toggleBlock: (id) => api.post(`/customers/${id}/toggle_block/`),
    create: (data) => api.post('/customers/', data),
    update: (id, data) => api.put(`/customers/${id}/`, data),
    delete: (id) => api.delete(`/customers/${id}/`),
};

export const cartAPI = {
    get: () => api.get('/cart/'),
    addItem: (data) => api.post('/cart/add_item/', data),
    removeItem: (data) => api.post('/cart/remove_item/', data),
    clear: () => api.post('/cart/clear/'),
};

export const orderAPI = {
    getStats: () => api.get('/orders/stats/'),
    getAll: (params) => api.get('/orders/', { params }),
    getById: (id) => api.get(`/orders/${id}/`),
    create: (data) => api.post('/orders/', data),
    updateStatus: (id, data) => api.patch(`/orders/${id}/`, data),
    exportCSV: () => api.get('/orders/export_csv/', { responseType: 'blob' }),
};

export const returnAPI = {
    getAll: () => api.get('/returns/'),
    updateStatus: (id, data) => api.patch(`/returns/${id}/`, data),
    create: (data) => api.post('/returns/', data),
};

export default api;
