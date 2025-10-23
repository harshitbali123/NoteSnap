import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function rehydrate() {
    try {
      const res = await fetch("http://localhost:5000/user/profile", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn("Failed to rehydrate auth", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
