import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import {
    ArrowLeft, User, Mail, Phone, Calendar,
    ShoppingBag, DollarSign, CreditCard, Clock,
    CheckCircle, Truck, XCircle
} from 'lucide-react';
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custRes, orderRes] = await Promise.all([
                    customerAPI.getById(id),
                    customerAPI.getOrders(id)
                ]);
                setCustomer(custRes.data);
                setOrders(orderRes.data);
            } catch (error) {
                console.error("Error fetching customer details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="detail-container">Loading customer profile...</div>;
    if (!customer) return <div className="detail-container">Customer not found.</div>;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered': return 'status-delivered';
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Out for Delivery': return 'status-shipping';
            case 'Cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    return (
        <div className="detail-container fade-in">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate('/customers')}>
                    <ArrowLeft size={20} /> Back to Customers
                </button>
                <h1>Customer Profile</h1>
            </header>

            <div className="profile-grid">
                <div className="profile-card glass-morphism">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <User size={64} />
                        </div>
                        <div className="profile-title">
                            <h2>{customer.name}</h2>
                            <span className={`status-pill ${customer.is_blocked ? 'status-blocked' : 'status-active'}`}>
                                {customer.is_blocked ? 'Blocked' : 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="profile-info">
                        <div className="info-item">
                            <Mail size={18} />
                            <div>
                                <label>Email Address</label>
                                <span>{customer.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Phone size={18} />
                            <div>
                                <label>Phone Number</label>
                                <span>{customer.phone}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar size={18} />
                            <div>
                                <label>Joined Date</label>
                                <span>{new Date(customer.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-box glass-morphism">
                            <ShoppingBag size={24} />
                            <div>
                                <strong>{customer.total_orders}</strong>
                                <span>Total Orders</span>
                            </div>
                        </div>
                        <div className="stat-box glass-morphism">
                            <DollarSign size={24} />
                            <div>
                                <strong>${customer.total_spending}</strong>
                                <span>Total Spending</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-history glass-morphism">
                    <h3>Order History</h3>
                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <p className="no-data">No orders found for this customer.</p>
                        ) : orders.map(order => (
                            <div key={order.id} className="order-item glass-morphism">
                                <div className="order-main">
                                    <div className="order-id">
                                        <strong>Order #{order.id}</strong>
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-amount">
                                        <strong>${order.total_amount}</strong>
                                        <span>{order.items.length} Items</span>
                                    </div>
                                </div>
                                <div className="order-sub">
                                    <div className="order-pay">
                                        <CreditCard size={14} />
                                        <span className={order.payment_status === 'Paid' ? 'text-accent' : 'text-danger'}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                    <div className={`status-pill ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
