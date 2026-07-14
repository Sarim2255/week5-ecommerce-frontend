import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await api.getProducts(filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.getProductById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch product details');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getCategories();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch categories');
    }
  }
);

export const submitReview = createAsyncThunk(
  'products/submitReview',
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const data = await api.addReview(productId, review);
      return data; // returns updated product
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit review');
    }
  }
);

// Helper to load wishlist
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem('eda_wishlist_v2');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (list) => {
  try {
    localStorage.setItem('eda_wishlist_v2', JSON.stringify(list));
  } catch {}
};

const initialState = {
  items: [],
  categories: ['All'],
  currentProduct: null,
  wishlist: loadWishlist(), // holds product IDs
  compareList: [], // holds full product objects (max 3)
  searchQuery: '',
  filters: {
    category: 'All',
    minPrice: 0,
    maxPrice: 25000,
    rating: 0,
    sortBy: 'default'
  },
  loading: false,
  detailLoading: false,
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    },
    toggleWishlist: (state, action) => {
      const id = action.payload;
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter(item => item !== id);
      } else {
        state.wishlist.push(id);
      }
      saveWishlist(state.wishlist);
    },
    toggleCompare: (state, action) => {
      const product = action.payload;
      const exists = state.compareList.find(p => p.id === product.id);
      if (exists) {
        state.compareList = state.compareList.filter(p => p.id !== product.id);
      } else {
        if (state.compareList.length < 3) {
          state.compareList.push(product);
        } else {
          // Replace first item or ignore. Let's ignore or replace first item.
          // Let's replace the first item to keep it at 3.
          state.compareList.shift();
          state.compareList.push(product);
        }
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(p => p.id !== action.payload);
    },
    clearCompareList: (state) => {
      state.compareList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
        // Update product in list if present
        const idx = state.items.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setSearchQuery, 
  setFilters, 
  resetFilters, 
  toggleWishlist, 
  toggleCompare, 
  removeFromCompare,
  clearCompareList 
} = productSlice.actions;

export default productSlice.reducer;
