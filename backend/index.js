const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // load env locally

const scoreRoutes = require("../routes/scores"); // adjust path (.. because inside api folder)

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("Server is running..."));
app.use("/api/scores", scoreRoutes);

// ✅ Export app for Vercel (no app.listen here!)
module.exports = app;
