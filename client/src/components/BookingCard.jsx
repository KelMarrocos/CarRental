import React, { useMemo } from "react";
import { assets } from "../constants/assets";

/*
====================================
        Booking Card Component
====================================

Responsabilidade:
-> Renderizar 1 booking
-> Formatar datas/valores
-> UI limpa e escalável

Futuro:
✔ botão Cancel
✔ Download receipt
✔ rating pós-viagem
*/

const BookingCard = ({ booking, currency = "$" }) => {
  const b = booking || {};
  const car = b.car || {};

  // ===== Status styles (escalável)
  const statusStyles = {
    confirmed: "bg-green-400/15 text-green-700 border border-green-500/20",
    pending: "bg-yellow-400/15 text-yellow-700 border border-yellow-500/20",
    cancelled: "bg-red-400/15 text-red-700 border border-red-500/20",
  };

  const statusLabel = String(b.status || "pending").toLowerCase();

  // ===== Date formatter (pt-BR friendly)
  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR");
  };

  // ===== Money formatter
  const formatMoney = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return `${currency} 0`;
    return `${currency} ${num.toLocaleString("pt-BR")}`;
  };

  // ===== Days (fallback: calcula se não vier do backend)
  const totalDays = useMemo(() => {
    if (typeof b.totalDays === "number" && b.totalDays > 0) return b.totalDays;

    const start = new Date(b.pickupDate);
    const end = new Date(b.returnDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [b.totalDays, b.pickupDate, b.returnDate]);

  const pricePerDay =
    typeof b.pricePerDay === "number" ? b.pricePerDay : car.pricePerDay;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-6
      p-6 border border-bordercolor rounded-2xl bg-white
      hover:shadow-lg transition"
    >
      {/* ================================
            CAR IMAGE + INFO
      ================================= */}
      <div className="md:col-span-1">
        <div className="rounded-xl overflow-hidden mb-3 bg-gray-100 border border-bordercolor">
          <img
            src={car.image || assets.upload_icon}
            alt={`${car.brand || "Car"} ${car.model || ""}`}
            className="w-full h-auto aspect-video object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="text-lg font-semibold text-gray-900 truncate">
          {car.brand || "—"} {car.model || ""}
        </p>

        <p className="text-gray-500 text-sm truncate">
          {car.year || "—"} • {car.category || "—"} • {car.location || "—"}
        </p>
      </div>

      {/* ================================
            BOOKING INFO
      ================================= */}
      <div className="md:col-span-2">
        {/* Header */}
        <div className="flex items-center flex-wrap gap-2">
          <p className="px-3 py-1.5 bg-light rounded-md text-sm text-gray-700">
            Booking #{String(b._id || "").slice(-5) || "—"}
          </p>

          <span
            className={`px-3 py-1 text-xs rounded-full capitalize
            ${statusStyles[statusLabel] || "bg-gray-200 text-gray-700 border border-gray-300"}`}
            title="Booking status"
          >
            {statusLabel}
          </span>

          {totalDays > 0 && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-50 text-gray-600 border border-bordercolor">
              {totalDays} day{totalDays > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Rental Period */}
        <div className="flex items-start gap-2 mt-4">
          <img
            src={assets.calendar_icon_colored}
            alt=""
            className="w-4 h-4 mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Rental Period</p>
            <p className="text-gray-500">
              {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mt-3">
          <img
            src={assets.location_icon_colored}
            alt=""
            className="w-4 h-4 mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Pick-up Location</p>
            <p className="text-gray-500">{car.location || "—"}</p>
          </div>
        </div>
      </div>

      {/* ================================
                PRICE
      ================================= */}
      <div className="md:col-span-1 flex flex-col justify-between">
        <div className="text-right">
          <p className="text-gray-500 text-sm">Total Price</p>

          <h2 className="text-2xl font-bold text-blue-600">
            {formatMoney(b.price)}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Booked on {formatDate(b.createdAt)}
          </p>

          {pricePerDay != null && (
            <p className="text-gray-500 text-xs mt-2">
              {formatMoney(pricePerDay)} / day
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;