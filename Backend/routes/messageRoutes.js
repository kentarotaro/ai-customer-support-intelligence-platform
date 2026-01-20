// Backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * Validation Rules
 */
const messageValidation = [
  body('content')
    .notEmpty().withMessage('Isi pesan wajib diisi')
    .isLength({ min: 1 }).withMessage('Pesan minimal 10 karakter')
    .isLength({ max: 5000 }).withMessage('Pesan maksimal 5000 karakter')
    .trim(),
  
  body('customer_name')
    .notEmpty().withMessage('Nama customer wajib diisi')
    .isLength({ min: 1 }).withMessage('Nama minimal 2 karakter')
    .isLength({ max: 255 }).withMessage('Nama maksimal 255 karakter')
    .trim(),
  
  body('subject')
    .optional()
    .isLength({ max: 500 }).withMessage('Subject maksimal 500 karakter')
    .trim()
];

const replyValidation = [
  body('reply_content')
    .notEmpty().withMessage('Isi balasan wajib diisi')
    .isLength({ min: 1 }).withMessage('Balasan minimal 10 karakter')
    .isLength({ max: 5000 }).withMessage('Balasan maksimal 3000 karakter')
    .trim()
];

const editReplyValidation = [
  body('reply_content')
    .notEmpty().withMessage('Isi balasan wajib diisi')
    .isLength({ min: 1 }).withMessage('Balasan minimal 10 karakter')
    .isLength({ max: 5000 }).withMessage('Balasan maksimal 3000 karakter')
    .trim()
];

const assignValidation = [
  body('agent_id')
    .optional()
    .isUUID().withMessage('agent_id harus berupa UUID valid')
];

const statusValidation = [
  body('status')
    .notEmpty().withMessage('Status wajib diisi')
    .isIn(['open', 'in_progress', 'resolved']).withMessage('Status tidak valid')
];

/**
 * Routes
 * PENTING: Route spesifik (tanpa parameter) harus di ATAS route dengan parameter :id
 */

// GET /api/messages/agents/list - Get all agents (Lead only)
// ⚠️ HARUS DI ATAS route /:id
router.get('/agents/list', 
  authenticateToken, 
  authorizeRole(['lead']),
  messageController.getAgents
);

// GET /api/messages - List semua messages (Protected)
router.get('/', authenticateToken, messageController.getMessages);

// GET /api/messages/:id - Detail satu message (Protected)
router.get('/:id', authenticateToken, messageController.getMessageDetail);

// POST /api/messages - Kirim message baru (Public - untuk customer/webhook)
router.post('/', messageValidation, messageController.createMessage);

// POST /api/messages/:id/assign - Assign ticket (Protected)
router.post('/:id/assign', 
  authenticateToken, 
  assignValidation,
  messageController.assignTicket
);

// POST /api/messages/:id/unassign - Unassign ticket (Lead Only)
router.post('/:id/unassign', 
  authenticateToken, 
  authorizeRole(['lead']),
  messageController.unassignTicket
);

// POST /api/messages/:id/reply - Balas message (Protected)
router.post('/:id/reply', 
  authenticateToken, 
  replyValidation, 
  messageController.replyMessage
);

// PATCH /api/messages/:id/status - Update status manual (Protected)
router.patch('/:id/status',
  authenticateToken,
  statusValidation,
  messageController.updateStatus
);

// DELETE /api/messages/:id - Delete message (Lead Only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['lead']),
  messageController.deleteMessage
);

router.patch('/replies/:id',
  authenticateToken,
  editReplyValidation,
  messageController.editReply
);

module.exports = router;