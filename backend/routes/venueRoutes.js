const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// Public routes
router.get("/", venueController.getAllVenues);
router.get("/detail/:id", venueController.getVenueById);

// Owner/Admin routes
router.get(
  "/owner",
  verifyToken,
  allowRoles(["owner", "admin"]),
  venueController.getOwnerVenues
);
router.post(
  "/",
  verifyToken,
  allowRoles(["owner", "admin"]),
  venueController.createVenue
);
router.put(
  "/:id",
  verifyToken,
  allowRoles(["owner", "admin"]),
  venueController.updateVenue
);
router.delete(
  "/:id",
  verifyToken,
  allowRoles(["owner", "admin"]),
  venueController.deleteVenue
);

// Review routes (Authenticated users)
router.post("/:id/reviews", verifyToken, venueController.addReview);

module.exports = router;
