import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../constants/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

/*
  Dashboard (Owner/Admin)

  Responsável por:
  ✔ carregar métricas do painel
  ✔ exibir cards de resumo
  ✔ listar atividades recentes
*/

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const dashboardCards = useMemo(
    () => [
      { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
      { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
      { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
      { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
    ],
    [data]
  );

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/owner/dashboard");
      const payload = res?.data;

      if (!payload?.success) {
        toast.error(payload?.message || "Failed to load dashboard");
        return;
      }

      // ✅ seu controller retorna { success: true, data: {...} }
      setData(payload.data || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData(); // ✅ agora chama de verdade
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities."
      />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center gap-4 bg-white border border-bordercolor
            rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="bg-primary/10 p-3 rounded-lg">
              <img src={card.icon} alt="" className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full mt-10">
        {/* Recent bookings */}
        <div className="p-4 md:p-6 border border-bordercolor rounded-md max-w-lg w-full bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium">Recent Booking</h1>
              <p className="text-gray-500">Latest customer bookings</p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="text-sm px-4 py-2 rounded-lg border border-bordercolor hover:bg-gray-50 transition"
            >
              Refresh
            </button>
          </div>

          {loading && <p className="mt-6 text-sm text-gray-500">Loading...</p>}

          {!loading && (!data.recentBookings || data.recentBookings.length === 0) && (
            <p className="mt-6 text-sm text-gray-500">No recent bookings yet.</p>
          )}

          {!loading &&
            (data.recentBookings || []).map((booking) => (
              <div key={booking._id} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="hidden md:flex items-center justify-center w-12 h-12 
                    rounded-full bg-primary/10"
                  >
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-gray-900">
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(booking?.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-medium">
                  <p className="text-sm text-gray-700 font-semibold">
                    {currency || "$"} {booking?.price}
                  </p>

                  <span
                    className={`
                      px-3 py-0.5 rounded-full text-xs border font-medium
                      transition-all duration-200 ease-out
                      hover:scale-105 hover:shadow-sm
                      ${getStatusStyle(booking?.status)}
                    `}
                  >
                    {String(booking?.status || "unknown").charAt(0).toUpperCase() +
                      String(booking?.status || "unknown").slice(1)}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Monthly revenue */}
        <div className="p-4 md:p-6 mb-6 border border-bordercolor rounded-md w-full md:max-w-xs bg-white">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>

          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency || "$"}
            {loading ? "..." : data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;