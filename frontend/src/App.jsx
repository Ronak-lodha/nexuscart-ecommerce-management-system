import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import OrderList from './pages/OrderList';
import ReturnList from './pages/ReturnList';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Orders from './pages/shop/Orders';
import './index.css';

const RootRedirect = () => {
  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token) return <Navigate to="/login" replace />;
  return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/shop" replace />;
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/shop" replace />;

  return children;
};

const AdminLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

const ShopLayout = ({ children }) => (
  <div className="shop-layout text-main">
    <Navbar />
    <main className="shop-content container">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/shop" element={<ShopLayout><Shop /></ShopLayout>} />
        <Route path="/product/:id" element={<ShopLayout><ProductDetail /></ShopLayout>} />
        <Route path="/cart" element={<ProtectedRoute><ShopLayout><Cart /></ShopLayout></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><ShopLayout><Orders /></ShopLayout></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="returns" element={<ReturnList />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
