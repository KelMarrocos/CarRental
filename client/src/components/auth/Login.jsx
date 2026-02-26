import React, { useState } from "react";
import "./modern-login.css";
import { assets } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const persistToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token); // seu AppContext já tem useEffect que seta Authorization + fetchUser
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const payload = {
        email: loginData.email.trim(),
        password: loginData.password,
      };

      // AJUSTE A ROTA SE PRECISAR
      const { data } = await axios.post("/api/user/login", payload);

      if (!data?.success) {
        toast.error(data?.message || "Login failed");
        return;
      }

      if (!data?.token) {
        toast.error("Server did not return a token");
        return;
      }

      persistToken(data.token);
      toast.success(data?.message || "Logged in!");
      setShowLogin(false);

      // opcional: limpar form
      setLoginData({ email: "", password: "" });
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      };

      // AJUSTE A ROTA SE PRECISAR
      const { data } = await axios.post("/api/user/register", payload);

      if (!data?.success) {
        toast.error(data?.message || "Register failed");
        return;
      }

      // Se o backend já devolve token no register, loga direto:
      if (data?.token) {
        persistToken(data.token);
        toast.success(data?.message || "Account created!");
        setShowLogin(false);
      } else {
        // Se NÃO devolver token, só muda pra tela de login
        toast.success(data?.message || "Account created! Please sign in.");
        setIsActive(false);
      }

      // opcional: limpar form
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Register failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* REGISTER */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <img src={assets.logo} alt="CarRental" className="login-logo" />

            <h1>Create Account</h1>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={registerData.name}
              onChange={handleRegisterChange}
              disabled={loading}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={registerData.email}
              onChange={handleRegisterChange}
              disabled={loading}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={handleRegisterChange}
              disabled={loading}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* LOGIN */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <img src={assets.logo} alt="CarRental" className="login-logo" />

            <h1>Sign In</h1>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={loginData.email}
              onChange={handleLoginChange}
              disabled={loading}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={handleLoginChange}
              disabled={loading}
            />

            <a href="#">Forgot your password?</a>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* TOGGLE PANEL */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button
                type="button"
                className="ghost"
                onClick={() => setIsActive(false)}
                disabled={loading}
              >
                Sign In
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Create an account to start booking cars</p>
              <button
                type="button"
                className="ghost"
                onClick={() => setIsActive(true)}
                disabled={loading}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;