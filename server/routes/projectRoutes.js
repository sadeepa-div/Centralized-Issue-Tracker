const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  addProjectMember,
  removeProjectMember,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all projects
router.get("/", protect, getProjects);

// Create project
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Project Manager"),
  createProject,
);

// Get one project
router.get("/:id", protect, getProjectById);

// Add project member
router.patch(
  "/:id/members",
  protect,
  authorizeRoles("Admin", "Project Manager"),
  addProjectMember,
);

// Remove project member
router.delete(
  "/:id/members/:userId",
  protect,
  authorizeRoles("Admin", "Project Manager"),
  removeProjectMember,
);

// Delete project
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "Project Manager"),
  deleteProject,
);

module.exports = router;
