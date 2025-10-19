import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Use your live backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://deploy-delta-ruddy.vercel.app";

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
        console.error("❌ Error fetching leaderboard:", err);
      }
    };
    fetchScores();
  }, []);

  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 50);

  return (
    <div style={{ background: "linear-gradient(135deg, #1f1c2c, #928DAB)", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 15px" }}>
      <h1>🏆 Leaderboard</h1>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        {topScores.length === 0 ? (
          <p>No scores yet!</p>
        ) : (
          topScores.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", background: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 15px" }}>
              <span>{i + 1}. {s.playerName}</span>
              <span>Score: {s.score} | Level: {s.level}</span>
            </div>
          ))
        )}
      </div>
      <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px", background: "linear-gradient(90deg, #00c6ff, #0072ff)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
        🎮 Play Again
      </button>
    </div>
  );
}
