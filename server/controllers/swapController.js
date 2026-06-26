const Swap = require('../models/Swap');
const User = require('../models/User');

// @route   POST /api/swaps
// @access  Private
const createSwap = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillWanted, message } = req.body;

    if (!receiverId || !skillOffered || !skillWanted) {
      return res.status(400).json({ message: 'Please provide receiverId, skillOffered, and skillWanted' });
    }

    // Can't send swap request to yourself
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a swap request to yourself' });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if a pending swap already exists between these users
    const existingSwap = await Swap.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'You already have a pending swap request with this user' });
    }

    const swap = await Swap.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered,
      skillWanted,
      message: message || '',
    });

    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/swaps
// @access  Private
const getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/swaps/:id/accept
// @access  Private
const acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    // Only receiver can accept
    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the receiver can accept this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: `Cannot accept a swap that is ${swap.status}` });
    }

    swap.status = 'accepted';
    await swap.save();

    res.status(200).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/swaps/:id/reject
// @access  Private
const rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    // Only receiver can reject
    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the receiver can reject this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: `Cannot reject a swap that is ${swap.status}` });
    }

    swap.status = 'rejected';
    await swap.save();

    res.status(200).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/swaps/:id/cancel
// @access  Private
const cancelSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    // Only sender can cancel
    if (swap.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the sender can cancel this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: `Cannot cancel a swap that is ${swap.status}` });
    }

    swap.status = 'cancelled';
    await swap.save();

    res.status(200).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/swaps/:id/complete
// @access  Private
const completeSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    const isParticipant =
      swap.sender.toString() === req.user._id.toString() ||
      swap.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Only participants can complete this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: `Cannot complete a swap that is ${swap.status}` });
    }

    // Check receiver has enough credits
    const receiver = await User.findById(swap.receiver);
    if (receiver.credits < 1) {
      return res.status(400).json({
        message: 'Receiver does not have enough credits to complete this swap',
      });
    }

    // Atomic credit transfer
    // Receiver loses 1 credit (consumed the skill)
    await User.findByIdAndUpdate(
      swap.receiver,
      { $inc: { credits: -1 } },
      { new: true }
    );

    // Sender gains 1 credit (provided the skill)
    await User.findByIdAndUpdate(
      swap.sender,
      { $inc: { credits: 1 } },
      { new: true }
    );

    // Mark swap as completed
    swap.status = 'completed';
    await swap.save();

    // Get updated user data to return
    const updatedSender = await User.findById(swap.sender).select('name credits');
    const updatedReceiver = await User.findById(swap.receiver).select('name credits');

    res.status(200).json({
      message: 'Swap completed successfully',
      swap,
      creditTransfer: {
        sender: { name: updatedSender.name, credits: updatedSender.credits },
        receiver: { name: updatedReceiver.name, credits: updatedReceiver.credits },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { createSwap, getMySwaps, acceptSwap, rejectSwap, cancelSwap, completeSwap };