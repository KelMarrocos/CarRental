import React, { useState } from "react";
import "./modern-login.css";
import { assets } from "../../constants";

/*
  LOGIN PAGE — versão funcional

  Agora tem:
  ✔ alternar login / registro
  ✔ confirmar senha
  ✔ validação básica
  ✔ preparado pra API futura
*/

const Login = ({ onClose }) => {

  const [isActive, setIsActive] = useState(false);

  // estados formulário
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // handlers
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // submit login
  const handleSignIn = (e) => {
    e.preventDefault();

    console.log("LOGIN:", loginData);

    // FUTURO:
    // await api.post("/auth/login", loginData)
  };

  // submit register
  const handleSignUp = (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    console.log("REGISTER:", registerData);

    // FUTURO:
    // await api.post("/auth/register", registerData)
  };

  return (
    <section className="login-page">
      <div className={`container ${isActive ? "active" : ""}`}>

        {/* REGISTER */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            {/* LOGO */}
            <img
              src={assets.logo}
              alt="CarRental"
              className="login-logo"
            />

            <h1>Create Account</h1>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={registerData.name}
              onChange={handleRegisterChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={registerData.email}
              onChange={handleRegisterChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={handleRegisterChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
            />

            <button type="submit">Create Account</button>
          </form>
        </div>

        {/* LOGIN */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            {/* LOGO */}
             <img
              src={assets.logo}
              alt="CarRental"
              className="login-logo"
            />

            <h1>Sign In</h1>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={loginData.email}
              onChange={handleLoginChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={handleLoginChange}
            />

            <a href="#">Forgot your password?</a>

            <button type="submit">Sign In</button>
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