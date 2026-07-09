import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './contexts/AdminAuthContext';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import BannerManagement from './pages/BannerManagement';
import CouponManagement from './pages/CouponManagement';
import AdminLayout from './layouts/AdminLayout';

function App() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-primary text-2xl font-bold">Loading...</div>;
  }

  return (
    <Routes>
      {/* Admin Login - Accessible without login */}
      <Route path="/login" element={isAdmin ? <Navigate to="/" /> : <AdminLogin />} />

      {/* Protected Admin Routes - បានកែសម្រួលផ្លូវ (Paths) ឱ្យត្រូវនឹង Sidebar */}
      <Route path="/" element={isAdmin ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        {/* បន្ថែម /admin នៅពីមុខគ្រប់ផ្លូវទាំងអស់ */}
        <Route path="admin/products" element={<ProductManagement />} />
        <Route path="admin/categories" element={<CategoryManagement />} />
        <Route path="admin/orders" element={<OrderManagement />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/banners" element={<BannerManagement />} />
        <Route path="admin/coupons" element={<CouponManagement />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;