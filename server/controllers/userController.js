const User = require("../models/User");
const Project = require("../models/Project");

// ============================
// GET ALL DEVELOPERS
// ============================
const getDevelopers = async (req, res) => {
  try {
    const developers = await User.find({
      role: "Developer",
    }).select("-password");

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================
// GET TEAM USERS
// ============================
const getTeamUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $in: ["Developer", "Tester"],
      },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================
// GET DEVELOPERS OF ONE PROJECT
// ============================
const getProjectDevelopers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "members",
      "name email role",
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const developers = project.members.filter(
      (member) => member.role === "Developer",
    );

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDevelopers,
  getTeamUsers,
  getProjectDevelopers,
};
