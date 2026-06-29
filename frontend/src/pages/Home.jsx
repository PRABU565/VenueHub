import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search, MapPin, Calendar, Users, Heart, Star, Sparkles, Building, Landmark, ShieldAlert, Utensils, Gamepad2, Waves, Flower2 } from "lucide-react";
import heroImg from "../assets/hero.png";

export default function Home() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [location, setLocation] = useState("Chennai");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  // FAQ Accordion states
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/venues");
        // Sort by rating desc and take top 3
        const sorted = res.data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setVenues(sorted);
      } catch (err) {
        console.error("Error loading featured venues:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    if (date) params.append("date", date);
    navigate(`/search?${params.toString()}`);
  };

  const selectCategory = (catName) => {
    navigate(`/search?category=${encodeURIComponent(catName)}`);
  };

  const faqData = [
    {
      q: "How does VenueHub guarantee no double-bookings?",
      a: "When a user confirms a booking and processes payment, our system instantly pulls that date out of the venue's available list. The slot is locked and becomes unavailable to all other searchers in real time.",
    },
    {
      q: "What types of venues can I find on VenueHub?",
      a: "We list everything from grand Marriage Halls and Party Halls to dining Restaurants, gaming arenas, relaxing spas, and swimming pools.",
    },
    {
      q: "Can I cancel a booking and get a refund?",
      a: "Yes, bookings can be cancelled through your User Dashboard. Depending on the venue owner's policy, the date is pushed back to the public pool and a simulated refund is credited.",
    },
  ];

  const categoryIcons = {
    "Party Hall": <Sparkles size={24} className="text-pink-400" />,
    "Marriage Hall": <Landmark size={24} className="text-amber-400" />,
    "Restaurant": <Utensils size={24} className="text-red-400" />,
    "Gaming": <Gamepad2 size={24} className="text-blue-400" />,
    "Spa & Massage": <Flower2 size={24} className="text-teal-400" />,
    "Swimming": <Waves size={24} className="text-emerald-400" />,
  };

  return (
    <div className="w-full pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 max-w-7xl mx-auto">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-16 pb-12 md:pt-24 md:pb-16">
          {/* Text and Badge */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1.5 bg-brand-950/50 border border-brand-500/20 text-brand-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles size={12} className="text-brand-400" />
              The Smarter Way to Book Event Spaces
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-[1.15] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Find the Perfect Space for <br />
              <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Your Next Big Event</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Compare Chennai's premium wedding palaces, party halls, dining restaurants, wellness spas, gaming hubs, and swimming pools with transparent calendars.
            </p>
          </div>

          {/* Floating Original Image */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient glow background */}
            <div className="absolute w-64 h-64 rounded-full bg-brand-500/15 filter blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
            <img
              src={heroImg}
              alt="VenueHub original graphics"
              className="w-64 md:w-80 max-w-full h-auto object-contain animate-float drop-shadow-[0_15px_35px_rgba(139,92,246,0.25)]"
            />
          </div>
        </div>

        {/* 2. OVERLAPPING SEARCH BAR */}
        <div className="mt-8 max-w-5xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="glass-card p-4 md:p-6 border-slate-800/80 shadow-2xl flex flex-col md:flex-row gap-4 items-center"
          >
            {/* Location Field */}
            <div className="flex-1 w-full text-left space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <MapPin size={10} /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Area in Chennai (e.g. Adyar, ECR)"
                className="glass-input bg-slate-950/40 border-slate-800/60"
              />
            </div>

            {/* Category Field */}
            <div className="flex-1 w-full text-left space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <Building size={10} /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input bg-slate-950/40 border-slate-800/60 text-slate-300"
              >
                <option value="">All Categories</option>
                <option value="Party Hall">Party Hall</option>
                <option value="Marriage Hall">Marriage Hall</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Gaming">Gaming</option>
                <option value="Spa & Massage">Spa & Massage</option>
                <option value="Swimming">Swimming</option>
              </select>
            </div>

            {/* Date Field */}
            <div className="flex-1 w-full text-left space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <Calendar size={10} /> Target Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input bg-slate-950/40 border-slate-800/60 text-slate-300"
              />
            </div>

            {/* Search Action Button */}
            <div className="w-full md:w-auto md:self-end pt-1">
              <button type="submit" className="btn-primary py-3 w-full md:px-8">
                <Search size={16} /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. CATEGORIES QUICK GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white">Explore by Category</h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold">Select an accommodation type to view active listings</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {Object.keys(categoryIcons).map((catName) => (
            <button
              key={catName}
              onClick={() => selectCategory(catName)}
              className="glass-card p-5 border-slate-900 flex flex-col items-center gap-3 hover:border-brand-500/30 hover:-translate-y-1 hover:shadow-brand-glow transition-all"
            >
              <div className="w-12 h-12 bg-slate-950/60 rounded-xl flex items-center justify-center border border-slate-800/40">
                {categoryIcons[catName]}
              </div>
              <span className="text-xs font-bold text-slate-300 text-center tracking-wide">{catName}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="bg-slate-950/40 border-y border-slate-900 py-12 px-4 mb-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold font-display bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">7+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Categories Supported</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold font-display bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">100%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Real-time Calendars</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold font-display bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">500+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Verified Hall bookings</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold font-display bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">0%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Hidden Booking Fees</p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PLACES */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white">Top Rated Venues</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Handpicked locations backed by verified client reviews</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-brand-400 hover:text-brand-300 text-xs font-bold transition-all flex items-center gap-1">
            See All Venues →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card h-80 animate-pulse border-slate-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                onClick={() => navigate(`/venue/${venue._id}`)}
                className="glass-card overflow-hidden border-slate-900/60 hover:border-brand-500/20 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Photo frame */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={venue.images[0]}
                    alt={venue.venueName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Star size={10} fill="currentColor" /> {venue.rating || "New"}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-brand-600/90 text-white font-semibold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {venue.category}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-brand-400 transition-colors">
                    {venue.venueName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                    <MapPin size={12} className="text-slate-500" /> {venue.location}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-900/60">
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                      <Users size={12} className="text-slate-500" /> Max: {venue.capacity}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block leading-none font-semibold">
                        {venue.category === "Gaming" ? "Price per Hour" : venue.category === "Restaurant" ? "Table Reservation" : venue.category === "Swimming" ? "Day Pass / Rent" : venue.category === "Spa & Massage" ? "Starting Price" : "Price per Day"}
                      </span>
                      <span className="text-sm font-extrabold text-brand-400">₹{venue.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. FAQS ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold">Clear details explaining how the booking architecture performs</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div key={idx} className="glass-card border-slate-900/50 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-900/30 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-200">{faq.q}</span>
                <span className="text-slate-400 font-bold text-sm">{openFaq === idx ? "−" : "+"}</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-950/20 bg-slate-950/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
