import { Router } from "express";
import upload from "../config/multer.js";
import { requireOwner } from "../middleware/auth.js";

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
} from "../controllers/transactionsController.js";

const router = Router();

// endpoints
router.get("/transactions", getTransactions);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.get("/summary", getSummary);
router.get("/summary/monthly", getMonthlySummary);
router.get("/summary/date-range", getSummaryByDateRange);
router.get("/summary/by-category", getCategoryBreakdown);

router.post("/transactions", upload.single("receipt"), addTransaction);
router.post("/categories", requireOwner, createCategory);
router.delete("/transactions/:id", deleteTransaction);

export default router;
