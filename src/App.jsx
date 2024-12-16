import React, { useState, useEffect } from 'react'; 
import './App.css';


// Programming languages and their colors
const LANGUAGES = [
  { name: 'PHP', color: 'mediumpurple' },
  { name: 'C#', color: 'darkblue' },
  { name: 'Scala', color: 'darkred' },
  { name: 'Dart', color: 'deepskyblue' },
  { name: 'Haskell', color: 'darkolivegreen' },
  { name: 'R', color: 'steelblue' },
  { name: 'Perl', color: 'darkgoldenrod' },
  { name: 'Lua', color: 'slateblue' },
  { name: 'Erlang', color: 'darkmagenta' },
  { name: 'Elixir', color: 'mediumpurple' },
  { name: 'JavaScript', color: 'goldenrod' },
  { name: 'Python', color: 'steelblue' },
  { name: 'Java', color: 'orange' },
  { name: 'C++', color: 'midnightblue' },
  { name: 'Ruby', color: 'crimson' },
  { name: 'Swift', color: 'coral' },
  { name: 'Go', color: 'deepskyblue' },
  { name: 'Rust', color: 'sienna' },
  { name: 'TypeScript', color: 'dodgerblue' },
  { name: 'Kotlin', color: 'darkorange' },
 
];

function ProgrammingColorGame() {
  const [showColors, setShowColors] = useState(true);
  const [languages, setLanguages] = useState(LANGUAGES);
  const [guessedLanguages, setGuessedLanguages] = useState([]);
  const [currentGuess, setCurrentGuess] = useState({ language: '', color: '' });
  const [results, setResults] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  //  Audio initialization
  const [successAudio, setSuccessAudio] = useState(null);
  const [failureAudio, setFailureAudio] = useState(null);


  useEffect(() => {
    //  initialize audio sound
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      setSuccessAudio(new Audio('/src/sounds/success.mp3'));
      setFailureAudio(new Audio('/src/sounds/failure.mp3'));
    }
  }, []);

  // Effect to hide colors after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowColors(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Check game over conditions
  useEffect(() => {
    if (failedAttempts >= 5 || results.length >= 20) {
      setGameOver(true);
    }
  }, [failedAttempts, results]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //  normalize input
    const trimmedLanguage = currentGuess.language.trim();
    const trimmedColor = currentGuess.color.trim().toLowerCase();

    // Check if the language was already guessed
    if (guessedLanguages.includes(trimmedLanguage)) {
      handleFailedAttempt();
      return;
    }

    // Find the correct language
    const correctLanguage = LANGUAGES.find(lang => 
      lang.name.toLowerCase() === trimmedLanguage.toLowerCase()
    );

    if (
      correctLanguage && 
      correctLanguage.color.toLowerCase() === trimmedColor
    ) {
      // Successful guess
      if (successAudio) successAudio.play();
      setResults([
        ...results, 
        {
          attemptNumber: results.length + 1,
          language: trimmedLanguage,
          status: 'success'
        }
      ]);
      setGuessedLanguages([...guessedLanguages, trimmedLanguage]);
    } else {
      // Failed attempt
      handleFailedAttempt();
    }

    // Reset current guess
    setCurrentGuess({ language: '', color: '' });
  };

  const handleFailedAttempt = () => {
    if (failureAudio) failureAudio.play();
    setFailedAttempts(prev => prev + 1);
    setResults([
      ...results, 
      {
        attemptNumber: results.length + 1,
        language: currentGuess.language.trim(),
        status: 'failure'
      }
    ]);
    setGuessedLanguages([...guessedLanguages, currentGuess.language.trim()]);
  };

  const restartGame = () => {
    setShowColors(true);
    setLanguages(LANGUAGES);
    setGuessedLanguages([]);
    setCurrentGuess({ language: '', color: '' });
    setResults([]);
    setFailedAttempts(0);
    setGameOver(false);

    // Reset timer to hide colors
    setTimeout(() => {
      setShowColors(false);
    }, 4000);
  };

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>Total Attempts: {results.length}</p>
        <p>Failed Attempts: {failedAttempts}</p>
        <button onClick={restartGame}>Restart Game</button>
      </div>
    );
  }

  return (
    <div className="programming-color-game">
      <h1>Programming Language Color Game</h1>
      
      {showColors ? (
        <div className="language-colors">
          {languages.map((lang, index) => (
            <div 
              key={index} 
              className="language-color-block"
              style={{ backgroundColor: lang.color }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="guess-form">
          <input 
            type="text"
            placeholder="Programming Language"
            value={currentGuess.language}
            onChange={(e) => setCurrentGuess(prev => ({ 
              ...prev, 
              language: e.target.value 
            }))}
            required
          />
          <input 
            type="text"
            placeholder="Color "
            value={currentGuess.color}
            onChange={(e) => setCurrentGuess(prev => ({ 
              ...prev, 
              color: e.target.value 
            }))}
            required
          />
          <button type="submit">Submit Guess</button>
        </form>
      )}

      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Language</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.attemptNumber}</td>
                <td>{result.language}</td>
                <td className={`status-${result.status}`}>
                  {result.status === 'success' ? '✓' : '✗'} 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProgrammingColorGame;