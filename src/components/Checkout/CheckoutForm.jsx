import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import { formatCurrency, handleImageError } from '../../utils/helpers';

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    card: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => calculateSubtotal() * 0.18; // 18% GST setup
  const shipping = 150; // ₹150 flat shipping
  const total = calculateSubtotal() + shipping + calculateTax();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.address.trim()) newErrors.address = 'Shipping address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    
    if (!form.zip.trim()) {
      newErrors.zip = 'Zip code is required';
    } else if (!/^\d{5,6}$/.test(form.zip)) {
      newErrors.zip = 'Please enter a valid zip code (5-6 digits)';
    }

    if (!form.card.trim()) {
      newErrors.card = 'Card number is required';
    } else if (!/^\d{16}$/.test(form.card.replace(/\s+/g, ''))) {
      newErrors.card = 'Card number must be 16 digits';
    }

    if (!form.expiry.trim()) {
      newErrors.expiry = 'Expiration date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Must be in MM/YY format';
    }

    if (!form.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3}$/.test(form.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API submit
      const randOrder = 'EDA-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randOrder);
      setIsSuccess(true);
      dispatch(clearCart());
    }
  };

  const handleInputChange = (field, val) => {
    setForm({ ...form, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  if (isSuccess) {
    return (
      <div className="order-placed-success glass-panel p-10 animate-fade-in text-center max-w-md mx-auto">
        <div className="success-check-circle">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-gray-400 mb-6 font-medium">Order Number: <span className="text-white font-semibold">{orderNumber}</span></p>
        <p className="text-gray-400 text-sm mb-8">
          Thank you for your purchase. We have sent a confirmation email to <span className="text-white font-semibold">{form.email}</span>. Your order will be dispatched shortly.
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="checkout-btn w-full py-3"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 glass-panel max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="checkout-btn px-6 py-2">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="checkout-card glass-panel flex flex-col gap-6">
        <div>
          <h2 className="checkout-step-title">
            <MapPin size={20} className="text-brand-primary" />
            Shipping Information
          </h2>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'input-invalid' : ''}`}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <div className="validation-error-msg">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'input-invalid' : ''}`}
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && <div className="validation-error-msg">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className={`form-input ${errors.address ? 'input-invalid' : ''}`}
              placeholder="123 Developer Lane"
              value={form.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            {errors.address && <div className="validation-error-msg">{errors.address}</div>}
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className={`form-input ${errors.city ? 'input-invalid' : ''}`}
                placeholder="Tech City"
                value={form.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              {errors.city && <div className="validation-error-msg">{errors.city}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                className={`form-input ${errors.zip ? 'input-invalid' : ''}`}
                placeholder="94016"
                value={form.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
              />
              {errors.zip && <div className="validation-error-msg">{errors.zip}</div>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="checkout-step-title mt-4">
            <CreditCard size={20} className="text-brand-primary" />
            Payment Information
          </h2>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              maxLength="19"
              className={`form-input ${errors.card ? 'input-invalid' : ''}`}
              placeholder="1234 5678 1234 5678"
              value={form.card}
              onChange={(e) => {
                // simple format spacer
                let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let matches = v.match(/\d{4,16}/g);
                let match = matches && matches[0] || '';
                let parts = [];
                for (let i = 0, len = match.length; i < len; i += 4) {
                  parts.push(match.substring(i, i + 4));
                }
                if (parts.length > 0) {
                  handleInputChange('card', parts.join(' '));
                } else {
                  handleInputChange('card', v);
                }
              }}
            />
            {errors.card && <div className="validation-error-msg">{errors.card}</div>}
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input
                type="text"
                maxLength="5"
                className={`form-input ${errors.expiry ? 'input-invalid' : ''}`}
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                  if (v.length > 2) {
                    handleInputChange('expiry', v.substring(0, 2) + '/' + v.substring(2, 4));
                  } else {
                    handleInputChange('expiry', v);
                  }
                }}
              />
              {errors.expiry && <div className="validation-error-msg">{errors.expiry}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                maxLength="3"
                className={`form-input ${errors.cvv ? 'input-invalid' : ''}`}
                placeholder="123"
                value={form.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              />
              {errors.cvv && <div className="validation-error-msg">{errors.cvv}</div>}
            </div>
          </div>
        </div>

        <button type="submit" className="checkout-btn py-3 mt-4">
          Complete Purchase ({formatCurrency(total)})
        </button>
      </form>

      {/* Order Summary Sidebar */}
      <div className="cart-summary glass-panel p-6 rounded-xl border border-white/5 h-fit">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Order Items</h3>
        <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto mb-6 pr-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" onError={handleImageError} />
                <div>
                  <h4 className="text-sm font-semibold text-white max-w-[150px] truncate">{item.name}</h4>
                  <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-white">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

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
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
