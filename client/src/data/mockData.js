import { assets } from "../constants/assets";

/* ================================
        USER
================================ */

export const dummyUserData = {
  _id: "6847f7cab3d8daecdb517095",
  name: "DevMarrocos",
  email: "admin@example.com",
  role: "owner",
  image: assets.user_profile,
};

/* ================================
        CARS
================================ */

export const dummyCarData = [
  {
    _id: "67ff5bc069c03d4e45f30b77",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "BMW",
    model: "X5",
    image: assets.car_image1,
    year: 2006,
    category: "SUV",
    seating_capacity: 4,
    fuel_type: "Hybrid",
    transmission: "Semi-Automatic",
    pricePerDay: 300,
    location: "New York",
    description:
      "The BMW X5 is a mid-size luxury SUV produced by BMW.",
    isAvailable: true,
    createdAt: "2025-04-16T07:26:56.215Z",
  },
  {
    _id: "67ff6b758f1b3684286a2a65",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "Mercedes Benz",
    model: "C-Class",
    image: assets.car_image2,
    year: 2021,
    category: "Sedan",
    seating_capacity: 5,
    fuel_type: "Diesel",
    transmission: "Manual",
    pricePerDay: 300,
    location: "Chicago",
    description:
      "A luxury compact sedan known for comfort, technology, and smooth performance.",
    isAvailable: true,
    createdAt: "2025-04-16T08:33:57.993Z",
  },
  {
    _id: "67ff6b9f8f1b3684286a2a68",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "Jeep",
    model: "Wrangler",
    image: assets.car_image3,
    year: 2023,
    category: "SUV",
    seating_capacity: 4,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    pricePerDay: 200,
    location: "Los Angeles",
    description:
      "The Jeep Wrangler is built for adventure.",
    isAvailable: true,
    createdAt: "2025-04-16T08:34:39.592Z",
  },
  {
    _id: "68009c93a3f5fc6338ea7e38",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "Ford",
    model: "Neo 6",
    image: assets.car_image4,
    year: 2022,
    category: "Sedan",
    seating_capacity: 2,
    fuel_type: "Diesel",
    transmission: "Semi-Automatic",
    pricePerDay: 209,
    location: "Houston",
    description:
      "A modern sedan offering comfort and performance.",
    isAvailable: true,
    createdAt: "2025-04-17T06:15:47.318Z",
  },
  {
    _id: "68009c93a3f5fc6338ea7e87",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "Porsche",
    model: "Panamera",
    image: assets.car_image5,
    year: 2022,
    category: "Sedan",
    seating_capacity: 4,
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: 550,
    location: "Houston",
    description:
      "A full-size luxury sedan that blends sports-car performance with premium comfort and advanced technology.",
    isAvailable: true,
    createdAt: "2025-04-17T06:15:47.318Z",
  },
  {
    _id: "68009c93a3f5fc6338ea7f67",
    owner: "67fe3467ed8a8fe17d0ba6e2",
    brand: "Lamborghini",
    model: "Revuelto",
    image: assets.car_image6,
    year: 2022,
    category: "Coupe",
    seating_capacity: 4,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    pricePerDay: 750,
    location: "Houston",
    description:
      "A high-performance hybrid supercar that combines a V12 engine with electric motors for extreme speed and advanced technology.",
    isAvailable: true,
    createdAt: "2025-04-17T06:15:47.318Z",
  },
];

/* ================================
        BOOKINGS
================================ */

export const dummyMyBookingsData = [
  {
    _id: "68482bcc98eb9722b7751f70",
    car: dummyCarData[0],
    user: dummyUserData._id,
    owner: dummyUserData._id,
    pickupDate: "2026-06-13",
    returnDate: "2026-06-14",
    status: "confirmed",
    price: 300,
    createdAt: "2025-06-10T12:57:48.244Z",
  },
  {
    _id: "68482bb598eb9722b7751f60",
    car: dummyCarData[1],
    user: dummyUserData._id,
    owner: "67fe3467ed8a8fe17d0ba6e2",
    pickupDate: "2026-06-12",
    returnDate: "2026-06-12",
    status: "pending",
    price: 200,
  },
  {
    _id: "684800fa0fb481c5cfd92e56",
    car: dummyCarData[2],
    user: dummyUserData._id,
    owner: "67fe3467ed8a8fe17d0ba6e2",
    pickupDate: "2026-06-11",
    returnDate: "2026-06-12",
    status: "pending",
    price: 200,
  },
  {
    _id: "6847fe790fb481c5cfd92d94",
    car: dummyCarData[3],
    user: dummyUserData._id,
    owner: dummyUserData._id,
    pickupDate: "2026-06-11",
    returnDate: "2026-06-12",
    status: "confirmed",
    price: 209,
  },
  {
    _id: "68009c93a3f5fc6338ea7e87",
    car: dummyCarData[4],
    user: dummyUserData._id,
    owner: dummyUserData._id,
    pickupDate: "2026-06-11",
    returnDate: "2026-06-12",
    status: "confirmed",
    price: 550,
  },
  {
    _id: "68009c93a3f5fc6338ea7f67",
    car: dummyCarData[5],
    user: dummyUserData._id,
    owner: dummyUserData._id,
    pickupDate: "2026-06-11",
    returnDate: "2026-06-12",
    status: "pending",
    price: 750,
  },
];

/* ================================
        DASHBOARD
================================ */

export const dummyDashboardData = {
  totalCars: dummyCarData.length,
  totalBookings: dummyMyBookingsData.length,
  pendingBookings: dummyMyBookingsData.filter(
    (b) => b.status === "pending"
  ).length,
  completedBookings: dummyMyBookingsData.filter(
    (b) => b.status === "confirmed"
  ).length,
  recentBookings: dummyMyBookingsData,
  monthlyRevenue: 840,
};