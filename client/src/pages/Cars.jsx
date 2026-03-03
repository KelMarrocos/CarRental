import React, { useEffect, useMemo, useRef, useState } from "react";
import Title from "../components/Title";
import { assets } from "../constants/assets";
import CarCard from "../components/CarCard";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const norm = (v) => String(v ?? "").trim().toLowerCase();

const Cars = () => {
  const { axios, cars: carsFromContext = [] } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // dropdown filtro na página
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);

  // lê params
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get("q") || "",
      category: params.get("category") || "",
      transmission: params.get("transmission") || "",
      fuel: params.get("fuel") || "",
      maxPrice: params.get("maxPrice") || "",
    };
  }, [location.search]);

  // estados controlados (espelham URL)
  const [input, setInput] = useState(urlParams.q);
  const [category, setCategory] = useState(urlParams.category);
  const [transmission, setTransmission] = useState(urlParams.transmission);
  const [fuel, setFuel] = useState(urlParams.fuel);
  const [maxPrice, setMaxPrice] = useState(urlParams.maxPrice);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Opções dinâmicas (do que existe mesmo)
  const options = useMemo(() => {
    const uniq = (arr) =>
      Array.from(new Set(arr.map((x) => String(x ?? "").trim()).filter(Boolean)));

    // prioridade: cars do context (já carregados), fallback: cars do fetch local
    const base = (carsFromContext?.length ? carsFromContext : cars) || [];

    return {
      categories: uniq(base.map((c) => c.category)),
      transmissions: uniq(base.map((c) => c.transmission)),
      fuels: uniq(base.map((c) => c.fuel_type)),
    };
  }, [carsFromContext, cars]);

  // ✅ Sync quando URL mudar (mantém navbar/página alinhados)
  useEffect(() => {
    setInput(urlParams.q);
    setCategory(urlParams.category);
    setTransmission(urlParams.transmission);
    setFuel(urlParams.fuel);
    setMaxPrice(urlParams.maxPrice);
  }, [urlParams.q, urlParams.category, urlParams.transmission, urlParams.fuel, urlParams.maxPrice]);

  // fecha dropdown clicando fora
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!filtersOpen) return;
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [filtersOpen]);

  // fetch cars
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

        // só disponíveis
        const list = (data.cars || []).filter((c) => {
          if (typeof c.isAvailable === "boolean") return c.isAvailable;
          if (typeof c.isAvaliable === "boolean") return c.isAvaliable;
          return true;
        });

        setCars(list);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Failed to load cars");
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [axios]);

  // helper: atualizar URL preservando tudo
  const setUrlParams = (next, replace = true) => {
    const params = new URLSearchParams(location.search);

    Object.entries(next).forEach(([k, v]) => {
      const val = String(v ?? "").trim();
      if (val) params.set(k, val);
      else params.delete(k);
    });

    const qs = params.toString();
    navigate(qs ? `/cars?${qs}` : "/cars", { replace });
  };

  // Apply e Clear (página)
  const applyFilters = () => {
    setUrlParams({
      q: input,
      category,
      transmission,
      fuel,
      maxPrice,
    });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setCategory("");
    setTransmission("");
    setFuel("");
    setMaxPrice("");
    setUrlParams({ category: "", transmission: "", fuel: "", maxPrice: "" });
    setFiltersOpen(false);
  };

  // quando digitar, atualiza só q com debounce (não explode history)
  useEffect(() => {
    const t = setTimeout(() => {
      setUrlParams({ q: input });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // lista filtrada
  const filteredCars = useMemo(() => {
    const q = norm(input);
    const c = norm(category);
    const t = norm(transmission);
    const f = norm(fuel);

    const max =
      maxPrice !== "" && !Number.isNaN(Number(maxPrice)) ? Number(maxPrice) : null;

    return cars.filter((car) => {
      if (q) {
        const hay = [
          car.brand,
          car.model,
          car.category,
          car.transmission,
          car.fuel_type,
          car.location,
          car.description,
        ]
          .filter(Boolean)
          .join(" ");
        if (!norm(hay).includes(q)) return false;
      }

      if (c && norm(car.category) !== c) return false;
      if (t && norm(car.transmission) !== t) return false;
      if (f && norm(car.fuel_type) !== f) return false;

      if (max !== null) {
        const p = Number(car.pricePerDay);
        if (Number.isNaN(p)) return false;
        if (p > max) return false;
      }

      return true;
    });
  }, [cars, input, category, transmission, fuel, maxPrice]);

  return (
    <div className="bg-light min-h-screen">
      {/* HERO */}
      <div className="flex flex-col items-center py-20 max-md:px-4">
        <Title
          title="Available Cars"
          subtitle="Browse our select of premium vehicles available for your next adventure."
        />

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow relative">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500 bg-transparent"
          />

          {/* botão filtro */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((p) => !p)}
              className="h-9 w-9 rounded-full grid place-items-center hover:bg-gray-50 transition"
              title="Filters"
            >
              <img src={assets.filter_icon} alt="" className="opacity-90" />
            </button>

            {filtersOpen && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-bordercolor rounded-2xl shadow-lg p-4 z-50">
                <p className="text-sm font-semibold text-gray-800 mb-3">Filters</p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-bordercolor rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="">All</option>
                      {options.categories.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full border border-bordercolor rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="">All</option>
                      {options.transmissions.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Fuel</label>
                    <select
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      className="w-full border border-bordercolor rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="">All</option>
                      {options.fuels.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max price / day</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="e.g. 300"
                      className="w-full border border-bordercolor rounded-lg px-3 py-2 text-sm outline-none"
                      min={0}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-2 rounded-lg border border-bordercolor text-sm hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={applyFilters}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dull transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* chips de filtros ativos */}
        {(category || transmission || fuel || maxPrice) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
            {category && <span className="px-3 py-1 rounded-full bg-white border">Category: <b>{category}</b></span>}
            {transmission && <span className="px-3 py-1 rounded-full bg-white border">Transmission: <b>{transmission}</b></span>}
            {fuel && <span className="px-3 py-1 rounded-full bg-white border">Fuel: <b>{fuel}</b></span>}
            {maxPrice && <span className="px-3 py-1 rounded-full bg-white border">Max/day: <b>{maxPrice}</b></span>}
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-1 rounded-full bg-white border hover:bg-gray-50 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* LISTAGEM */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-26 max-w-7xl mx-auto">
          Showing {loading ? "..." : filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-6">
          {loading && (
            <>
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse" />
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse" />
              <div className="h-72 bg-white border border-bordercolor rounded-xl animate-pulse hidden lg:block" />
            </>
          )}

          {!loading && filteredCars.map((car) => <CarCard key={car._id} car={car} />)}

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