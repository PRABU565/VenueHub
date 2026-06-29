import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      // Route based on role
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else if (loggedUser.role === "owner") {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 border-slate-800/60 shadow-2xl relative overflow-hidden">
        {/* Ambient glow decoration */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Sign in to access your VenueHub dashboard
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email input field */}
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
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-11 pr-11"
                placeholder="••••••••"
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

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Credentials Alert Info */}
        <div className="mt-6 p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1 text-center">💡 Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span>Customer: customer@venuehub.com</span>
            <span>Pass: customerpassword</span>
            <span>Owner: owner@venuehub.com</span>
            <span>Pass: ownerpassword</span>
            <span className="col-span-2 text-center mt-1 pt-1 border-t border-slate-900/40 text-brand-400">Admin: admin@venuehub.com / adminpassword</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign up today
          </Link>
        </p>
      </div>
    </div>
  );
}
