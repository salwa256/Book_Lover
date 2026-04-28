import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Akun khusus petugas
    const adminUsername = "Petugas";
    const adminPassword = "Petugas Perpus";

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem("isLogin", "true");
      navigate("/tambahbuku");
    } else {
      alert("Username atau Password salah!");
    }
  };

  return (
  <div className="login-wrapper">
    <div className="login-container">
      <h2>Login Petugas</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
);
};

export default Login;
