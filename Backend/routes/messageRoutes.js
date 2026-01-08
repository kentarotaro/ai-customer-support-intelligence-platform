// Backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// URL: /api/messages
router.get('/', messageController.getMessages);

// URL: /api/messages/:id (Contoh: /api/messages/1)
router.get('/:id', messageController.getMessageDetail);

// URL: POST /api/messages
router.post('/', messageController.createMessage); 

module.exports = router;