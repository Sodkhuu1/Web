import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }

      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };
  //comment 
  return (
    <div style={{ maxWidth: 400, margin: "32px auto" }}>
      <h2>{mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}</h2>

      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            marginRight: 8,
            fontWeight: mode === "login" ? "bold" : "normal",
          }}
        >
          Нэвтрэх
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          style={{
            fontWeight: mode === "signup" ? "bold" : "normal",
          }}
        >
          Бүртгүүлэх
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 360 }}
      >
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Имэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
        />
        {mode === "signup" && (
          <input 
            type="url"
            placeholder="Зурагны URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        )}

        <button type="submit">
          {mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
        </button>
      </form>
    </div>
  );
}
