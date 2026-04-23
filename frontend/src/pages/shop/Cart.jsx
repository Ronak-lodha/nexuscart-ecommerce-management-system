import React, { useEffect, useState } from 'react';
import { cartAPI, orderAPI } from '../../services/api';
import { Trash2, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await cartAPI.get();
            setCart(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await cartAPI.removeItem({ item_id: itemId });
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!shippingAddress) {
            alert("Please provide a shipping address.");
            return;
        }
        try {
            await orderAPI.create({
                shipping_address: shippingAddress,
                payment_method: paymentMethod
            });
            alert("Order placed successfully!");
            navigate('/my-orders');
        } catch (err) {
            alert("Order placement failed");
        }
    };

    if (loading) return <div className="loading-screen">Loading Cart...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart fade-in">
                <ShoppingBag size={64} color="var(--text-muted)" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-page fade-in">
            <h1>Shopping Cart</h1>

            <div className="cart-grid">
                <div className="cart-items-section glass-morphism">
                    {cart.items.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-info">
                                <h3>{item.product_details.name}</h3>
                                <small>Category: {item.product_details.category_name}</small>
                                <div className="price">${(item.product_details.price - item.product_details.discount).toFixed(2)}</div>
                            </div>
                            <div className="item-qty">
                                <span>Quantity: {item.quantity}</span>
                            </div>
                            <div className="item-total">
                                <strong>Subtotal: ${item.subtotal.toFixed(2)}</strong>
                            </div>
                            <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="checkout-section glass-morphism">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Items Subtotal</span>
                        <span>${cart.total_price.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping Fees</span>
                        <span className="text-accent">FREE</span>
                    </div>
                    <div className="summary-total">
                        <span>Grand Total</span>
                        <span>${cart.total_price.toFixed(2)}</span>
                    </div>

                    {!checkingOut ? (
                        <button className="btn btn-primary w-full" onClick={() => setCheckingOut(true)}>
                            Proceed to Checkout
                        </button>
                    ) : (
                        <form className="checkout-form fade-in" onSubmit={handleCheckout}>
                            <div className="form-group">
                                <label><Truck size={16} /> Shipping Address</label>
                                <textarea
                                    required
                                    placeholder="Enter your full street address, city, and zip..."
                                    value={shippingAddress}
                                    onChange={e => setShippingAddress(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label><CreditCard size={16} /> Payment Method</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="Online">Online Payment (Simulated)</option>
                                </select>
                            </div>
                            <div className="checkout-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setCheckingOut(false)}>
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Place Order
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
