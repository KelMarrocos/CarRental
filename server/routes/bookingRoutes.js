import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityofCars,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// Public (ou pode proteger também se quiser)
bookingRouter.post("/check-availability", checkAvailabilityofCars);

// User
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);

// Owner
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;