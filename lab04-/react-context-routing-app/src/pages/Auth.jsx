import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    const to = location.state?.from?.pathname || "/";
    navigate(to, { replace: true });
  };

  return (
    <div>
      <h2>Нэвтрэх / Бүртгүүлэх</h2>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:8, maxWidth:360}}>
        <input type="email" placeholder="Имэйл" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Нууц үг" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={4}/>
        <button type="submit">Нэвтрэх</button>
      </form>
    </div>
  );
}