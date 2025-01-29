"use client"
import React, { useState, useEffect } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";

const TypingSpeedTest = () => {
  const [inputValue, setInputValue] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctWords, setCorrectWords] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [displayedWords, setDisplayedWords] = useState<string[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0); // Typing speed in WPM

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        calculateTypingSpeed();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, correctWords]);

  const fetchWords = async () => {
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word?number=200");
      const words = await response.json();
      generateNewWords(words);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const generateNewWords = (allWords: string[]) => {
    const lines: string[][] = [];
    let line: string[] = [];

    allWords.forEach((word) => {
      if (line.join(" ").length + word.length + 1 <= 50) {
        line.push(word);
      } else {
        lines.push(line);
        line = [word];
      }
    });
    if (line.length > 0) lines.push(line);
    setDisplayedWords(lines);
  };

  const startGame = () => {
    setInputValue("");
    setStartTime(Date.now());
    setCorrectWords(0);
    setAccuracy(100);
    setCurrentWordIndex(0);
    setTotalCharsTyped(0);
    setCurrentLineIndex(0);
    setTypingSpeed(0);
    fetchWords();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const currentLine = displayedWords[currentLineIndex] || [];
    const currentWord = currentLine[currentWordIndex] || "";

    // Move to next word if input matches and ends with a space
    if (value.endsWith(" ") && value.trim() === currentWord) {
      setCorrectWords((prev) => prev + 1);
      setCurrentWordIndex((prev) => prev + 1);
      setInputValue("");

      // If the current line is complete, move to the next line
      if (currentWordIndex + 1 === currentLine.length) {
        setCurrentWordIndex(0);
        setCurrentLineIndex((prev) => prev + 1);
      }
    }

    setTotalCharsTyped((prev) => prev + value.replace(/\s/g, "").length);

    // Calculate accuracy
    const typedWords = value.trim().split(" ");
    const correctChars = typedWords.reduce((acc, word, index) => {
      return acc + (word === currentLine[index] ? word.length : 0);
    }, 0);

    const calculatedAccuracy = (correctChars / totalCharsTyped) * 100;
    setAccuracy(isNaN(calculatedAccuracy) ? 100 : Math.round(calculatedAccuracy));
  };

  const calculateTypingSpeed = () => {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Time in minutes
      const wpm = correctWords / elapsedTime;
      setTypingSpeed(Math.round(wpm));
    }
  };

  const getWordClass = (word: string, index: number) => {
    if (index < currentWordIndex) {
      return word === displayedWords[currentLineIndex][index]
        ? "text-green-500 opacity-100"
        : "text-red-500 opacity-100";
    }
    if (index === currentWordIndex) {
      return "underline opacity-100";
    }
    return "text-gray-500 opacity-40";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <h1 className="text-5xl font-bold mb-6">Typing Speed Test</h1>
      <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md mb-6 w-3/4 max-w-3xl text-center">
        {displayedWords[currentLineIndex]?.map((word, index) => (
          <span
            key={index}
            className={`${getWordClass(word, index)} mx-1 text-xl`}
          >
            {word}
          </span>
        ))}
      </div>
      <input
        type="text"
        className="w-3/4 max-w-3xl h-12 p-4 rounded-lg shadow-md text-black focus:outline-none text-lg"
        value={inputValue}
        onChange={handleChange}
        placeholder="Start typing here..."
      />
      <div className="mt-4 text-xl">
        Words Typed Correctly: {correctWords} | Accuracy: {accuracy}% | Typing Speed: {typingSpeed} WPM
      </div>
      <button
        onClick={startGame}
        className="mt-6 px-8 py-4 flex justify-center items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg text-lg transition-transform transform hover:scale-110"
      >
       <MdOutlineRestartAlt size={24}/> Restart 
      </button>
    </div>
  );
};

export default TypingSpeedTest;
