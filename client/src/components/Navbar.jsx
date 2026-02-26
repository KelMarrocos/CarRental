import React, { useEffect, useState } from "react";
import { assets, menuLinks } from "../constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Navbar = ({ setShowLogin: setShowLoginProp }) => {
  const {
    setShowLogin: setShowLoginFromContext,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
    token,
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

  // estado do search
  const [query, setQuery] = useState("");

  const isHome = location.pathname === "/";

  // se já estiver em /cars e mudar o ?q=..., sincroniza o input
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (location.pathname === "/cars") setQuery(q);
  }, [location.pathname, location.search]);

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleListCarsClick = () => {
    setOpen(false);

    if (isOwner) {
      navigate("/owner");
      return;
    }

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

  // quando pesquisar (Enter ou click na lupa)
  const submitSearch = () => {
    const q = query.trim();
    // manda pra página /cars com querystring
    navigate(q ? `/cars?q=${encodeURIComponent(q)}` : "/cars");
    setOpen(false);
  };

  return (
    <header
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 
      py-4 text-gray-600 border-b border-bordercolor relative transition-all
      ${isHome ? "bg-light" : "bg-white"}`}
    >
      {/* Logo */}
      <Link to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} alt="Company logo" className="h-8" />
      </Link>

      {/* Menu */}
      <nav
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 
        max-sm:border-t border-bordercolor right-0 flex flex-col sm:flex-row 
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-transform 
        duration-300 z-50 ${isHome ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {/* Links */}
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

        {/* Search (desktop) */}
        <div
          className={`hidden lg:flex items-center text-sm gap-2 border 
          border-bordercolor px-3 rounded-full max-w-56
          ${isHome ? "bg-light" : "bg-white"}`}
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
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars..."
          />

          <button type="button" onClick={submitSearch} className="opacity-80 hover:opacity-100">
            <img src={assets.search_icon} alt="search" />
          </button>
        </div>

        {/* Actions */}
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

      {/* Mobile toggle */}
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