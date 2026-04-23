import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="shop-navbar glass-morphism">
            <div className="container nav-content">
                <NavLink to="/shop" className="nav-logo">
                    <h1>E-Shop</h1>
                </NavLink>

                <div className="nav-links">
                    <NavLink to="/shop" className="nav-link">Home</NavLink>
                    {isLoggedIn && (
                        <>
                            <NavLink to="/my-orders" className="nav-link">My Orders</NavLink>
                            <NavLink to="/cart" className="nav-link nav-cart">
                                <ShoppingCart size={20} />
                                <span>Cart</span>
                            </NavLink>
                        </>
                    )}
                    {isAdmin && (
                        <NavLink to="/admin/dashboard" className="nav-link admin-btn">
                            Admin Panel
                        </NavLink>
                    )}
                </div>

                <div className="nav-auth">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn btn-outline logout-btn-nav">
                            <LogOut size={18} /> Sign Out
                        </button>
                    ) : (
                        <div className="auth-buttons">
                            <NavLink to="/login" className="btn btn-outline">Login</NavLink>
                            <NavLink to="/signup" className="btn btn-primary">Sign Up</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
