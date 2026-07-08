import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Star, Heart } from 'lucide-react';

export default function Categories() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('select') || 'Marriage Halls';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarCategories = [
    "Marriage Halls", "Party Halls", "Restaurants", "Gaming", 
    "Swimming", "Spa & Massage", "Birthday Venues", "Corporate", 
    "College Farewell", "Kids Activities", "Events", "Offers"
  ];

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        // In a real app we would pass the category query. For now, fetch all and filter client side
        const res = await api.get("/venues");
        // Simulated filtering
        const filtered = res.data.filter(v => v.category === selectedCategory || (selectedCategory === "Offers" && v.price < 5000));
        setVenues(filtered.length > 0 ? filtered : res.data.slice(0, 3)); // Show some data if empty for demo
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [selectedCategory]);

  return (
    <div className="w-full pb-24 bg-gray-50 flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Sidebar (Flipkart Style) */}
      <div className="w-1/3 md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200 overflow-y-auto hide-scrollbar pb-20 pt-2">
        {sidebarCategories.map((cat, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-4 text-xs md:text-sm font-medium cursor-pointer transition-colors border-l-4 ${
              selectedCategory === cat 
                ? 'bg-orange-50 text-primary border-primary font-bold' 
                : 'text-gray-600 border-transparent hover:bg-gray-50'
            }`}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Right Side Cards */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        <h2 className="text-lg font-bold text-darkText mb-4">{selectedCategory}</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="h-28 bg-white rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map(venue => (
              <div 
                key={venue._id} 
                onClick={() => navigate(`/venue/${venue._id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-32 w-full relative">
                  <img src={venue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500"} alt={venue.venueName} className="w-full h-full object-cover" />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500">
                    <Heart size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-darkText line-clamp-1">{venue.venueName}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                    <MapPin size={10} /> {venue.location}
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center gap-1 bg-green-50 text-success px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Star size={10} fill="currentColor" /> {venue.rating || 4.2}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-primary">₹{venue.price?.toLocaleString() || 5000}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
