import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/new/order", order, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Order creating failed" },
      );
    }
  },
);

// Get My Orders
export const getAllMyOrders = createAsyncThunk(
  "order/getAllMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/order/user", {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch orders" },
      );
    }
  },
);

// Get Order Details
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderID, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${orderID}`, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch order details" },
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    error: null,
    orders: [],
    order: {},
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Order creating failed";
      })

      // My Orders
      .addCase(getAllMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.orders = action.payload.orders;
      })

      .addCase(getAllMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })

      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch order details";
      });
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;
