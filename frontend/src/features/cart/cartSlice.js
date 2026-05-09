import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add items to cart — userId pulled from Redux auth state automatically
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/${id}`,
      );
      // Get userId from auth state — no need to pass it manually everywhere
      const userId = getState().user?.user?._id;

      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
        userId,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [], //Empty on start — loadUserCart fills this after login
    shippingInfo: {}, //Empty on start — loadUserCart fills this after login
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
  },
  reducers: {
    // NEW: Call this after login — loads that user's cart from localStorage
    loadUserCart: (state, action) => {
      const userId = action.payload;
      state.cartItems =
        JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
      state.shippingInfo =
        JSON.parse(localStorage.getItem(`shippingInfo_${userId}`)) || {};
    },

    removeErrors: (state) => {
      state.error = null;
    },

    removeMessage: (state) => {
      state.message = null;
    },

    // Updated: pass { productId, userId } instead of just productId
    removeItemFromCart: (state, action) => {
      const { productId, userId } = action.payload;
      state.removingId = productId;
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== productId,
      );
      if (userId) {
        localStorage.setItem(
          `cartItems_${userId}`,
          JSON.stringify(state.cartItems),
        );
      }
      state.removingId = null;
    },

    // Updated: pass { shippingData, userId } instead of just the data
    saveShippingInfo: (state, action) => {
      const { shippingData, userId } = action.payload;
      state.shippingInfo = shippingData;
      if (userId) {
        localStorage.setItem(
          `shippingInfo_${userId}`,
          JSON.stringify(state.shippingInfo),
        );
      }
    },

    // Updated: pass userId to also clear localStorage, or null to only reset Redux state
    clearCart: (state, action) => {
      const userId = action.payload;
      state.cartItems = [];
      state.shippingInfo = {};
      if (userId) {
        localStorage.removeItem(`cartItems_${userId}`);
        localStorage.removeItem(`shippingInfo_${userId}`);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const { userId } = item;

        const existingItem = state.cartItems.find(
          (i) => i.product === item.product,
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
          state.message = `Updated ${item.name} quantity in the cart`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} is added to cart successfully`;
        }

        state.loading = false;
        state.success = true;
        state.error = null;

        // Save to user-specific key, or guest key if not logged in
        const storageKey = userId ? `cartItems_${userId}` : "cartItems_guest";
        localStorage.setItem(storageKey, JSON.stringify(state.cartItems));
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred";
      });
  },
});

export const {
  loadUserCart,
  removeErrors,
  removeMessage,
  removeItemFromCart,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
