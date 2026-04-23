import React, { useEffect, useState } from 'react';
import { productAPI, categoryAPI, cartAPI } from '../../services/api';
import { ShoppingCart, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
            console.error("Error fetching shop data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!localStorage.getItem('access_token')) {
            alert("Please login to add items to cart");
            return;
        }
        try {
            await cartAPI.addItem({ product_id: productId, quantity: 1 });
            alert("Product added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || p.category.toString() === selectedCategory)
    );

    return (
        <div className="shop-container fade-in">
            {/* Hero Section */}
            <section className="shop-hero glass-morphism">
                <div className="hero-content">
                    <h1>Explore <span>Our Products</span></h1>
                    <p>Discover high-quality items at the best prices. No images, just pure value.</p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="shop-controls glass-morphism">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="category-filters">
                    <button
                        className={`cat-btn ${selectedCategory === '' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`cat-btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {loading ? (
                    <div className="loading">Loading amazing products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-products">No products found.</div>
                ) : filteredProducts.map(product => (
                    <div key={product.id} className="shop-product-card glass-morphism animate-up no-image-card">
                        <div className="product-details">
                            <div className="product-meta">
                                <span className="cat-tag">{product.category_name}</span>
                                <span className={`stock-tag ${product.stock > 0 ? '' : 'out'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-desc-short">{product.description?.substring(0, 100)}...</p>
                            <div className="product-price">
                                <span className="current-price">${(product.price - product.discount).toFixed(2)}</span>
                                {product.discount > 0 && <span className="old-price">${product.price}</span>}
                            </div>
                            <div className="card-actions-row">
                                <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm">Details</Link>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart size={16} /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
