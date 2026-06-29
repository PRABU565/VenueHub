import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-950 border-t border-brand-900/30 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-brand-500 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-brand-100 text-xs shadow-md">
            VH
          </div>
          <span className="font-display font-semibold text-brand-200">
            VenueHub
          </span>
        </div>

        {/* Link navigation */}
        <div className="flex gap-6 text-sm text-slate-400">
          <Link to="/" className="hover:text-brand-300 transition-colors">Home</Link>
          <Link to="/search" className="hover:text-brand-300 transition-colors">Browse Venues</Link>
          <a href="#about" className="hover:text-brand-300 transition-colors">About Us</a>
          <a href="#contact" className="hover:text-brand-300 transition-colors">Contact Support</a>
        </div>

        {/* System copyright */}
        <p className="text-xs text-slate-500 font-medium text-center md:text-right">
          © {new Date().getFullYear()} VenueHub Event Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
