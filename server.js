const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Mongoose Schema and Model
const PromptSchema = new mongoose.Schema({
  id: String,
  text: String,
  description: String,
  prompt: String,
  sections: [
    {
      key: String,
      label: String,
      placeholder: String,
      example: String,
      input: String,
      size: String,
    },
  ],
});

const Prompt = mongoose.model('Prompt', PromptSchema);

// API Endpoints
app.get('/api/teamPrompts', async (req, res) => {
  try {
    const teamPrompts = await Prompt.find();
    res.json(teamPrompts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prompts', error: err });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
