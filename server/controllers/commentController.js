const Comment = require('../models/Comment')
const Issue = require('../models/Issue')

const createComment = async (req, res) => {
  try {
    const { text } = req.body
    const { issueId } = req.params

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: 'Comment text is required'
      })
    }

    const issue = await Issue.findById(issueId)

    if (!issue) {
      return res.status(404).json({
        message: 'Issue not found'
      })
    }

    const comment = await Comment.create({
      issue: issueId,
      user: req.user._id,
      text: text.trim()
    })

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email role')

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      issue: req.params.issueId
    })
      .populate('user', 'name email role')
      .sort({ createdAt: 1 })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {
  createComment,
  getComments
}