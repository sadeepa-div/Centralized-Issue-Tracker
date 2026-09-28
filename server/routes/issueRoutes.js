const express = require('express')

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus
} = require('../controllers/issueController')

const {
  protect
} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getIssues)

router.post('/', protect, createIssue)

router.get('/:id', protect, getIssueById)

router.patch('/:id/status', protect, updateIssueStatus)

module.exports = router