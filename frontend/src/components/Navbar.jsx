import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User, LayoutDashboard, Search, Home, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-brand-950/80 backdrop-blur-md border-b border-brand-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-gradient-to-br from-brand-500 to-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-brand-100 text-lg tracking-wider shadow-brand-glow">
              VH
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-brand-200 via-brand-300 to-indigo-400 bg-clip-text text-transparent">
              VenueHub
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-brand-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
              <Home size={16} /> Home
            </Link>
            <Link to="/search" className="text-slate-300 hover:text-brand-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
              <Search size={16} /> Find Venues
            </Link>
            <Link to="/budget-planner" className="text-slate-300 hover:text-brand-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
              <Sparkles size={16} className="text-brand-400 animate-pulse" /> Budget Planner
            </Link>

            {user && (
              <>
                <Link to="/bookings" className="text-slate-300 hover:text-brand-300 transition-colors text-sm font-medium">
                  My Bookings
                </Link>

                {user.role === "owner" && (
                  <Link to="/owner" className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
                    <LayoutDashboard size={16} /> Owner Panel
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link to="/admin" className="text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1.5 text-sm font-medium">
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-brand-100">{user.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg text-slate-400 border border-slate-800">
                  <User size={16} />
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="text-slate-400 hover:text-red-400 hover:bg-slate-900/50 p-2 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-xs">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-xs">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-brand-300 p-2 rounded-lg hover:bg-brand-900/30"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-900/30 bg-brand-950/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-brand-300 py-2 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-brand-300 py-2 text-sm font-medium"
          >
            Find Venues
          </Link>
          <Link
            to="/budget-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-brand-300 hover:text-brand-400 py-2 text-sm font-medium"
          >
            ★ Budget Planner
          </Link>

          {user && (
            <>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-brand-300 py-2 text-sm font-medium"
              >
                My Bookings
              </Link>
              {user.role === "owner" && (
                <Link
                  to="/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-brand-400 hover:text-brand-300 py-2 text-sm font-medium"
                >
                  Owner Panel
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-accent-400 hover:text-accent-300 py-2 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          {user ? (
            <div className="border-t border-brand-900/30 pt-4 flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-100">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
              <button onClick={handleLogoutClick} className="btn-secondary w-full text-red-400 flex items-center justify-center gap-2 py-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-brand-900/30 pt-4 grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary text-center py-2">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center py-2">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
