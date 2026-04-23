import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './ProductModal.css'; // Reusing modal styles

const CustomerModal = ({ customer, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        is_blocked: false
    });

    useEffect(() => {
        if (isOpen) {
            if (customer) setFormData(customer);
            else setFormData({ name: '', email: '', phone: '', is_blocked: false });
        }
    }, [isOpen, customer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-morphism fade-in">
                <div className="modal-header">
                    <h2>{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.is_blocked}
                                    onChange={e => setFormData({ ...formData, is_blocked: e.target.checked })}
                                />
                                Is Blocked
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
