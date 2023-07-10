import React, { useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import '../App.css';
import Dot from '../components/Dot.component';
import GameResults from '../components/GameResults.component';
import VerticalLine from '../components/VerticalLine.component';

interface ScreenSize {
  width: number | undefined;
  height: number | undefined;
}

const Game = ({ localName }: { localName: string }) => {
  const mainTimer = useRef<number | null>(null);
  const dotTimeout = useRef<number | null>(null);

  const [dotSize, setDotSize] = React.useState<number>(10);

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

  return (
    <>
      {isGameOver ? (
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
          <VerticalLine />
          <Dot {...{ ...dotPosition, width: dotSize }} />
        </>
      )}
    </>
  );
};
export default Game;
