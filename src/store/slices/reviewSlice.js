import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

// Async thunk for fetching product reviews
export const getProductReviews = createAsyncThunk(
  'reviews/getProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch reviews');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

// Async thunk for creating a review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create review');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearReviewError: (state) => {
      state.error = null;
    },
    resetReviewState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getProductReviews
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload || [];
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviews = [];
      })
      // Handle createReview
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setReviews, 
  setLoading, 
  setError, 
  clearError, 
  clearReviewError, 
  resetReviewState 
} = reviewSlice.actions;

export default reviewSlice.reducer;