const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// All admin routes require token authentication and Admin role
router.use(verifyToken);
router.use(allowRoles(["admin"]));

router.get("/stats", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/venues/pending", adminController.getPendingVenues);
router.put("/venues/:id/approve", adminController.approveVenue);

module.exports = router;
