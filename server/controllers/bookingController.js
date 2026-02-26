import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

/*
  Verifica se existe alguma reserva que SOBREPOE o intervalo informado.

  Overlap rule:
  pickup <= existingReturn AND return >= existingPickup
*/
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
};

// API: checar carros disponíveis por location + datas
export const checkAvailabilityofCars = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    if (!location || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "location, pickupDate, returnDate are required" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (Number.isNaN(picked.getTime()) || Number.isNaN(returned.getTime())) {
      return res.json({ success: false, message: "Invalid date format" });
    }

    if (returned <= picked) {
      return res.json({ success: false, message: "returnDate must be after pickupDate" });
    }

    // Carros cadastrados como disponíveis
    const cars = await Car.find({ location, isAvailable: true });

    // Checa disponibilidade real por datas
    const availableCars = (
      await Promise.all(
        cars.map(async (car) => {
          const free = await checkAvailability(car._id, picked, returned);
          return free ? car : null;
        })
      )
    ).filter(Boolean);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API: criar booking
export const createBooking = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { car: carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "car, pickupDate, returnDate are required" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (Number.isNaN(picked.getTime()) || Number.isNaN(returned.getTime())) {
      return res.json({ success: false, message: "Invalid date format" });
    }

    if (returned <= picked) {
      return res.json({ success: false, message: "returnDate must be after pickupDate" });
    }

    const carData = await Car.findById(carId);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    const isAvailable = await checkAvailability(carId, picked, returned);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    // Número de dias (mínimo 1)
    const msPerDay = 1000 * 60 * 60 * 24;
    const noOfDays = Math.max(1, Math.ceil((returned - picked) / msPerDay));

    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car: carId,
      owner: carData.owner,
      user: userId,
      pickupDate: picked,
      returnDate: returned,
      price,
      status: "pending", // opcional: define um default no schema
    });

    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API: listar reservas do usuário
export const getUserBookings = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const bookings = await Booking.find({ user: userId })
      .populate("car") // nome do campo no schema
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API: listar reservas do dono
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car")
      .populate({ path: "user", select: "-password" })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API: mudar status (owner aprova/cancela)
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id: ownerId } = req.user;
    const { bookingId, status } = req.body;

    const allowed = ["pending", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== ownerId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};