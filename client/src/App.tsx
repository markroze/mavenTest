import React, { useCallback, useEffect, useRef } from 'react';

import './App.css';
import Login from './Login';
import axios from 'axios';
export const apiUrl = 'http://localhost:3001';

interface DotProps {
  width?: number;
  x?: number;
  y?: number;
}

interface ScreenSize {
  width: number | undefined;
  height: number | undefined;
}

const Dot = ({ width = 20, x, y }: DotProps) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...{
        style: { width, position: 'absolute', left: x + 'px', top: y + 'px' },
      }}
    >
      <circle cx="10" cy="10" r="10" />
    </svg>
  );
};
const ResultsSpan = ({ color, label }: { color: string; label: string }) => {
  return (
    <div {...{ style: { color, position: 'fixed', bottom: 0, width: '100%' } }}>
      {label}
    </div>
  );
};
const GameResults = ({ start, end }: { start: number; end: number }) => {
  if (start === 0 && end === 0) {
    return <ResultsSpan {...{ color: 'red', label: 'Wrong Key' }} />;
  }
  if (start === -1 && end === -1) {
    return <ResultsSpan {...{ color: 'red', label: 'Waiting for start' }} />;
  }
  if (end - start < 0)
    return <ResultsSpan {...{ color: 'red', label: 'Too Late' }} />;
  return (
    <ResultsSpan
      {...{
        color: 'green',
        label: `You Won! 🎉, Game duration: ${end - start}ms`,
      }}
    />
  );
};

const App = () => {
  const mainTimer = useRef<number | null>(null);
  const dotTimeout = useRef<number | null>(null);

  const [dotSize, setDotSize] = React.useState<number>(10);
  const [localName, setLocalName] = React.useState<string | null>(
    localStorage.getItem('username')
  );

  const [screenSize, setScreenSize] = React.useState<ScreenSize>({
    width: window.visualViewport?.width,
    height: window.visualViewport?.height,
  });

  const [dotPosition, setDotPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [gameTimestamps, setGameTimestamps] = React.useState<number[]>([
    -1, -1,
  ]);

  const isDotLeft = dotPosition.x < screenSize.width! / 2;
  const isGameOver = gameTimestamps.length > 1;

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.visualViewport?.width,
        height: window.visualViewport?.height,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleWin = async () => {
      const res = await axios.post(`${apiUrl}/addResult`, {
        username: localName,
        score: gameTimestamps[1] - gameTimestamps[0],
      });
      console.log(res);
    };
    if (gameTimestamps[0] > 0 && gameTimestamps[1] > 0) {
      handleWin();
    }
  }, [gameTimestamps, localName]);

  const handleUserKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const isOnTimeOnTarget = (eventKey: string) =>
        ((eventKey === 'a' && isDotLeft) || (eventKey === 'i' && !isDotLeft)) &&
        gameTimestamps.length === 1;

      const stopMainTimer = () => {
        if (mainTimer.current === null) return;
        window.clearTimeout(mainTimer.current);
        mainTimer.current = null;
      };
      const stopDotTimer = () => {
        if (dotTimeout.current === null) return;
        window.clearTimeout(dotTimeout.current);
        dotTimeout.current = null;
      };

      if (isOnTimeOnTarget(event.key))
        setGameTimestamps((state) => [...state, Date.now()]);
      else {
        setGameTimestamps([0, 0]);
      }
      stopMainTimer();
      stopDotTimer();
    },
    [isDotLeft, gameTimestamps]
  );

  useEffect(() => {
    if (gameTimestamps.length < 2) {
      window.addEventListener('keydown', handleUserKeyPress);
    }
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [gameTimestamps, handleUserKeyPress]);

  const isDotOnTheLines = (x: number, y: number) => {
    if (
      (x < screenSize.width! / 2 + dotSize && x! > screenSize.width! / 2) ||
      x >= screenSize.width! - dotSize
    ) {
      return true;
    } else if (y >= screenSize.height! - dotSize) {
      return false;
    }
  };

  const calcDotPosition = (): void => {
    const x = Math.floor(Math.random() * screenSize.width!);
    const y = Math.floor(Math.random() * screenSize.height!);

    if (isDotOnTheLines(x, y)) {
      return calcDotPosition();
    }
    setDotPosition({ x, y });
  };

  const handleGameRestart = () => {
    calcDotPosition();
    setGameTimestamps([]);
    const randomTime = Math.floor(Math.random() * 4) + 2;

    mainTimer.current = window.setTimeout(() => {
      setGameTimestamps([Date.now()]);

      dotTimeout.current = window.setTimeout(() => {
        setGameTimestamps((state) => [...state, 0]);
      }, 1000);
    }, 1000 * randomTime);
  };

  console.log(gameTimestamps);

  return (
    <div className="App">
      {!localName ? (
        <Login {...{ setLocalName }} />
      ) : isGameOver ? (
        <>
          <GameResults
            {...{
              start: gameTimestamps[0],
              end: gameTimestamps[1],
              style: { position: 'fixed', botton: 0 },
            }}
          />
          <button
            onClick={() => {
              handleGameRestart();
            }}
          >
            Reset Game
          </button>
        </>
      ) : gameTimestamps.length === 0 ? (
        'Get Ready!'
      ) : (
        <>
          <div className="VerticalLine"></div>
          <Dot {...{ ...dotPosition, width: dotSize }} />
        </>
      )}
    </div>
  );
};
export default App;
