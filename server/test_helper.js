const express = require('express')
const cors = require('cors')
const { db, init } = require('./db')
const authRoutes = require('./routes/auth')
const entriesRoutes = require('./routes/entries')
const analyticsRoutes = require('./routes/analytics')

const app = express()
init()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/entries', entriesRoutes)
app.use('/api/analytics', analyticsRoutes)

module.exports = { app, db }
