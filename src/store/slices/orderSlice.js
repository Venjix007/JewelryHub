import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// Helper function to handle API errors
const handleApiError = (error, thunkAPI) => {
  const message = 
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();
  toast.error(message);
  return thunkAPI.rejectWithValue(message);
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const response = await api.post('/orders', orderData);
      
      // Save order details to localStorage for order confirmation page
      localStorage.setItem('lastOrderItems', JSON.stringify(orderData.items));
      localStorage.setItem('lastOrderTotal', orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
      localStorage.setItem('shippingAddress', JSON.stringify(orderData.shippingAddress));
      
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, thunkAPI) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/my-orders', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
    }
  }
);

export const getSellerOrders = createAsyncThunk(
  'orders/getSellerOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/seller/orders', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch seller orders');
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    pagination: null,
    isLoading: false,
    isCreating: false,
    error: null,
    createError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.createError = null;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isCreating = true;
        state.error = null;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreating = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isCreating = false;
        state.createError = action.payload;
      })
      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Seller Orders
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Orders (Admin)
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearOrderError, resetCurrentOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectIsCreatingOrder = (state) => state.orders.isCreating;
export const selectCreateOrderError = (state) => state.orders.createError;
export default orderSlice.reducer;