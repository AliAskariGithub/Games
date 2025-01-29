"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";

const words = ["javascript", "react", "nextjs", "typescript", "developer", "frontend", "backend", "fullstack"];

const Hangman = () => {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    if (/^[a-z]$/.test(key) && !guessedLetters.includes(key)) {
      setGuessedLetters([...guessedLetters, key]);
      if (!word.includes(key)) {
        setWrongGuesses(wrongGuesses + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [guessedLetters, wrongGuesses]);

  const displayWord = word.split("").map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(" ");
  const isGameOver = wrongGuesses >= maxWrong;
  const isWinner = !displayWord.includes("_");

  const restartGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  const hangmanParts = [
    "", // 0 wrong
    "O", // 1 wrong
    "O\n|", // 2 wrong
    "O\n/|", // 3 wrong
    "O\n/|\\", // 4 wrong
    "O\n/|\\\n/", // 5 wrong
    "O\n/|\\\n/ \\", // 6 wrong
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-4">Hangman</h1>
      <pre className="text-xl flex font-mono text-center mb-4">
        <Image src={"/image.png"} alt="hangman stand" width={100} height={100}/>
        <pre className="relative -left-7 top-2"> {hangmanParts[wrongGuesses]}</pre>
        </pre>
      <p className="text-2xl tracking-widest">{displayWord}</p>
      <p className="mt-4">Wrong Guesses: {wrongGuesses} / {maxWrong}</p>
      {isGameOver && <p className="text-red-500 text-2xl font-bold">Game Over! The word was {word}.</p>}
      {isWinner && <p className="text-green-500 text-2xl font-bold">You Win!</p>}
      {(isGameOver || isWinner) && (
        <button
          onClick={restartGame}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default Hangman;
