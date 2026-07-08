import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search as SearchIcon, MapPin, Users, Calendar, Filter, X, Star, Sliders, RotateCcw } from "lucide-react";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter States (initialized from Search URL params)
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [capacity, setCapacity] = useState(searchParams.get("capacity") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "200000");
  const [ac, setAc] = useState(searchParams.get("ac") === "true");
  const [parking, setParking] = useState(searchParams.get("parking") === "true");

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilteredVenues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (category) params.category = category;
      if (capacity) params.capacity = capacity;
      if (maxPrice) params.maxPrice = maxPrice;
      if (date) params.date = date;
      if (ac) params.ac = true;
      if (parking) params.parking = true;

      const res = await api.get("/venues", { params });
      setVenues(res.data);
    } catch (err) {
      console.error("Error searching venues:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when searchParams change
  useEffect(() => {
    fetchFilteredVenues();
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const newParams = {};
    if (location) newParams.location = location;
    if (category) newParams.category = category;
    if (capacity) newParams.capacity = capacity;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (date) newParams.date = date;
    if (ac) newParams.ac = ac;
    if (parking) newParams.parking = parking;
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setLocation("");
    setCategory("");
    setDate("");
    setCapacity("");
    setMaxPrice("200000");
    setAc(false);
    setParking(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-white">Find Event Venues</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">
          Showing {venues.length} available listings matching your criteria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 1. FILTER SIDEBAR (Glass Panel) */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleApplyFilters}
            className="glass-card p-6 border-slate-900/60 sticky top-20 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Filter size={16} className="text-brand-400" /> Filter Options
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-bold"
                title="Reset all fields"
              >
                <RotateCcw size={12} /> Clear
              </button>
            </div>

            {/* Location Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. ECR, T. Nagar"
                  className="glass-input pl-9 text-xs"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Venue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input text-xs text-slate-300"
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

            {/* Capacity Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Minimum Capacity</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 150 attendees"
                  className="glass-input pl-9 text-xs"
                />
              </div>
            </div>

            {/* Date Check */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Check Date Availability</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input pl-9 text-xs text-slate-300"
                />
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Max Budget (Daily)</span>
                <span className="text-brand-400">₹{parseInt(maxPrice).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="200000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold pl-1 pr-1">
                <span>₹500</span>
                <span>₹200K</span>
              </div>
            </div>

            {/* AC and Parking Checkboxes */}
            <div className="space-y-3 pt-3 border-t border-slate-900/40">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ac}
                  onChange={(e) => setAc(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">AC Hall Required</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">Parking Space Available</span>
              </label>
            </div>

            {/* Apply Button */}
            <button type="submit" className="btn-primary w-full text-xs py-2.5">
              Apply Filters
            </button>
          </form>
        </div>

        {/* 2. CATALOGUE RESULTS GRID */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="glass-card h-80 animate-pulse border-slate-900" />
              ))}
            </div>
          ) : venues.length === 0 ? (
            <div className="glass-card p-12 text-center border-slate-900/60 max-w-lg mx-auto mt-12">
              <div className="w-16 h-16 bg-slate-950/60 rounded-full flex items-center justify-center border border-slate-800/80 mx-auto mb-4 text-slate-500 text-2xl">
                🔎
              </div>
              <h3 className="text-lg font-bold text-slate-200">No Venues Found</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                We couldn't find any listings matching your search variables. Try adjusting your budget, selecting "All Categories", or removing date selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-secondary mx-auto mt-6 text-xs px-6 py-2"
              >
                Reset Filter Settings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  onClick={() => navigate(`/venue/${venue._id}`)}
                  className="glass-card overflow-hidden border-slate-900/60 hover:border-brand-500/20 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Media Header */}
                    <div className="relative h-44 bg-slate-950 overflow-hidden">
                      <img
                        src={venue.images[0]}
                        alt={venue.venueName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Star size={10} fill="currentColor" /> {venue.rating || "New"}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-brand-600/90 text-white font-semibold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
                        <span>{venue.category}</span>
                        <span className="opacity-75">•</span>
                        <span className="text-amber-300 font-bold">{venue.priceRange}</span>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-brand-400 transition-colors">
                        {venue.venueName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-slate-500" /> {venue.location}
                      </p>
                      {venue.address && (
                        <p className="text-[10px] text-slate-500 line-clamp-1 italic font-medium">
                          {venue.address}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {venue.description || "No description provided for this listing."}
                      </p>
                      {venue.googleMapsLink && (
                        <div className="pt-1">
                          <a
                            href={venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-400 hover:text-brand-300 transition-all border border-brand-500/20 hover:border-brand-500/40 bg-brand-950/40 px-2 py-1 rounded"
                          >
                            🗺️ View on Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Details Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                      <Users size={12} className="text-slate-500" /> Max Capacity: {venue.capacity}
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block leading-none font-semibold">
                        {venue.category === "Gaming" ? "Per Hour" : venue.category === "Restaurant" ? "Reservation Fee" : venue.category === "Swimming" ? "Day Pass / Rent" : venue.category === "Spa & Massage" ? "Massage Base" : "Daily Rent"}
                      </span>
                      <span className="text-sm font-extrabold text-brand-400">₹{venue.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
