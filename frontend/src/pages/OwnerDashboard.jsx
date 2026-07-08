import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Landmark, BookOpen, Users, DollarSign, Calendar, Image, Clipboard, Trash2, ArrowUpRight, BarChart2, CheckCircle, Clock, Edit, X } from "lucide-react";

export default function OwnerDashboard() {
  const { user, showAlert } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState("listings"); // "listings", "bookings", "add"
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating a venue
  const [venueName, setVenueName] = useState("");
  const [category, setCategory] = useState("Party Hall");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [priceRange, setPriceRange] = useState("₹₹");
  const [openingHours, setOpeningHours] = useState("09:00 AM - 10:00 PM");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  // Category specific states
  const [menuInput, setMenuInput] = useState("");
  const [tableReservation, setTableReservation] = useState(false);
  const [birthdayDecoration, setBirthdayDecoration] = useState(false);
  const [anniversaryPackages, setAnniversaryPackages] = useState(false);
  const [familyDining, setFamilyDining] = useState(false);
  const [gamesInput, setGamesInput] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [groupBooking, setGroupBooking] = useState(false);
  const [adultPool, setAdultPool] = useState(false);
  const [kidsPool, setKidsPool] = useState(false);
  const [coachAvailable, setCoachAvailable] = useState(false);
  const [monthlyMembership, setMonthlyMembership] = useState("");
  const [dayPass, setDayPass] = useState("");
  const [spaServicesInput, setSpaServicesInput] = useState("");
  const [massagePackagesInput, setMassagePackagesInput] = useState("");
  const [steamBath, setSteamBath] = useState(false);
  const [appointmentBooking, setAppointmentBooking] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const venuesRes = await api.get("/venues/owner");
      setVenues(venuesRes.data);

      const bookingsRes = await api.get("/bookings/owner");
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error loading owner data:", err.message);
      showAlert("Could not retrieve owner metrics.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    if (!venueName || !location || !capacity || !price) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const amenities = amenitiesInput ? amenitiesInput.split(",").map((a) => a.trim()).filter((a) => a !== "") : ["AC"];
      const images = imageInput ? imageInput.split(",").map((i) => i.trim()).filter((i) => i !== "") : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3"];

      await api.post("/venues", {
        venueName, category, location, address, googleMapsLink, priceRange, openingHours,
        capacity: parseInt(capacity), price: parseInt(price), description, amenities, images,
        menu: menuInput ? menuInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        tableReservation, birthdayDecoration, anniversaryPackages, familyDining,
        gamesAvailable: gamesInput ? gamesInput.split(",").map(g => g.trim()).filter(g => g !== "") : [],
        pricePerHour: pricePerHour ? parseInt(pricePerHour) : 0, groupBooking,
        adultPool, kidsPool, coachAvailable, monthlyMembership: monthlyMembership ? parseInt(monthlyMembership) : 0,
        dayPass: dayPass ? parseInt(dayPass) : 0,
        spaServices: spaServicesInput ? spaServicesInput.split(",").map(s => s.trim()).filter(s => s !== "") : [],
        massagePackages: massagePackagesInput ? massagePackagesInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        steamBath, appointmentBooking,
      });

      showAlert("Venue created successfully!", "success");
      fetchOwnerData();
      setActiveTab("listings");
    } catch (err) {
      showAlert("Listing creation failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/venues/${venueId}`);
      showAlert("Listing deleted successfully.", "success");
      fetchOwnerData();
    } catch (err) {
      showAlert("Failed to delete venue.", "error");
    }
  };

  const activeBookings = bookings.filter((b) => b.status === "Confirmed");
  const totalEarnings = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-display text-darkText">Owner Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your venues and track reservations.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <Landmark size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">My Listings</span>
              <span className="text-2xl font-extrabold text-darkText">{venues.length}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Clipboard size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Total Bookings</span>
              <span className="text-2xl font-extrabold text-darkText">{activeBookings.length}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Total Revenue</span>
              <span className="text-2xl font-extrabold text-darkText">₹{totalEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 pb-px overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab("listings")} className={`pb-4 font-bold text-sm whitespace-nowrap relative ${activeTab === "listings" ? "text-primary" : "text-gray-500"}`}>
            My Listings
            {activeTab === "listings" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
          <button onClick={() => setActiveTab("bookings")} className={`pb-4 font-bold text-sm whitespace-nowrap relative ${activeTab === "bookings" ? "text-primary" : "text-gray-500"}`}>
            Reservations
            {activeTab === "bookings" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
          <button onClick={() => setActiveTab("add")} className={`pb-4 font-bold text-sm whitespace-nowrap relative flex items-center gap-1 ${activeTab === "add" ? "text-primary" : "text-gray-500"}`}>
            <PlusCircle size={16} /> Add Venue
            {activeTab === "add" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : activeTab === "listings" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.length === 0 ? (
              <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-4">You haven't listed any venues yet.</p>
                <button onClick={() => setActiveTab("add")} className="btn-primary py-2 px-6">Add New Venue</button>
              </div>
            ) : (
              venues.map(venue => (
                <div key={venue._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="h-40 relative">
                    <img src={venue.images[0]} className="w-full h-full object-cover" alt="Venue"/>
                    <span className="absolute top-2 right-2 bg-white/90 text-[10px] font-bold px-2 py-1 rounded text-primary uppercase">{venue.category}</span>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-darkText line-clamp-1">{venue.venueName}</h3>
                    <p className="text-[11px] text-gray-500 mt-1">{venue.location}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${venue.isApproved ? "bg-green-50 text-success" : "bg-yellow-50 text-yellow-600"}`}>
                        {venue.isApproved ? "Approved" : "Pending"}
                      </span>
                      <span className="font-extrabold text-primary">₹{venue.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button onClick={() => handleDeleteVenue(venue._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "bookings" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-darkText mb-6">Recent Reservations</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No reservations found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking._id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="font-bold text-darkText">{booking.venueId?.venueName || "Deleted Venue"}</h3>
                      <p className="text-xs text-gray-500 mt-1">Guest: {booking.customerName} | Mobile: {booking.mobile}</p>
                      <p className="text-xs text-primary font-semibold mt-1">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded block mb-2 text-center ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                        booking.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>{booking.status}</span>
                      <span className="font-extrabold text-darkText">₹{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-darkText mb-6">Add New Venue</h2>
            <form onSubmit={handleCreateVenue} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Venue Name *</label>
                  <input type="text" required value={venueName} onChange={e => setVenueName(e.target.value)} className="modern-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="modern-input">
                    <option value="Party Hall">Party Hall</option>
                    <option value="Marriage Hall">Marriage Hall</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Spa & Massage">Spa & Massage</option>
                    <option value="Swimming">Swimming</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Location City *</label>
                  <select value={location} required onChange={e => setLocation(e.target.value)} className="modern-input">
                    <option value="">Select City</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Base Price (₹) *</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="modern-input" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Capacity / Pax *</label>
                <input type="number" required value={capacity} onChange={e => setCapacity(e.target.value)} className="modern-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Full Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Main St, Area" className="modern-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Google Maps Link</label>
                  <input type="url" value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="modern-input" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your venue..." className="modern-input min-h-[80px]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Image URLs (comma separated)</label>
                <input type="text" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://..." className="modern-input" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-4">
                {submitting ? "Submitting..." : "Submit for Approval"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
