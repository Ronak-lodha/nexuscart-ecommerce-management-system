import React, { useEffect, useState } from 'react';
import { returnAPI } from '../services/api';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import './OrderList.css'; // Reusing table styles

const ReturnList = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            const res = await returnAPI.getAll();
            setReturns(res.data.results || res.data || []);
        } catch (error) {
            console.error("Error fetching returns:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await returnAPI.updateStatus(id, { status });
            fetchReturns();
        } catch (error) {
            console.error("Error updating return status:", error);
        }
    };

    return (
        <div className="order-list-container fade-in">
            <header className="page-header">
                <div>
                    <h1>Return Requests</h1>
                    <p>Manage product returns and refund requests.</p>
                </div>
            </header>

            <div className="orders-table-wrapper glass-morphism">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading requests...</td></tr>
                        ) : returns.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No return requests found.</td></tr>
                        ) : returns.map(ret => (
                            <tr key={ret.id}>
                                <td><strong>#{ret.id}</strong></td>
                                <td>#{ret.order_id}</td>
                                <td>{ret.customer_name}</td>
                                <td><small>{ret.reason}</small></td>
                                <td>
                                    <span className={`status-pill status-${ret.status.toLowerCase()}`}>
                                        {ret.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {ret.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="icon-btn"
                                                    style={{ color: 'var(--accent)' }}
                                                    onClick={() => handleStatusUpdate(ret.id, 'Approved')}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    style={{ color: 'var(--danger)' }}
                                                    onClick={() => handleStatusUpdate(ret.id, 'Rejected')}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        {ret.status === 'Approved' && (
                                            <button
                                                className="btn btn-outline"
                                                onClick={() => handleStatusUpdate(ret.id, 'Completed')}
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnList;
