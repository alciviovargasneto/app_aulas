import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background";
import StartScreen from "./components/StartScreen";
import GameScreen, { type GameResult } from "./components/GameScreen";
import EndScreen from "./components/EndScreen";

type Screen = "start" | "game" | "end";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [result, setResult] = useState<GameResult | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const startGame = () => {
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  return (
    <div className="relative min-h-screen font-body text-white selection:bg-gold-400 selection:text-navy-950">
      <Background />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen === "game" ? `game-${gameKey}` : screen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {screen === "start" && <StartScreen onStart={startGame} />}

          {screen === "game" && (
            <GameScreen
              key={gameKey}
              onFinish={(r) => {
                setResult(r);
                setScreen("end");
              }}
            />
          )}

          {screen === "end" && result && (
            <EndScreen result={result} onRestart={startGame} onHome={() => setScreen("start")} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
