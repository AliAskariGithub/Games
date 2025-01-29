"use client"
import React, { useState } from "react";

const cards = [
  { name: "Dragon", attack: 10, defense: 8 },
  { name: "Knight", attack: 7, defense: 6 },
  { name: "Wizard", attack: 8, defense: 5 },
  { name: "Goblin", attack: 5, defense: 4 },
  { name: "Orc", attack: 6, defense: 7 },
];

type Card = {
  name: string;
  attack: number;
  defense: number;
};

const BattleCardGame = () => {
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [opponentCard, setOpponentCard] = useState<Card | null>(null);
  const [result, setResult] = useState<string>("");
  const [hiddenCards, setHiddenCards] = useState<Card[]>([]);

  const generateHiddenCards = () => {
    const selectedCards: Card[] = [];
    const cardSet = new Set<string>();
    while (selectedCards.length < 3) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      if (!cardSet.has(randomCard.name)) {
        cardSet.add(randomCard.name);
        selectedCards.push(randomCard);
      }
    }
    setHiddenCards(selectedCards);
    setPlayerCard(null);
    setOpponentCard(null);
    setResult("");
  };

  const chooseCard = (card: Card) => {
    setPlayerCard(card);
    const opponentDraw = cards[Math.floor(Math.random() * cards.length)];
    setOpponentCard(opponentDraw);

    if (card.attack > opponentDraw.attack) {
      setResult("You Win!");
    } else if (card.attack < opponentDraw.attack) {
      setResult("You Lose!");
    } else {
      setResult("It's a Draw!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-4">Battle Card Game</h1>
      <button
        onClick={generateHiddenCards}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold shadow-md transition-all"
      >
       Restart
      </button>
      <div className="flex mt-6 gap-4">
        {hiddenCards.map((card, index) => (
          <div
            key={index}
            className="p-4 border-2 border-gray-500 rounded-lg text-center cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
            onClick={() => chooseCard(card)}
          >
            <p className="text-lg font-bold">Card {index + 1}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-6 gap-10">
        {playerCard && (
          <div className="p-4 border-2 border-blue-500 rounded-lg text-center">
            <h2 className="text-xl font-bold">Your Card</h2>
            <p className="text-lg">{playerCard.name}</p>
            <p>Attack: {playerCard.attack}</p>
            <p>Defense: {playerCard.defense}</p>
          </div>
        )}
        {opponentCard && (
          <div className="p-4 border-2 border-red-500 rounded-lg text-center">
            <h2 className="text-xl font-bold">Opponent&apos;s Card</h2>
            <p className="text-lg">{opponentCard.name}</p>
            <p>Attack: {opponentCard.attack}</p>
            <p>Defense: {opponentCard.defense}</p>
          </div>
        )}
      </div>
      {result && <p className="text-2xl mt-4 font-bold">{result}</p>}
    </div>
  );
};

export default BattleCardGame;