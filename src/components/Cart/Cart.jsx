import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import { formatCurrency, handleImageError } from '../../utils/helpers';

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.18; // 18% GST for India setup
    };
    
    const handleQuantityChange = (id, quantity) => {
        if (quantity < 1) {
            dispatch(removeFromCart(id));
        } else {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    const handleCheckoutRedirect = () => {
        navigate('/checkout');
    };
    
    return (
        <div className="cart-container glass-panel p-8">
            <h2 className="border-b border-gray-700 pb-4">Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <div className="empty-cart text-center py-16">
                  <p className="text-gray-400 mb-6">Your cart is empty</p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="add-cart-btn inline-block"
                  >
                    Go Shopping
                  </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} onError={handleImageError} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="price">{formatCurrency(item.price)}</p>
                                </div>
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary glass-card p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{formatCurrency(150)}</span>
                        </div>
                        <div className="summary-row">
                            <span>GST (18%)</span>
                            <span>{formatCurrency(calculateTax())}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatCurrency(calculateSubtotal() + 150 + calculateTax())}</span>
                        </div>
                        <button 
                          className="checkout-btn"
                          onClick={handleCheckoutRedirect}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
