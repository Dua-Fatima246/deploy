const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// ✅ GET all scores, sorted by score and level (descending)
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, level: -1 });
    res.json(scores);
  } catch (err) {
    console.error("❌ Error fetching scores:", err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// ✅ POST a new score
router.post("/", async (req, res) => {
  try {
    const newScore = new Score(req.body);
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    console.error("❌ Error saving score:", err);
    res.status(400).json({ error: "Failed to save score" });
  }
});

// ✅ PUT — update or create player score by name
router.put("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { score, level } = req.body;

    let player = await Score.findOne({ name });

    if (player) {
      // Update only if new score/level is higher
      player.score = Math.max(player.score, score);
      player.level = Math.max(player.level, level);
      await player.save();
      res.json(player);
    } else {
      // Create new player if not exists
      const newPlayer = new Score({ name, score, level });
      await newPlayer.save();
      res.status(201).json(newPlayer);
    }
  } catch (err) {
    console.error("❌ Error updating/creating score:", err);
    res.status(400).json({ error: "Failed to update/create score" });
  }
});

module.exports = router;
