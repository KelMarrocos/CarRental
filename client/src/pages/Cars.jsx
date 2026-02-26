import React, { useEffect, useMemo, useState } from "react";
import Title from "../components/Title";
import { assets } from "../constants/assets";
import CarCard from "../components/CarCard";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Cars = () => {
  const { axios } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ pega q da URL (ex: /cars?q=tesla)
  const qFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  }, [location.search]);

  // ✅ input começa com q da URL
  const [input, setInput] = useState(qFromUrl);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ mantém input sincronizado se a URL mudar (ex: search no Navbar)
  useEffect(() => {
    setInput(qFromUrl);
  }, [qFromUrl]);

  // ✅ busca carros da API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/user/cars");

        if (!data?.success) {
          toast.error(data?.message || "Failed to load cars");
          setCars([]);
          return;
        }

        // opcional: só disponíveis (compat com typo antigo)
        const list = (data.cars || []).filter((c) => {
          if (typeof c.isAvailable === "boolean") return c.isAvailable;
          if (typeof c.isAvaliable === "boolean") return c.isAvaliable;
          return true;
        });

        setCars(list);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Failed to load cars"
        );
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [axios]);

  // ✅ lista filtrada (derivada)
  const filteredCars = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return cars;

    return cars.filter((car) => {
      const haystack = [
        car.brand,
        car.model,
        car.category,
        car.transmission,
        car.fuel_type,
        car.location,
        car.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [input, cars]);

  // ✅ atualiza URL quando digitar (sem ficar spammando history)
  // - atualiza só após pequena pausa (debounce simples)
  useEffect(() => {
    const t = setTimeout(() => {
      const q = input.trim();
      const params = new URLSearchParams(location.search);

      if (q) params.set("q", q);
      else params.delete("q");

      // replace: não cria mil entradas no histórico
      navigate(`/cars?${params.toString()}`, { replace: true });
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="bg-light min-h-screen">
      {/* HERO */}
      <div className="flex flex-col items-center py-20 max-md:px-4">
        <Title
          title="Available Cars"
          subtitle="Browse our select of premium vehicles available for your next adventure."
        />

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500 bg-transparent"
          />

          {/* limpar */}
          {input ? (
            <button
              type="button"
              onClick={() => setInput("")}
              className="text-gray-400 hover:text-gray-700 transition px-2"
              title="Clear"
            >
              ✕
            </button>
          ) : (
            <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
          )}
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-26 max-w-7xl mx-auto">
          Showing {loading ? "..." : filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-6">
          {/* Loading */}
          {loading && (
            <>
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse" />
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse" />
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse hidden lg:block" />
            </>
          )}

          {/* Resultados */}
          {!loading &&
            filteredCars.map((car) => <CarCard key={car._id} car={car} />)}

          {/* Empty */}
          {!loading && filteredCars.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No cars found{input ? (
                <>
                  {" "}for <span className="font-medium">"{input}"</span>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;