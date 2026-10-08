const Issue = require("../models/Issue");
const Project = require("../models/Project");
const User = require("../models/User");

const createIssue = async (req, res) => {
  try {
    const { title, description, type, priority, project, assignee } = req.body;

    if (!title || !description || !project) {
      return res.status(400).json({
        message: "Title, description and project are required",
      });
    }

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const issue = await Issue.create({
      title,
      description,
      type,
      priority,
      project,
      reporter: req.user._id,
      assignee: assignee || null,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role");

    res.status(201).json({
      message: "Issue created successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getIssues = async (req, res) => {
  try {
    const { search, status, priority, project, assignee } = req.query;

    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (project) {
      filter.project = project;
    }

    if (assignee) {
      filter.assignee = assignee;
    }

    const issues = await Issue.find(filter)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role");

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Open",
      "In Progress",
      "Testing",
      "Resolved",
      "Closed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid issue status",
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    issue.status = status;

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role");

    res.status(200).json({
      message: "Issue status updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const assignIssue = async (req, res) => {
  try {
    const { assignee } = req.body;

    if (!assignee) {
      return res.status(400).json({
        message: "Developer is required",
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const user = await User.findById(assignee);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "Developer") {
      return res.status(400).json({
        message: "Issue can only be assigned to a Developer",
      });
    }

    issue.assignee = user._id;

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role");

    res.status(200).json({
      message: "Issue assigned successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getIssueStats = async (req, res) => {
  try {
    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      recentIssues,
    ] = await Promise.all([
      Issue.countDocuments(),

      Issue.countDocuments({
        status: "Open",
      }),

      Issue.countDocuments({
        status: "In Progress",
      }),

      Issue.countDocuments({
        status: "Resolved",
      }),

      Issue.find()
        .populate("project", "name")
        .populate("reporter", "name")
        .populate("assignee", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      recentIssues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getIssueStats,
};
