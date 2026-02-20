// pages/owner/ManageBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../constants/assets";
import { dummyMyBookingsData } from "../../data/mockData";

/*
  ManageBookings (Owner)
  ----------------------
  Objetivo:
  ✔ listar reservas do dono
  ✔ permitir aprovar / cancelar (mock agora, API depois)
  ✔ UX: status com cores + hover, responsivo e fácil de manter

  FUTURO (API):
  - fetchOwnerBookings(): GET /owner/bookings
  - updateBookingStatus(id, status): PATCH /bookings/:id
*/

const statusStyles = {
  confirmed: "bg-green-500/10 text-green-700 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

const statusLabel = (s) => {
  if (!s) return "unknown";
  const v = String(s).toLowerCase();
  if (v === "confirmed") return "confirmed";
  if (v === "pending") return "pending";
  if (v === "cancelled" || v === "canceled") return "cancelled";
  return v;
};

const formatDate = (d) => {
  if (!d) return "-";
  // seu mock às vezes é "2025-06-13" e às vezes tem T
  return String(d).split("T")[0];
};

const ManageBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // dados
  const [bookings, setBookings] = useState([]);

  // loading UI simples
  const [loading, setLoading] = useState(true);

  // busca bookings (mock agora)
  const fetchOwnerBookings = async () => {
    setLoading(true);

    // simulando uma “latência” pequena pra skeleton fazer sentido
    setTimeout(() => {
      setBookings(dummyMyBookingsData);
      setLoading(false);
    }, 250);
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  // total (para header)
  const total = useMemo(() => bookings.length, [bookings]);

  /*
    Atualiza status (mock)
    ---------------------
    Futuro: chama API e depois atualiza state com resposta
  */
  const updateStatus = (bookingId, nextStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: nextStatus } : b
      )
    );
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Header: count + refresh */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-800">{total}</span>{" "}
          bookings
        </p>

        <button
          type="button"
          onClick={fetchOwnerBookings}
          className="px-4 py-2 rounded-xl border border-bordercolor text-sm
          hover:bg-gray-50 transition hover:-translate-y-0.5 hover:shadow-sm"
        >
          Refresh
        </button>
      </div>

      {/* Skeleton (loading) */}
      {loading && (
        <div className="mt-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-bordercolor rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-52 bg-gray-100 animate-pulse rounded" />
                  <div className="h-3 w-40 bg-gray-100 animate-pulse rounded" />
                  <div className="h-3 w-28 bg-gray-100 animate-pulse rounded" />
                </div>
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo */}
      {!loading && (
        <>
          {/* MOBILE: cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
            {bookings.map((b) => {
              const s = statusLabel(b.status);

              return (
                <article
                  key={b._id}
                  className="bg-white border border-bordercolor rounded-xl p-4
                  hover:shadow-md transition hover:-translate-y-0.5"
                >
                  {/* Top: car */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-bordercolor">
                      <img
                        src={b.car?.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {b.car?.brand} {b.car?.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.car?.year} • {b.car?.category} • {b.car?.location}
                      </p>
                    </div>
                  </div>

                  {/* Middle: info */}
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.calendar_icon_colored}
                        alt=""
                        className="w-4 h-4"
                      />
                      <p>
                        {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Total:{" "}
                        <span className="font-semibold text-primary">
                          {currency}{b.price}
                        </span>
                      </p>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-medium
                        ${statusStyles[s] || "bg-gray-100 text-gray-600 border-gray-200"}
                        transition hover:scale-[1.03]`}
                      >
                        {s}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      Booked on {formatDate(b.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(b._id, "confirmed")}
                      className="flex-1 px-4 py-2 rounded-xl text-sm font-medium
                      bg-primary text-white hover:bg-primary-dull
                      transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(b._id, "cancelled")}
                      className="flex-1 px-4 py-2 rounded-xl text-sm font-medium
                      border border-bordercolor hover:bg-gray-50
                      transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* DESKTOP: table */}
          <div className="mt-6 hidden md:block">
            <div className="w-full rounded-xl overflow-hidden border border-bordercolor bg-white">
              <table className="w-full border-collapse text-left text-sm text-gray-600">
                <thead className="text-gray-500 bg-light">
                  <tr>
                    <th className="p-4 font-medium">Car</th>
                    <th className="p-4 font-medium">Rental period</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => {
                    const s = statusLabel(b.status);

                    return (
                      <tr
                        key={b._id}
                        className="border-t border-bordercolor hover:bg-gray-50/60 transition"
                      >
                        {/* Car */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-bordercolor">
                              <img
                                src={b.car?.image}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {b.car?.brand} {b.car?.model}
                              </p>
                              <p className="text-xs text-gray-500">
                                {b.car?.year} • {b.car?.category} • {b.car?.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Period */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={assets.calendar_icon_colored}
                              alt=""
                              className="w-4 h-4"
                            />
                            <p>
                              {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Booked on {formatDate(b.createdAt)}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <p className="font-semibold text-primary">
                            {currency}{b.price}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium
                            ${statusStyles[s] || "bg-gray-100 text-gray-600 border-gray-200"}
                            transition hover:scale-[1.03]`}
                          >
                            {s}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => updateStatus(b._id, "confirmed")}
                              className="px-4 py-2 rounded-xl text-sm font-medium
                              bg-primary text-white hover:bg-primary-dull
                              transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                            >
                              Confirm
                            </button>

                            <button
                              type="button"
                              onClick={() => updateStatus(b._id, "cancelled")}
                              className="px-4 py-2 rounded-xl text-sm font-medium
                              border border-bordercolor hover:bg-gray-50
                              transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {bookings.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-gray-500" colSpan={5}>
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBookings;