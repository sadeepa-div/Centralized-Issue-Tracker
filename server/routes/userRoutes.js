const express = require('express')

const {
  getDevelopers,
  getTeamUsers
} = require('../controllers/userController')

const {
  protect
} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/developers', protect, getDevelopers)

router.get('/team', protect, getTeamUsers)

module.exports = router