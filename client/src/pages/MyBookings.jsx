import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import BookingCard from "../components/BookingCard";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const navigate = useNavigate();
  const { axios, currency, token, setShowLogin } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const openLoginIfPossible = () => {
    if (typeof setShowLogin === "function") {
      setShowLogin(true);
    } else {
      toast.error("Login required.");
    }
  };

  const fetchMyBookings = async (opts = { silent: false }) => {
    // se não estiver logado, não faz request
    if (!token) {
      setBookings([]);
      setLoading(false);
      if (!opts.silent) toast("Please login to view your bookings.");
      openLoginIfPossible();
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/user");

      if (!data?.success) {
        toast.error(data?.message || "Failed to load bookings");
        setBookings([]);
        return;
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.message || error?.message || "Failed to load bookings";

      // token inválido/expirado
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again.");
        openLoginIfPossible();
        setBookings([]);
        return;
      }

      toast.error(msg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchMyBookings({ silent: true });
      toast.success("Updated!");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const SkeletonCard = () => (
    <div className="bg-white border border-bordercolor rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-24 h-16 rounded-xl bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
          <div className="h-3 w-40 bg-gray-200 rounded mt-3" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <Title
          title="My Bookings"
          subtitle="View and manage all your car bookings."
          align="left"
        />

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className={`text-sm px-4 py-2 rounded-lg border border-bordercolor transition
            ${refreshing || loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-8 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty */}
      {!loading && bookings.length === 0 && (
        <div className="mt-16 bg-white border border-bordercolor rounded-2xl p-10 text-center">
          <p className="text-gray-700 font-semibold text-base">
            You have no bookings yet
          </p>
          <p className="text-gray-500 mt-2">
            Pick a car you like and reserve it in seconds.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/cars")}
              className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary-dull transition"
            >
              Browse cars
            </button>

            {!token && (
              <button
                type="button"
                onClick={openLoginIfPossible}
                className="px-5 py-2 rounded-xl border border-bordercolor hover:bg-gray-50 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* List */}
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