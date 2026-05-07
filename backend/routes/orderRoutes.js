import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import {
  allMyOrders,
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controller/orderController.js";

const router = express.Router();

// Create order
router.route("/new/order").post(verifyUserAuth, createNewOrder);


// User orders
router.route("/order/user").get(verifyUserAuth, allMyOrders);


// Get single order
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);



// Admin update/delete order
router
  .route("/admin/order/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteOrder);


// Admin all orders
router
  .route("/admin/orders")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);

export default router;
