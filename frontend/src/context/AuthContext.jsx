import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Auto-load profile if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile load failed:", err.message);
        // Token expired or invalid, log out
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      showAlert(`Welcome back, ${receivedUser.name}!`, "success");
      return receivedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check credentials.";
      showAlert(errorMsg, "error");
      throw err;
    }
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      showAlert("Registration successful!", "success");
      return receivedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed.";
      showAlert(errorMsg, "error");
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    showAlert("Logged out successfully.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        alert,
        showAlert,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {/* Sleek Floating Alert System */}
      {alert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-slide-down">
          <div
            className={`backdrop-blur-md border px-4 py-3.5 rounded-xl shadow-lg flex items-center gap-3 ${
              alert.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
                : alert.type === "error"
                ? "bg-red-950/80 border-red-500/30 text-red-200"
                : "bg-indigo-950/80 border-indigo-500/30 text-indigo-200"
            }`}
          >
            {/* Visual Icon Indicators */}
            {alert.type === "success" ? (
              <span className="text-xl">✅</span>
            ) : alert.type === "error" ? (
              <span className="text-xl">❌</span>
            ) : (
              <span className="text-xl">ℹ️</span>
            )}
            <p className="text-sm font-medium tracking-wide flex-1">{alert.message}</p>
            <button
              onClick={() => setAlert(null)}
              className="text-slate-400 hover:text-slate-200 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
