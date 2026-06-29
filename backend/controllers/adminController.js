const User = require("../models/User");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");

// 1. Get platform-wide dashboard stats (earnings, metrics, counts, category split)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVenues = await Venue.countDocuments();
    const approvedVenues = await Venue.countDocuments({ isApproved: true });
    const pendingVenues = await Venue.countDocuments({ isApproved: false });
    
    const bookings = await Booking.find();
    const totalBookingsCount = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
    
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Calculate category breakdown
    const venues = await Venue.find();
    const categoryCounts = {};
    venues.forEach((v) => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
    });

    // Recent Bookings (limit to 6)
    // In-memory array doesn't support mongoose slice limits directly in query, so we sort & slice manually
    const sortedBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    for (let b of sortedBookings) {
      await b.populate("userId");
      await b.populate("venueId");
    }

    res.status(200).json({
      metrics: {
        users: totalUsers,
        venues: totalVenues,
        approvedVenues,
        pendingVenues,
        bookings: totalBookingsCount,
        confirmedBookings: confirmedBookings.length,
        revenue: totalRevenue,
      },
      categories: categoryCounts,
      recentBookings: sortedBookings.map((b) => ({
        id: b._id,
        user: b.userId ? b.userId.name : "Unknown",
        venue: b.venueId ? b.venueId.venueName : "Deleted Venue",
        amount: b.totalAmount,
        date: b.bookingDate,
        status: b.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading admin statistics", error: error.message });
  }
};

// 2. List all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const formatted = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error loading user directories", error: error.message });
  }
};

// 3. Promote/demote user roles (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "owner", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully", user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
};

// 4. Get all pending listings needing approval (Admin only)
exports.getPendingVenues = async (req, res) => {
  try {
    const pending = await Venue.find({ isApproved: false });
    for (let v of pending) {
      await v.populate("ownerId");
    }
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: "Error loading pending listings", error: error.message });
  }
};

// 5. Approve a venue listing (Admin only)
exports.approveVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue listing approved successfully", venue });
  } catch (error) {
    res.status(500).json({ message: "Error approving venue listing", error: error.message });
  }
};

// 6. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
