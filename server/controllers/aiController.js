const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash',generationConfig:{temperature:1.5,} });

// @route   POST /api/ai/match-suggestions
// @access  Private
const getMatchSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.skillsOffered.length && !currentUser.skillsWanted.length) {
      return res.status(400).json({
        message: 'Please update your profile with skills offered and wanted before getting suggestions',
      });
    }

    const otherUsers = await User.find({
      _id: { $ne: req.user._id },
      isActive: true,
    }).select('name bio skillsOffered skillsWanted location credits');

    if (otherUsers.length === 0) {
      return res.status(200).json({
        message: 'No other users found to match with yet',
        suggestions: [],
      });
    }

    const prompt = `
You are a skill-swap matching assistant for a platform called SkillSwap.

Current User Profile:
- Name: ${currentUser.name}
- Skills They Offer: ${currentUser.skillsOffered.join(', ') || 'None listed'}
- Skills They Want to Learn: ${currentUser.skillsWanted.join(', ') || 'None listed'}
- Location: ${currentUser.location || 'Not specified'}
- Bio: ${currentUser.bio || 'No bio'}

Available Users to Match With:
${otherUsers.map((u, i) => `
User ${i + 1}:
- ID: ${u._id}
- Name: ${u.name}
- Skills They Offer: ${u.skillsOffered.join(', ') || 'None'}
- Skills They Want: ${u.skillsWanted.join(', ') || 'None'}
- Location: ${u.location || 'Not specified'}
`).join('')}

Task: Analyze skill compatibility and suggest the TOP 3 best matches for the current user.
For each match explain:
1. Why they are a good match (what skills align)
2. What the current user can learn from them
3. What they can learn from the current user
4. A compatibility score out of 10

Respond ONLY with a valid JSON array, no markdown, no explanation outside the JSON:
[
  {
    "userId": "the user's _id",
    "name": "user name",
    "compatibilityScore": 8,
    "reason": "explanation of why this is a good match",
    "youCanLearn": "what current user can learn",
    "theyCanLearn": "what they can learn from current user"
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleanText);

    res.status(200).json({
      currentUser: {
        name: currentUser.name,
        skillsOffered: currentUser.skillsOffered,
        skillsWanted: currentUser.skillsWanted,
      },
      suggestions,
    });
  } catch (error) {
    // ← 429 handling added here too
    if (error.message.includes('429')) {
      return res.status(429).json({
        message: 'AI service is temporarily busy. Please wait a moment and try again.',
      });
    }
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// @route   POST /api/ai/swap-message
// @access  Private
const generateSwapMessage = async (req, res) => {
  try {
    const { receiverName, skillOffered, skillWanted, receiverBio } = req.body;

    if (!receiverName || !skillOffered || !skillWanted) {
      return res.status(400).json({
        message: 'Please provide receiverName, skillOffered, and skillWanted',
      });
    }

    const currentUser = await User.findById(req.user._id);

    const prompt = `
Write a friendly, personalized skill-swap request message.

Sender: ${currentUser.name}
Receiver: ${receiverName}
Receiver's Bio: ${receiverBio || 'Not provided'}
Skill the sender is offering: ${skillOffered}
Skill the sender wants to learn: ${skillWanted}

Requirements:
- Keep it under 100 words
- Sound genuine and enthusiastic, not robotic
- Mention both skills specifically
- End with a clear call to action

Respond with ONLY the message text, nothing else.
`;

    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    res.status(200).json({ message });
  } catch (error) {
    if (error.message.includes('429')) {
      return res.status(429).json({
        message: 'AI service is temporarily busy. Please wait a moment and try again.',
      });
    }
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

module.exports = { getMatchSuggestions, generateSwapMessage };