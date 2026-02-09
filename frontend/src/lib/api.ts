import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  getUsers: (page = 1) => api.get(`/auth/users?page=${page}`),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
};

// Product API
export const productAPI = {
  getProducts: (params: any = {}) => api.get('/products', { params }),
  getProductBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getProductById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getRelated: (id: string) => api.get(`/products/${id}/related`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  adminGetAll: (page = 1) => api.get(`/products/admin/all?page=${page}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data: { productId: string; quantity: number; size?: string; color?: string }) =>
    api.post('/cart/add', data),
  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/item/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  createCheckoutSession: (orderId: string) =>
    api.post('/orders/checkout-session', { orderId }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAll: (params: any = {}) => api.get('/orders', { params }),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
  getStats: () => api.get('/orders/stats'),
};
