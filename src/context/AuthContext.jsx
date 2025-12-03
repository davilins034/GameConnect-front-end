// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/v1/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação pelo backend (cookie enviado automaticamente)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          credentials: "include", // envia cookies httpOnly
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // -------------------------------
  // REGISTRO
  // -------------------------------
  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include", // aceita cookies httpOnly
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.msg };
      }

      return { success: false, message: data.msg || "Registration failed" };

    } catch (err) {
      return { success: false, message: "Network error or server unavailable" };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // LOGIN
  // -------------------------------
  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // cookies httpOnly do backend
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, message: data.msg || "Invalid credentials" };

    } catch (err) {
      return { success: false, message: "Network error or server unavailable" };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include", // limpa cookie httpOnly no backend
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
  };

  if (loading) {
    return <div>Loading Authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
