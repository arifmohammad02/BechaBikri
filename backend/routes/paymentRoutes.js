import express from "express";
const router = express.Router();

import {
  getPaymentMethods,
  createOrUpdatePaymentMethod,
  deletePaymentMethod,
  submitManualPayment,
  verifyManualPayment,
  getPaymentStats,
  checkTransactionId,
} from "../controllers/paymentController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.get("/methods", getPaymentMethods);
router.put("/submit/:orderId", authenticate, submitManualPayment);
router.get("/check-transaction/:transactionId", checkTransactionId);
router.get("/stats", authenticate, authorizeAdmin, getPaymentStats);
router.post(
  "/methods",
  authenticate,
  authorizeAdmin,
  createOrUpdatePaymentMethod,
);
router.delete(
  "/methods/:type",
  authenticate,
  authorizeAdmin,
  deletePaymentMethod,
);
router.put(
  "/verify/:orderId",
  authenticate,
  authorizeAdmin,
  verifyManualPayment,
);

export default router;
