const Issue = require('../models/Issue')
const Project = require('../models/Project')

const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      priority,
      project,
      assignee
    } = req.body

    if (!title || !description || !project) {
      return res.status(400).json({
        message: 'Title, description and project are required'
      })
    }

    const existingProject = await Project.findById(project)

    if (!existingProject) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    const issue = await Issue.create({
      title,
      description,
      type,
      priority,
      project,
      reporter: req.user._id,
      assignee: assignee || null
    })

    const populatedIssue = await Issue.findById(issue._id)
      .populate('project', 'name')
      .populate('reporter', 'name email role')
      .populate('assignee', 'name email role')

    res.status(201).json({
      message: 'Issue created successfully',
      issue: populatedIssue
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('project', 'name')
      .populate('reporter', 'name email role')
      .populate('assignee', 'name email role')
      .sort({ createdAt: -1 })

    res.status(200).json(issues)
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('project', 'name')
      .populate('reporter', 'name email role')
      .populate('assignee', 'name email role')

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      })
    }

    res.status(200).json(issue)
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body

    const validStatuses = [
      'Open',
      'In Progress',
      'Testing',
      'Resolved',
      'Closed'
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid issue status'
      })
    }

    const issue = await Issue.findById(req.params.id)

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      })
    }

    issue.status = status

    await issue.save()

    res.status(200).json({
      message: 'Issue status updated successfully',
      issue
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus
}