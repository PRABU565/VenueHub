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

  // Restaurant options
  const [menuInput, setMenuInput] = useState("");
  const [tableReservation, setTableReservation] = useState(false);
  const [birthdayDecoration, setBirthdayDecoration] = useState(false);
  const [anniversaryPackages, setAnniversaryPackages] = useState(false);
  const [familyDining, setFamilyDining] = useState(false);

  // Gaming options
  const [gamesInput, setGamesInput] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [groupBooking, setGroupBooking] = useState(false);

  // Swimming options
  const [adultPool, setAdultPool] = useState(false);
  const [kidsPool, setKidsPool] = useState(false);
  const [coachAvailable, setCoachAvailable] = useState(false);
  const [monthlyMembership, setMonthlyMembership] = useState("");
  const [dayPass, setDayPass] = useState("");

  // Spa options
  const [spaServicesInput, setSpaServicesInput] = useState("");
  const [massagePackagesInput, setMassagePackagesInput] = useState("");
  const [steamBath, setSteamBath] = useState(false);
  const [appointmentBooking, setAppointmentBooking] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Edit Venue state
  const [editingVenue, setEditingVenue] = useState(null);
  
  // Edit Form states
  const [editVenueName, setEditVenueName] = useState("");
  const [editCategory, setEditCategory] = useState("Party Hall");
  const [editLocation, setEditLocation] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editGoogleMapsLink, setEditGoogleMapsLink] = useState("");
  const [editPriceRange, setEditPriceRange] = useState("₹₹");
  const [editOpeningHours, setEditOpeningHours] = useState("09:00 AM - 10:00 PM");
  const [editCapacity, setEditCapacity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmenitiesInput, setEditAmenitiesInput] = useState("");
  const [editImageInput, setEditImageInput] = useState("");
  
  // Edit Restaurant options
  const [editMenuInput, setEditMenuInput] = useState("");
  const [editTableReservation, setEditTableReservation] = useState(false);
  const [editBirthdayDecoration, setEditBirthdayDecoration] = useState(false);
  const [editAnniversaryPackages, setEditAnniversaryPackages] = useState(false);
  const [editFamilyDining, setEditFamilyDining] = useState(false);

  // Edit Gaming options
  const [editGamesInput, setEditGamesInput] = useState("");
  const [editPricePerHour, setEditPricePerHour] = useState("");
  const [editGroupBooking, setEditGroupBooking] = useState(false);

  // Edit Swimming options
  const [editAdultPool, setEditAdultPool] = useState(false);
  const [editKidsPool, setEditKidsPool] = useState(false);
  const [editCoachAvailable, setEditCoachAvailable] = useState(false);
  const [editMonthlyMembership, setEditMonthlyMembership] = useState("");
  const [editDayPass, setEditDayPass] = useState("");

  // Edit Spa options
  const [editSpaServicesInput, setEditSpaServicesInput] = useState("");
  const [editMassagePackagesInput, setEditMassagePackagesInput] = useState("");
  const [editSteamBath, setEditSteamBath] = useState(false);
  const [editAppointmentBooking, setEditAppointmentBooking] = useState(false);

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
      // Parse amenities from comma-separated list
      const amenities = amenitiesInput
        ? amenitiesInput.split(",").map((a) => a.trim()).filter((a) => a !== "")
        : ["AC", "Audio System", "Stage Setup"];

      // Parse image URLs from comma-separated list
      const images = imageInput
        ? imageInput.split(",").map((i) => i.trim()).filter((i) => i !== "")
        : [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
          ];

      await api.post("/venues", {
        venueName,
        category,
        location,
        address,
        googleMapsLink,
        priceRange,
        openingHours,
        capacity: parseInt(capacity),
        price: parseInt(price),
        description,
        amenities,
        images,
        // Restaurant
        menu: menuInput ? menuInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        tableReservation,
        birthdayDecoration,
        anniversaryPackages,
        familyDining,
        // Gaming
        gamesAvailable: gamesInput ? gamesInput.split(",").map(g => g.trim()).filter(g => g !== "") : [],
        pricePerHour: pricePerHour ? parseInt(pricePerHour) : 0,
        groupBooking,
        // Swimming
        adultPool,
        kidsPool,
        coachAvailable,
        monthlyMembership: monthlyMembership ? parseInt(monthlyMembership) : 0,
        dayPass: dayPass ? parseInt(dayPass) : 0,
        // Spa
        spaServices: spaServicesInput ? spaServicesInput.split(",").map(s => s.trim()).filter(s => s !== "") : [],
        massagePackages: massagePackagesInput ? massagePackagesInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        steamBath,
        appointmentBooking,
      });

      showAlert("Venue created successfully and sent to Admin for approval!", "success");
      
      // Reset form fields
      setVenueName("");
      setLocation("");
      setAddress("");
      setGoogleMapsLink("");
      setPriceRange("₹₹");
      setOpeningHours("09:00 AM - 10:00 PM");
      setCapacity("");
      setPrice("");
      setDescription("");
      setAmenitiesInput("");
      setImageInput("");
      setMenuInput("");
      setTableReservation(false);
      setBirthdayDecoration(false);
      setAnniversaryPackages(false);
      setFamilyDining(false);
      setGamesInput("");
      setPricePerHour("");
      setGroupBooking(false);
      setAdultPool(false);
      setKidsPool(false);
      setCoachAvailable(false);
      setMonthlyMembership("");
      setDayPass("");
      setSpaServicesInput("");
      setMassagePackagesInput("");
      setSteamBath(false);
      setAppointmentBooking(false);
      
      // Refresh list and swap back to listings tab
      fetchOwnerData();
      setActiveTab("listings");
    } catch (err) {
      showAlert("Listing creation failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (venue) => {
    setEditingVenue(venue);
    setEditVenueName(venue.venueName || "");
    setEditCategory(venue.category || "Party Hall");
    setEditLocation(venue.location || "");
    setEditAddress(venue.address || "");
    setEditGoogleMapsLink(venue.googleMapsLink || "");
    setEditPriceRange(venue.priceRange || "₹₹");
    setEditOpeningHours(venue.openingHours || "09:00 AM - 10:00 PM");
    setEditCapacity(venue.capacity || "");
    setEditPrice(venue.price || "");
    setEditDescription(venue.description || "");
    setEditAmenitiesInput(venue.amenities ? venue.amenities.join(", ") : "");
    setEditImageInput(venue.images ? venue.images.join(", ") : "");

    // Restaurant
    setEditMenuInput(venue.menu ? venue.menu.join(", ") : "");
    setEditTableReservation(venue.tableReservation || false);
    setEditBirthdayDecoration(venue.birthdayDecoration || false);
    setEditAnniversaryPackages(venue.anniversaryPackages || false);
    setEditFamilyDining(venue.familyDining || false);

    // Gaming
    setEditGamesInput(venue.gamesAvailable ? venue.gamesAvailable.join(", ") : "");
    setEditPricePerHour(venue.pricePerHour || "");
    setEditGroupBooking(venue.groupBooking || false);

    // Swimming
    setEditAdultPool(venue.adultPool || false);
    setEditKidsPool(venue.kidsPool || false);
    setEditCoachAvailable(venue.coachAvailable || false);
    setEditMonthlyMembership(venue.monthlyMembership || "");
    setEditDayPass(venue.dayPass || "");

    // Spa
    setEditSpaServicesInput(venue.spaServices ? venue.spaServices.join(", ") : "");
    setEditMassagePackagesInput(venue.massagePackages ? venue.massagePackages.join(", ") : "");
    setEditSteamBath(venue.steamBath || false);
    setEditAppointmentBooking(venue.appointmentBooking || false);
  };

  const handleUpdateVenue = async (e) => {
    e.preventDefault();
    if (!editVenueName || !editLocation || !editCapacity || !editPrice) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const amenities = editAmenitiesInput
        ? editAmenitiesInput.split(",").map((a) => a.trim()).filter((a) => a !== "")
        : [];
      const images = editImageInput
        ? editImageInput.split(",").map((i) => i.trim()).filter((i) => i !== "")
        : [];
      
      const updateData = {
        venueName: editVenueName,
        category: editCategory,
        location: editLocation,
        address: editAddress,
        googleMapsLink: editGoogleMapsLink,
        priceRange: editPriceRange,
        openingHours: editOpeningHours,
        capacity: parseInt(editCapacity),
        price: parseInt(editPrice),
        description: editDescription,
        amenities,
        images,
        // Restaurant
        menu: editMenuInput ? editMenuInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        tableReservation: editTableReservation,
        birthdayDecoration: editBirthdayDecoration,
        anniversaryPackages: editAnniversaryPackages,
        familyDining: editFamilyDining,
        // Gaming
        gamesAvailable: editGamesInput ? editGamesInput.split(",").map(g => g.trim()).filter(g => g !== "") : [],
        pricePerHour: editPricePerHour ? parseInt(editPricePerHour) : 0,
        groupBooking: editGroupBooking,
        // Swimming
        adultPool: editAdultPool,
        kidsPool: editKidsPool,
        coachAvailable: editCoachAvailable,
        monthlyMembership: editMonthlyMembership ? parseInt(editMonthlyMembership) : 0,
        dayPass: editDayPass ? parseInt(editDayPass) : 0,
        // Spa
        spaServices: editSpaServicesInput ? editSpaServicesInput.split(",").map(s => s.trim()).filter(s => s !== "") : [],
        massagePackages: editMassagePackagesInput ? editMassagePackagesInput.split(",").map(m => m.trim()).filter(m => m !== "") : [],
        steamBath: editSteamBath,
        appointmentBooking: editAppointmentBooking,
      };

      await api.put(`/venues/${editingVenue._id}`, updateData);
      showAlert("Venue updated successfully!", "success");
      setEditingVenue(null);
      fetchOwnerData();
    } catch (err) {
      showAlert("Listing update failed.", "error");
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

  // Calculations for analytics cards
  const activeBookings = bookings.filter((b) => b.status === "Confirmed");
  const totalEarnings = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-white">Owner Panel</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">
          Review bookings, list new event spaces, and track your platform earnings
        </p>
      </div>

      {/* Metrics Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-brand-400">
            <Landmark size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Spaces Listed</span>
            <span className="text-xl font-extrabold text-slate-200">{venues.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-accent-400">
            <Clipboard size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Reservations Filled</span>
            <span className="text-xl font-extrabold text-slate-200">{activeBookings.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-emerald-400">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gross Revenue</span>
            <span className="text-xl font-extrabold text-slate-200">₹{totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors Navbar */}
      <div className="flex gap-4 border-b border-slate-900 mb-8 pb-px">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-4 text-sm font-semibold transition-all relative ${
            activeTab === "listings" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          My Listings
          {activeTab === "listings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 text-sm font-semibold transition-all relative ${
            activeTab === "bookings" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Received Reservations
          {activeTab === "bookings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-1 ${
            activeTab === "add" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <PlusCircle size={14} /> Add Venue
          {activeTab === "add" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>
      </div>

      {/* Tabs panels */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Clock className="animate-spin text-slate-500" size={24} />
        </div>
      ) : activeTab === "listings" ? (
        /* LISTINGS TAB PANEL */
        venues.length === 0 ? (
          <div className="glass-card p-12 text-center border-slate-900/60 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-slate-300">No Listings Added</h3>
            <p className="text-xs text-slate-400 mt-2">Get started by listing your marriage hall, restaurant, spa, gaming arena, or party space.</p>
            <button onClick={() => setActiveTab("add")} className="btn-primary py-2 px-6 mt-6 text-xs font-semibold mx-auto">
              Add New Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue._id} className="glass-card overflow-hidden border-slate-900 flex flex-col justify-between">
                <div>
                  <div className="relative h-40 bg-slate-950">
                    <img src={venue.images[0]} alt={venue.venueName} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                      {venue.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{venue.venueName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{venue.location}</p>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-[10px] text-slate-500 font-bold">Status:</span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          venue.isApproved
                            ? "bg-emerald-950/40 border border-emerald-500/25 text-emerald-400"
                            : "bg-amber-950/40 border border-amber-500/25 text-amber-400"
                        }`}
                      >
                        {venue.isApproved ? "Approved" : "Pending Admin"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-900/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400">₹{venue.price.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(venue)}
                      className="text-slate-500 hover:text-brand-400 hover:bg-slate-950 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
                      title="Edit listing"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue._id)}
                      className="text-slate-500 hover:text-red-400 hover:bg-slate-950 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "bookings" ? (
        /* BOOKINGS TAB PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Log List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-slate-200">Reservation Log</h2>
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold py-8">No reservations have been placed on your listings.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="glass-card p-5 border-slate-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                          : booking.status === "Pending"
                          ? "bg-amber-950/40 border-amber-500/20 text-amber-400"
                          : "bg-red-950/40 border-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-2">{booking.venueId ? booking.venueId.venueName : "Deleted Venue"}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Guest: {booking.userId ? booking.userId.name : "Anonymous"}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-2 font-semibold">
                      <Calendar size={10} className="text-brand-400" /> {booking.bookingDate}
                    </p>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-900/60 w-full sm:w-auto">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Received</span>
                    <span className="text-sm font-extrabold text-brand-400">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Analytics Visual Panel */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-base font-bold text-slate-200">Revenue Analytics</h2>
            
            <div className="glass-card p-5 border-slate-900/60 space-y-6">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Total Bookings Gross</span>
                <span className="text-slate-200">₹{totalEarnings.toLocaleString()}</span>
              </div>

              {/* Simple premium SVG Analytics Graph chart */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-end h-44">
                {/* Visual SVG bar graphs */}
                <svg className="w-full h-32" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />

                  {/* SVG Bars simulating weekly peaks */}
                  <rect x="5" y="60" width="10" height="40" rx="2" fill="url(#violet-grad)" />
                  <rect x="25" y="30" width="10" height="70" rx="2" fill="url(#violet-grad)" />
                  <rect x="45" y="45" width="10" height="55" rx="2" fill="url(#violet-grad)" />
                  <rect x="65" y="15" width="10" height="85" rx="2" fill="url(#emerald-grad)" />
                  <rect x="85" y="35" width="10" height="65" rx="2" fill="url(#violet-grad)" />

                  <defs>
                    <linearGradient id="violet-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="emerald-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X labels */}
                <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase mt-2 pl-1 pr-1">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Active</span>
                  <span>Wk 5</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-semibold leading-relaxed bg-slate-950/20 p-3 rounded-lg border border-slate-900/60 flex gap-2">
                <BarChart2 size={16} className="text-brand-400 shrink-0 mt-0.5" />
                <span>Green bar represents current billing cycle peak payouts. Revenues clear into account within 24 hours of event check-out.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ADD VENUE FORM TAB */
        <div className="max-w-2xl mx-auto glass-card p-8 border-slate-900">
          <h2 className="text-lg font-bold text-slate-200 border-b border-slate-900 pb-3 mb-6">List New Space</h2>

          <form onSubmit={handleCreateVenue} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Venue Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Business / Space Name *</label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Sri Saravana Restaurant"
                  className="glass-input"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input text-slate-300"
                >
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
              {/* Location Select Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Location City *</label>
                <select
                  value={location}
                  required
                  onChange={(e) => setLocation(e.target.value)}
                  className="glass-input text-slate-300"
                >
                  <option value="">-- Select Location --</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Avadi">Avadi</option>
                  <option value="Ambattur">Ambattur</option>
                  <option value="Poonamallee">Poonamallee</option>
                  <option value="Thiruvallur">Thiruvallur</option>
                  <option value="Tiruvallur">Tiruvallur</option>
                  <option value="Arakkonam">Arakkonam</option>
                </select>
              </div>

              {/* Detailed Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Detailed Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 2, Sathyamoorthy St, Suvalpet"
                  className="glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Google Maps Link */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-xs font-bold text-slate-400">Google Maps Link *</label>
                <input
                  type="url"
                  required
                  value={googleMapsLink}
                  onChange={(e) => setGoogleMapsLink(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="glass-input text-xs"
                />
              </div>

              {/* Opening Hours */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-xs font-bold text-slate-400">Opening Hours</label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 09:00 AM - 10:00 PM"
                  className="glass-input"
                />
              </div>

              {/* Price Range */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-xs font-bold text-slate-400">Price Range Indicator</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="glass-input text-slate-300"
                >
                  <option value="₹">₹ (Budget)</option>
                  <option value="₹₹">₹₹ (Moderate)</option>
                  <option value="₹₹₹">₹₹₹ (Premium)</option>
                  <option value="₹₹₹₹">₹₹₹₹ (Ultra Luxury)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capacity */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Max Capacity *</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Max guests / visitors"
                  className="glass-input"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Price Rent / Base Booking *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="₹ Amount"
                  className="glass-input"
                />
              </div>
            </div>

            {/* CATEGORY SPECIFIC FIELDS */}
            <div className="border-t border-slate-900 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-300">Category-Specific Configurations ({category})</h3>

              {category === "Restaurant" && (
                <div className="space-y-4 animate-slide-down">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Recommended Menu (Comma separated)</label>
                    <input
                      type="text"
                      value={menuInput}
                      onChange={(e) => setMenuInput(e.target.value)}
                      placeholder="Biryani, Paneer Dosa, South Indian Meals"
                      className="glass-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={tableReservation} onChange={(e) => setTableReservation(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Table Reservation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={birthdayDecoration} onChange={(e) => setBirthdayDecoration(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Birthday Decoration</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={anniversaryPackages} onChange={(e) => setAnniversaryPackages(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Anniversary Packages</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={familyDining} onChange={(e) => setFamilyDining(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Family Dining</span>
                    </label>
                  </div>
                </div>
              )}

              {category === "Gaming" && (
                <div className="space-y-4 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Games Available (Comma separated)</label>
                      <input
                        type="text"
                        value={gamesInput}
                        onChange={(e) => setGamesInput(e.target.value)}
                        placeholder="PS5 VR, Box Cricket, Escape Rooms"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Price per Hour (₹)</label>
                      <input
                        type="number"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        placeholder="₹/Hour"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={groupBooking} onChange={(e) => setGroupBooking(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                    <span className="text-xs font-semibold text-slate-300">Group Booking Available</span>
                  </label>
                </div>
              )}

              {category === "Swimming" && (
                <div className="space-y-4 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Day Pass Price (₹)</label>
                      <input
                        type="number"
                        value={dayPass}
                        onChange={(e) => setDayPass(e.target.value)}
                        placeholder="₹ Day Pass"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Monthly Membership Price (₹)</label>
                      <input
                        type="number"
                        value={monthlyMembership}
                        onChange={(e) => setMonthlyMembership(e.target.value)}
                        placeholder="₹ Monthly Membership"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={adultPool} onChange={(e) => setAdultPool(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Adult Pool</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={kidsPool} onChange={(e) => setKidsPool(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Kids Pool</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={coachAvailable} onChange={(e) => setCoachAvailable(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Coach Available</span>
                    </label>
                  </div>
                </div>
              )}

              {category === "Spa & Massage" && (
                <div className="space-y-4 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Spa Services (Comma separated)</label>
                      <input
                        type="text"
                        value={spaServicesInput}
                        onChange={(e) => setSpaServicesInput(e.target.value)}
                        placeholder="Sauna, Pedicure, Facial"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Massage Packages (Comma separated)</label>
                      <input
                        type="text"
                        value={massagePackagesInput}
                        onChange={(e) => setMassagePackagesInput(e.target.value)}
                        placeholder="Deep Tissue, Thai Therapy"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={steamBath} onChange={(e) => setSteamBath(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Steam Bath Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={appointmentBooking} onChange={(e) => setAppointmentBooking(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Appointment Booking</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Brief Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about dimensions, catering details, dressing facilities..."
                className="glass-input resize-none"
              />
            </div>

            {/* Amenities Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Amenities (Comma separated)</label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="AC, Buffet, Valet Parking, Audio System"
                className="glass-input"
              />
            </div>

            {/* Images Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Photo Links (Comma separated URLs)</label>
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="http://example.com/pic1.jpg, http://example.com/pic2.jpg"
                className="glass-input"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-4 text-xs font-bold uppercase tracking-wider">
              {submitting ? "Submitting Listing..." : "Register Venue Listing"}
            </button>
          </form>
        </div>
      )}

      {/* 5. EDIT VENUE OVERLAY MODAL */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Edit Business Profile</h3>
                <p className="text-[11px] text-slate-400">Update availability, links, pricing and category-specific setups</p>
              </div>
              <button
                onClick={() => setEditingVenue(null)}
                className="text-slate-400 hover:text-slate-200 font-bold text-sm bg-slate-950/80 p-2 rounded-lg border border-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateVenue} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Edit Venue Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Business / Space Name *</label>
                  <input
                    type="text"
                    required
                    value={editVenueName}
                    onChange={(e) => setEditVenueName(e.target.value)}
                    className="glass-input text-slate-200"
                  />
                </div>

                {/* Edit Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="glass-input text-slate-300"
                  >
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
                {/* Edit Location Select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Location City *</label>
                  <select
                    value={editLocation}
                    required
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="glass-input text-slate-300"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Avadi">Avadi</option>
                    <option value="Ambattur">Ambattur</option>
                    <option value="Poonamallee">Poonamallee</option>
                    <option value="Thiruvallur">Thiruvallur</option>
                    <option value="Tiruvallur">Tiruvallur</option>
                    <option value="Arakkonam">Arakkonam</option>
                  </select>
                </div>

                {/* Edit Detailed Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Detailed Address *</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Edit Google Maps Link */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-bold text-slate-400">Google Maps Link *</label>
                  <input
                    type="url"
                    required
                    value={editGoogleMapsLink}
                    onChange={(e) => setEditGoogleMapsLink(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>

                {/* Edit Opening Hours */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-bold text-slate-400">Opening Hours</label>
                  <input
                    type="text"
                    value={editOpeningHours}
                    onChange={(e) => setEditOpeningHours(e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* Edit Price Range */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-bold text-slate-400">Price Range Indicator</label>
                  <select
                    value={editPriceRange}
                    onChange={(e) => setEditPriceRange(e.target.value)}
                    className="glass-input text-slate-300"
                  >
                    <option value="₹">₹ (Budget)</option>
                    <option value="₹₹">₹₹ (Moderate)</option>
                    <option value="₹₹₹">₹₹₹ (Premium)</option>
                    <option value="₹₹₹₹">₹₹₹₹ (Ultra Luxury)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Edit Capacity */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Max Capacity *</label>
                  <input
                    type="number"
                    required
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* Edit Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Price Rent / Base Booking *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              {/* EDIT CATEGORY SPECIFIC FIELDS */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Category Specifications ({editCategory})</h3>

                {editCategory === "Restaurant" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Recommended Menu (Comma separated)</label>
                      <input
                        type="text"
                        value={editMenuInput}
                        onChange={(e) => setEditMenuInput(e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editTableReservation} onChange={(e) => setEditTableReservation(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Table Reservation</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editBirthdayDecoration} onChange={(e) => setEditBirthdayDecoration(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Birthday Decoration</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editAnniversaryPackages} onChange={(e) => setEditAnniversaryPackages(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Anniversary Packages</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editFamilyDining} onChange={(e) => setEditFamilyDining(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Family Dining</span>
                      </label>
                    </div>
                  </div>
                )}

                {editCategory === "Gaming" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Games Available (Comma separated)</label>
                        <input
                          type="text"
                          value={editGamesInput}
                          onChange={(e) => setEditGamesInput(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Price per Hour (₹)</label>
                        <input
                          type="number"
                          value={editPricePerHour}
                          onChange={(e) => setEditPricePerHour(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={editGroupBooking} onChange={(e) => setEditGroupBooking(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-300">Group Booking Available</span>
                    </label>
                  </div>
                )}

                {editCategory === "Swimming" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Day Pass Price (₹)</label>
                        <input
                          type="number"
                          value={editDayPass}
                          onChange={(e) => setEditDayPass(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Monthly Membership Price (₹)</label>
                        <input
                          type="number"
                          value={editMonthlyMembership}
                          onChange={(e) => setEditMonthlyMembership(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editAdultPool} onChange={(e) => setEditAdultPool(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Adult Pool</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editKidsPool} onChange={(e) => setEditKidsPool(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Kids Pool</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editCoachAvailable} onChange={(e) => setEditCoachAvailable(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Coach Available</span>
                      </label>
                    </div>
                  </div>
                )}

                {editCategory === "Spa & Massage" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Spa Services (Comma separated)</label>
                        <input
                          type="text"
                          value={editSpaServicesInput}
                          onChange={(e) => setEditSpaServicesInput(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">Massage Packages (Comma separated)</label>
                        <input
                          type="text"
                          value={editMassagePackagesInput}
                          onChange={(e) => setEditMassagePackagesInput(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editSteamBath} onChange={(e) => setEditSteamBath(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Steam Bath Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={editAppointmentBooking} onChange={(e) => setEditAppointmentBooking(e.target.checked)} className="w-4 h-4 rounded border-slate-800 text-brand-500 accent-brand-500 cursor-pointer" />
                        <span className="text-xs font-semibold text-slate-300">Appointment Booking</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Brief Description</label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="glass-input resize-none"
                />
              </div>

              {/* Edit Amenities */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={editAmenitiesInput}
                  onChange={(e) => setEditAmenitiesInput(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* Edit Images */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Photo Links (Comma separated URLs)</label>
                <input
                  type="text"
                  value={editImageInput}
                  onChange={(e) => setEditImageInput(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingVenue(null)}
                  className="btn-secondary w-full py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent w-full py-3 text-xs font-bold uppercase tracking-wider"
                >
                  {submitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
