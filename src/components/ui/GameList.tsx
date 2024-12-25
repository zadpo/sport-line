"use client";

import { useState, useEffect } from "react";
import GameCard from "./GameCard";
import { motion } from "framer-motion";

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  sport: string;
};

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // TODO: Fetch games from the backend API
    // For now, we'll use mock data
    const mockGames: Game[] = [
      {
        id: "1",
        homeTeam: "Lakers",
        awayTeam: "Celtics",
        startTime: "2023-05-01T19:00:00Z",
        sport: "Basketball",
      },
      {
        id: "2",
        homeTeam: "Yankees",
        awayTeam: "Red Sox",
        startTime: "2023-05-01T18:30:00Z",
        sport: "Baseball",
      },
    ];
    setGames(mockGames);
  }, []);

  return (
    <motion.div
      className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </motion.div>
  );
}
