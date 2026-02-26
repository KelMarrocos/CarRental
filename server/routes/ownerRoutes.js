import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateCar,
  getOwnerBookings,
  updateBookingStatus,
} from "../controllers/ownerController.js";

const ownerRouter = express.Router();

// Role
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// Cars
ownerRouter.post(
  "/add-car",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },   // capa
    { name: "images", maxCount: 8 },  // galeria
  ]),
  addCar
);

ownerRouter.get("/cars", protect, getOwnerCars);

ownerRouter.put(
  "/car/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },   // capa (opcional no edit)
    { name: "images", maxCount: 8 },  // galeria (opcional no edit)
  ]),
  updateCar
);

// Toggle availability
ownerRouter.patch("/car/:id/toggle", protect, toggleCarAvailability);

// Delete
ownerRouter.delete("/car/:id", protect, deleteCar);

// Dashboard
ownerRouter.get("/dashboard", protect, getDashboardData);

// Bookings
ownerRouter.get("/bookings", protect, getOwnerBookings);
ownerRouter.patch("/booking/:id", protect, updateBookingStatus);

export default ownerRouter;