import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import './Login.css'; // Reusing Login styles

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authAPI.register(formData);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-morphism fade-in">
                <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Join E-Shop Today</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="first_name" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="last_name" required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label><User size={16} /> Username</label>
                        <input type="text" name="username" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label><Mail size={16} /> Email</label>
                        <input type="email" name="email" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input type="password" name="password" required onChange={handleChange} />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
