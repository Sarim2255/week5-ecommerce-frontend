import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, GitCompare, X } from 'lucide-react';
import { removeFromCompare, clearCompareList } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { formatCurrency, handleImageError } from '../utils/helpers';

const Compare = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareList = useSelector(state => state.products.compareList);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCompare(id));
  };

  // Collect all unique specification keys across all products in the compare list
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specs || {})))
  );

  return (
    <div className="glass-panel p-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-3">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Compare Hardware
        </h2>
        {compareList.length > 0 && (
          <button 
            onClick={() => dispatch(clearCompareList())}
            className="remove-btn text-xs font-semibold py-1.5 px-3"
          >
            Clear All
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="text-center py-16">
          <GitCompare size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-6 font-medium">Add up to 3 hardware items to compare side-by-side.</p>
          <button onClick={() => navigate('/products')} className="add-cart-btn">
            Find Hardware
          </button>
        </div>
      ) : (
        <div className="compare-container">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="w-1/4 text-gray-400 text-sm font-semibold uppercase">Feature</th>
                {compareList.map(p => (
                  <th key={p.id} className="w-1/4">
                    <div className="compare-product-header">
                      <button 
                        onClick={() => handleRemove(p.id)}
                        className="circle-btn absolute -top-2 -right-2 w-7 h-7 bg-red-950/40 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                        title="Remove from comparison"
                        aria-label="Remove item"
                      >
                        <X size={12} />
                      </button>
                      <img src={p.image} alt={p.name} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer hover:opacity-90" onError={handleImageError} />
                      <h3 className="font-bold text-white text-base hover:underline cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                        {p.name}
                      </h3>
                      <span className="text-brand-secondary font-extrabold text-lg block mb-4">
                        {formatCurrency(p.price)}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(p)}
                        className="add-cart-btn flex items-center gap-1 text-xs py-1.5 px-3"
                      >
                        <ShoppingCart size={12} />
                        Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
                {/* Pad columns if comparing less than 3 products */}
                {compareList.length < 3 && 
                  [...Array(3 - compareList.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="w-1/4 text-center">
                      <div className="py-16 text-gray-600 text-sm border-2 border-dashed border-white/5 rounded-xl flex flex-col justify-center items-center gap-2">
                        <GitCompare size={24} />
                        <span>Empty Slot</span>
                        <button 
                          onClick={() => navigate('/products')}
                          className="auth-btn text-xs mt-2"
                        >
                          Add Product
                        </button>
                      </div>
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-white text-sm">Category</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-gray-300 text-sm font-semibold">{p.category}</td>
                ))}
                {compareList.length < 3 && [...Array(3 - compareList.length)].map((_, i) => <td key={`empty-cat-${i}`} />)}
              </tr>
              <tr>
                <td className="font-bold text-white text-sm">Rating</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-gray-300 text-sm">
                    <span className="text-amber-400 font-bold">{p.rating} ★</span> ({p.reviewCount} reviews)
                  </td>
                ))}
                {compareList.length < 3 && [...Array(3 - compareList.length)].map((_, i) => <td key={`empty-rate-${i}`} />)}
              </tr>
              <tr>
                <td className="font-bold text-white text-sm">Stock status</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-sm">
                    <span className={p.stock > 0 ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                      {p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}
                    </span>
                  </td>
                ))}
                {compareList.length < 3 && [...Array(3 - compareList.length)].map((_, i) => <td key={`empty-stock-${i}`} />)}
              </tr>
              {/* Dynamic specs rows */}
              {allSpecKeys.map(specKey => (
                <tr key={specKey}>
                  <td className="font-bold text-white text-sm">{specKey}</td>
                  {compareList.map(p => (
                    <td key={p.id} className="text-gray-400 text-sm">
                      {p.specs[specKey] || '—'}
                    </td>
                  ))}
                  {compareList.length < 3 && [...Array(3 - compareList.length)].map((_, i) => <td key={`empty-spec-${specKey}-${i}`} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
