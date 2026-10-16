const express = require('express')

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getIssueStats,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController')

const {
  protect
} = require('../middleware/authMiddleware')

const {
  authorizeRoles
} = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/', protect, getIssues)

router.get(
  '/stats/summary',
  protect,
  getIssueStats
)

router.post('/', protect, createIssue)

router.get(
  '/:id',
  protect,
  getIssueById
)

router.patch(
  '/:id/status',
  protect,
  updateIssueStatus
)

router.patch(
  '/:id/assignee',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  assignIssue
)

router.patch(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  updateIssue
)

router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  deleteIssue
)

module.exports = router