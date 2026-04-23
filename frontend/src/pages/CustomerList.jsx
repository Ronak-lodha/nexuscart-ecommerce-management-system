import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import {
    User, Mail, Phone, ShoppingBag, DollarSign,
    Ban, Unlock, UserCircle, Edit, Trash2, Eye, Plus
} from 'lucide-react';
import CustomerModal from '../components/CustomerModal';
import './CustomerList.css';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await customerAPI.getAll();
            setCustomers(res.data.results || res.data || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (id) => {
        try {
            await customerAPI.toggleBlock(id);
            fetchCustomers();
        } catch (error) {
            console.error("Error updating customer status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerAPI.delete(id);
                fetchCustomers();
            } catch (error) {
                console.error("Error deleting customer:", error);
            }
        }
    };

    const handleSave = async (data) => {
        try {
            if (editingCustomer) {
                await customerAPI.update(editingCustomer.id, data);
            } else {
                await customerAPI.create(data);
            }
            fetchCustomers();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving customer:", error);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    return (
        <div className="customer-list-container fade-in">
            <header className="page-header">
                <div>
                    <h1>Customer Management</h1>
                    <p>Manage customer profiles, order history, and account status.</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <Plus size={20} /> Add Customer
                </button>
            </header>

            <div className="customers-grid">
                {loading ? (
                    <div>Loading customers...</div>
                ) : customers.length === 0 ? (
                    <div>No customers found.</div>
                ) : customers.map(customer => (
                    <div key={customer.id} className={`customer-card glass-morphism ${customer.is_blocked ? 'blocked' : ''}`}>
                        <div className="card-top">
                            <div className="avatar">
                                <UserCircle size={48} />
                            </div>
                            <div className="basic-info">
                                <h3>{customer.name}</h3>
                                <span className={`status-pill ${customer.is_blocked ? 'status-blocked' : 'status-active'}`}>
                                    {customer.is_blocked ? 'Blocked' : 'Active'}
                                </span>
                            </div>
                            <div className="card-actions">
                                <button className="icon-btn edit-btn" onClick={() => handleEdit(customer)} title="Edit">
                                    <Edit size={18} />
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => handleDelete(customer.id)} title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="contact-details">
                            <div className="detail-item"><Mail size={14} /> {customer.email}</div>
                            <div className="detail-item"><Phone size={14} /> {customer.phone}</div>
                        </div>

                        <div className="customer-stats">
                            <div className="stat">
                                <ShoppingBag size={16} />
                                <div>
                                    <span>Orders</span>
                                    <strong>{customer.total_orders}</strong>
                                </div>
                            </div>
                            <div className="stat">
                                <DollarSign size={16} />
                                <div>
                                    <span>Spent</span>
                                    <strong>${customer.total_spending}</strong>
                                </div>
                            </div>
                            <div className="stat">
                                {customer.is_blocked ? (
                                    <button onClick={() => handleToggleBlock(customer.id)} className="action-link unblock-link">
                                        <Unlock size={16} /> Unblock
                                    </button>
                                ) : (
                                    <button onClick={() => handleToggleBlock(customer.id)} className="action-link block-link">
                                        <Ban size={16} /> Block
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="card-footer">
                            <button
                                className="btn btn-outline w-full"
                                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                            >
                                <Eye size={18} /> View Profile & History
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CustomerModal
                isOpen={isModalOpen}
                customer={editingCustomer}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default CustomerList;
