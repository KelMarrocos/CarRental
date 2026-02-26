import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../constants/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ManageCars = () => {
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Helpers
  ========================== */
  const formatPrice = (value) => `${currency || "$"} ${value}`;
  const getStatus = (car) => (car.isAvailable ? "Available" : "Unavailable");

  const getStatusClasses = (status) => {
    if (status === "Available") {
      return "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/15";
    }
    return "bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/15";
  };

  /* =========================
     API
  ========================== */
  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/owner/cars");

      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch owner cars");
        setCars([]);
        return;
      }

      setCars(data.cars || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to fetch cars"
      );
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (carId) => {
  // otimista (UI muda na hora)
  setCars((prev) =>
    prev.map((c) => (c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c))
  );

  try {
    const { data } = await axios.patch(`/api/owner/car/${carId}/toggle`);

    if (!data?.success) throw new Error(data?.message || "Toggle failed");

    toast.success(data?.message || "Availability updated");
  } catch (error) {
    // rollback
    setCars((prev) =>
      prev.map((c) => (c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c))
    );
    toast.error(error?.response?.data?.message || error?.message || "Failed to toggle");
  }
};

  const handleDelete = async (carId) => {
    // (simples) confirma com o browser — depois você pode trocar por modal bonito
    const ok = window.confirm("Remove this car?");
    if (!ok) return;

    // otimista
    const before = cars;
    setCars((prev) => prev.filter((c) => c._id !== carId));

    try {
      const { data } = await axios.delete(`/api/owner/car/${carId}`);

      if (!data?.success) {
        throw new Error(data?.message || "Delete failed");
      }

      toast.success(data?.message || "Car removed");
    } catch (error) {
      setCars(before); // reverte
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to delete"
      );
    }
  };

  useEffect(() => {
    fetchOwnerCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     UI pieces
  ========================== */
  const SkeletonRow = () => (
    <tr className="border-t border-bordercolor">
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-28 bg-gray-200 rounded mt-2 animate-pulse hidden md:block" />
          </div>
        </div>
      </td>
      <td className="p-3 max-md:hidden">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-3">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-3 max-md:hidden">
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2 justify-end">
          <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );

  const EmptyState = () => (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <img
          src={assets.carIconColored || assets.car_icon}
          alt=""
          className="w-7 h-7"
        />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-800">
        No cars listed yet
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Add your first car to start receiving bookings.
      </p>

      <button
        type="button"
        onClick={() => navigate("/owner/add-car")}
        className="mt-6 px-5 py-2 rounded-xl bg-primary text-white
        hover:bg-primary-dull transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
      >
        Add new car
      </button>
    </div>
  );

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="max-w-5xl w-full rounded-xl overflow-hidden border border-bordercolor mt-6 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-bordercolor">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="text-gray-800 font-medium">{cars.length}</span> cars
          </p>

          <button
            type="button"
            onClick={fetchOwnerCars}
            className="text-sm px-4 py-2 rounded-lg border border-bordercolor
            hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium max-md:hidden">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {!loading && cars.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState />
                  </td>
                </tr>
              )}

              {!loading &&
                cars.map((car) => {
                  const status = getStatus(car);

                  return (
                    <tr
                      key={car._id}
                      className="border-t border-bordercolor hover:bg-gray-50/60 transition"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                            <img
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {car.brand} {car.model}
                            </p>

                            <p className="text-xs text-gray-500 truncate hidden md:block">
                              {car.seating_capacity} Seats • {car.transmission}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 max-md:hidden">{car.category}</td>

                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {formatPrice(car.pricePerDay)}
                          </span>
                          <span className="text-xs text-gray-500">per day</span>
                        </div>
                      </td>

                      <td className="p-3 max-md:hidden">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(car._id)}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            border text-xs font-medium transition
                            hover:-translate-y-[1px] hover:shadow-sm
                            ${getStatusClasses(status)}
                          `}
                          title="Toggle availability"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              status === "Available" ? "bg-green-600" : "bg-gray-500"
                            }`}
                          />
                          {status}
                        </button>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleToggleAvailability(car._id)}
                            className={`
                              px-3 py-1.5 rounded-md text-sm font-medium transition
                              ${
                                car.isAvailable
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }
                            `}
                          >
                            {car.isAvailable ? "Listed" : "Hidden"}
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate(`/owner/edit-car/${car._id}`)}
                            className="
                              h-10 w-10 flex items-center justify-center
                              rounded-lg border border-bordercolor bg-white
                              hover:bg-gray-900 group transition-all
                            "
                            title="Edit"
                          >
                            <img
                              src={assets.edit_icon}
                              alt="edit"
                              className="w-5 h-5 invert group-hover:invert-0"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(car._id)}
                            className="
                              h-10 w-10 flex items-center justify-center
                              rounded-lg border border-red-200 bg-red-50
                              hover:bg-red-100 transition hover:-translate-y-[1px] hover:shadow-sm
                            "
                            title="Delete"
                          >
                            <img
                              src={assets.delete_icon || assets.trash_icon}
                              alt="delete"
                              className="w-5 h-5 object-contain opacity-90"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(car._id)}
                            className="
                              h-10 px-3 rounded-lg border border-bordercolor bg-white
                              hover:bg-gray-50 transition hover:-translate-y-[1px] hover:shadow-sm
                              text-xs font-medium md:hidden
                            "
                            title="Toggle availability"
                          >
                            {status}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCars;