import express from "express";
import { verifyUserAuth } from "../middleware/userAuth.js";
import {
  processPayment,
  sendAPIKey,
  paymentVerification,
} from "../controller/paymentController.js"; 

const router = express.Router();

router.route("/payment/process").post(verifyUserAuth, processPayment);
router.route("/getKey").get(sendAPIKey);
router.route("/paymentVerification").post(verifyUserAuth, paymentVerification); 

export default router;
