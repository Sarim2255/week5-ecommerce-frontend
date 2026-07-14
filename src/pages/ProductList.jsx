import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { fetchProducts, fetchCategories, setFilters, resetFilters } from '../store/productSlice';
import ProductCard from '../components/ProductCard/ProductCard';
import { formatCurrency } from '../utils/helpers';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items: products, categories, filters, searchQuery, loading } = useSelector(state => state.products);

  // Sync route query params to redux store on mount/query change
  useEffect(() => {
    dispatch(fetchCategories());
    
    const cat = searchParams.get('category') || 'All';
    
    dispatch(setFilters({ 
      category: cat,
      minPrice: parseFloat(searchParams.get('minPrice') || '0'),
      maxPrice: parseFloat(searchParams.get('maxPrice') || '25000'),
      rating: parseFloat(searchParams.get('rating') || '0'),
      sortBy: searchParams.get('sortBy') || 'default'
    }));
  }, [searchParams, dispatch]);

  // Trigger product fetch when filters or searchQuery changes
  useEffect(() => {
    dispatch(fetchProducts({
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      sortBy: filters.sortBy,
      search: searchQuery
    }));
  }, [filters, searchQuery, dispatch]);

  const updateUrlParams = (newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === null || val === 'All' || val === 'default' || val === 0) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (cat) => {
    dispatch(setFilters({ category: cat }));
    updateUrlParams({ category: cat });
  };

  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setFilters({ maxPrice: val }));
    updateUrlParams({ maxPrice: val });
  };

  const handleRatingChange = (ratingVal) => {
    const val = filters.rating === ratingVal ? 0 : ratingVal;
    dispatch(setFilters({ rating: val }));
    updateUrlParams({ rating: val });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    dispatch(setFilters({ sortBy: val }));
    updateUrlParams({ sortBy: val });
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  return (
    <div className="catalog-container">
      {/* Sidebar Filters */}
      <aside className="sidebar-filters glass-panel">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-brand-primary" />
            Filters
          </h3>
          <button 
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Reset all filters"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        {/* Category filter */}
        <div className="filter-section">
          <h4 className="filter-title">Category</h4>
          <div className="flex flex-col gap-1">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryChange(cat)}
                className={`text-left text-sm py-2 px-3 rounded-lg transition-all ${
                  filters.category === cat 
                    ? 'bg-brand-primary/10 text-white font-semibold border-l-2 border-brand-primary' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="filter-section">
          <h4 className="filter-title">Max Price</h4>
          <input
            type="range"
            min="0"
            max="25000"
            step="500"
            className="range-slider"
            value={filters.maxPrice}
            onChange={handlePriceChange}
          />
          <div className="range-values">
            <span>{formatCurrency(0)}</span>
            <span className="text-brand-secondary font-bold">{formatCurrency(filters.maxPrice)}</span>
            <span>{formatCurrency(25000)}</span>
          </div>
        </div>

        {/* Rating filter */}
        <div className="filter-section">
          <h4 className="filter-title">Customer Reviews</h4>
          <div className="filter-list">
            {[4.5, 4.0, 3.5].map((stars) => (
              <label key={stars} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.rating === stars}
                  onChange={() => handleRatingChange(stars)}
                />
                <span>{stars}★ &amp; above</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Grid View */}
      <main className="catalog-content flex flex-col gap-6">
        <div className="catalog-header border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Hardware Catalog</h1>
            <p className="text-xs text-gray-400">
              Showing {products.length} products
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-medium">Sort By:</label>
            <select 
              value={filters.sortBy} 
              onChange={handleSortChange} 
              className="sort-select"
            >
              <option value="default">Trending</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <p className="text-gray-400 text-lg mb-4">No hardware matches your active filters.</p>
            <button onClick={handleReset} className="add-cart-btn">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
