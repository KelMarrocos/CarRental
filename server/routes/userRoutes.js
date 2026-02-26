import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import uploadMemory from "../middleware/uploadMemory.js";
import { multerErrorHandler } from "../middleware/multerError.js";
import { updateUserImage } from "../controllers/userController.js";
import { getMyBookings } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.post(
  "/update-image",
  protect,
  uploadMemory.single("image"),
  multerErrorHandler,
  updateUserImage
);
userRouter.get("/bookings", protect, getMyBookings);


export default userRouter;