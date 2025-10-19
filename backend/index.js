const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // ✅ load .env (inside backend folder)

const scoreRoutes = require("./routes/scores"); // adjust if needed

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/scores", scoreRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// ✅ Port setup (Vercel will set PORT automatically)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
