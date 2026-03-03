import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../constants";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Hero = () => {
  const navigate = useNavigate();
  const { axios, cars: carsFromContext = [], fetchCars } = useAppContext();

  // estados do form
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // garante que terá carros no context (pra montar as opções de location)
  useEffect(() => {
    if (!carsFromContext?.length && typeof fetchCars === "function") {
      fetchCars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // locations dinâmicos do que existe no banco (carros carregados)
  const locations = useMemo(() => {
    const uniq = new Set();

    (carsFromContext || []).forEach((c) => {
      const loc = String(c?.location ?? "").trim();
      if (loc) uniq.add(loc);
    });

    return Array.from(uniq).sort((a, b) => a.localeCompare(b));
  }, [carsFromContext]);

  // validações básicas (datas)
  const validateDates = () => {
    if (!pickupDate || !returnDate) return false;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    if (end <= start) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupLocation) {
      toast.error("Please select a location.");
      return;
    }

    if (!validateDates()) {
      toast.error("Return date must be after pick-up date.");
      return;
    }

    try {
      setSearchLoading(true);

      // chama o endpoint que checa disponibilidade real por datas
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to check availability");
        return;
      }

      const availableCount = Array.isArray(data.availableCars)
        ? data.availableCars.length
        : 0;

      if (availableCount === 0) {
        toast.error("No cars available for these dates in this location.");
        return;
      }

      toast.success(`${availableCount} car(s) available!`);

      // navega para /cars já com os parâmetros (Cars.jsx filtra)
      navigate(
        `/cars?location=${encodeURIComponent(
          pickupLocation
        )}&pickupDate=${pickupDate}&returnDate=${returnDate}`
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center">
        <h1
        className="
            mt-6 sm:mt-0
            text-3xl sm:text-4xl md:text-5xl
            font-semibold
            leading-tight
            px-4
            break-words
        "
        >
        Luxury cars on Rent
        </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-start md:items-center
          justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[800px]
          bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8">
          
          {/* LOCATION */}
            <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <label className="text-sm font-medium">Pickup Location</label>

            <select
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="
                border rounded-md px-2 py-2 text-sm
                w-full md:w-48
                bg-white
                "
            >
                <option value="">Select location</option>
                {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
                ))}
            </select>

            <p className="px-1 text-sm text-gray-500">
                {pickupLocation ? pickupLocation : "Please select location"}
            </p>
            </div>

          {/* PICKUP DATE */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date" className="text-sm font-medium">
              Pick-up Date
            </label>

            <input
              type="date"
              id="pickup-date"
              min={today}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="text-sm text-gray-500 border rounded-md px-2 py-1"
              required
            />
          </div>

          {/* RETURN DATE */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date" className="text-sm font-medium">
              Return Date
            </label>

            <input
              type="date"
              id="return-date"
              min={pickupDate || today} // retorno nunca antes do pickup
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm text-gray-500 border rounded-md px-2 py-1"
              required
            />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          disabled={searchLoading}
          className={`flex items-center justify-center gap-2 px-9 py-3
            max-sm:mt-4 bg-primary hover:bg-primary-dull text-white
            rounded-full cursor-pointer transition
            ${searchLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <img src={assets.search_icon} alt="" />
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </form>

      <img
        src={assets.main_car}
        alt="Luxury car"
        className="max-h-74 object-contain"
      />
    </section>
  );
};

export default Hero;