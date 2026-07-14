import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, GitCompare, Star } from 'lucide-react';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist, toggleCompare } from '../../store/productSlice';
import { formatCurrency, handleImageError } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const wishlist = useSelector(state => state.products.wishlist);
  const compareList = useSelector(state => state.products.compareList);
  
  const isWishlisted = wishlist.includes(product.id);
  const isComparing = compareList.some(p => p.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    dispatch(toggleCompare(product));
  };

  return (
    <div className="product-card glass-card animate-fade-in">
      <div className="product-card-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" onError={handleImageError} />
        </Link>
        
        {/* Floating actions */}
        <div className="product-card-actions">
          <button 
            className={`circle-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} className={isWishlisted ? "fill-pink-500 text-pink-500" : ""} />
          </button>
          
          <button 
            className={`circle-btn ${isComparing ? 'active' : ''}`}
            onClick={handleCompareToggle}
            title={isComparing ? "Remove from comparison" : "Add to comparison"}
            aria-label="Toggle compare"
          >
            <GitCompare size={16} />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="hover:underline">
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        {/* Star rating */}
        <div className="product-rating">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"}
              />
            ))}
          </div>
          <span className="font-semibold">{product.rating}</span>
          <span className="rating-count">({product.reviewCount})</span>
        </div>

        {/* Price & Cart actions */}
        <div className="product-price-row">
          <span className="product-price">{formatCurrency(product.price)}</span>
          <button 
            className="add-cart-btn flex items-center gap-1.5"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
