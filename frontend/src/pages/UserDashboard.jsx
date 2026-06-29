import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";

export default function UserDashboard() {
  const { user, showAlert } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for paying a pending booking from dashboard
  const [activeBooking, setActiveBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [paying, setPaying] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
      showAlert("Could not retrieve your bookings list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      showAlert("Booking cancelled successfully. Refund initiated.", "success");
      fetchBookings();
    } catch (err) {
      showAlert("Failed to cancel booking.", "error");
    }
  };

  const handlePayNow = (booking) => {
    setActiveBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      await api.post("/bookings/confirm", {
        bookingId: activeBooking._id,
        transactionId: "pay_sim_" + Math.random().toString(36).substring(7),
      });
      showAlert("Booking paid and slot reserved successfully!", "success");
      setShowPaymentModal(false);
      fetchBookings();
    } catch (err) {
      showAlert("Payment confirmation failed.", "error");
    } finally {
      setPaying(false);
    }
  };

  // Calculations for profile metrics
  const confirmed = bookings.filter((b) => b.status === "Confirmed");
  const pending = bookings.filter((b) => b.status === "Pending");
  const cancelled = bookings.filter((b) => b.status === "Cancelled");
  const totalExpenditure = confirmed.reduce((sum, b) => sum + b.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-white">Guest Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Manage your event bookings, track transactions, and check venue statuses
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-4"
        >
          <RefreshCw size={14} /> Sync Lists
        </button>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-brand-400">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-xl font-extrabold text-slate-200">{bookings.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-emerald-400">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Confirmed Events</span>
            <span className="text-xl font-extrabold text-slate-200">{confirmed.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-amber-400">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Checkout</span>
            <span className="text-xl font-extrabold text-slate-200">{pending.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-purple-400">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Spending</span>
            <span className="text-xl font-extrabold text-slate-200">₹{totalExpenditure.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bookings Table/List */}
      <h2 className="text-lg font-bold text-slate-200 mb-4">Your Reservation Log</h2>
      {bookings.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-900/60 max-w-lg mx-auto">
          <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800/80 text-slate-500 text-xl">
            📅
          </div>
          <h3 className="text-sm font-bold text-slate-300">No Reservations Yet</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You haven't initiated any bookings. Search for party halls, restaurants, wellness spas, or swimming pools and secure your date slots today.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const dateObj = new Date(booking.bookingDate);
            const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            return (
              <div
                key={booking._id}
                className="glass-card p-6 border-slate-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                          : booking.status === "Pending"
                          ? "bg-amber-950/40 border-amber-500/20 text-amber-400"
                          : "bg-red-950/40 border-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Booked On: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                    {booking.venueId ? booking.venueId.venueName : "Deleted Venue"}
                    {booking.venueId && (
                      <Link to={`/venue/${booking.venueId._id}`} className="text-slate-500 hover:text-slate-300">
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </h3>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar size={12} className="text-brand-400" /> {formattedDate}
                  </p>
                  
                  {booking.status === "Confirmed" && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      Ref Code: {booking.paymentDetails.transactionId}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-900/40">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">Paid Amount</span>
                    <span className="text-base font-extrabold text-brand-400">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === "Pending" && (
                      <button
                        onClick={() => handlePayNow(booking)}
                        className="btn-accent py-2 px-4 text-xs font-bold"
                      >
                        Complete Payment
                      </button>
                    )}

                    {booking.status === "Confirmed" && (
                      <button
                        onClick={() => handleCancelClick(booking._id)}
                        className="btn-secondary py-2 px-4 text-xs font-bold text-red-400 hover:bg-red-950/10 hover:border-red-500/20"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RAZORPAY SANDBOX DIALOG FOR DASHBOARD PAYMENTS */}
      {showPaymentModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-slide-down">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Razorpay Checkout Sandbox</span>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-200 font-bold text-sm">✕</button>
            </div>

            <div className="text-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Payable Amount</span>
              <span className="text-3xl font-extrabold text-white mt-1 block">₹{activeBooking.totalAmount.toLocaleString()}</span>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">Date: {activeBooking.bookingDate}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 text-[11px] text-slate-400 leading-relaxed">
                Confirming payment reserves this slot and details it as confirmed in your profile ledger.
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase pl-1">Insert Verification OTP</label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Insert 123456"
                  className="glass-input text-center text-sm font-mono tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary w-full text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="btn-accent w-full text-xs font-bold"
                >
                  {paying ? <Loader2 size={14} className="animate-spin" /> : "Verify & Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
