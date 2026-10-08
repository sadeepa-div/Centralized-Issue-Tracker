const express = require('express')

const {
  getDevelopers
} = require('../controllers/userController')

const {
  protect
} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/developers', protect, getDevelopers)

module.exports = router
