import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },
    car: { type: ObjectId, ref: "Car", required: true },

    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    totalDays: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    price: { type: Number, required: true }, // total final

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;