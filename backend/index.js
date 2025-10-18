const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // ✅ ensure .env is read correctly

const scoreRoutes = require("./routes/scores");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect MongoDB
mongoose
  .connect("mongodb+srv://sitara:Pakistan@cluster0.bunqn28.mongodb.net/deploy?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("Server is running..."));
app.use("/api/scores", scoreRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
