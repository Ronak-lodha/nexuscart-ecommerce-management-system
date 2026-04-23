import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import {
    Package, ShoppingCart, DollarSign, Users,
    CheckCircle, Clock, Truck, XCircle, RotateCcw
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await orderAPI.getStats();
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading-screen">Loading Dashboard Analytics...</div>;

    const statCards = [
        { title: 'Total Revenue', value: `$${stats.total_revenue.toFixed(2)}`, icon: <DollarSign />, color: '#10b981' },
        { title: 'Total Orders', value: stats.total_orders, icon: <ShoppingCart />, color: '#818cf8' },
        { title: 'Total Products', value: stats.total_products, icon: <Package />, color: '#fbbf24' },
        { title: 'Total Customers', value: stats.total_customers, icon: <Users />, color: '#f472b6' },
    ];

    const orderStatusCards = [
        { title: 'Delivered', value: stats.delivered_orders, icon: <CheckCircle size={18} />, color: '#10b981' },
        { title: 'Pending', value: stats.pending_orders, icon: <Clock size={18} />, color: '#f59e0b' },
        { title: 'Shipping', value: stats.out_for_delivery_orders, icon: <Truck size={18} />, color: '#6366f1' },
        { title: 'Returned', value: stats.returned_orders, icon: <RotateCcw size={18} />, color: '#a855f7' },
        { title: 'Cancelled', value: stats.cancelled_orders, icon: <XCircle size={18} />, color: '#ef4444' },
    ];

    return (
        <div className="dashboard-container fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Comprehensive overview of your store's health and sales.</p>
                </div>
            </header>

            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="stat-card glass-morphism">
                        <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{card.title}</h3>
                            <p className="stat-value">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-status-row">
                {orderStatusCards.map((card, index) => (
                    <div key={index} className="status-mini-card glass-morphism">
                        <span style={{ color: card.color }}>{card.icon}</span>
                        <div className="mini-info">
                            <span className="mini-value">{card.value}</span>
                            <span className="mini-label">{card.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-footer-note glass-morphism" style={{ marginTop: '30px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>All systems operational. Data is synced with the live database.</p>
            </div>
        </div>
    );
};

export default Dashboard;
