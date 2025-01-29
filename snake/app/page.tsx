"use client"
import React, { useState, useEffect, useRef } from "react";

const CELL_SIZE = 20;
const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 20;

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => JSON.parse(localStorage.getItem("highScore")) || 0
  );

  const boardRef = useRef<HTMLDivElement>(null);

  const generateFood = () => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_WIDTH),
        Math.floor(Math.random() * BOARD_HEIGHT),
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    setFood(newFood);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;

      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[newSnake.length - 1];
        let newHead;

        switch (direction) {
          case "UP":
            newHead = [head[0], head[1] - 1];
            break;
          case "DOWN":
            newHead = [head[0], head[1] + 1];
            break;
          case "LEFT":
            newHead = [head[0] - 1, head[1]];
            break;
          case "RIGHT":
            newHead = [head[0] + 1, head[1]];
            break;
          default:
            return prevSnake;
        }

        if (
          newHead[0] < 0 ||
          newHead[1] < 0 ||
          newHead[0] >= BOARD_WIDTH ||
          newHead[1] >= BOARD_HEIGHT ||
          newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        newSnake.push(newHead);

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((prevScore) => prevScore + 0.5);
          generateFood();
        } else {
          newSnake.shift();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", JSON.stringify(score));
    }
  }, [score, highScore]);

  const restartGame = () => {
    setSnake([[5, 5]]);
    setFood([10, 10]);
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>

      <div className="absolute top-4 right-4 bg-white text-black p-4 rounded-lg shadow-lg">
        <div className="font-bold text-lg">Dashboard</div>
        <div>Current Score: {score}</div>
        <div>Highest Score: {highScore}</div>
      </div>

      <div
        ref={boardRef}
        className="relative rounded-xl bg-gray-500" 
        style={{
          width: `${CELL_SIZE * BOARD_WIDTH}px`,
          height: `${CELL_SIZE * BOARD_HEIGHT}px`,
          backgroundColor: "#111",
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`
        }}
      >
        {snake.map(([x, y], index) => (
          <div
            key={index}
            className={`absolute flex items-center justify-center bg-green-500 shadow-md ${
              index === snake.length - 1 ? "bg-yellow-500 rounded-full" : " rounded-md"
            }`}
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              transform: `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`
            }}
          >
            {index === snake.length - 1 && (
              <div className="rounded-full bg-black w-2 h-2" />
            )}
          </div>
        ))}

        <div
          className="absolute bg-gradient-to-t from-red-600 via-orange-500 to-yellow-500 rounded-full shadow-lg"
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            transform: `translate(${food[0] * CELL_SIZE}px, ${food[1] * CELL_SIZE}px)`
          }}
        />
      </div>

      <div className="mt-6 text-lg">Score: {score}</div>

      {isGameOver && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold mb-2">Game Over!</p>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-semibold transition-all shadow-md"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
