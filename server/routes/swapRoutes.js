const express = require('express');
const router = express.Router();
const {
  createSwap,
  getMySwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  completeSwap,
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSwap);
router.get('/', protect, getMySwaps);
router.put('/:id/accept', protect, acceptSwap);
router.put('/:id/reject', protect, rejectSwap);
router.put('/:id/cancel', protect, cancelSwap);
router.put('/:id/complete', protect, completeSwap);

module.exports = router;