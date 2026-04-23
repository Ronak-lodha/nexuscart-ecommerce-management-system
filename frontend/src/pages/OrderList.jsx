import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import {
    Calendar, CreditCard, Truck, User,
    ChevronRight, FileText, Download, Save
} from 'lucide-react';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderAPI.getAll();
            setOrders(res.data.results || res.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await orderAPI.updateStatus(id, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handleExport = async () => {
        try {
            const res = await orderAPI.exportCSV();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders_report.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting orders:", error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered': return 'status-delivered';
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Out for Delivery': return 'status-shipping';
            case 'Cancelled': return 'status-cancelled';
            case 'Returned': return 'status-returned';
            default: return '';
        }
    };

    return (
        <div className="order-list-container fade-in">
            <header className="page-header">
                <div>
                    <h1>Order Management</h1>
                    <p>Track shipments, update statuses and manage returns.</p>
                </div>
                <button className="btn btn-outline" onClick={handleExport}>
                    <Download size={18} /> Export CSV
                </button>
            </header>

            <div className="orders-table-wrapper glass-morphism">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Update Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>
                                    <div className="order-customer">
                                        <User size={14} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.customer_name}</span>
                                            <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td><strong>${order.total_amount}</strong></td>
                                <td>
                                    <div className="payment-status">
                                        <span className={order.payment_status === 'Paid' ? 'paid' : 'unpaid'}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="status-select glass-morphism"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Returned">Returned</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="icon-btn">
                                        <FileText size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
