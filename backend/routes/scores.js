const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Schema and Model
const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  level: Number,
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);

// ✅ POST → Save new score
router.post("/", async (req, res) => {
  try {
    const { playerName, score, level } = req.body;
    const newScore = new Score({ playerName, score, level });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// ✅ GET → Fetch all scores
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, level: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

module.exports = router;
