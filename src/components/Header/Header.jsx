import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, Heart, GitCompare, User, LogOut } from 'lucide-react';
import { setSearchQuery, setFilters } from '../../store/productSlice';
import { loginUser, registerUser, logout, clearUserError } from '../../store/userSlice';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import { formatCurrency, handleImageError } from '../../utils/helpers';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(state => state.cart.items);
  const wishlist = useSelector(state => state.products.wishlist);
  const compareList = useSelector(state => state.products.compareList);
  const { currentUser, isAuthenticated, error: authError, loading: authLoading } = useSelector(state => state.user);

  // Search autocomplete states
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Authentication modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authValidation, setAuthValidation] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state search input on navigation
  useEffect(() => {
    if (!location.pathname.startsWith('/products')) {
      setSearchInput('');
    }
  }, [location]);

  // Handle autocomplete query fetching
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim().length > 1) {
        try {
          const results = await api.getProducts({ search: searchInput });
          setSuggestions(results.slice(0, 5));
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  // Total cart items badge
  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput));
      dispatch(setFilters({ category: 'All' }));
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleSuggestionClick = (id) => {
    setSearchInput('');
    setShowSuggestions(false);
    navigate(`/product/${id}`);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthValidation('');
    dispatch(clearUserError());

    if (!authForm.email.includes('@')) {
      setAuthValidation('Please enter a valid email address.');
      return;
    }
    if (authForm.password.length < 4) {
      setAuthValidation('Password must be at least 4 characters long.');
      return;
    }

    if (isRegisterMode) {
      if (authForm.name.trim().length < 2) {
        setAuthValidation('Name must be at least 2 characters long.');
        return;
      }
      dispatch(registerUser({ 
        name: authForm.name, 
        email: authForm.email, 
        password: authForm.password 
      })).then((res) => {
        if (!res.error) {
          setIsAuthOpen(false);
          setAuthForm({ name: '', email: '', password: '' });
        }
      });
    } else {
      dispatch(loginUser({ 
        email: authForm.email, 
        password: authForm.password 
      })).then((res) => {
        if (!res.error) {
          setIsAuthOpen(false);
          setAuthForm({ name: '', email: '', password: '' });
        }
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        <span>Tech Store</span>
      </Link>

      {/* Autocomplete Search Bar */}
      <div className="search-container" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map(p => (
              <div
                key={p.id}
                className="autocomplete-item"
                onClick={() => handleSuggestionClick(p.id)}
              >
                <img src={p.image} alt={p.name} onError={handleImageError} />
                <div className="info">
                  <span className="name">{p.name}</span>
                  <span className="price">{formatCurrency(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        <Link to="/products" className="nav-link">Shop</Link>
        
        <Link to="/wishlist" className="nav-link" title="Wishlist">
          <Heart size={20} className={wishlist.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
          {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
        </Link>

        <Link to="/compare" className="nav-link" title="Compare Products">
          <GitCompare size={20} />
          {compareList.length > 0 && <span className="cart-badge">{compareList.length}</span>}
        </Link>

        <Link to="/cart" className="cart-icon-btn" title="Shopping Cart">
          <ShoppingCart size={20} />
          {totalCartQty > 0 && <span className="cart-badge">{totalCartQty}</span>}
        </Link>

        {/* User Auth Info */}
        {isAuthenticated ? (
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="auth-btn flex items-center gap-2"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <User size={14} />
              {currentUser?.name || 'User'}
            </button>
            {showUserDropdown && (
              <div className="user-menu-dropdown">
                <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); navigate('/wishlist'); }}>
                  My Wishlist
                </button>
                <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); navigate('/compare'); }}>
                  Comparison List
                </button>
                <button className="dropdown-item flex items-center gap-2 text-red-500" onClick={handleLogout}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="auth-btn"
            onClick={() => {
              setIsAuthOpen(true);
              dispatch(clearUserError());
              setAuthValidation('');
            }}
          >
            Sign In
          </button>
        )}
      </div>

      {/* Auth Portal Modal */}
      <Modal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        title={isRegisterMode ? "Create Account" : "Welcome Back"}
      >
        <form onSubmit={handleAuthSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={authForm.name}
                onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              value={authForm.email}
              onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              value={authForm.password}
              onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {(authValidation || authError) && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {authValidation || authError}
            </div>
          )}

          <button 
            type="submit" 
            className="checkout-btn w-full mb-4" 
            disabled={authLoading}
          >
            {authLoading ? 'Processing...' : (isRegisterMode ? 'Sign Up' : 'Sign In')}
          </button>

          <div className="text-center text-sm text-gray-400">
            {isRegisterMode ? (
              <>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="text-brand-primary font-semibold hover:underline"
                  onClick={() => { setIsRegisterMode(false); dispatch(clearUserError()); }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="text-brand-primary font-semibold hover:underline"
                  onClick={() => { setIsRegisterMode(true); dispatch(clearUserError()); }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
