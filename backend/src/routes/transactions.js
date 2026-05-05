import { Router } from "express";
import upload from "../config/multer.js";

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
  getSummary,
} from "../controllers/transactionsController.js";

const router = Router();

// endpoints
router.get("/transactions", getTransactions);
router.get("/categories", getCategories);
router.get("/summary", getSummary);

router.post("/transactions", upload.single("receipt"), addTransaction);
router.delete("/transactions/:id", deleteTransaction);

export default router;
