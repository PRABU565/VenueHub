import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Component files
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page files
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VenueDetails from "./pages/VenueDetails";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BudgetPlanner from "./pages/BudgetPlanner";

// Auth Gate for Guest Customers
const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

// Auth Gate for Owners and Admins
const ProtectedOwnerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && (user.role === "owner" || user.role === "admin") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

// Auth Gate exclusively for Admins
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === "admin" ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Paths */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/venue/:id" element={<VenueDetails />} />
              <Route path="/budget-planner" element={<BudgetPlanner />} />

              {/* Guarded Paths */}
              <Route
                path="/bookings"
                element={
                  <ProtectedUserRoute>
                    <UserDashboard />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/owner"
                element={
                  <ProtectedOwnerRoute>
                    <OwnerDashboard />
                  </ProtectedOwnerRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Redirect fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
