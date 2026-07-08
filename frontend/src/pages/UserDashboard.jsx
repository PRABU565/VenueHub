import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, Loader2, RefreshCw, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const { user, showAlert } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");

  // Filter bookings based on activeTab
  // Assuming "Pending" or "Confirmed" for future dates are Upcoming
  // "Completed" for past dates (for simplicity we will use status or assume all Confirmed are completed if date passed, but let's just map status to tabs for demo)
  const getFilteredBookings = () => {
    if (activeTab === "Upcoming") return bookings.filter(b => b.status === "Pending" || b.status === "Confirmed");
    if (activeTab === "Completed") return bookings.filter(b => b.status === "Completed");
    if (activeTab === "Cancelled") return bookings.filter(b => b.status === "Cancelled");
    return bookings;
  };

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
      showAlert("Booking cancelled successfully.", "success");
      fetchBookings();
    } catch (err) {
      showAlert("Failed to cancel booking.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      <div className="bg-white px-4 pt-8 pb-4 shadow-sm border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-darkText flex items-center gap-2">
            <Calendar className="text-primary" /> My Bookings
          </h1>
          <button onClick={fetchBookings} className="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-50 rounded-full">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto flex gap-6 overflow-x-auto hide-scrollbar border-b border-gray-200">
          {["Upcoming", "Completed", "Cancelled"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-sm whitespace-nowrap transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <Calendar size={24} />
            </div>
            <h3 className="font-bold text-darkText">No {activeTab} Bookings</h3>
            <p className="text-sm text-gray-500 mt-2">You do not have any {activeTab.toLowerCase()} bookings at the moment.</p>
            <Link to="/search" className="btn-primary inline-flex px-6 py-2 rounded-full mt-6">
              Book a Venue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const dateObj = new Date(booking.bookingDate);
              const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
              
              return (
                <div key={booking._id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                  
                  {/* Venue Image (Placeholder if absent) */}
                  <div className="w-full md:w-32 h-32 md:h-auto bg-gray-200 rounded-xl overflow-hidden shrink-0 relative">
                    <img src={booking.venueId?.images?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200"} alt="Venue" className="w-full h-full object-cover" />
                    <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      booking.status === "Confirmed" ? "bg-green-500 text-white" : 
                      booking.status === "Pending" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {booking.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-darkText text-lg flex items-center gap-1.5">
                        {booking.venueId?.venueName || "Deleted Venue"}
                        {booking.venueId && (
                          <Link to={`/venue/${booking.venueId._id}`} className="text-gray-400 hover:text-primary">
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </h3>
                      <p className="text-xs text-primary font-semibold">{booking.venueId?.category}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Calendar size={14} className="text-gray-400" /> {formattedDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <CreditCard size={14} className="text-gray-400" /> ₹{booking.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      {booking.earnedPoints ? (
                        <div className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                          +{booking.earnedPoints} Points Earned
                        </div>
                      ) : <div/>}

                      <div className="flex gap-2">
                        {booking.status === "Pending" && (
                          <button className="btn-primary py-1.5 px-4 text-xs rounded-full">
                            Pay Now
                          </button>
                        )}
                        {(booking.status === "Pending" || booking.status === "Confirmed") && (
                          <button 
                            onClick={() => handleCancelClick(booking._id)}
                            className="bg-red-50 text-red-500 hover:bg-red-100 py-1.5 px-4 text-xs font-bold rounded-full transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
