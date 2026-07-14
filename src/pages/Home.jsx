import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard/ProductCard';
import { handleImageError } from '../utils/helpers';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Featured categories list
  const categories = [
    { name: 'Audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=60', count: '2 Products' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=60', count: '3 Products' },
    { name: 'Wearables', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop&q=60', count: '1 Product' }
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Banner */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <h1 className="hero-title text-white">
            Elevate Your <br />
            <span className="gradient-text">Developer Setup</span>
          </h1>
          <p className="hero-subtitle mb-8 text-gray-400 max-w-md">
            Premium tech accessories, high-fidelity audio, and wearables crafted specifically for creators, builders, and developers who demand the absolute best.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="add-cart-btn flex items-center gap-2 text-base px-6 py-3"
          >
            Shop All Gear
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
            alt="Premium Headphones Setup" 
            onError={handleImageError}
          />
        </div>
      </section>

      {/* Feature Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex gap-4 items-center">
          <div className="circle-btn bg-brand-primary/10 border-brand-primary/20 text-brand-primary">
            <Truck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Free Global Delivery</h4>
            <p className="text-gray-400 text-xs mt-1">On orders over ₹2,999. Tracked shipping.</p>
          </div>
        </div>

        <div className="glass-card p-6 flex gap-4 items-center">
          <div className="circle-btn bg-brand-primary/10 border-brand-primary/20 text-brand-primary">
            <Zap size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">2-Year Warranty</h4>
            <p className="text-gray-400 text-xs mt-1">Full protection and 100% money-back guarantee.</p>
          </div>
        </div>

        <div className="glass-card p-6 flex gap-4 items-center">
          <div className="circle-btn bg-brand-primary/10 border-brand-primary/20 text-brand-primary">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Encrypted Payments</h4>
            <p className="text-gray-400 text-xs mt-1">Secure processing with stripe authentication.</p>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold border-b border-gray-800 pb-3">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <div 
              key={i}
              className="glass-card overflow-hidden group cursor-pointer relative aspect-video flex items-end p-6 border border-white/5"
              onClick={() => navigate(`/products?category=${c.name}`)}
            >
              <img 
                src={c.image} 
                alt={c.name}
                className="absolute inset-0 w-100 h-100 object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300 z-0" 
                onError={handleImageError}
              />
              <div className="z-10">
                <h3 className="text-xl font-extrabold text-white mb-1">{c.name}</h3>
                <span className="text-xs text-brand-secondary font-semibold">{c.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b border-gray-800 pb-3">
          <h2 className="text-2xl font-bold">Featured Hardware</h2>
          <Link to="/products" className="text-brand-primary hover:underline text-sm font-semibold flex items-center gap-1">
            View Catalog <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
