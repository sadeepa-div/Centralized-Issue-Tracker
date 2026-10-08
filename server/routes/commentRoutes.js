const express = require('express')

const {
  createComment,
  getComments
} = require('../controllers/commentController')

const {
  protect
} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:issueId', protect, getComments)

router.post('/:issueId', protect, createComment)

module.exports = router