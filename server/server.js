import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

await connectDB();

/**
 * CORS: como você usa Authorization Bearer (não cookies),
 * o melhor é refletir o Origin automaticamente.
 */
const corsOptions = {
  origin: true, // reflete o Origin da requisição
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// CORS precisa vir ANTES das rotas
app.use(cors(corsOptions));

// Preflight (OPTIONS) para qualquer rota
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Server is running"));

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));