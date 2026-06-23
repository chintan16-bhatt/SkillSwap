const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile, getUserById,searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.get('/search', protect, searchUsers); 
router.get('/:id', protect, getUserById);

module.exports = router;