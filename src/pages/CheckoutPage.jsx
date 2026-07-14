import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import { loginUser, clearUserError } from '../store/userSlice';
import { ShieldCheck, Lock } from 'lucide-react';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const { error: authError, loading: authLoading } = useSelector(state => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setValidation('');
    dispatch(clearUserError());

    if (!email.includes('@')) {
      setValidation('Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setValidation('Password must be at least 4 characters');
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  if (!isAuthenticated) {
    return (
      <div className="py-4">
        <h1 className="text-3xl font-extrabold text-white mb-6 border-b border-gray-800 pb-3 uppercase tracking-wider">
          Secure Checkout
        </h1>
        
        <div className="text-center py-12 glass-panel max-w-md mx-auto animate-fade-in p-8">
          <div className="success-check-circle bg-brand-primary/10 border-brand-primary/20 text-brand-primary">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Please sign in to proceed with your checkout and complete your order.
          </p>

          <form onSubmit={handleLoginSubmit} className="text-left flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {(validation || authError) && (
              <div className="text-red-500 text-xs text-center font-medium">
                {validation || authError}
              </div>
            )}

            <button 
              type="submit" 
              className="checkout-btn py-3 mt-2"
              disabled={authLoading}
            >
              {authLoading ? 'Signing In...' : 'Sign In & Checkout'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-3xl font-extrabold text-white mb-6 border-b border-gray-800 pb-3 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck size={28} className="text-emerald-500" />
        Secure Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
