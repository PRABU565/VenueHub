import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Calculator, Users, DollarSign, MapPin, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function BudgetPlanner() {
  const navigate = useNavigate();

  // Input states
  const [budget, setBudget] = useState("150000");
  const [guests, setGuests] = useState("300");
  const [location, setLocation] = useState("Avadi");

  // Output states
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searched, setSearched] = useState(false);

  // Baselines
  const CATERING_PER_PLATE = 250;
  const DECOR_PER_GUEST = 50;
  const MIN_DECOR_COST = 10000;

  const calculateBudgetOptions = async (e) => {
    if (e) e.preventDefault();
    if (!budget || !guests) return;

    setLoading(true);
    setSearched(true);
    try {
      // Fetch all approved listings
      const res = await api.get("/venues");
      const allHalls = res.data;

      // Filter: Match location and capacity
      const eligibleHalls = allHalls.filter((hall) => {
        // Location matching (case-insensitive sub-string or match)
        const locMatch =
          !location ||
          location === "All" ||
          hall.location.toLowerCase().includes(location.toLowerCase());

        // Capacity must support expected guests
        const capMatch = hall.capacity >= parseInt(guests);

        // Only recommend event-capable halls for the budget event planner
        const isEventHall = hall.category === "Party Hall" || hall.category === "Marriage Hall";

        return locMatch && capMatch && isEventHall;
      });

      // Calculate details for each hall
      const calculated = eligibleHalls.map((hall) => {
        const hallRent = hall.price;
        const cateringCost = parseInt(guests) * CATERING_PER_PLATE;
        const decorationCost = Math.max(
          parseInt(guests) * DECOR_PER_GUEST,
          MIN_DECOR_COST
        );
        const totalCost = hallRent + cateringCost + decorationCost;
        const remaining = parseInt(budget) - totalCost;
        const fits = remaining >= 0;

        // Percentage calculations for progress bars
        const rentPct = Math.round((hallRent / totalCost) * 100);
        const cateringPct = Math.round((cateringCost / totalCost) * 100);
        const decorPct = 100 - (rentPct + cateringPct);

        return {
          hall,
          hallRent,
          cateringCost,
          decorationCost,
          totalCost,
          remaining,
          fits,
          breakdown: { rentPct, cateringPct, decorPct },
        };
      });

      // Sort by budget alignment (fits first, then ascending total cost)
      calculated.sort((a, b) => {
        if (a.fits && !b.fits) return -1;
        if (!a.fits && b.fits) return 1;
        return a.totalCost - b.totalCost;
      });

      setSuggestions(calculated);
    } catch (err) {
      console.error("Budget calculations failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run initial calculation on load based on default parameters (Avadi, 300 guests, 150000 budget)
  useEffect(() => {
    calculateBudgetOptions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1 bg-brand-950 border border-brand-500/25 text-brand-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Sparkles size={12} className="text-brand-400" /> Unique Review Feature
        </span>
        <h1 className="text-3xl font-extrabold font-display text-white">Budget Event Planner</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">
          Input your budget, size parameters, and target location. We calculate renting, catering, and decoration splits in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Planner Inputs Sidebar (Glass Card) */}
        <div className="lg:col-span-1">
          <form
            onSubmit={calculateBudgetOptions}
            className="glass-card p-6 border-slate-900/60 sticky top-20 shadow-xl space-y-5"
          >
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-3">
              <Calculator size={16} className="text-brand-400 animate-pulse" /> Planner Parameters
            </h2>

            {/* Target Budget */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Total Target Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-extrabold">₹</span>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 150000"
                  className="glass-input pl-8 text-xs font-bold text-slate-200"
                />
              </div>
            </div>

            {/* Guest Count */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Expected Guests Count</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="number"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="e.g. 300"
                  className="glass-input pl-9 text-xs font-bold text-slate-200"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Preferred Area</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass-input text-xs text-slate-300 font-bold"
              >
                <option value="All">All Locations</option>
                <option value="Chennai">Chennai</option>
                <option value="Avadi">Avadi</option>
                <option value="Ambattur">Ambattur</option>
                <option value="Poonamallee">Poonamallee</option>
                <option value="Thiruvallur">Thiruvallur</option>
                <option value="Tiruvallur">Tiruvallur</option>
                <option value="Arakkonam">Arakkonam</option>
              </select>
            </div>

            {/* Submit Calc */}
            <button type="submit" disabled={loading} className="btn-primary w-full text-xs py-2.5">
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Calculate Splits"}
            </button>
          </form>
        </div>

        {/* Suggestion Outputs Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-4 border-slate-900 bg-brand-950/20 text-xs font-medium text-brand-300 leading-relaxed flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div>
              <strong>South Indian Catering Split:</strong> Calculations utilize a baseline plate fee of <strong>₹250/head</strong> for traditional vegetarian buffet layouts. Decoration projections baseline at <strong>₹50/head</strong> (minimum ₹10,000) for standard floral/stage lights.
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div key={n} className="glass-card h-60 animate-pulse border-slate-900" />
              ))}
            </div>
          ) : searched && suggestions.length === 0 ? (
            <div className="glass-card p-12 text-center border-slate-900 max-w-lg mx-auto">
              <AlertTriangle size={32} className="text-amber-500 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-slate-200">No Suitable Halls Found</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                We couldn't locate any venues in {location === "All" ? "any location" : location} that can support {guests} guests. Try increasing your guest capacity limit, changing locations, or scaling down guest count parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {suggestions.map(({ hall, hallRent, cateringCost, decorationCost, totalCost, remaining, fits, breakdown }) => (
                <div
                  key={hall._id}
                  className={`glass-card p-6 border-slate-900/60 relative overflow-hidden transition-all duration-300 hover:border-brand-500/20 ${
                    fits
                      ? "bg-slate-900/50"
                      : "bg-red-950/5 border-red-500/10"
                  }`}
                >
                  {/* Status Banner */}
                  <div className="absolute top-0 right-0">
                    <span
                      className={`text-[9px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider block ${
                        fits
                          ? "bg-emerald-950 text-emerald-400 border-l border-b border-emerald-800/20"
                          : "bg-red-950 text-red-400 border-l border-b border-red-800/20"
                      }`}
                    >
                      {fits ? "Fits in Budget" : "Exceeds Budget"}
                    </span>
                  </div>

                  {/* Hall Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{hall.venueName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                        <MapPin size={12} className="text-slate-500" /> {hall.location} | Capacity: {hall.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Estimates Breakdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-900/40 text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase text-[9px] tracking-wide">Hall Rent</span>
                      <span className="font-extrabold text-slate-200">₹{hallRent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase text-[9px] tracking-wide">Est. Catering</span>
                      <span className="font-extrabold text-slate-200">₹{cateringCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase text-[9px] tracking-wide">Est. Decor</span>
                      <span className="font-extrabold text-slate-200">₹{decorationCost.toLocaleString()}</span>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-slate-900/60 pt-2 md:pt-0 md:pl-4">
                      <span className="text-slate-500 font-bold block mb-1 uppercase text-[9px] tracking-wide">Total Estimate</span>
                      <span className="font-black text-brand-400 text-sm">₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Visual Split Progress Meters */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-0.5">Budget Allocation Split</span>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${breakdown.rentPct}%` }}
                        className="bg-brand-500 h-full hover:opacity-90 transition-opacity"
                        title={`Hall Rent: ${breakdown.rentPct}%`}
                      />
                      <div
                        style={{ width: `${breakdown.cateringPct}%` }}
                        className="bg-emerald-500 h-full hover:opacity-90 transition-opacity"
                        title={`Catering: ${breakdown.cateringPct}%`}
                      />
                      <div
                        style={{ width: `${breakdown.decorPct}%` }}
                        className="bg-amber-500 h-full hover:opacity-90 transition-opacity"
                        title={`Decor: ${breakdown.decorPct}%`}
                      />
                    </div>
                    {/* Legend */}
                    <div className="flex gap-4 text-[9px] text-slate-500 font-semibold pl-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-500" /> Hall Rent ({breakdown.rentPct}%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Catering ({breakdown.cateringPct}%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Decor ({breakdown.decorPct}%)</span>
                    </div>
                  </div>

                  {/* Summary Comparison & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-900/40">
                    <div className="text-xs">
                      {fits ? (
                        <p className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Saves ₹{remaining.toLocaleString()} from your budget limit!
                        </p>
                      ) : (
                        <p className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle size={14} /> Exceeds budget by ₹{Math.abs(remaining).toLocaleString()}.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/venue/${hall._id}`)}
                      className="btn-secondary py-2 px-5 text-xs font-bold hover:gap-3 transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      Place Enquiry <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
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
