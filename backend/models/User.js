const mongoose = require("mongoose");
const { createModel } = require("./dbWrapper");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue"
    }],
    rewardPoints: {
      type: Number,
      default: 0,
    },
    coupons: [{
      type: String,
    }],
  },
  { timestamps: true }
);

module.exports = createModel("User", UserSchema);
