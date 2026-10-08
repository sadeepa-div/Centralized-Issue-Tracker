const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Project name and description are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const canManage =
      req.user.role === "Admin" ||
      project.createdBy.toString() === req.user._id.toString();

    if (!canManage) {
      return res.status(403).json({
        message: "You cannot manage members of this project",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!["Developer", "Tester"].includes(user.role)) {
      return res.status(400).json({
        message: "Only Developers and Testers can be added",
      });
    }

    const alreadyMember = project.members.some(
      (member) => member.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    project.members.push(userId);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const canManage =
      req.user.role === "Admin" ||
      project.createdBy.toString() === req.user._id.toString();

    if (!canManage) {
      return res.status(403).json({
        message: "You cannot manage members of this project",
      });
    }

    if (project.createdBy.toString() === req.params.userId) {
      return res.status(400).json({
        message: "Project creator cannot be removed",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== req.params.userId,
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    res.status(200).json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  addProjectMember,
  removeProjectMember
};
