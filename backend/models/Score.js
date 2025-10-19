const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    level: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", ScoreSchema);
