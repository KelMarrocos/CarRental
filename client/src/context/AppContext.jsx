import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/*
  Axios global defaults
  - baseURL vem do .env (ex: http://localhost:3000)
  - Authorization será setado quando houver token
*/
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  /*
    Navegação global (para redirecionar em fluxos de auth e etc).
    Observação: AppProvider precisa estar dentro do <BrowserRouter />
    (você já está fazendo isso no main.jsx)
  */
  const navigate = useNavigate();

  /*
    Configs globais
    - moeda vem do .env (VITE_CURRENCY=$)
  */
  const currency = import.meta.env.VITE_CURRENCY || "$";

  /*
    Auth + usuário
    - token: JWT salvo no localStorage
    - user: dados do usuário logado
    - isOwner: flag de role
  */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  /*
    UI state
    - showLogin: controla modal/tela de login
  */
  const [showLogin, setShowLogin] = useState(false);

  /*
    Filtros globais de busca/booking
  */
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  /*
    Dados globais
    - cars: lista de carros exibidos no app
  */
  const [cars, setCars] = useState([]);

  /*
    Helper: aplicar/remover Authorization do axios
    - seu backend já aceita token direto (sem "Bearer "), então mantive assim
    - se você padronizar para Bearer no backend, troque para: `Bearer ${token}`
  */
  const applyAuthHeader = (tokenValue) => {
  if (tokenValue) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

  /*
    Buscar dados do usuário logado
    - depende de Authorization estar setado
    - se falhar por token inválido/expirado, faz logout silencioso e volta pra Home
  */
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (!data?.success) {
        // Se o backend devolveu "success: false", trata como não autenticado
        logout(true);
        navigate("/");
        return;
      }

      setUser(data.user);
      setIsOwner(data.user?.role === "owner");
    } catch (error) {
      // Erros de rede ou 401/403
      const msg =
        error?.response?.data?.message || error?.message || "Failed to load user";
      toast.error(msg);

      // Se for erro de auth (comum em token expirado), limpa sessão
      if ([401, 403].includes(error?.response?.status)) {
        logout(true);
        navigate("/");
      }
    }
  };

  /*
    Buscar carros do servidor
    - endpoint público (não depende de token, pelo seu código)
  */
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data?.success) setCars(data.cars);
      else toast.error(data?.message || "Failed to fetch cars");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Failed to fetch cars";
      toast.error(msg);
    }
  };

  /*
    Logout
    - remove token local
    - limpa estados do usuário
    - remove Authorization do axios
    - opcional: não mostrar toast (útil em token expirado)
  */
  const logout = (silent = false) => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    applyAuthHeader(null);

    if (!silent) toast.success("You have been logged out");
  };

  /*
    Bootstrap inicial
    - carrega token do localStorage
    - já busca carros
  */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);

    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    Sempre que token mudar:
    - seta header Authorization
    - busca user (se houver token)
  */
  useEffect(() => {
  if (token) {
    // Padrão recomendado: Bearer
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}, [token]);

  /*
    value memoizado
    - evita rerender em cascata nos consumidores quando nada mudou
    - mantém interface estável para updates futuros
  */
  const value = useMemo(
    () => ({
      navigate,
      currency,

      // auth + user
      token,
      setToken,
      user,
      setUser,
      isOwner,
      setIsOwner,

      // ui
      showLogin,
      setShowLogin,

      // data
      cars,
      setCars,

      // booking filters
      pickupDate,
      setPickupDate,
      returnDate,
      setReturnDate,

      // actions
      fetchUser,
      fetchCars,
      logout,

      // axios (para uso opcional nos componentes)
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

/*
  Hook helper para consumir o contexto.
  - garante que você não precise importar useContext + AppContext em todo arquivo
*/
export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider />");
  }
  return ctx;
};