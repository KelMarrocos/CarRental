import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import BookingCard from "../components/BookingCard";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/user/bookings");

      if (!data?.success) {
        toast.error(data?.message || "Failed to load bookings");
        setBookings([]);
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to load bookings"
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 
      mt-16 text-sm max-w-7xl mx-auto"
    >
      <Title
        title="My Bookings"
        subtitle="View and manage all your car bookings."
        align="left"
      />

      {/* refresh */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={fetchMyBookings}
          className="text-sm px-4 py-2 rounded-lg border border-bordercolor hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      {/* loading */}
      {loading && (
        <div className="mt-10 text-gray-500">Loading bookings...</div>
      )}

      {/* empty */}
      {!loading && bookings.length === 0 && (
        <div className="mt-20 text-center text-gray-500">
          You have no bookings yet.
        </div>
      )}

      {/* list */}
      {!loading && bookings.length > 0 && (
        <div className="mt-10 space-y-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              currency={currency || "$"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;