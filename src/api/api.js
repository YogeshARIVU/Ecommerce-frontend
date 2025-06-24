import axios from 'axios';

const API = axios.create({
    baseURL: 'http://ecommerce-production-bec3.up.railway.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
API.interceptors.request.use(
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

// Add response interceptor to handle token expiration
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const loginUser = (email, password) => {
    return API.post('/auth/login', { email, password });
};

export const registerUser = (userData) => {
    return API.post('/auth/register', userData);
};

export const fetchProducts = () => {
    return API.get('/products');
};

export const fetchProductById = (id) => {
    return API.get(`/products/${id}`);
};

export const searchProducts = (name) => {
    return API.get(`/products/search?name=${name}`);
};

export const filterProducts = (category) => {
    return API.get(`/products/filter?category=${category}`);
};

export const uploadProduct = (formData) => {
    return API.post('/products/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProduct = (id) => {
    return API.delete(`/products/${id}`);
};
