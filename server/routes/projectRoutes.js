const express = require('express')

const {
  createProject,
  getProjects,
  getProjectById,
  addProjectMember,
  removeProjectMember
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

router.get(
  '/:id',
  protect,
  getProjectById
)

router.patch(
  '/:id/members',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  addProjectMember
)

router.delete(
  '/:id/members/:userId',
  protect,
  authorizeRoles('Admin', 'Project Manager'),
  removeProjectMember
)

module.exports = router