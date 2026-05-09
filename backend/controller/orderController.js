import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";


// Create New Order

export const createNewOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo: {
      address: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      country: shippingInfo.country,
      pinCode: shippingInfo.pinCode,
      phoneNo: shippingInfo.phoneNo,
    },

    orderItems,

    paymentInfo: paymentInfo || {
      status: "pending",
    },

    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,

    paidAt: paymentInfo?.status === "succeeded" ? Date.now() : null,

    orderStatus:
      paymentInfo?.status === "succeeded" ? "Processing" : "Cancelled",

    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});


// Get Single Order

export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order) {
    return next(new HandleError("No order found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});


// Get My Orders

export const allMyOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});


// Get All Orders (Admin)

export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});


// Update Product Stock
async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  product.stock -= quantity;

  await product.save({
    validateBeforeSave: false,
  });
}


// Update Order Status

export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("No order found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new HandleError("This order has already been delivered", 400));
  }

  await Promise.all(
    order.orderItems.map((item) => updateQuantity(item.product, item.quantity)),
  );

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Delete Order

export const deleteOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("No order found", 404));
  }

  if (order.orderStatus !== "Delivered") {
    return next(
      new HandleError(
        "This order is still processing and cannot be deleted",
        400,
      ),
    );
  }

  await Order.deleteOne({
    _id: req.params.id,
  });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
