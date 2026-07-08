import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { MapPin, Users, Star, ArrowLeft, Loader2, Heart, Share2, Info, Wind, Car, Utensils } from "lucide-react";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showAlert } = useAuth();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review posting details
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const fetchVenueData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/venues/detail/${id}`);
      setVenue(res.data.venue);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error loading venue details:", err.message);
      showAlert("Venue details could not be retrieved.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenueData();
  }, [id]);

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
      fetchVenueData();
    } catch (err) {
      showAlert("Failed to post review.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">Venue not found.</p>
        <Link to="/search" className="btn-secondary inline-flex items-center">
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-28 bg-gray-50 min-h-screen">
      {/* Mobile Top Nav */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-30 px-4 py-3 flex justify-between items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-darkText">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-100 rounded-full text-gray-500">
            <Share2 size={20} />
          </button>
          <button className="p-2 bg-gray-100 rounded-full text-red-500">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto md:px-4 md:py-8">
        
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1.5 font-bold">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-3">
            <button className="text-gray-500 hover:text-primary font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200">
              <Share2 size={16} /> Share
            </button>
            <button className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50">
              <Heart size={16} className="fill-red-500" /> Save
            </button>
          </div>
        </div>

        {/* Image Slider */}
        <div className="bg-white md:rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-64 md:h-[400px]">
            <img src={venue.images?.[activeImage] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"} alt={venue.venueName} className="w-full h-full object-cover" />
          </div>
          {venue.images && venue.images.length > 1 && (
            <div className="flex p-2 gap-2 overflow-x-auto hide-scrollbar">
              {venue.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 md:h-20 md:w-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  alt="Thumbnail" 
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-100 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {venue.category}
                </span>
                <span className="flex items-center gap-1 bg-green-50 text-success text-[10px] font-bold px-2 py-0.5 rounded">
                  <Star size={10} fill="currentColor" /> {venue.rating || "New"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-darkText font-display mb-2">{venue.venueName}</h1>
              <p className="text-gray-500 text-sm flex items-start gap-1.5">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>
                  {venue.address ? `${venue.address}, ` : ''}{venue.location}
                  {venue.googleMapsLink && (
                    <a href={venue.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline block mt-1 font-semibold">
                      View on Google Maps
                    </a>
                  )}
                </span>
              </p>
            </div>

            {/* Quick Amenities Icons */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <Users size={20} />
                </div>
                <span className="text-xs font-bold text-darkText">Capacity</span>
                <span className="text-[10px] text-gray-500">Upto {venue.capacity} Pax</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <Car size={20} />
                </div>
                <span className="text-xs font-bold text-darkText">Parking</span>
                <span className="text-[10px] text-gray-500">{venue.parking ? "Available" : "Not Available"}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-500">
                  <Wind size={20} />
                </div>
                <span className="text-xs font-bold text-darkText">AC / Non-AC</span>
                <span className="text-[10px] text-gray-500">{venue.ac ? "Fully AC" : "Non-AC"}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <Utensils size={20} />
                </div>
                <span className="text-xs font-bold text-darkText">Dining</span>
                <span className="text-[10px] text-gray-500">{venue.tableReservation ? "Available" : "Optional"}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-darkText mb-3">About the Space</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {venue.description || "No description provided."}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-darkText">Reviews & Ratings</h2>
              
              {user && user.role !== "owner" && (
                <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-darkText">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button key={stars} type="button" onClick={() => setUserRating(stars)} className={`${stars <= userRating ? "text-yellow-500" : "text-gray-300"}`}>
                          <Star size={18} fill={stars <= userRating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows="3"
                    value={userComment}
                    required
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Write your review here..."
                    className="modern-input"
                  />
                  <div className="flex justify-end mt-2">
                    <button type="submit" disabled={reviewLoading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-orange-600">
                      {reviewLoading ? "Posting..." : "Post Review"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No reviews yet.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-darkText">{rev.user.name}</p>
                        <span className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-yellow-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-yellow-500" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Desktop Booking Box */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-20">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <span className="text-2xl font-extrabold text-primary">₹{venue.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Availability</span>
                  <span className="font-bold text-success">Check Calendar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reward Points</span>
                  <span className="font-bold text-orange-500">Earn ~{Math.floor(venue.price/1000)*10} Pts</span>
                </div>
              </div>

              <button onClick={handleBookNow} className="btn-primary w-full py-4 text-base shadow-lg">
                Book Now
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-4">You won't be charged yet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-between items-center z-40 pb-safe">
        <div>
          <span className="text-xl font-extrabold text-primary">₹{venue.price.toLocaleString()}</span>
          <span className="text-[10px] text-gray-500 font-medium block">Price per day</span>
        </div>
        <button onClick={handleBookNow} className="btn-primary py-3 px-8 text-sm shadow-md">
          Book Now
        </button>
      </div>
    </div>
  );
}
