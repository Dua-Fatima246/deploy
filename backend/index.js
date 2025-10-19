const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // ✅ load .env from backend folder

const scoreRoutes = require("./routes/scores"); // ✅ correct path

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (using your connection string)
mongoose
  .connect("mongodb+srv://sitara:Pakistan@cluster0.bunqn28.mongodb.net/deploy?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API routes
app.use("/api/scores", scoreRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// ✅ Port setup (Vercel will handle PORT automatically)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
