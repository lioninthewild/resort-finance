import { Router } from "express";
import upload from "../config/multer.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
  getCategoryById,
  createCategory,
  getSummary,
  getMonthlySummary,
  getSummaryByDateRange,
  getCategoryBreakdown,
  getNotifications,
  markNotificationRead,
} from "../controllers/transactionsController.js";

const router = Router();

// Admin-only endpoints (require authentication)
router.get("/transactions", authenticateToken, getTransactions);
router.get("/categories", authenticateToken, getCategories);
router.get("/categories/:id", authenticateToken, getCategoryById);
router.get("/summary", authenticateToken, getSummary);
router.get("/summary/monthly", authenticateToken, getMonthlySummary);
router.get("/summary/date-range", authenticateToken, getSummaryByDateRange);
router.get("/summary/by-category", authenticateToken, getCategoryBreakdown);
router.get("/notifications", authenticateToken, getNotifications);
router.post("/categories", authenticateToken, createCategory);

// Public endpoints (no auth, but notify admin)
router.post("/transactions", upload.single("receipt"), addTransaction);
router.delete("/transactions/:id", deleteTransaction);
router.patch("/notifications/:id/read", authenticateToken, markNotificationRead);

export default router;