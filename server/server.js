require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const projectRoutes = require('./routes/projectRoutes')

const authRoutes = require('./routes/authRoutes')

const app = express()

connectDB()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Bug Tracker API is running'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})