import React, { useEffect, useMemo, useRef, useState } from "react";
import { assets, menuLinks } from "../constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

// normaliza para comparar
const norm = (v) => String(v ?? "").trim().toLowerCase();
const normalizeLabel = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  return s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
};

const Navbar = ({ setShowLogin: setShowLoginProp }) => {
  const {
    setShowLogin: setShowLoginFromContext,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
    token,
    cars: carsFromContext = [],
  } = useAppContext();

  const setShowLogin =
    typeof setShowLoginProp === "function"
      ? setShowLoginProp
      : typeof setShowLoginFromContext === "function"
      ? setShowLoginFromContext
      : null;

  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // Search + Filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterBoxRef = useRef(null);

  const isHome = location.pathname === "/";

  // opções dinâmicas iguais ao Cars.jsx
  const options = useMemo(() => {
    const addUnique = (set, value) => {
      const label = normalizeLabel(value);
      if (!label) return;
      set.add(label);
    };

    const categories = new Set();
    const transmissions = new Set();
    const fuels = new Set();

    (carsFromContext || []).forEach((c) => {
      addUnique(categories, c?.category);
      addUnique(transmissions, c?.transmission);
      addUnique(fuels, c?.fuel_type);
    });

    const sortAZ = (a, b) => a.localeCompare(b);

    return {
      categories: Array.from(categories).sort(sortAZ),
      transmissions: Array.from(transmissions).sort(sortAZ),
      fuels: Array.from(fuels).sort(sortAZ),
    };
  }, [carsFromContext]);

  // URL -> state (sempre sincronizado)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setQuery(params.get("q") || "");
    setCategory(params.get("category") || "");
    setTransmission(params.get("transmission") || "");
    setFuel(params.get("fuel") || "");
    setMaxPrice(params.get("maxPrice") || "");
  }, [location.search]);

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!filtersOpen) return;
      if (filterBoxRef.current && !filterBoxRef.current.contains(e.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [filtersOpen]);

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleListCarsClick = () => {
    setOpen(false);

    if (isOwner) return navigate("/owner");

    if (!token) {
      if (!setShowLogin) return toast.error("Login modal handler is missing.");
      setShowLogin(true);
      return;
    }

    changeRole();
  };

  const handleLoginClick = () => {
    setOpen(false);

    if (user) return logout();

    if (!setShowLogin) return toast.error("Login modal handler is missing.");
    setShowLogin(true);
  };

  // helper: navegar para /cars com params
  const goToCarsWithParams = (paramsObj, replace = false) => {
    const params = new URLSearchParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      const v = String(value ?? "").trim();
      if (v) params.set(key, v);
    });

    const qs = params.toString();
    navigate(qs ? `/cars?${qs}` : "/cars", { replace });
  };

  const submitSearch = () => {
    setOpen(false);

    goToCarsWithParams({
      q: query,
      category,
      transmission,
      fuel,
      maxPrice,
    });
  };

  const applyFilters = () => {
    setFiltersOpen(false);
    submitSearch();
  };

  const clearFilters = () => {
    setCategory("");
    setTransmission("");
    setFuel("");
    setMaxPrice("");
    goToCarsWithParams({ q: query }, true);
    setFiltersOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between
      px-6 md:px-16 lg:px-24 xl:px-32 py-4
      text-gray-600 border-b border-bordercolor
      ${isHome ? "bg-light" : "bg-white"}`}
    >
      <Link to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} alt="Company logo" className="h-8" />
      </Link>

      <nav
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 
        max-sm:border-t border-bordercolor right-0 flex flex-col sm:flex-row 
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-transform 
        duration-300 z-50 ${isHome ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="hover:text-gray-900 transition"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Search + Filter (desktop) */}
        <div
          className={`hidden lg:flex items-center text-sm gap-2 border border-bordercolor
          px-3 rounded-full w-[340px] h-10 ${isHome ? "bg-light" : "bg-white"}`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitSearch();
              }
            }}
            className="w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars..."
          />

          <div className="relative" ref={filterBoxRef}>
            <button
              type="button"
              onClick={() => setFiltersOpen((p) => !p)}
              className="h-9 w-9 rounded-full grid place-items-center hover:bg-gray-50 transition"
              title="Filters"
            >
              <img src={assets.filter_icon} alt="filters" className="opacity-90" />
            </button>

            {filtersOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-[320px]
                bg-white border border-bordercolor rounded-2xl shadow-lg p-4 z-50"
              >
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
                      {options.categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
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
                      {options.transmissions.map((t) => (
                        <option key={t} value={t}>{t}</option>
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
                      {options.fuels.map((f) => (
                        <option key={f} value={f}>{f}</option>
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

          <button
            type="button"
            onClick={submitSearch}
            className="h-9 w-9 rounded-full grid place-items-center hover:bg-gray-50 transition"
            title="Search"
          >
            <img src={assets.search_icon} alt="search" className="opacity-90" />
          </button>
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={handleListCarsClick}
            className="cursor-pointer hover:text-gray-900 transition"
            type="button"
          >
            {isOwner ? "Dashboard" : user ? "Become Owner" : "List cars"}
          </button>

          <button
            onClick={handleLoginClick}
            className="cursor-pointer px-8 py-2 bg-primary 
            hover:bg-primary-dull transition text-white rounded-lg"
            type="button"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </nav>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Toggle menu"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="" />
      </button>
    </header>
  );
};

export default Navbar;