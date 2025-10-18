import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/scores`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchScores();
  }, []);

  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 50);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1f1c2c, #928DAB)",
        color: "white",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 15px",
         borderRadius: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "25px",
          textShadow: "0 2px 8px black",
          transition: "transform 0.2s",
          cursor: "default",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🏆 Leaderboard
      </h1>

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {topScores.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.1rem" }}>No scores yet!</p>
        ) : (
          topScores.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "8px", // slightly rounded corners
                padding: "12px 18px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                color:
                  i === 0
                    ? "#FFD700"
                    : i === 1
                    ? "#C0C0C0"
                    : i === 2
                    ? "#CD7F32"
                    : "white",
                transition: "transform 0.2s, background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
            >
              <span
                style={{ fontWeight: 600, fontSize: "1rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00c6ff")}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    i === 0
                      ? "#FFD700"
                      : i === 1
                      ? "#C0C0C0"
                      : i === 2
                      ? "#CD7F32"
                      : "white";
                }}
              >
                {i + 1}. {s.name}
              </span>
              <div style={{ display: "flex", gap: "12px", fontWeight: 500 }}>
                <span>Score: {s.score}</span>
                <span>Level: {s.level}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "30px",
          background: "linear-gradient(90deg, #00c6ff, #0072ff)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 30px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1rem",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.filter = "brightness(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        🎮 Play Again
      </button>
    </div>
  );
}
