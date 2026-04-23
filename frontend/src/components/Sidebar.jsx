import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart,
    Users, Settings, LogOut, RotateCcw
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('user') || 'Admin';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <aside className="sidebar glass-morphism">
            <div className="sidebar-logo">
                <h2>E-Shop</h2>
                <span className="user-badge">{userName}</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Package size={20} />
                    <span>Products</span>
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShoppingCart size={20} />
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Users size={20} />
                    <span>Customers</span>
                </NavLink>
                <NavLink to="/admin/returns" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <RotateCcw size={20} />
                    <span>Returns</span>
                </NavLink>
                <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button className="btn btn-outline logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
