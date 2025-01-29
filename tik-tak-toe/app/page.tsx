"use client"
import React, { useState } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Next Player: ${isXTurn ? "X" : "O"}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">Tic Tac Toe</h1>
      <div className="text-xl mb-4 p-2 bg-white text-black rounded-lg shadow-md">{status}</div>
      <div className="grid grid-cols-3 gap-4">
        {board.map((value, index) => (
          <button
            key={index}
            className={`w-24 h-24 text-3xl font-extrabold flex items-center justify-center rounded-xl shadow-lg transition-transform transform hover:scale-105 ${
              value === "X" ? "bg-blue-600 text-white" : value === "O" ? "bg-yellow-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg text-lg transition-transform transform hover:scale-110"
      >
        Restart Game
      </button>
    </div>
  );
};

export default TicTacToe;
