const mongoose = require("mongoose");
const { createModel } = require("./dbWrapper");

const VenueSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: "",
    },
    googleMapsLink: {
      type: String,
      required: true,
      default: "",
    },
    priceRange: {
      type: String,
      default: "₹₹",
    },
    openingHours: {
      type: String,
      default: "09:00 AM - 10:00 PM",
    },
    capacity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ac: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    contactNumber: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    availableDates: {
      type: [String],
      default: [],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Category-specific details (Restaurant)
    menu: {
      type: [String],
      default: [],
    },
    tableReservation: {
      type: Boolean,
      default: false,
    },
    birthdayDecoration: {
      type: Boolean,
      default: false,
    },
    anniversaryPackages: {
      type: Boolean,
      default: false,
    },
    familyDining: {
      type: Boolean,
      default: false,
    },
    // Category-specific details (Gaming)
    gamesAvailable: {
      type: [String],
      default: [],
    },
    pricePerHour: {
      type: Number,
      default: 0,
    },
    groupBooking: {
      type: Boolean,
      default: false,
    },
    // Category-specific details (Swimming)
    adultPool: {
      type: Boolean,
      default: false,
    },
    kidsPool: {
      type: Boolean,
      default: false,
    },
    coachAvailable: {
      type: Boolean,
      default: false,
    },
    monthlyMembership: {
      type: Number,
      default: 0,
    },
    dayPass: {
      type: Number,
      default: 0,
    },
    // Category-specific details (Spa & Massage)
    spaServices: {
      type: [String],
      default: [],
    },
    massagePackages: {
      type: [String],
      default: [],
    },
    steamBath: {
      type: Boolean,
      default: false,
    },
    appointmentBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = createModel("Venue", VenueSchema);
