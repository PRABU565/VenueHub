import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search, MapPin, ChevronDown, Flame, CalendarDays, Star, TrendingUp, Sparkles, Heart } from "lucide-react";
import heroImg from "../assets/hero.png"; // We can keep or remove this

export default function Home() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [location, setLocation] = useState("Chennai");
  const [loading, setLoading] = useState(true);

  // Klook-style promotional banners
  const promos = [
    { title: "Wedding Season Offers", subtitle: "Up to 30% Off on Premium Halls", bg: "bg-gradient-to-r from-orange-400 to-red-500" },
    { title: "Gaming Offers", subtitle: "Flat ₹500 OFF Weekend Pass", bg: "bg-gradient-to-r from-blue-500 to-indigo-600" },
    { title: "Spa Packages", subtitle: "Buy 1 Get 1 Free Sessions", bg: "bg-gradient-to-r from-emerald-400 to-teal-500" },
  ];

  const ongoingDeals = [
    { title: "20% OFF Party Hall", code: "PARTY20", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80" },
    { title: "10% OFF Restaurant", code: "FOOD10", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
    { title: "Flat ₹500 OFF Gaming", code: "GAME500", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
    { title: "Weekend Swimming Pass", code: "SWIMWND", img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80" },
    { title: "Spa Combo Offer", code: "RELAX", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80" },
  ];

  const upcomingDeals = [
    { title: "Wedding Expo", date: "Coming this Weekend" },
    { title: "Gaming Tournament", date: "Coming this Weekend" },
    { title: "Food Festival", date: "Coming this Weekend" },
    { title: "Pool Party", date: "Coming this Weekend" },
    { title: "Kids Carnival", date: "Coming this Weekend" },
  ];

  const mainCategories = [
    { name: "Marriage Halls", color: "bg-pink-100 text-pink-600" },
    { name: "Party Halls", color: "bg-purple-100 text-purple-600" },
    { name: "Restaurants", color: "bg-orange-100 text-orange-600" },
    { name: "Gaming", color: "bg-blue-100 text-blue-600" },
    { name: "Swimming", color: "bg-cyan-100 text-cyan-600" },
    { name: "Spa & Massage", color: "bg-emerald-100 text-emerald-600" },
    { name: "Birthday Venues", color: "bg-yellow-100 text-yellow-600" },
    { name: "Events", color: "bg-red-100 text-red-600" },
  ];

  const browseCategories = [
    "Wedding", "Birthday", "Corporate", "College", "Gaming", "Restaurants", 
    "Swimming", "Massage", "Kids Activities", "Weekend Plans", "Special Events", 
    "Live Shows", "Festivals", "Outdoor Activities"
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/venues");
        setVenues(res.data);
      } catch (err) {
        console.error("Error loading featured venues:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="w-full pb-24 bg-white">
      {/* 1. Mobile-style Header & Search (Top Area) */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <div className="flex items-center gap-1">
            <MapPin size={18} className="text-primary" />
            <span className="font-bold text-darkText">{location}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Search Bar matching prompt requirement */}
        <div 
          onClick={handleSearchClick}
          className="bg-white border border-gray-200 rounded-full py-3 px-4 shadow-sm flex items-center gap-3 cursor-text md:hidden"
        >
          <Search size={20} className="text-primary" />
          <span className="text-gray-400 text-sm font-medium">Search Marriage Hall, Gaming, Restaurant...</span>
        </div>
      </div>

      {/* 2. Promotional Banner Slider */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 snap-x pb-4">
          {promos.map((promo, idx) => (
            <div key={idx} className={`min-w-[280px] md:min-w-[400px] h-32 md:h-48 rounded-2xl ${promo.bg} p-5 flex flex-col justify-center snap-center text-white shadow-md relative overflow-hidden`}>
              <h3 className="text-lg md:text-2xl font-bold mb-1 relative z-10">{promo.title}</h3>
              <p className="text-sm md:text-base opacity-90 relative z-10">{promo.subtitle}</p>
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <Sparkles size={100} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Categories Grid (Large colorful cards) */}
      <section className="px-4 mb-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {mainCategories.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/categories?select=${cat.name}`)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                 <Sparkles size={24} />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-center leading-tight text-gray-700 group-hover:text-primary">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ongoing Deals (Klook Style) */}
      <section className="px-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={20} className="text-red-500 fill-red-500" />
          <h2 className="text-lg md:text-xl font-bold text-darkText">Ongoing Deals</h2>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x">
          {ongoingDeals.map((deal, idx) => (
            <div key={idx} className="min-w-[160px] md:min-w-[220px] rounded-xl overflow-hidden snap-start shadow-sm border border-gray-100 cursor-pointer group">
              <div className="h-24 md:h-32 w-full overflow-hidden relative">
                <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">PROMO</div>
              </div>
              <div className="p-3 bg-white">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{deal.title}</h3>
                <p className="text-xs text-primary font-semibold mt-1 bg-orange-50 inline-block px-2 py-1 rounded border border-orange-100">{deal.code}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trending This Week (Horizontal Cards) */}
      <section className="px-4 mb-10 bg-gray-50 py-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-secondary" />
            <h2 className="text-lg md:text-xl font-bold text-darkText">Trending This Week</h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
            {["Top Wedding Halls", "Top Restaurants", "Best Gaming Zones", "Most Booked Swimming Pools", "Popular Spa"].map((title, idx) => (
              <div key={idx} className="min-w-[200px] md:min-w-[280px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-secondary transition-colors">
                <h3 className="font-bold text-gray-800">{title}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">View collection <ChevronDown size={12} className="-rotate-90"/></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Browse By Category */}
      <section className="px-4 mb-10 max-w-7xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-darkText mb-4">Browse By Category</h2>
        <div className="flex flex-wrap gap-2">
          {browseCategories.map((cat, idx) => (
            <span key={idx} onClick={() => navigate(`/categories?select=${cat}`)} className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm font-medium rounded-full cursor-pointer transition-colors border border-gray-200">
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* 7. Upcoming Deals */}
      <section className="px-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={20} className="text-purple-500" />
          <h2 className="text-lg md:text-xl font-bold text-darkText">Upcoming Deals</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {upcomingDeals.map((deal, idx) => (
            <div key={idx} className="bg-lightGray p-4 rounded-xl border border-gray-100 text-center flex flex-col justify-center items-center h-28 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 text-sm">{deal.title}</h3>
              <p className="text-xs text-primary font-semibold mt-2 bg-white px-2 py-1 rounded-full border border-orange-100">{deal.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Recommended For You (AI Recommendation) */}
      <section className="px-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
          <h2 className="text-lg md:text-xl font-bold text-darkText">Recommended For You</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4 font-medium flex items-center gap-1">
           <Sparkles size={12} className="text-secondary" /> AI Recommendation based on your budget & nearby places
        </p>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[1, 2, 3].map(n => <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-xl" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {venues.slice(0, 4).map((venue) => (
              <div 
                key={venue._id} 
                onClick={() => navigate(`/venue/${venue._id}`)}
                className="modern-card overflow-hidden group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img src={venue.images?.[0]} alt={venue.venueName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500">
                    <Heart size={16} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-darkText line-clamp-1">{venue.venueName}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                    <MapPin size={10} /> {venue.location}
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center gap-1 bg-green-50 text-success px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Star size={10} fill="currentColor" /> {venue.rating || 4.5}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-primary">₹{venue.price?.toLocaleString() || 5000}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
