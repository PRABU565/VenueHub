import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, MapPin, Users, Info, Star, Shield, ArrowLeft, Loader2, Sparkles, Send, ShieldAlert } from "lucide-react";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showAlert } = useAuth();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking details
  const [selectedDate, setSelectedDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [functionType, setFunctionType] = useState("Wedding");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [paying, setPaying] = useState(false);

  // Review posting details
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchVenueData = async () => {
    setLoading(true);
    try {
      // Get details
      const res = await api.get(`/venues/detail/${id}`);
      setVenue(res.data.venue);
      setReviews(res.data.reviews || []);

      // Run Content-Based AI recommendation query: Find other venues in the same category
      const venuesRes = await api.get("/venues");
      const filtered = venuesRes.data
        .filter((v) => v._id !== id && v.category === res.data.venue.category)
        .slice(0, 3);
      setRecommendations(filtered);
    } catch (err) {
      console.error("Error loading venue details:", err.message);
      showAlert("Venue details could not be retrieved.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenueData();
    // Reset selected date on id change
    setSelectedDate("");
  }, [id]);

  const handleBookingSubmit = async () => {
    if (!selectedDate) {
      showAlert("Please select a booking date first.", "error");
      return;
    }
    if (!customerName || !mobile) {
      showAlert("Please fill in your Name and Mobile Number for the enquiry.", "error");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await api.post("/bookings", {
        venueId: venue._id,
        bookingDate: selectedDate,
        customerName,
        mobile,
        functionType,
      });
      setActiveBooking(res.data.booking);
      setShowPaymentModal(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Booking failed.";
      showAlert(errorMsg, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentConfirm = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      showAlert("Please enter verification OTP code.", "error");
      return;
    }
    setPaying(true);
    try {
      await api.post("/bookings/confirm", {
        bookingId: activeBooking._id,
        transactionId: "pay_sim_" + Math.random().toString(36).substring(7),
      });
      showAlert("Booking confirmed and slot reserved!", "success");
      setShowPaymentModal(false);
      // Reload details to clear the booked date from availability
      fetchVenueData();
      navigate("/bookings");
    } catch (err) {
      showAlert("Payment validation failed.", "error");
    } finally {
      setPaying(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment) return;
    setReviewLoading(true);
    try {
      await api.post(`/venues/${venue._id}/reviews`, {
        rating: userRating,
        comment: userComment,
      });
      showAlert("Thank you for your feedback!", "success");
      setUserComment("");
      // Reload reviews
      fetchVenueData();
    } catch (err) {
      showAlert("Failed to post review. Please try again.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 font-semibold mb-4">Venue not found or has been deleted.</p>
        <Link to="/search" className="btn-secondary inline-flex items-center">
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Back link */}
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold mb-6">
        <ArrowLeft size={14} /> Back to results
      </button>

      {/* Title Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-brand-900/60 text-brand-300 font-semibold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wide border border-brand-800/40">
            {venue.category}
          </span>
          {(venue.category === "Party Hall" || venue.category === "Marriage Hall") && (
            <>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${
                venue.ac 
                  ? "bg-brand-950/40 border-brand-500/25 text-brand-300"
                  : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}>
                {venue.ac ? "❄ AC Hall" : "🌬 Non-AC Hall"}
              </span>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${
                venue.parking 
                  ? "bg-emerald-950/40 border-emerald-500/25 text-emerald-300"
                  : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}>
                {venue.parking ? "🚗 Parking Available" : "🚫 No Parking"}
              </span>
            </>
          )}
          {venue.category === "Restaurant" && (
            <>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${
                venue.tableReservation 
                  ? "bg-emerald-950/40 border-emerald-500/25 text-emerald-300"
                  : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}>
                {venue.tableReservation ? "🍽 Table Reservation" : "🚫 No Reservations"}
              </span>
              {venue.familyDining && (
                <span className="bg-indigo-950/40 border border-indigo-500/25 text-indigo-300 text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  👨‍👩‍👧 Family Dining
                </span>
              )}
            </>
          )}
          {venue.category === "Gaming" && (
            <>
              {venue.groupBooking && (
                <span className="bg-purple-950/40 border border-purple-500/25 text-purple-300 text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  🎮 Group Bookings
                </span>
              )}
            </>
          )}
          {venue.category === "Swimming" && (
            <>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide border border-slate-800 text-slate-300`}>
                {venue.adultPool ? "🏊 Adult Pool" : ""} {venue.kidsPool ? "👶 Kids Pool" : ""}
              </span>
              {venue.coachAvailable && (
                <span className="bg-emerald-950/40 border border-emerald-500/25 text-emerald-300 text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  🎓 Coach Available
                </span>
              )}
            </>
          )}
          {venue.category === "Spa & Massage" && (
            <>
              {venue.steamBath && (
                <span className="bg-teal-950/40 border border-teal-500/25 text-teal-300 text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  💆 Steam Bath
                </span>
              )}
            </>
          )}
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
            <Star size={12} fill="currentColor" /> {venue.rating || "New"} ({venue.reviewsCount} reviews)
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">{venue.venueName}</h1>
        <div className="text-slate-400 text-xs flex flex-wrap items-center gap-2 mt-2 font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-slate-500" /> {venue.location}
          </span>
          {venue.address && <span className="text-slate-600">|</span>}
          {venue.address && <span className="text-slate-400 italic">{venue.address}</span>}
          {venue.googleMapsLink && (
            <a
              href={venue.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-brand-400 hover:text-brand-300 font-bold border border-brand-500/20 hover:border-brand-500/40 bg-brand-950/30 px-2.5 py-0.5 rounded transition-all flex items-center gap-1"
            >
              🗺️ Open in Google Maps
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Info VS Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Images & Descriptions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-4 h-96 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
              <img src={venue.images[0]} alt={venue.venueName} className="w-full h-full object-cover" />
            </div>
            {venue.images.slice(1).map((imgUrl, idx) => (
              <div key={idx} className="h-24 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
                <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>

          {/* Description Section */}
          <div className="glass-card p-6 border-slate-900">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">About the Space</h2>
            <p className="text-slate-300 text-xs leading-relaxed mt-4 font-medium whitespace-pre-line">
              {venue.description || "No description provided."}
            </p>
          </div>

          {/* Category-Specific Details Sections */}
          {venue.category === "Restaurant" && (
            <div className="glass-card p-6 border-slate-900 space-y-4">
              <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">🍽 Restaurant Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Services & Packages</p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Table Reservation:</span> <span className={venue.tableReservation ? "text-emerald-400" : "text-slate-500"}>{venue.tableReservation ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Birthday Decoration:</span> <span className={venue.birthdayDecoration ? "text-emerald-400" : "text-slate-500"}>{venue.birthdayDecoration ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Anniversary Packages:</span> <span className={venue.anniversaryPackages ? "text-emerald-400" : "text-slate-500"}>{venue.anniversaryPackages ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between"><span>Family Dining:</span> <span className={venue.familyDining ? "text-emerald-400" : "text-slate-500"}>{venue.familyDining ? "Yes" : "No"}</span></p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Recommended Menu</p>
                  {venue.menu && venue.menu.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {venue.menu.map((m, idx) => (
                        <span key={idx} className="bg-brand-950/50 border border-brand-500/20 text-brand-300 text-[10px] px-2 py-1 rounded-full font-bold">{m}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No menu items listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {venue.category === "Gaming" && (
            <div className="glass-card p-6 border-slate-900 space-y-4">
              <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">🎮 Gaming Arena Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rates & Bookings</p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Price per Hour:</span> <span className="text-brand-400 font-extrabold">₹{venue.pricePerHour || venue.price}</span></p>
                  <p className="flex justify-between"><span>Group Bookings:</span> <span className={venue.groupBooking ? "text-emerald-400" : "text-slate-500"}>{venue.groupBooking ? "Available" : "Not Available"}</span></p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Games Available</p>
                  {venue.gamesAvailable && venue.gamesAvailable.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {venue.gamesAvailable.map((g, idx) => (
                        <span key={idx} className="bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-[10px] px-2 py-1 rounded-full font-bold">{g}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No games listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {venue.category === "Swimming" && (
            <div className="glass-card p-6 border-slate-900 space-y-4">
              <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">🏊 Swimming Pool Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pool Configuration</p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Adult Pool:</span> <span className={venue.adultPool ? "text-emerald-400" : "text-slate-500"}>{venue.adultPool ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Kids Pool:</span> <span className={venue.kidsPool ? "text-emerald-400" : "text-slate-500"}>{venue.kidsPool ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between"><span>Coach Available:</span> <span className={venue.coachAvailable ? "text-emerald-400" : "text-slate-500"}>{venue.coachAvailable ? "Yes" : "No"}</span></p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Memberships & Rates</p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Day Pass rate:</span> <span className="text-brand-400 font-extrabold">₹{venue.dayPass || venue.price}</span></p>
                  <p className="flex justify-between"><span>Monthly Membership:</span> <span className="text-emerald-400 font-bold">₹{venue.monthlyMembership || "N/A"}</span></p>
                </div>
              </div>
            </div>
          )}

          {venue.category === "Spa & Massage" && (
            <div className="glass-card p-6 border-slate-900 space-y-4">
              <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">💆 Wellness & Spa Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Wellness Services</p>
                  <p className="flex justify-between border-b border-slate-900/40 pb-1"><span>Steam Bath:</span> <span className={venue.steamBath ? "text-emerald-400" : "text-slate-500"}>{venue.steamBath ? "Yes" : "No"}</span></p>
                  <p className="flex justify-between"><span>Appointment Booking:</span> <span className={venue.appointmentBooking ? "text-emerald-400" : "text-slate-500"}>{venue.appointmentBooking ? "Available" : "Not Available"}</span></p>
                  {venue.spaServices && venue.spaServices.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Spa Services</span>
                      <div className="flex flex-wrap gap-1">
                        {venue.spaServices.map((s, idx) => (
                          <span key={idx} className="bg-teal-950/50 border border-teal-500/20 text-teal-300 text-[9px] px-1.5 py-0.5 rounded font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-slate-950/40 border border-slate-900/50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Massage Packages</p>
                  {venue.massagePackages && venue.massagePackages.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 pt-1 text-slate-300 font-medium">
                      {venue.massagePackages.map((p, idx) => (
                        <li key={idx} className="text-[11px]">{p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No packages listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          <div className="glass-card p-6 border-slate-900">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">Available Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {venue.amenities && venue.amenities.length > 0 ? (
                venue.amenities.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-900/60 p-3 rounded-xl flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span>
                    <span className="text-slate-300 text-xs font-semibold">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-semibold col-span-3">No amenities listed.</p>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="glass-card p-6 border-slate-900 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-3">Reviews & Ratings</h2>

            {/* Review Input Box (Active Customer and not owner) */}
            {user && user.role !== "owner" && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Your Rating:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setUserRating(stars)}
                        className={`text-sm hover:scale-110 transition-transform ${
                          stars <= userRating ? "text-amber-400" : "text-slate-600"
                        }`}
                      >
                        <Star size={16} fill={stars <= userRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    rows="3"
                    value={userComment}
                    required
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Write your review here... How was the venue size, sound, and overall layout?"
                    className="glass-input resize-none text-xs"
                  />
                  <button type="submit" disabled={reviewLoading} className="btn-primary absolute right-3 bottom-3 py-1.5 px-4 text-xs">
                    {reviewLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Post
                  </button>
                </div>
              </form>
            )}

            {/* Existing reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 font-semibold py-4 text-center">No reviews posted yet. Be the first to leave a feedback!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-slate-900/60 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-200">{rev.user.name}</p>
                      <span className="text-[10px] text-slate-500 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-amber-400" : "text-slate-800"} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Booking Panel (Sticky) */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 border-slate-900/80 sticky top-20 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Rental Cost</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-brand-400">₹{venue.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ Day</span>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-4 space-y-4">
              <label className="text-xs font-bold text-slate-300 block">Select Booking Date</label>
              
              {venue.availableDates && venue.availableDates.length > 0 ? (
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass-input text-xs text-slate-200"
                >
                  <option value="">-- Choose an Available Date --</option>
                  {venue.availableDates.map((dateStr) => {
                    const parsed = new Date(dateStr);
                    const formatted = parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <option key={dateStr} value={dateStr}>
                        {formatted}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-[11px] font-semibold flex items-start gap-2">
                  <ShieldAlert size={14} className="mt-0.5" />
                  <span>No available dates left! This venue is fully booked for the next two weeks.</span>
                </div>
              )}
            </div>

            {/* Enquiry Fields Form details */}
            {selectedDate && (
              <div className="space-y-3 pt-3 border-t border-slate-900/40 animate-slide-down">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Your Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    required
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sundar"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobile}
                    required
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Function Type *</label>
                  <select
                    value={functionType}
                    onChange={(e) => setFunctionType(e.target.value)}
                    className="glass-input text-xs text-slate-300"
                  >
                    <option value="Wedding">Wedding / Marriage</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Farewell Function">Farewell Function</option>
                    <option value="College Event">College Event</option>
                    <option value="Corporate Meeting">Corporate Meeting</option>
                  </select>
                </div>
              </div>
            )}

            {/* Calculations Breakdown */}
            {selectedDate && (
              <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">1x Daily Rent</span>
                  <span className="text-slate-200">₹{venue.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Booking Processing</span>
                  <span className="text-slate-200">₹500</span>
                </div>
                <div className="flex justify-between font-extrabold text-brand-400 pt-1 border-t border-slate-900/40">
                  <span>Total Amount</span>
                  <span>₹{(venue.price + 500).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* CTA action */}
            {user ? (
              user.role === "owner" ? (
                <div className="p-3 bg-indigo-950/20 border border-indigo-950/80 text-indigo-300 rounded-xl text-center text-xs font-medium">
                  Owners cannot book listings.
                </div>
              ) : (
                <button
                  onClick={handleBookingSubmit}
                  disabled={!selectedDate || bookingLoading}
                  className="btn-accent w-full py-3"
                >
                  {bookingLoading ? <Loader2 size={16} className="animate-spin" /> : "Proceed to Booking"}
                </button>
              )
            ) : (
              <Link to="/login" className="btn-primary w-full text-center py-3 text-sm">
                Login to Book Venue
              </Link>
            )}

            <div className="text-[10px] text-slate-500 font-semibold text-center leading-relaxed">
              ⚡ Safe Reservation Guaranteed. Double-booking protection locks slots instantly upon transaction success.
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI RECOMMENDATIONS PANEL */}
      <section className="mt-24 border-t border-slate-900/60 pt-16 mb-8">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles size={20} className="text-brand-400" />
          <h2 className="text-xl md:text-2xl font-extrabold font-display text-slate-100">AI Recommendations</h2>
          <span className="bg-brand-950 border border-brand-500/20 text-brand-400 font-semibold text-[9px] px-2 py-0.5 rounded-full ml-1">
            Category Match
          </span>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-xs text-slate-500 font-semibold">No similar venues in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/venue/${item._id}`)}
                className="glass-card overflow-hidden border-slate-900/60 hover:border-brand-500/20 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative h-40 bg-slate-950">
                  <img src={item.images[0]} alt={item.venueName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800/80 flex items-center gap-1 text-[9px] font-bold text-amber-400">
                    <Star size={8} fill="currentColor" /> {item.rating || "New"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-brand-400 transition-colors">{item.venueName}</h3>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin size={10} className="text-slate-500" /> {item.location}
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900/30 text-[10px] font-bold">
                    <span className="text-slate-400">Max Cap: {item.capacity}</span>
                    <span className="text-brand-400">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. RAZORPAY MOCKOUT DIALOG MODAL */}
      {showPaymentModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-slide-down">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Razorpay Checkout Sandbox</span>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  showAlert("Payment cancelled. Booking saved as pending.", "info");
                }}
                className="text-slate-400 hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Payable Amount</span>
              <span className="text-3xl font-extrabold text-white mt-1 block">₹{activeBooking.totalAmount.toLocaleString()}</span>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">To: {venue.venueName}</p>
            </div>

            <form onSubmit={handlePaymentConfirm} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 text-[11px] text-slate-400 leading-relaxed">
                <p className="font-semibold text-slate-300 mb-1">🛡️ Sandbox Verification:</p>
                This is a simulated Razorpay secure checkout. To finalize the reservation and lock this date (<strong>{activeBooking.bookingDate}</strong>), please click "Simulate Payment".
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
                  onClick={() => {
                    setShowPaymentModal(false);
                    showAlert("Booking saved. Please complete payment from dashboard later.", "info");
                  }}
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
