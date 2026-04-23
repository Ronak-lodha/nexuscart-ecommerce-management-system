import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI } from '../services/api';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '0',
        stock: '0',
        category: ''
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (product) {
                const { image_url, ...rest } = product; // Remove image_url if exists
                setFormData(rest);
            } else {
                setFormData({ name: '', description: '', price: '', discount: '0', stock: '0', category: '' });
            }

            categoryAPI.getAll().then(res => {
                setCategories(res.data.results || res.data || []);
            });
        }
    }, [isOpen, product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-morphism fade-in">
                <div className="modal-header">
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Discount ($)</label>
                            <input type="number" step="0.01" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
