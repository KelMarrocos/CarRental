import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express();

// Connect Database
await connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://car-rental-client.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// preflight sem quebrar (NÃO use "*")
app.options(/.*/, cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => res.send("Server is running"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);