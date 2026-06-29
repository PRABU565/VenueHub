const mongoose = require("mongoose");
const { createModel } = require("./dbWrapper");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: "",
    },
    functionType: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    paymentDetails: {
      transactionId: { type: String, default: "" },
      status: { type: String, default: "Pending" },
      method: { type: String, default: "Simulated Card" },
    },
  },
  { timestamps: true }
);

module.exports = createModel("Booking", BookingSchema);
