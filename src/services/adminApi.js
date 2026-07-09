import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Automatically attach the JWT token to every request
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

// Response interceptor: on 401, clear the (expired/invalid) token and send admin to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const adminLogin = (data) => api.post('/login', data, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

export const getAdminProfile = () => api.get('/users/me');

// ==================== DASHBOARD ====================
export const getDashboard = () => api.get('/admin/dashboard');

// ==================== PRODUCTS (Full CRUD + Images) ====================
export const getProducts = () => api.get('/admin/products');
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// 🚀 Upload Single Main Image (Local PC)
export const uploadProductImage = (productId, formData) => 
  api.post(`/admin/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// 🚀 Upload Multiple Sub Images (Local PC)
export const uploadProductImages = (productId, formData) => 
  api.post(`/admin/products/${productId}/images/multiple`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// ==================== CATEGORIES ====================
export const getCategories = () => api.get('/admin/categories');
export const createCategory = (data) => api.post('/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// ==================== ORDERS ====================
export const getOrders = (status) => api.get('/admin/orders', { params: { status } });
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });

// ==================== USERS ====================
export const getUsers = () => api.get('/admin/users');
export const toggleUserBlock = (id) => api.put(`/admin/users/${id}/block`);

// ==================== BANNERS (Full CRUD + Local Upload) ====================
export const getBanners = () => api.get('/admin/banners');
export const createBanner = (data) => api.post('/admin/banners', data);
export const updateBanner = (id, data) => api.put(`/admin/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`);
export const toggleBannerStatus = (id) => api.put(`/admin/banners/${id}/toggle`);

// 🚀 Upload Local Image for Banner
export const uploadBannerImage = (bannerId, formData) => 
  api.post(`/admin/banners/${bannerId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
// បន្ថែមបន្ទាត់នេះទៅក្នុង adminApi.js (នៅក្បែរ Category APIs)
export const uploadCategoryImage = (categoryId, formData) => 
  api.post(`/admin/categories/${categoryId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
// ==================== COUPONS ====================
export const getCoupons = () => api.get('/admin/coupons');
export const createCoupon = (data) => api.post('/admin/coupons', data);
export const deleteCoupon = (id) => api.delete(`/admin/coupons/${id}`);

export default api;