import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
      if (!raw) return null;
      const saved = JSON.parse(raw);

      if(saved && saved.id && !saved.userId) {
        return {
          userId: saved.id,
          name: saved.name,
          email: saved.email,
        };
      }
      return saved;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // LOGIN -> backend /api/users/login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Нэвтрэхэд алдаа гарлаа.");
    }

    const loggedInUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
    };

    setUser(loggedInUser);
    return loggedInUser;
  };

  // SIGNUP -> backend /api/users/signup
  const signup = async (name, email, password, image) => {
    const res = await fetch(`${API_BASE}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, image }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Бүртгэл үүсгэхэд алдаа гарлаа.");
    }

    const newUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
    };
    
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
