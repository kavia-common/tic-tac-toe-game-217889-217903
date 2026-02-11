import React, { useMemo, useState } from 'react';
import './App.css';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }

  return { winner: null, line: [] };
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function App() {
  /** Core game state */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const nextPlayer = xIsNext ? PLAYER_X : PLAYER_O;
  const isDraw = !winner && isBoardFull(squares);

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? 'Draw!'
      : `Next player: ${nextPlayer}`;

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // Ignore clicks if game already ended or square is occupied
    if (winner || squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });

    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt">
        <header className="ttt__header" aria-label="Tic Tac Toe header">
          <div className="ttt__brand">
            <div className="ttt__badge" aria-hidden="true">
              8-BIT
            </div>
            <h1 className="ttt__title">Tic Tac Toe</h1>
          </div>
          <p className="ttt__subtitle">Two players. One device. Retro vibes.</p>
        </header>

        <section className="ttt__card" aria-label="Tic Tac Toe game">
          <div className="ttt__status" role="status" aria-live="polite">
            <span className="ttt__statusLabel">Status</span>
            <span className="ttt__statusValue">{statusText}</span>
          </div>

          <div
            className="ttt__board"
            role="grid"
            aria-label="Tic Tac Toe board"
          >
            {squares.map((value, idx) => {
              const isWinning = winningLine.includes(idx);
              const isDisabled = Boolean(value) || Boolean(winner);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    'ttt__square',
                    value ? `ttt__square--${value}` : '',
                    isWinning ? 'ttt__square--win' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ''}`}
                >
                  <span className="ttt__squareInner" aria-hidden="true">
                    {value ?? ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt__actions">
            <button
              type="button"
              className="ttt__btn"
              onClick={restartGame}
              aria-label="Restart game"
            >
              Restart
            </button>
          </div>

          <footer className="ttt__hint" aria-label="Game hint">
            Tip: X goes first. Click any square to place your mark.
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
