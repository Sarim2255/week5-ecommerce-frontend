import { createSlice } from '@reduxjs/toolkit';

const loadCartItems = () => {
  try {
    const serialized = localStorage.getItem('eda_cart_v2');
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items) => {
  try {
    localStorage.setItem('eda_cart_v2', JSON.stringify(items));
  } catch (e) {
    console.error("Could not save cart items to localStorage", e);
  }
};

const initialState = {
  items: loadCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, stock } = action.payload;
      const existing = state.items.find(item => item.id === id);
      
      if (existing) {
        if (existing.quantity < stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({ id, name, price, image, stock, quantity: 1 });
      }
      
      saveCartItems(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartItems(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find(item => item.id === id);
      
      if (existing) {
        if (quantity < 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else if (quantity <= existing.stock) {
          existing.quantity = quantity;
        }
      }
      
      saveCartItems(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartItems(state.items);
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
