// Backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
// Satpam: Cek Token (Login) -> Cek Role (Harus Lead)
router.get('/stats', 
  authenticateToken, 
  authorizeRole(['lead']), 
  dashboardController.getDashboardStats
);

module.exports = router;