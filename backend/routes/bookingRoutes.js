const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// All booking routes require a logged-in user
router.use(verifyToken);

router.post("/", bookingController.createBooking);
router.post("/confirm", bookingController.confirmPayment);
router.get("/my", bookingController.getUserBookings);

router.get(
  "/owner",
  allowRoles(["owner", "admin"]),
  bookingController.getOwnerBookings
);
router.put("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
