// Backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * Validation Rules
 */
const registerValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('full_name').notEmpty().withMessage('Nama lengkap wajib diisi'),
  body('role').optional().isIn(['agent', 'lead']).withMessage('Role harus agent atau lead')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi')
];

/**
 * Routes
 */
// POST /api/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/auth/logout (Protected)
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/profile (Protected)
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;