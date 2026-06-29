import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Calendar, ShieldCheck } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "owner"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      const registeredUser = await register(name, email, password, role);
      if (registeredUser.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 border-slate-800/60 shadow-2xl relative overflow-hidden">
        {/* Glow decorative items */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Join VenueHub and start organizing fests & events
          </p>
        </div>

        {/* Role Selector Card Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              role === "user"
                ? "bg-brand-950/40 border-brand-500 text-brand-300 ring-1 ring-brand-500/30"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <Calendar size={22} className={role === "user" ? "text-brand-400" : "text-slate-500"} />
            <div className="text-center">
              <p className="text-xs font-bold">Event Host</p>
              <p className="text-[10px] opacity-80 mt-0.5">I want to book halls</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              role === "owner"
                ? "bg-brand-950/40 border-brand-500 text-brand-300 ring-1 ring-brand-500/30"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <ShieldCheck size={22} className={role === "owner" ? "text-brand-400" : "text-slate-500"} />
            <div className="text-center">
              <p className="text-xs font-bold">Venue Owner</p>
              <p className="text-[10px] opacity-80 mt-0.5">I want to list spaces</p>
            </div>
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input pl-11"
                placeholder="Jane Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-11"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-11 pr-11"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
