const User = require("../models/User");

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

module.exports = {
  getDevelopers,
};
