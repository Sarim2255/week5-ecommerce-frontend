import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, GitCompare, Star, CheckCircle, ChevronLeft } from 'lucide-react';
import { fetchProductById, submitReview, toggleWishlist, toggleCompare } from '../store/productSlice';
import { addToCart, updateQuantity } from '../store/cartSlice';
import { formatCurrency, handleImageError } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct: product, detailLoading: loading, error, wishlist, compareList } = useSelector(state => state.products);
  const cartItems = useSelector(state => state.cart.items);

  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ user: '', rating: 5, comment: '' });
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // specs or reviews

  useEffect(() => {
    dispatch(fetchProductById(id));
    setQty(1);
    setReviewSuccess(false);
  }, [id, dispatch]);

  if (loading && !product) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-12 h-12 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 glass-panel max-w-md mx-auto">
        <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
        <button onClick={() => navigate('/products')} className="checkout-btn px-6 py-2">
          Back to Catalog
        </button>
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isComparing = compareList.some(p => p.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);

  const handleAddToCart = () => {
    if (cartItem) {
      const targetQty = cartItem.quantity + qty;
      if (targetQty <= product.stock) {
        dispatch(updateQuantity({ id: product.id, quantity: targetQty }));
      } else {
        dispatch(updateQuantity({ id: product.id, quantity: product.stock }));
      }
    } else {
      dispatch(addToCart(product));
      if (qty > 1) {
        dispatch(updateQuantity({ id: product.id, quantity: qty }));
      }
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.user.trim() || !reviewForm.comment.trim()) return;

    dispatch(submitReview({
      productId: product.id,
      review: {
        user: reviewForm.user,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }
    })).then((res) => {
      if (!res.error) {
        setReviewSuccess(true);
        setReviewForm({ user: '', rating: 5, comment: '' });
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 w-fit transition-colors"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Main product card detail */}
      <div className="detail-grid">
        <div className="detail-gallery">
          <div className="main-detail-image">
            <img src={product.image} alt={product.name} onError={handleImageError} />
          </div>
          {/* Thumbnail row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-brand-primary/40 rounded-lg overflow-hidden cursor-pointer aspect-square bg-slate-900/60 p-1">
              <img src={product.image} alt="thumbnail 1" className="w-100 h-100 object-cover rounded" onError={handleImageError} />
            </div>
            {/* mock thumbnails */}
            <div className="border border-white/5 hover:border-brand-primary/20 rounded-lg overflow-hidden cursor-pointer opacity-50 hover:opacity-100 transition-all aspect-square bg-slate-900/60 p-1">
              <img src={product.image} alt="thumbnail 2" className="w-100 h-100 object-cover rounded sepia-[0.3]" onError={handleImageError} />
            </div>
            <div className="border border-white/5 hover:border-brand-primary/20 rounded-lg overflow-hidden cursor-pointer opacity-50 hover:opacity-100 transition-all aspect-square bg-slate-900/60 p-1">
              <img src={product.image} alt="thumbnail 3" className="w-100 h-100 object-cover rounded hue-rotate-60" onError={handleImageError} />
            </div>
            <div className="border border-white/5 hover:border-brand-primary/20 rounded-lg overflow-hidden cursor-pointer opacity-50 hover:opacity-100 transition-all aspect-square bg-slate-900/60 p-1">
              <img src={product.image} alt="thumbnail 4" className="w-100 h-100 object-cover rounded saturate-150" onError={handleImageError} />
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="detail-info glass-panel p-8">
          <span className="product-category text-xs font-bold tracking-wider text-brand-secondary">{product.category}</span>
          <h1 className="detail-title text-white mt-1 mb-3">{product.name}</h1>
          
          <div className="product-rating mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"}
                />
              ))}
            </div>
            <span className="text-white font-semibold text-sm">{product.rating}</span>
            <span className="rating-count text-xs">({product.reviewCount} verified reviews)</span>
          </div>

          <div className="detail-price">{formatCurrency(product.price)}</div>
          <p className="detail-desc">{product.description}</p>
          
          <div className="border-t border-gray-800 pt-6 mb-6">
            <span className="text-xs text-gray-400 font-semibold uppercase block mb-3">Availability</span>
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Add to cart section */}
          {product.stock > 0 && (
            <div className="detail-actions">
              <div className="detail-qty-control">
                <button 
                  className="detail-qty-btn"
                  onClick={() => setQty(q => q > 1 ? q - 1 : 1)}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="detail-qty-val text-white">{qty}</span>
                <button 
                  className="detail-qty-btn"
                  onClick={() => setQty(q => q < product.stock ? q + 1 : product.stock)}
                  disabled={qty >= product.stock}
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="add-cart-btn flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          )}

          {/* Wishlist & Compare list additions */}
          <div className="flex gap-4 border-t border-gray-800 pt-6">
            <button 
              className={`nav-link text-sm hover:text-white flex items-center gap-1.5 ${isWishlisted ? 'text-pink-500' : ''}`}
              onClick={() => dispatch(toggleWishlist(product.id))}
            >
              <Heart size={16} className={isWishlisted ? "fill-pink-500" : ""} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>

            <button 
              className={`nav-link text-sm hover:text-white flex items-center gap-1.5 ${isComparing ? 'text-brand-primary' : ''}`}
              onClick={() => dispatch(toggleCompare(product))}
            >
              <GitCompare size={16} />
              {isComparing ? 'Comparing' : 'Compare Hardware'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs section for specs and reviews */}
      <section className="glass-panel p-8 mt-4">
        <div className="flex gap-6 border-b border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-base font-bold pb-2 transition-all ${
              activeTab === 'specs' ? 'text-white border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-base font-bold pb-2 transition-all ${
              activeTab === 'reviews' ? 'text-white border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            User Reviews ({product.reviews.length})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <table className="specs-table">
            <tbody>
              {Object.entries(product.specs).map(([key, val]) => (
                <tr key={key}>
                  <td className="spec-name">{key}</td>
                  <td className="spec-value">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="reviews-grid">
            {/* Reviews display */}
            <div className="reviews-list">
              {product.reviews.map(r => (
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{r.user}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-700"}
                      />
                    ))}
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a review form */}
            <div className="review-form glass-card">
              <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
              {reviewSuccess ? (
                <div className="flex flex-col items-center gap-3 py-6 text-emerald-500">
                  <CheckCircle size={32} />
                  <span className="font-semibold text-sm">Review Submitted Successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Jane Doe"
                      value={reviewForm.user}
                      onChange={e => setReviewForm({ ...reviewForm, user: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div className="stars-rating-input">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          className={`star-input-btn ${reviewForm.rating >= val ? 'active' : ''}`}
                          onClick={() => setReviewForm({ ...reviewForm, rating: val })}
                        >
                          <Star size={20} className={reviewForm.rating >= val ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Details</label>
                    <textarea
                      className="form-textarea"
                      rows="4"
                      required
                      placeholder="Share your thoughts about this hardware..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="add-cart-btn w-full">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
