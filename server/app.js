require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { db, init } = require('./db');
const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');
const analyticsRoutes = require('./routes/analytics');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", FRONTEND_ORIGIN],
        scriptSrc: ["'self'", FRONTEND_ORIGIN],
        styleSrc: ["'self'", FRONTEND_ORIGIN, "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', FRONTEND_ORIGIN],
        connectSrc: ["'self'", FRONTEND_ORIGIN],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      }
    }
  }));
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}

const limiter = rateLimit({ windowMs: 60*1000, max: 120 });
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'PLAN INVEST API' }));

module.exports = { app, init };
