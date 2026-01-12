// Backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * Validation Rules untuk Message
 */
const messageValidation = [
  body('content')
    .notEmpty().withMessage('Isi pesan wajib diisi')
    .isLength({ min: 10 }).withMessage('Pesan minimal 10 karakter')
    .isLength({ max: 5000 }).withMessage('Pesan maksimal 5000 karakter')
    .trim(),
  
  body('customer_name')
    .notEmpty().withMessage('Nama customer wajib diisi')
    .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
    .isLength({ max: 255 }).withMessage('Nama maksimal 255 karakter')
    .trim(),
  
  body('subject')
    .optional()
    .isLength({ max: 500 }).withMessage('Subject maksimal 500 karakter')
    .trim()
];

/**
 * Validation Rules untuk Reply
 */
const replyValidation = [
  body('reply_content')
    .notEmpty().withMessage('Isi balasan wajib diisi')
    .isLength({ min: 10 }).withMessage('Balasan minimal 10 karakter')
    .isLength({ max: 3000 }).withMessage('Balasan maksimal 3000 karakter')
    .trim()
];

/**
 * Routes
 */

// GET /api/messages - List semua messages (Protected)
router.get('/', authenticateToken, messageController.getMessages);

// GET /api/messages/:id - Detail satu message (Protected)
router.get('/:id', authenticateToken, messageController.getMessageDetail);

// POST /api/messages - Kirim message baru (Public - untuk webhook/customer)
// Note: Tidak pakai authenticateToken karena ini untuk customer external
router.post('/', messageValidation, messageController.createMessage);

// POST /api/messages/:id/reply - Balas message (Protected)
router.post('/:id/reply', 
  authenticateToken, 
  replyValidation, 
  messageController.replyMessage
);

module.exports = router;