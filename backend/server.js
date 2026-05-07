import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import transactionsRouter from "./src/routes/transactions.js";
import authRouter from "./src/routes/auth.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? false 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" }
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend running");
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api", transactionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));