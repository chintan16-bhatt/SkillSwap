const User = require('../models/User');

// @route   GET /api/users/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/users/profile
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update fields that were actually sent
    const { name, bio, skillsOffered, skillsWanted, location, profilePicture } = req.body;

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skillsOffered !== undefined) user.skillsOffered = skillsOffered;
    if (skillsWanted !== undefined) user.skillsWanted = skillsWanted;
    if (location !== undefined) user.location = location;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      credits: updatedUser.credits,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted,
      location: updatedUser.location,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { skill, location } = req.query;

    // Must provide at least a skill to search
    if (!skill) {
      return res.status(400).json({ message: 'Please provide a skill to search for' });
    }

    // Build the filter dynamically
    const filter = {
      skillsOffered: { $regex: skill, $options: 'i' },
      isActive: true,
      _id: { $ne: req.user._id }, // exclude the searching user themselves
    };

    // Add location filter if provided
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('name bio skillsOffered skillsWanted location profilePicture credits')
      .limit(20); // max 20 results per search

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/users/credits
// @access  Private
const getMyCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name credits');

    // Get completed swaps to show credit history
    const Swap = require('../models/Swap');

    const completedSwaps = await Swap.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'completed',
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .select('sender receiver skillOffered skillWanted status createdAt')
      .sort({ updatedAt: -1 })
      .limit(10);

    // Format transaction history
    const history = completedSwaps.map((swap) => {
      const isSender = swap.sender._id.toString() === req.user._id.toString();
      return {
        type: isSender ? 'earned' : 'spent',
        amount: isSender ? +1 : -1,
        skill: isSender ? swap.skillOffered : swap.skillWanted,
        with: isSender ? swap.receiver.name : swap.sender.name,
        date: swap.updatedAt,
      };
    });

    res.status(200).json({
      credits: user.credits,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, getUserById, searchUsers, getMyCredits };
