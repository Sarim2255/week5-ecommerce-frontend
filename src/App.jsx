import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GitCompare, ArrowRight } from 'lucide-react';
import Header from './components/Header/Header';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import './App.css';

function App() {
  const compareList = useSelector(state => state.products.compareList);

  return (
    <Router>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 mt-12 text-center border-t border-white/5 bg-[#0a0f1e]/50">
          <p className="text-sm text-gray-500">
            &copy; 2026 Tech Store. Designed &amp; Developed by <span className="text-white font-semibold">Mohd Sarim Khan</span>.
          </p>
        </footer>

        {/* Floating Compare Notification Bar */}
        {compareList.length > 0 && (
          <div className="compare-sticky-bar glass-panel border border-brand-primary/30 shadow-2xl flex items-center justify-between gap-6 py-3 px-6">
            <div className="flex items-center gap-3">
              <GitCompare size={20} className="text-brand-secondary animate-pulse" />
              <span className="text-sm font-semibold text-white">
                Comparing {compareList.length} of 3 items
              </span>
            </div>
            <Link 
              to="/compare" 
              className="add-cart-btn flex items-center gap-1.5 text-xs py-1.5 px-4"
            >
              Compare Now
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
