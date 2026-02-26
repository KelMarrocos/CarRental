import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// ================================
// USER
// ================================

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    return res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ================================
// HELPERS (ImageKit)
// ================================

const uploadFileToImageKit = async (file, folder = "/cars", width = "1280") => {
  const buf = fs.readFileSync(file.path);

  const up = await imagekit.upload({
    file: buf,
    fileName: file.originalname,
    folder,
  });

  const url = imagekit.url({
    path: up.filePath,
    transformation: [{ width }, { quality: "auto" }, { format: "webp" }],
  });

  return { url, fileId: up.fileId };
};

// ================================
// CARS
// ================================

// API to Add Car (CREATE)
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    // carData vem como string JSON
    let car = {};
    try {
      car = JSON.parse(req.body.carData || "{}");
    } catch {
      return res.json({ success: false, message: "Invalid carData JSON" });
    }

    // principal (obrigatório no create)
    const mainFile = req.files?.image?.[0];
    if (!mainFile) {
      return res.json({ success: false, message: "Main image is required" });
    }

    // extras (opcional)
    const extraFiles = req.files?.images || [];

    // upload principal
    const mainUp = await uploadFileToImageKit(mainFile, "/cars", "1280");

    // upload extras (se tiver)
    const extraUps = await Promise.all(
      extraFiles.map((f) => uploadFileToImageKit(f, "/cars", "1280"))
    );

    const images = extraUps.map((x) => x.url);

    const created = await Car.create({
      ...car,
      owner: _id,
      image: mainUp.url,
      images, // ✅ galeria

      // opcionais para deletar depois
      imageFileId: mainUp.fileId,
      imageFileIds: extraUps.map((x) => x.fileId),
    });

    return res.json({ success: true, message: "Car Added", car: created });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to list Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    return res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to list Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookingId = req.params.id;
    const { status } = req.body;

    const normalized = String(status || "").toLowerCase();
    if (!["confirmed", "cancelled", "pending"].includes(normalized)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.json({ success: false, message: "Booking not found" });

    if (booking.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = normalized;
    await booking.save();

    return res.json({ success: true, message: "Status updated", booking });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to Update Car (EDIT)
export const updateCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const carId = req.params.id || req.body.carId;

    if (!carId) {
      return res.json({ success: false, message: "carId is required" });
    }

    const carDoc = await Car.findById(carId);
    if (!carDoc) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (carDoc.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Dados do carro
    let updates = req.body;
    if (typeof req.body.carData === "string") {
      try {
        updates = JSON.parse(req.body.carData);
      } catch {
        return res.json({ success: false, message: "Invalid carData JSON" });
      }
    }

    // com upload.fields() os arquivos vêm em req.files (não req.file)
    const mainFile = req.files?.image?.[0];     // opcional no edit
    const extraFiles = req.files?.images || []; // opcional no edit

    // (Opcional) Trocar capa
    if (mainFile) {
      const mainUp = await uploadFileToImageKit(mainFile, "/cars", "1280");
      updates.image = mainUp.url;
      updates.imageFileId = mainUp.fileId; // se você usa
    }

    // (Opcional) Atualizar galeria
    if (extraFiles.length) {
      const extraUps = await Promise.all(
        extraFiles.map((f) => uploadFileToImageKit(f, "/cars", "1280"))
      );

      const newUrls = extraUps.map((x) => x.url);
      const newFileIds = extraUps.map((x) => x.fileId);

      // Regra: SUBSTITUIR galeria inteira pelo que veio agora:
      updates.images = newUrls;
      updates.imageFileIds = newFileIds;

      // Se você preferir SOMAR (manter antigas + novas), use isso:
      // updates.images = Array.from(new Set([...(carDoc.images || []), ...newUrls]));
      // updates.imageFileIds = Array.from(new Set([...(carDoc.imageFileIds || []), ...newFileIds]));
    }

    // Proteções
    delete updates.owner;
    delete updates._id;

    const updated = await Car.findByIdAndUpdate(carId, updates, { new: true });

    return res.json({ success: true, message: "Car Updated", car: updated });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to Toggle car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const carId = req.params.id;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    if (car.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const current = typeof car.isAvailable === "boolean" ? car.isAvailable : !!car.isAvaliable;

    car.isAvailable = !current;
    car.isAvaliable = undefined;
    await car.save();

    return res.json({ success: true, message: "Availability Toggled", car });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to delete a car (soft delete)
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const carId = req.body.carId || req.params.id;

    if (!carId) {
      return res.json({ success: false, message: "carId is required" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    return res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const totalCars = await Car.countDocuments({ owner: _id });
    const totalBookings = await Booking.countDocuments({ owner: _id });

    const pendingBookings = await Booking.countDocuments({
      owner: _id,
      status: "pending",
    });

    const completedBookings = await Booking.countDocuments({
      owner: _id,
      status: "confirmed",
    });

    const recentBookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 })
      .limit(5);

    const revenueAgg = await Booking.aggregate([
      { $match: { owner: _id, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const monthlyRevenue = revenueAgg[0]?.total || 0;

    return res.json({
      success: true,
      data: {
        totalCars,
        totalBookings,
        pendingBookings,
        completedBookings,
        recentBookings,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};