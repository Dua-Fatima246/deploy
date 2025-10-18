import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Backend URL (Vite format)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const playerName = location.state?.playerName || "Guest";
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: Math.min(window.innerWidth * 0.9, 1000),
    height: Math.min(window.innerHeight * 0.6, 700),
  });

  const keysRef = useRef({});
  const mobileKeysRef = useRef({ up: false, down: false, left: false, right: false });

  // Resize canvas dynamically
  useEffect(() => {
    const handleResize = () =>
      setCanvasSize({
        width: Math.min(window.innerWidth * 0.9, 1000),
        height: Math.min(window.innerHeight * 0.6, 700),
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Save score to backend
  const saveScore = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/scores/${encodeURIComponent(playerName)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, level }),
      });
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  // Main game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let playerBall = createPlayerBall(width, height);
    let { stars, obstacles } = makeLevelEntities(level, width, height);
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);

    let animation;
    const gameOverTrigger = () => {
      cancelAnimationFrame(animation);
      clearInterval(timer);
      setGameOver(true);
      saveScore();
    };

    const loop = () => {
      if (isPaused) {
        animation = requestAnimationFrame(loop);
        return;
      }

      // Background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "hsla(305, 53%, 85%, 1)");
      gradient.addColorStop(1, "rgba(168, 209, 241, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw player and entities
      drawBall(ctx, playerBall.x, playerBall.y, playerBall.r, playerBall.color);
      stars.forEach((s) => drawStar(ctx, s.x, s.y, s.r, s.color));
      obstacles.forEach((o) => {
        ctx.fillStyle = "rgba(255,70,70,0.85)";
        ctx.fillRect(o.x, o.y, o.w, o.h);
        o.x += o.dx;
        if (o.x < 0 || o.x + o.w > width) o.dx *= -1;
      });

      // Movement
      const step = 7;
      if (keysRef.current["ArrowUp"] || mobileKeysRef.current.up) playerBall.y -= step;
      if (keysRef.current["ArrowDown"] || mobileKeysRef.current.down) playerBall.y += step;
      if (keysRef.current["ArrowLeft"] || mobileKeysRef.current.left) playerBall.x -= step;
      if (keysRef.current["ArrowRight"] || mobileKeysRef.current.right) playerBall.x += step;

      playerBall.x = Math.max(playerBall.r, Math.min(width - playerBall.r, playerBall.x));
      playerBall.y = Math.max(playerBall.r, Math.min(height - playerBall.r, playerBall.y));

      // Collect stars
      stars = stars.filter((s) => {
        const dist = Math.hypot(playerBall.x - s.x, playerBall.y - s.y);
        if (dist < playerBall.r + s.r) {
          setScore((prev) => prev + 10);
          return false;
        }
        return true;
      });

      // Collisions
      for (let o of obstacles) {
        if (
          playerBall.x + playerBall.r > o.x &&
          playerBall.x - playerBall.r < o.x + o.w &&
          playerBall.y + playerBall.r > o.y &&
          playerBall.y - playerBall.r < o.y + o.h
        ) {
          return gameOverTrigger();
        }
      }

      // Next level
      if (stars.length === 0) {
        setLevel((prev) => prev + 1);
        setTimeLeft(40);
        const next = makeLevelEntities(level + 1, width, height);
        stars = next.stars;
        obstacles = next.obstacles;
      }

      animation = requestAnimationFrame(loop);
    };

    loop();

    // Keyboard events
    const handleKeyDown = (e) => (keysRef.current[e.key] = true);
    const handleKeyUp = (e) => (keysRef.current[e.key] = false);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animation);
      clearInterval(timer);
    };
  }, [level, isPaused, canvasSize]);

  // Time over
  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      setGameOver(true);
      saveScore();
    }
  }, [timeLeft]);

  // Helper functions
  const createPlayerBall = (width, height) => ({
    x: width / 2,
    y: height / 2,
    r: 15,
    color: `hsl(${Math.random() * 360}, 90%, 45%)`,
  });

  const drawBall = (ctx, x, y, r, color) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx, x, y, r, color) => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        x + r * Math.cos(((18 + i * 72) / 180) * Math.PI),
        y - r * Math.sin(((18 + i * 72) / 180) * Math.PI)
      );
      ctx.lineTo(
        x + (r / 2) * Math.cos(((54 + i * 72) / 180) * Math.PI),
        y - (r / 2) * Math.sin(((54 + i * 72) / 180) * Math.PI)
      );
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  };

  const makeLevelEntities = (lvl, width, height) => ({
    stars: Array.from({ length: 5 + lvl }, () => ({
      x: Math.random() * (width - 60) + 30,
      y: Math.random() * (height - 60) + 30,
      r: 10 + Math.random() * 5,
      color: `hsl(${Math.random() * 360}, 100%, 40%)`,
    })),
    obstacles: Array.from({ length: lvl }, () => ({
      x: Math.random() * (width - 60) + 20,
      y: Math.random() * (height - 60) + 20,
      w: 40 + Math.random() * 20,
      h: 10 + Math.random() * 10,
      dx: Math.random() < 0.5 ? -2 : 2,
    })),
  });

  const handleMobileMove = (key, state) => (mobileKeysRef.current[key] = state);

  const btnStyle = (c1, c2) => ({
    background: `linear-gradient(90deg, ${c1}, ${c2})`,
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "all 0.25s ease",
  });

  const buttonHover = (e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
  };

  const buttonOut = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      {!gameOver ? (
        <>
          <div
            style={{
              width: "90%",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
              fontSize: "1.4rem",
              color: "#39FF14",
            }}
          >
            <div>
              {playerName} — Score: {score} • Level: {level} • Time: {timeLeft}s
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={btnStyle("#00c6ff", "#0072ff")}
                onMouseOver={buttonHover}
                onMouseOut={buttonOut}
                onClick={() => setIsPaused((p) => !p)}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                style={btnStyle("#f7971e", "#ffd200")}
                onMouseOver={buttonHover}
                onMouseOut={buttonOut}
                onClick={() => navigate("/")}
              >
                Exit
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              borderRadius: 24,
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              background:
                "linear-gradient(145deg, #f3f9ff 0%, #f6eaf2 100%)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              padding: "20px",
            }}
          />

          {/* Mobile Controls */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["⬆️", "⬅️", "⬇️", "➡️"].map((arrow, idx) => {
              const dir = ["up", "left", "down", "right"][idx];
              return (
                <button
                  key={dir}
                  onTouchStart={() => handleMobileMove(dir, true)}
                  onTouchEnd={() => handleMobileMove(dir, false)}
                  style={{
                    ...btnStyle("#00c6ff", "#0072ff"),
                    fontSize: "2rem",
                    padding: "18px 24px",
                  }}
                  onMouseOver={buttonHover}
                  onMouseOut={buttonOut}
                >
                  {arrow}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            borderRadius: 50,
            background:
              "linear-gradient(135deg, rgba(245,246,250,1) 0%, rgba(234,184,212,1) 50%, #f4f4f4ff 100%)",
            color: "BLUE",
            width: "70%",
            maxWidth: "600px",
          }}
        >
          <h2
            style={{
              color: "#ffeb3b",
              fontSize: 38,
              fontWeight: "bold",
              textShadow: "0 3px 10px rgba(0,0,0,0.4)",
            }}
          >
            🎮 Game Over!
          </h2>
          <p style={{ fontSize: 26, marginTop: 14 }}>
            Final Score: <strong>{score}</strong>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 30,
            }}
          >
            <button
              style={btnStyle("#00c6ff", "#0072ff")}
              onMouseOver={buttonHover}
              onMouseOut={buttonOut}
              onClick={() => navigate("/")}
            >
              Restart
            </button>
            <button
              style={btnStyle("#f7971e", "#ffd200")}
              onMouseOver={buttonHover}
              onMouseOut={buttonOut}
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
