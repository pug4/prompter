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
  id: { type: String, required: true },
  text: { type: String, required: true },
  description: { type: String, required: true },
  prompt: { type: String, required: true },
  sections: [
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
      example: { type: String, required: true },
      input: { type: String, default: "" },
      size: { type: String, enum: ["small", "large"], required: true },
    },
  ],
});

const Prompt = mongoose.model('Prompt', PromptSchema);

// API Endpoints
app.get('/api/teamPrompts', async (req, res) => {
  try {
    console.log('Fetching prompts...');
    const teamPrompts = await Prompt.find();
    console.log('Prompts retrieved:', teamPrompts);
    res.json(teamPrompts);
  } catch (err) {
    console.error('Error fetching prompts:', err);
    res.status(500).json({ message: 'Error fetching prompts', error: err.message });
  }
});


app.post('/api/teamPrompts', async (req, res) => {
  const { id, text, description, prompt, sections } = req.body;

  // Validate the incoming structure
  if (!id || !text || !description || !prompt || !Array.isArray(sections)) {
    return res.status(400).json({ message: 'Invalid prompt format' });
  }

  // Ensure each section follows the correct structure
  for (const section of sections) {
    if (!section.key || !section.label || !section.placeholder || !section.example || !section.size) {
      return res.status(400).json({ message: 'Invalid section format', section });
    }
  }

  try {
    const newPrompt = new Prompt(req.body);
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    console.error('Error saving prompt:', err);
    res.status(500).json({ message: 'Error saving prompt', error: err.message });
  }
});


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
