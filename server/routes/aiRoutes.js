const express = require('express');
const router = express.Router();
const { getMatchSuggestions, generateSwapMessage } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/match-suggestions', protect, getMatchSuggestions);
router.post('/swap-message', protect, generateSwapMessage);

module.exports = router;