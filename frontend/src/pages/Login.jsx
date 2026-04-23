import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { User, Lock, Loader2, CheckCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authAPI.login(credentials);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user', res.data.username);
            localStorage.setItem('is_admin', res.data.is_staff);

            if (res.data.is_staff) {
                navigate('/admin/dashboard');
            } else {
                navigate('/shop');
            }
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-morphism fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <h2>E-Shop</h2>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                {success && (
                    <div className="success-msg">
                        <CheckCircle size={16} /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username"><User size={16} /> Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            placeholder="Enter your username"
                            value={credentials.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Dashboard'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
