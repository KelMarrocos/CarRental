import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

/*
  overlap rule (conflito):
  start < existingEnd && end > existingStart

  E só conta reservas "pending" e "confirmed" (cancelled não bloqueia).
*/
const hasOverlap = async ({ carId, pickupDate, returnDate }) => {
  return Booking.exists({
    car: carId,
    status: { $in: ["pending", "confirmed"] },
    pickupDate: { $lt: new Date(returnDate) },
    returnDate: { $gt: new Date(pickupDate) },
  });
};

// POST /api/bookings/check-availability
export const checkAvailabilityofCars = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    if (!location || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "location, pickupDate, returnDate are required",
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "returnDate must be after pickupDate",
      });
    }

    // pega carros disponíveis na localização
    const cars = await Car.find({ location, isAvailable: true }).sort({ createdAt: -1 });

    // filtra os que NÃO têm conflito no intervalo
    const availableCars = (
      await Promise.all(
        cars.map(async (car) => {
          const conflict = await hasOverlap({
            carId: car._id,
            pickupDate: start,
            returnDate: end,
          });
          return conflict ? null : car;
        })
      )
    ).filter(Boolean);

    return res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bookings/create (PROTEGIDO)
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "carId, pickupDate, returnDate are required",
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    // se carro está indisponível, não deixa reservar
    if (typeof car.isAvailable === "boolean" && !car.isAvailable) {
      return res.status(400).json({ success: false, message: "Car is not available" });
    }

    // bloqueia conflito
    const conflict = await hasOverlap({
      carId,
      pickupDate: start,
      returnDate: end,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "This car is already booked for these dates",
      });
    }

    const pricePerDay = Number(car.pricePerDay || 0);
    const price = diffDays * pricePerDay;

    const booking = await Booking.create({
      user: userId,
      owner: car.owner,
      car: car._id,
      pickupDate: start,
      returnDate: end,
      totalDays: diffDays,
      pricePerDay,
      price,
      status: "pending",
    });

    const populated = await Booking.findById(booking._id).populate("car");

    return res.json({
      success: true,
      message: "Booking created",
      booking: populated,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/user (PROTEGIDO)
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/owner (PROTEGIDO)
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car")
      .populate({ path: "user", select: "-password" })
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bookings/change-status (PROTEGIDO OWNER)
export const changeBookingStatus = async (req, res) => {
  try {
    const ownerId = req.user._id;

    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { bookingId, status } = req.body;

    const allowed = ["pending", "confirmed", "cancelled"];
    const normalized = String(status || "").toLowerCase();

    if (!bookingId || !allowed.includes(normalized)) {
      return res.status(400).json({ success: false, message: "Invalid bookingId/status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = normalized;
    await booking.save();

    return res.json({ success: true, message: "Status updated", booking });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};