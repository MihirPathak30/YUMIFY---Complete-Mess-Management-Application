const express = require('express');
const router = express.Router();
const { chat, getSuggestions } = require('../controllers/aiAssistantController');
const { protect, authorize } = require('../middleware/auth');

router.post('/chat', protect, authorize('customer'), chat);
router.get('/suggestions', protect, authorize('customer'), getSuggestions);

module.exports = router;
