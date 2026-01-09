import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const maxWrong = 6;

  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    fetch('/words.txt')
      .then(res => res.text())
      .then(text => {
        const words = text
          .split('\n')
          .map(w => w.trim().toUpperCase())
          .filter(Boolean);
        setWordList(words);
        setWord(words[Math.floor(Math.random() * words.length)]);
      });
  }, []);

  const resetGame = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord);
    setGuessed([]);
    setWrong(0);
    setGameOver(false);
  };

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || gameOver) return;

    setGuessed([...guessed, letter]);

    if (!word.includes(letter)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      if (newWrong >= maxWrong) setGameOver(true);
    } else if (word.split('').every(l => guessed.includes(l) || l === letter)) {
      setScore(score + 1);
      setGameOver(true);
    }
  };

  const renderWord = () =>
    word
      .split('')
      .map(l => (guessed.includes(l) ? l : l === ' ' ? ' ' : '_'))
      .join(' ');

  const renderButtons = () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
      <button
        key={l}
        onClick={() => handleGuess(l)}
        disabled={guessed.includes(l) || gameOver}
        className="letter-btn"
      >
        {l}
      </button>
    ));

  return (
    <div className="App">
      <h1>Vishal's <span className='game-title'>Hangman Word Guessing Game </span>- Shri Ram Groups of College</h1>
      <p className="score">Score: {score}</p>
      <img src={`/images/hangman${wrong}.png`} alt="hangman" className="hangman-img" />
      <p className="word">{renderWord()}</p>
      <div className="letters">{renderButtons()}</div>

      
      {gameOver && (
        <div className="end-screen">
          <h2 className={wrong >= maxWrong ? 'lose' : 'win'}>
            {wrong >= maxWrong ? 'You Lost!' : 'Winner!'}
          </h2>
          <p>The word was: {word}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
