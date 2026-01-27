// Backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import Middleware
const { authLimiter, aiLimiter, generalLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ====== APPLY RATE LIMITERS ======
// 1. Global limiter untuk semua routes (100 req/menit)
app.use(generalLimiter);

// 2. Auth limiter untuk login/register (5 req/15 menit)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. AI limiter untuk message creation (50 req/jam)
app.use('/api/messages', aiLimiter);

// ====== ROUTES ======
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('AI Customer Support API is Running...');
});

// Jalankan Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
