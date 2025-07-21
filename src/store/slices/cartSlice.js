import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    console.log('Loading cart from storage:', serializedCart);
    if (serializedCart === null) {
      console.log('No cart found in storage, returning empty array');
      return [];
    }
    const parsedCart = JSON.parse(serializedCart);
    console.log('Parsed cart from storage:', parsedCart);
    return parsedCart;
  } catch (err) {
    console.error('Error loading cart from localStorage', err);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    console.log('Saving cart to storage:', cart);
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
    console.log('Cart saved to localStorage');
  } catch (err) {
    console.error('Error saving cart to localStorage', err);
  }
};

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { id, name, price, image, seller, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, image, seller, quantity });
      }
      
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToStorage(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Handle order creation success/failure
    builder
      .addCase('orders/createOrder/pending', (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase('orders/createOrder/fulfilled', (state) => {
        state.loading = false;
        state.items = [];
        saveCartToStorage([]);
      })
      .addCase('orders/createOrder/rejected', (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
      });
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, setCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
