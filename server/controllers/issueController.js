const Issue = require("../models/Issue");
const Project = require("../models/Project");
const User = require("../models/User");

// ======================================
// CREATE ISSUE
// ======================================
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

    let validAssignee = null;

    if (assignee) {
      const assignedUser = await User.findById(assignee);

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }

      if (assignedUser.role !== "Developer") {
        return res.status(400).json({
          message: "Issue can only be assigned to a Developer",
        });
      }

      const isProjectMember = existingProject.members.some(
        (member) => member.toString() === assignedUser._id.toString(),
      );

      if (!isProjectMember) {
        return res.status(400).json({
          message: "Developer must belong to the selected project",
        });
      }

      validAssignee = assignedUser._id;
    }

    const issue = await Issue.create({
      title,
      description,
      type: type || "Bug",
      priority: priority || "Medium",
      project,
      reporter: req.user._id,
      assignee: validAssignee,
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

// ======================================
// GET ALL ISSUES + SEARCH/FILTER
// ======================================
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

// ======================================
// GET ONE ISSUE
// ======================================
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

// ======================================
// UPDATE ISSUE STATUS
// ======================================
// ======================================
// UPDATE ISSUE STATUS
// ======================================
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

    const isAdmin = req.user.role === "Admin";

    const isManager = req.user.role === "Project Manager";

    const isAssignedDeveloper =
      req.user.role === "Developer" &&
      issue.assignee &&
      issue.assignee.toString() === req.user._id.toString();

    const isTester = req.user.role === "Tester" && issue.status === "Testing";

    // ==========================
    // GENERAL PERMISSION CHECK
    // ==========================
    if (!isAdmin && !isManager && !isAssignedDeveloper && !isTester) {
      return res.status(403).json({
        message: "You do not have permission to update this issue status",
      });
    }

    // ==========================
    // DEVELOPER STATUS RULES
    // ==========================
    if (
      isAssignedDeveloper &&
      !["Open", "In Progress", "Testing"].includes(status)
    ) {
      return res.status(403).json({
        message: "Developer can only use Open, In Progress or Testing status",
      });
    }

    // ==========================
    // TESTER STATUS RULES
    // ==========================
    if (isTester && !["In Progress", "Resolved"].includes(status)) {
      return res.status(403).json({
        message:
          "Tester can only move a Testing issue to In Progress or Resolved",
      });
    }

    // ==========================
    // UPDATE STATUS
    // ==========================
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

// ======================================
// ASSIGN ISSUE TO DEVELOPER
// ======================================
const assignIssue = async (req, res) => {
  try {
    const { assignee } = req.body;

    if (!assignee) {
      return res.status(400).json({
        message: "Developer is required",
      });
    }

    // Find issue
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Find selected user
    const user = await User.findById(assignee);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // User must be Developer
    if (user.role !== "Developer") {
      return res.status(400).json({
        message: "Issue can only be assigned to a Developer",
      });
    }

    // Find the issue project
    const project = await Project.findById(issue.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Developer must already belong to project
    const isProjectMember = project.members.some(
      (member) => member.toString() === user._id.toString(),
    );

    if (!isProjectMember) {
      return res.status(400).json({
        message: "Developer must be added to this project before assignment",
      });
    }

    // Assign
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

// ======================================
// DASHBOARD ISSUE STATISTICS
// ======================================
const getIssueStats = async (req, res) => {
  try {
    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      testingIssues,
      resolvedIssues,
      closedIssues,
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
        status: "Testing",
      }),

      Issue.countDocuments({
        status: "Resolved",
      }),

      Issue.countDocuments({
        status: "Closed",
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
      testingIssues,
      resolvedIssues,
      closedIssues,
      recentIssues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// EDIT ISSUE
// ======================================
const updateIssue = async (req, res) => {
  try {
    const { title, description, type, priority, project } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    if (title) {
      issue.title = title;
    }

    if (description) {
      issue.description = description;
    }

    if (type) {
      issue.type = type;
    }

    if (priority) {
      issue.priority = priority;
    }

    if (project) {
      const existingProject = await Project.findById(project);

      if (!existingProject) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      issue.project = project;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role");

    res.status(200).json({
      message: "Issue updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// DELETE ISSUE
// ======================================
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// GET MY ISSUES
// ======================================
const getMyIssues = async (req, res) => {
  try {
    const { search, status, priority, project } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Project filter
    if (project) {
      filter.project = project;
    }

    // ==========================
    // ROLE BASED FILTER
    // ==========================

    if (req.user.role === "Developer") {
      // Developer only sees assigned issues
      filter.assignee = req.user._id;

      if (status) {
        filter.status = status;
      }
    } else if (req.user.role === "Tester") {
      // Tester only sees Testing issues
      filter.status = "Testing";
    } else if (
      req.user.role === "Admin" ||
      req.user.role === "Project Manager"
    ) {
      // Admin / PM can see all
      if (status) {
        filter.status = status;
      }
    }

    const issues = await Issue.find(filter)
      .populate("project", "name")
      .populate("reporter", "name email role")
      .populate("assignee", "name email role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getIssueStats,
  updateIssue,
  deleteIssue,
};
