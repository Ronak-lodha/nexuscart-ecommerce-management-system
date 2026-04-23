import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../../services/api';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        productAPI.getById(id)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!localStorage.getItem('access_token')) {
            navigate('/login');
            return;
        }
        try {
            await cartAPI.addItem({ product_id: product.id, quantity });
            alert("Added to cart!");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="loading-screen">Loading Product Details...</div>;
    if (!product) return <div className="error-screen">Product not found.</div>;

    return (
        <div className="product-detail-page fade-in">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <div className="product-container glass-morphism no-image-detail">
                <div className="product-info-section full-width">
                    <div className="info-header">
                        <span className="cat-badge">{product.category_name}</span>
                        <div className="rating">
                            {[1, 2, 3, 4].map(i => <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />)}
                            <Star size={16} color="var(--text-muted)" />
                            <span>(4.0 Rating)</span>
                        </div>
                    </div>

                    <h1>{product.name}</h1>
                    <div className="price-box">
                        <span className="price">${(product.price - product.discount).toFixed(2)}</span>
                        {product.discount > 0 && <span className="old-price">${product.price}</span>}
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="stock-info">
                        <span className={`status ${product.stock > 0 ? 'in' : 'out'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                        </span>
                    </div>

                    <div className="purchase-controls">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>
                        <button
                            className="btn btn-primary add-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>

                    <div className="product-features">
                        <div className="feature">
                            <ShieldCheck size={20} color="var(--accent)" />
                            <div>
                                <strong>Security</strong>
                                <span>Verified Purchase Guarantee</span>
                            </div>
                        </div>
                        <div className="feature">
                            <Truck size={20} color="var(--accent)" />
                            <div>
                                <strong>Shipping</strong>
                                <span>Fast Delivery Within 24-48 Hours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
