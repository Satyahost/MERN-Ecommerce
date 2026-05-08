import handleAsyncError from "../middleware/handleAsyncError.js";
import { instance } from "../server.js";
import crypto from "crypto";

// Create Payment Order
export const processPayment = handleAsyncError(async (req, res) => {
  // amount received in rupees
  const amountInRupees = Number(req.body.amount);

  // convert rupees to paise
 

  const options = {
    amount: Math.round(amountInRupees * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
});

// Send Razorpay Key
export const sendAPIKey = handleAsyncError(async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
});

// Payment Verification
export const paymentVerification = handleAsyncError(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      reference: razorpay_payment_id,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Payment verification failed",
  });
});
