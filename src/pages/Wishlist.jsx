import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, HeartOff } from 'lucide-react';
import { toggleWishlist } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { api } from '../services/api';
import { formatCurrency, handleImageError } from '../utils/helpers';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(state => state.products.wishlist);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWishlistItems = async () => {
      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        return;
      }
      setLoading(true);
      try {
        const allProducts = await api.getProducts();
        const items = allProducts.filter(p => wishlistIds.includes(p.id));
        setWishlistItems(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadWishlistItems();
  }, [wishlistIds]);

  const handleRemove = (id) => {
    dispatch(toggleWishlist(id));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="glass-panel p-8">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-3 uppercase tracking-wider">
        My Wishlist
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <HeartOff size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-6 font-medium">Your wishlist is empty.</p>
          <button onClick={() => navigate('/products')} className="add-cart-btn">
            Explore Hardware
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {wishlistItems.map(item => (
            <div key={item.id} className="cart-item flex items-center justify-between gap-6 p-4 glass-card border border-white/5 rounded-xl">
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-white/5" onError={handleImageError} />
                <div>
                  <h3 className="font-bold text-white text-base hover:underline">{item.name}</h3>
                  <span className="text-sm text-brand-secondary font-semibold">{formatCurrency(item.price)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-cart-btn flex items-center gap-2 text-xs py-2 px-4"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="remove-btn py-2 px-3 flex items-center justify-center"
                  title="Remove item"
                  aria-label="Remove item from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
