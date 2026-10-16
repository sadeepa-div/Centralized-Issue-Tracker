const express = require("express");

const {
  getDevelopers,
  getTeamUsers,
  getProjectDevelopers,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/developers", protect, getDevelopers);

router.get("/team", protect, getTeamUsers);

router.get("/project/:projectId/developers", protect, getProjectDevelopers);

module.exports = router;
