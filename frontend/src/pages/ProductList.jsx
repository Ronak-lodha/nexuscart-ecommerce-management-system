import React, { useEffect, useState } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import { Plus, Edit, Trash2, Search, Filter, Download } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                productAPI.getAll(),
                categoryAPI.getAll()
            ]);
            setProducts(prodRes.data.results || prodRes.data || []);
            setCategories(catRes.data.results || catRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            if (editingProduct) {
                await productAPI.update(editingProduct.id, data);
            } else {
                await productAPI.create(data);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productAPI.delete(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || p.category.toString() === selectedCategory)
    );

    return (
        <div className="product-list-container fade-in">
            <header className="page-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Control your store items, pricing and availability.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => window.print()}>
                        <Download size={18} /> Export
                    </button>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </header>

            <div className="list-controls glass-morphism">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <Filter size={18} />
                    <select
                        className="glass-morphism"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="products-table-container glass-morphism">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No products found.</td></tr>
                        ) : filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-info">
                                        <div className="product-name-block">
                                            <strong>{product.name}</strong>
                                            <small>ID: {product.id}</small>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="category-tag">{product.category_name}</span></td>
                                <td>${product.price}</td>
                                <td style={{ color: 'var(--accent)' }}>-${product.discount}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit-btn" onClick={() => handleEdit(product)}><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="icon-btn delete-btn"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                product={editingProduct}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default ProductList;
