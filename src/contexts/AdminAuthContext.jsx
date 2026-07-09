import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, getAdminProfile } from '../services/adminApi';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAdmin = async () => {
    try {
      const response = await getAdminProfile();
      if (response.data.role === 'admin') {
        setAdmin(response.data);
      } else {
        localStorage.removeItem('token');
        toast.error('Access Denied. You are not an admin.');
      }
    } catch (error) {
      console.error('Failed to load admin:', error);
      // If the token is invalid (401), remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // 🚨 CRITICAL: Use URLSearchParams for OAuth2 compatibility
      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);

      const response = await adminLogin(body);
      
      const { access_token, role } = response.data;
      
      if (role !== 'admin') {
        toast.error('Access Denied. You are not an admin.');
        return { success: false };
      }

      localStorage.setItem('token', access_token);
      await loadAdmin();
      toast.success('Welcome Admin!');
      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      // 🚨 FIX: Handle specific error codes correctly
      if (error.response) {
        // Handle 401 Unauthorized (Incorrect username or password)
        if (error.response.status === 401) {
          errorMessage = 'Incorrect username or password';
        } 
        // Handle 422 Validation Error (Backend didn't like the format)
        else if (error.response.status === 422) {
          if (Array.isArray(error.response.data.detail)) {
            const firstError = error.response.data.detail[0];
            if (firstError && firstError.msg) {
              errorMessage = firstError.msg;
            }
          } else if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          }
        } 
        // Handle other errors
        else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      toast.error(errorMessage);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    toast.success('Logged out');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAdmin: !!admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};