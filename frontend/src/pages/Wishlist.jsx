import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import api from '../services/api';

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch user's wishlist from API
    // Since API wishlist route isn't strictly defined yet, we'll use dummy data if logged in
    if (user) {
      setTimeout(() => {
        setWishlist([
          {
            _id: "1",
            venueName: "Grand Palace Hall",
            category: "Marriage Halls",
            location: "Adyar, Chennai",
            price: 55000,
            rating: 4.8,
            images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80"]
          },
          {
            _id: "2",
            venueName: "The Royal Dine",
            category: "Restaurants",
            location: "T Nagar, Chennai",
            price: 2500,
            rating: 4.5,
            images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"]
          },
          {
            _id: "3",
            venueName: "NextGen Gaming Lounge",
            category: "Gaming",
            location: "Velachery, Chennai",
            price: 500,
            rating: 4.9,
            images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80"]
          },
          {
            _id: "4",
            venueName: "Blue Waves Pool",
            category: "Swimming",
            location: "ECR, Chennai",
            price: 300,
            rating: 4.3,
            images: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80"]
          }
        ]);
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading wishlist...</div>;
  }

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-extrabold font-display text-darkText mb-6 flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" /> My Wishlist
        </h1>

        {!user ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mt-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-red-300" />
            </div>
            <h2 className="text-xl font-bold text-darkText mb-2">Save your favourite places</h2>
            <p className="text-gray-500 mb-6 text-sm">Login to view and manage your saved venues.</p>
            <Link to="/login" className="btn-primary inline-flex px-8 py-3 rounded-full">
              Login to continue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.length > 0 ? (
              wishlist.map(venue => (
                <div key={venue._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex cursor-pointer hover:shadow-md transition-shadow">
                  <div className="w-32 h-auto relative">
                    <img src={venue.images[0]} alt={venue.venueName} className="w-full h-full object-cover" />
                    <button className="absolute top-2 left-2 bg-white/80 p-1.5 rounded-full text-red-500">
                      <Heart size={14} className="fill-red-500" />
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-darkText line-clamp-1">{venue.venueName}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{venue.category}</p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-2">
                      <MapPin size={12} /> {venue.location}
                    </div>
                    <div className="flex justify-between items-end mt-3">
                      <div className="flex items-center gap-1 bg-green-50 text-success px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Star size={10} fill="currentColor" /> {venue.rating}
                      </div>
                      <p className="text-sm font-extrabold text-darkText">₹{venue.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500">Your wishlist is empty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
