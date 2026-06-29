const Venue = require("../models/Venue");
const Review = require("../models/Review");

// 1. Get all approved venues (with filters)
exports.getAllVenues = async (req, res) => {
  try {
    const { category, location, capacity, maxPrice, date, ac, parking } = req.query;
    const query = { isApproved: true };

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }

    if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice) };
    }

    if (ac === "true") {
      query.ac = true;
    }

    if (parking === "true") {
      query.parking = true;
    }

    // Fetch venues
    let venues = await Venue.find(query);

    // Filter by date availability if provided
    if (date) {
      venues = venues.filter((venue) => {
        const dates = venue.availableDates || [];
        // Available dates are stored as 'YYYY-MM-DD'
        return dates.includes(date);
      });
    }

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching venues", error: error.message });
  }
};

// 2. Get single venue by ID (with populated owner details and reviews)
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Populate owner details
    await venue.populate("ownerId");

    // Fetch associated reviews
    const reviews = await Review.find({ venueId: venue._id });
    for (let rev of reviews) {
      await rev.populate("userId");
    }

    res.status(200).json({
      venue,
      reviews: reviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.userId ? { id: r.userId._id, name: r.userId.name } : { name: "Anonymous" },
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching venue details", error: error.message });
  }
};

// 3. Create a new venue listing (Owner/Admin)
exports.createVenue = async (req, res) => {
  try {
    const {
      venueName,
      category,
      location,
      address,
      googleMapsLink,
      priceRange,
      openingHours,
      capacity,
      price,
      ac,
      parking,
      contactNumber,
      description,
      images,
      amenities,
      availableDates,
      // Restaurant
      menu,
      tableReservation,
      birthdayDecoration,
      anniversaryPackages,
      familyDining,
      // Gaming
      gamesAvailable,
      pricePerHour,
      groupBooking,
      // Swimming
      adultPool,
      kidsPool,
      coachAvailable,
      monthlyMembership,
      dayPass,
      // Spa & Massage
      spaServices,
      massagePackages,
      steamBath,
      appointmentBooking,
    } = req.body;

    if (!venueName || !category || !location || !capacity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Default dates if none provided: set next 14 days as available
    let datesList = availableDates;
    if (!datesList || datesList.length === 0) {
      datesList = [];
      const today = new Date();
      for (let i = 1; i <= 14; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        datesList.push(nextDay.toISOString().split("T")[0]);
      }
    }

    const newVenue = await Venue.create({
      venueName,
      category,
      location,
      address: address || "",
      googleMapsLink: googleMapsLink || "",
      priceRange: priceRange || "₹₹",
      openingHours: openingHours || "09:00 AM - 10:00 PM",
      capacity: parseInt(capacity),
      price: parseInt(price),
      ac: ac === true || ac === "true",
      parking: parking === true || parking === "true",
      contactNumber: contactNumber || "",
      description: description || "",
      images: images || [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      ],
      amenities: amenities || [],
      availableDates: datesList,
      ownerId: req.user.id,
      isApproved: req.user.role === "admin", // Admin added is automatically approved; owners need admin approval
      // Restaurant
      menu: menu || [],
      tableReservation: tableReservation === true || tableReservation === "true",
      birthdayDecoration: birthdayDecoration === true || birthdayDecoration === "true",
      anniversaryPackages: anniversaryPackages === true || anniversaryPackages === "true",
      familyDining: familyDining === true || familyDining === "true",
      // Gaming
      gamesAvailable: gamesAvailable || [],
      pricePerHour: pricePerHour ? parseInt(pricePerHour) : 0,
      groupBooking: groupBooking === true || groupBooking === "true",
      // Swimming
      adultPool: adultPool === true || adultPool === "true",
      kidsPool: kidsPool === true || kidsPool === "true",
      coachAvailable: coachAvailable === true || coachAvailable === "true",
      monthlyMembership: monthlyMembership ? parseInt(monthlyMembership) : 0,
      dayPass: dayPass ? parseInt(dayPass) : 0,
      // Spa & Massage
      spaServices: spaServices || [],
      massagePackages: massagePackages || [],
      steamBath: steamBath === true || steamBath === "true",
      appointmentBooking: appointmentBooking === true || appointmentBooking === "true",
    });

    res.status(201).json({ message: "Venue created successfully", venue: newVenue });
  } catch (error) {
    res.status(500).json({ message: "Error creating venue", error: error.message });
  }
};

// 4. Update a venue listing (Owner/Admin)
exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Access control: Only owner or admin can edit
    if (venue.ownerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this venue" });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({ message: "Venue updated successfully", venue: updatedVenue });
  } catch (error) {
    res.status(500).json({ message: "Error updating venue", error: error.message });
  }
};

// 5. Delete a venue listing (Owner/Admin)
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Access check
    if (venue.ownerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this venue" });
    }

    await Venue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting venue", error: error.message });
  }
};

// 6. Get owner-specific venue listings
exports.getOwnerVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user.id });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving owner venues", error: error.message });
  }
};

// 7. Add a review to a venue (User role)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const venueId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Create the review
    const review = await Review.create({
      userId: req.user.id,
      venueId: venue._id,
      rating: parseInt(rating),
      comment,
    });

    // Recompute venue rating average
    const allReviews = await Review.find({ venueId: venue._id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / allReviews.length).toFixed(1));

    await Venue.findByIdAndUpdate(venueId, {
      rating: avgRating,
      reviewsCount: allReviews.length,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};
