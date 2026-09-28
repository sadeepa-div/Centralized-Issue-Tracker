const express = require('express')

const {
  createProject,
  getProjects
} = require('../controllers/projectController')

const {
  protect
} = require('../middleware/authMiddleware')

const {
  authorizeRoles
} = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/', protect, getProjects)

router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  createProject
)

module.exports = router