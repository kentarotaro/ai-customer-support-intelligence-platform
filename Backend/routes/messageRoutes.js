// Backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// URL: /api/messages
router.get('/', messageController.getMessages);

// URL: /api/messages/:id (Contoh: /api/messages/1)
router.get('/:id', messageController.getMessageDetail);

module.exports = router;