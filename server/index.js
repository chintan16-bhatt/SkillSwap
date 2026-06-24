require('dns').setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SkillSwap API is running ' });
});

// Connect to MongoDB + Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error(' DB connection failed:', err));