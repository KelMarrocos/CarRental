import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cars, setCars] = useState([]);

  // UM ÚNICO lugar pra aplicar/remover Authorization
  const applyAuthHeader = (tokenValue) => {
    if (tokenValue) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const logout = (silent = false) => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    applyAuthHeader(null);
    if (!silent) toast.success("You have been logged out");
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (!data?.success) {
        logout(true);
        navigate("/");
        return;
      }

      setUser(data.user);
      setIsOwner(data.user?.role === "owner");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Failed to load user";
      toast.error(msg);

      if ([401, 403].includes(error?.response?.status)) {
        logout(true);
        navigate("/");
      }
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data?.success) setCars(data.cars || []);
      else toast.error(data?.message || "Failed to fetch cars");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Failed to fetch cars";
      toast.error(msg);
    }
  };

  // Bootstrap: já lê token + aplica header ANTES de qualquer página disparar request
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      applyAuthHeader(storedToken);
      setToken(storedToken); // dispara fetchUser no effect de baixo
    } else {
      applyAuthHeader(null);
    }

    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Sempre que token mudar: aplica header + busca user
  useEffect(() => {
    applyAuthHeader(token);

    if (token) fetchUser();
    else {
      setUser(null);
      setIsOwner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      navigate,
      currency,

      token,
      setToken,
      user,
      setUser,
      isOwner,
      setIsOwner,

      showLogin,
      setShowLogin,

      cars,
      setCars,

      pickupDate,
      setPickupDate,
      returnDate,
      setReturnDate,

      fetchUser,
      fetchCars,
      logout,

      axios,
    }),
    [
      navigate,
      currency,
      token,
      user,
      isOwner,
      showLogin,
      cars,
      pickupDate,
      returnDate,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider />");
  return ctx;
};