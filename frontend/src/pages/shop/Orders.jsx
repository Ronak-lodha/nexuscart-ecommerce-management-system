import React, { useEffect, useState } from 'react';
import { orderAPI, returnAPI } from '../../services/api';
import { Package, Clock, CheckCircle, Truck, XCircle, RotateCcw } from 'lucide-react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        orderAPI.getAll()
            .then(res => setOrders(res.data.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleReturnRequest = async (orderId) => {
        const reason = prompt("Why do you want to return this order?");
        if (!reason) return;

        try {
            await returnAPI.create({ order: orderId, reason });
            alert("Return request submitted!");
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to submit return request");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={20} color="var(--accent)" />;
            case 'Pending': return <Clock size={20} color="#f59e0b" />;
            case 'Processing': return <Package size={20} color="var(--primary)" />;
            case 'Out for Delivery': return <Truck size={20} color="#0ea5e9" />;
            case 'Cancelled': return <XCircle size={20} color="var(--danger)" />;
            case 'Returned': return <RotateCcw size={20} color="#a855f7" />;
            default: return null;
        }
    };

    if (loading) return <div className="loading-screen">Loading My Order History...</div>;

    return (
        <div className="my-orders-page fade-in">
            <h1>My Orders</h1>

            <div className="orders-container">
                {orders.length === 0 ? (
                    <div className="no-orders glass-morphism">
                        <Package size={48} color="var(--text-muted)" />
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : orders.map(order => (
                    <div key={order.id} className="customer-order-card glass-morphism text-only-card">
                        <div className="order-header">
                            <div className="id-date">
                                <h3>Order #{order.id}</h3>
                                <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="status-indicator">
                                {getStatusIcon(order.status)}
                                <strong>{order.status}</strong>
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item.id} className="order-line-item">
                                    <div className="line-info">
                                        <strong>{item.product_name}</strong>
                                        <span>Quantity: {item.quantity} × Price: ${item.price}</span>
                                    </div>
                                    <span className="line-total">${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="address">
                                <Truck size={16} />
                                <span>{order.shipping_address}</span>
                            </div>
                            <div className="order-footer-actions">
                                {order.status === 'Delivered' && (
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleReturnRequest(order.id)}
                                    >
                                        Request Return
                                    </button>
                                )}
                                <div className="total">
                                    <span>Grand Total:</span>
                                    <strong>${order.total_amount}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
