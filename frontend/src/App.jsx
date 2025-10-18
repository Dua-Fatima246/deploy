import React from "react";
import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <div className="global-bg">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}
