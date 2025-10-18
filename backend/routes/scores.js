const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// GET all scores, sorted descending
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, level: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new score
router.post("/", async (req, res) => {
  try {
    const newScore = new Score(req.body);
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — update or create player score
router.put("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { score, level } = req.body;

    let player = await Score.findOne({ name });

    if (player) {
      player.score = Math.max(player.score, score);
      player.level = Math.max(player.level, level);
      await player.save();
      res.json(player);
    } else {
      const newPlayer = new Score({ name, score, level });
      await newPlayer.save();
      res.status(201).json(newPlayer);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
