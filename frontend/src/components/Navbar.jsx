import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, LayoutDashboard, Search, Home, MapPin, Menu, X } from "lucide-react";

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
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-primary w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-white text-lg tracking-wider">
              VH
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-secondary">
              VenueHub
            </span>
          </Link>

          {/* Location / Search (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-grow max-w-md mx-8">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Marriage Hall, Gaming, Restaurant..." 
              className="bg-transparent border-none outline-none text-sm w-full ml-2 text-darkText placeholder-gray-400"
            />
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <div className="flex items-center text-sm font-medium text-darkText whitespace-nowrap cursor-pointer hover:text-primary transition-colors">
              <MapPin size={16} className="mr-1 text-primary" />
              Chennai
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-4">
            {user && user.role === "owner" && (
              <Link to="/owner" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5 text-sm font-medium">
                <LayoutDashboard size={16} /> Owner Panel
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5 text-sm font-medium">
                <LayoutDashboard size={16} /> Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-darkText">{user.name}</p>
                  <p className="text-xs text-primary capitalize">{user.role}</p>
                </div>
                <Link to="/account" className="bg-lightGray p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors">
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="btn-secondary py-1.5 px-5 text-sm rounded-full">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-5 text-sm rounded-full">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {!user && (
               <Link to="/login" className="text-primary text-sm font-semibold">Login</Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full z-50">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search venues..." 
              className="bg-transparent border-none outline-none text-sm w-full ml-2 text-darkText placeholder-gray-400"
            />
          </div>

          {user && (
            <>
              {user.role === "owner" && (
                <Link
                  to="/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-primary py-2 text-sm font-medium"
                >
                  Owner Panel
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-primary py-2 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          {user && (
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-lightGray p-3 rounded-full text-primary">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-darkText">{user.name}</p>
                  <p className="text-xs text-primary capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogoutClick} className="btn-secondary bg-red-50 text-red-500 hover:bg-red-100 border-none w-full flex items-center justify-center gap-2 py-2 mt-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
