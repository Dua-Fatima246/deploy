import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (playerName.trim()) {
      navigate("/game", { state: { playerName } });
    } else {
      alert("Please enter your name to start!");
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        background: "linear-gradient(135deg, hsla(54, 96%, 44%, 1.00), #0d90dcff, #596f32ff, rgba(255, 255, 36, 1))",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background 0.8s ease-in-out",
        padding: "20px",
        borderRadius: "20px",
        width: "45%",
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          input::placeholder {
            transition: color 0.2s ease;
          }
          input:hover::placeholder, input:focus::placeholder {
            color: #2575FC;
            font-weight: 600;
          }
        `}
      </style>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "20px",
          padding: "40px 60px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            color: "#1d3557",
            fontSize: "2.2rem",
            marginBottom: "20px",
            letterSpacing: "1px",
            transition: "transform 0.2s, color 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.color = "#2575FC";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.color = "#1d3557";
          }}
        >
          🌟 Star Catcher
        </h1>

        <input
          type="text"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #b0c4de",
            fontSize: "1rem",
            outline: "none",
            marginBottom: "20px",
            textAlign: "center",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "1px solid #2575FC";
            e.currentTarget.style.boxShadow = "0 0 8px rgba(37, 117, 252, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid #b0c4de";
            e.currentTarget.style.boxShadow = "none";
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #2575FC";
            e.currentTarget.style.boxShadow = "0 0 8px rgba(37, 117, 252, 0.5)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #b0c4de";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {/* 🎮 Start Button */}
        <button
          onClick={handleStart}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease, box-shadow 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 14px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
          }}
        >
          🚀 Start Game
        </button>

        {/* 🏆 Leaderboard Button */}
        <button
          onClick={() => navigate("/leaderboard")}
          style={{
            width: "100%",
            padding: "12px 16px",
            marginTop: "15px",
            background: "linear-gradient(135deg, #f7971e, #ffd200)",
            color: "#333",
            fontWeight: "600",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease, box-shadow 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 14px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
          }}
        >
          🏆 Leaderboard
        </button>

        <p
          style={{
            marginTop: "25px",
            fontSize: "0.9rem",
            color: "#5a5a5a",
            fontStyle: "italic",
          }}
        >
          Collect stars, avoid obstacles, and climb the leaderboard!
        </p>
      </div>
    </div>
  );
}
