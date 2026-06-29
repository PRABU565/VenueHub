const Booking = require("../models/Booking");
const Venue = require("../models/Venue");

// 1. Create a booking (Starts as Pending)
exports.createBooking = async (req, res) => {
  try {
    const { venueId, bookingDate, customerName, mobile, functionType } = req.body;

    if (!venueId || !bookingDate) {
      return res.status(400).json({ message: "Venue ID and booking date are required" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (!venue.isApproved) {
      return res.status(400).json({ message: "This venue is not active yet" });
    }

    // Check if the requested date is in the availableDates array
    if (!venue.availableDates.includes(bookingDate)) {
      return res.status(400).json({
        message: "This venue is not available for booking on the selected date.",
      });
    }

    // Create the pending booking
    const booking = await Booking.create({
      userId: req.user.id,
      venueId: venue._id,
      bookingDate,
      totalAmount: venue.price,
      customerName: customerName || "",
      mobile: mobile || "",
      functionType: functionType || "",
      status: "Pending",
      paymentDetails: {
        transactionId: "",
        status: "Pending",
        method: "Razorpay Simulation",
      },
    });

    res.status(201).json({
      message: "Booking initialized. Please complete payment.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Error initiating booking", error: error.message });
  }
};

// 2. Confirm Booking (Simulating Payment Gateway webhook / client success callback)
exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, transactionId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Confirmed") {
      return res.status(200).json({ message: "Booking already confirmed", booking });
    }

    // Verify venue is still available for this date (prevent race conditions)
    const venue = await Venue.findById(booking.venueId);
    if (!venue || !venue.availableDates.includes(booking.bookingDate)) {
      booking.status = "Cancelled";
      booking.paymentDetails.status = "Failed";
      await booking.save();
      return res.status(400).json({
        message: "Venue slot is no longer available. Payment refunded.",
        booking,
      });
    }

    // Confirm booking and update transaction
    booking.status = "Confirmed";
    booking.paymentDetails.status = "Paid";
    booking.paymentDetails.transactionId = transactionId || "pay_sim_" + Math.random().toString(36).substring(7);
    await booking.save();

    // Pull the date out of the availableDates array so it cannot be double-booked
    await Venue.findByIdAndUpdate(booking.venueId, {
      $pull: { availableDates: booking.bookingDate },
    });

    res.status(200).json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error confirming payment", error: error.message });
  }
};

// 3. Get Bookings for Logged In User
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    
    // Populate venue details
    for (let b of bookings) {
      await b.populate("venueId");
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// 4. Get Bookings for Venue Owner (Bookings on venues they own)
exports.getOwnerBookings = async (req, res) => {
  try {
    // 1. Find all venues owned by this user
    const ownerVenues = await Venue.find({ ownerId: req.user.id });
    const venueIds = ownerVenues.map((v) => v._id);

    // 2. Find all bookings for these venues
    const bookings = await Booking.find({ venueId: { $in: venueIds } });
    
    // Populate user and venue detail
    for (let b of bookings) {
      await b.populate("userId");
      await b.populate("venueId");
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner bookings", error: error.message });
  }
};

// 5. Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Access check: only customer who booked, venue owner, or admin can cancel
    const venue = await Venue.findById(booking.venueId);
    const isUserOwnerOfVenue = venue && venue.ownerId.toString() === req.user.id;
    const isCustomerWhoBooked = booking.userId.toString() === req.user.id;

    if (!isCustomerWhoBooked && !isUserOwnerOfVenue && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Unauthorized cancellation" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const oldStatus = booking.status;
    booking.status = "Cancelled";
    booking.paymentDetails.status = "Refunded";
    await booking.save();

    // If it was already confirmed, put the date back to the availableDates array
    if (oldStatus === "Confirmed") {
      await Venue.findByIdAndUpdate(booking.venueId, {
        $push: { availableDates: booking.bookingDate },
      });
    }

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};
