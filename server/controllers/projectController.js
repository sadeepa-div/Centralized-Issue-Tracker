const Project = require('../models/Project')

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({
        message: 'Project name and description are required'
      })
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    })

    res.status(201).json({
      message: 'Project created successfully',
      project
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {
  createProject,
  getProjects
}