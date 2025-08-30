import { type JSX, useEffect, useReducer, useRef, useState } from "react";

import { useCSSVariables } from "../hooks/useCSSVariables";
import { INITIAL_STATE, gameReducer } from "../states/gameReducer";
import "bootstrap-icons/font/bootstrap-icons.css";

import { PAIRS, TITLE } from "../constants/gameConstants";

import BackgroundMusic from "./BackgroundMusic";
import type { BackgroundMusicHandle } from "./BackgroundMusic";
import Game from "./Game";

import "../styles/Main.css";
import "../styles/Transitions.css";

// Level Buttons Component
function LevelButtons({ onSelect }: { onSelect: (num: number) => void }) {
  return (
    <div className="level-select slow-fade-in">
      <div className="level-grid">
        {PAIRS.map((num) => (
          <button
            key={num}
            onClick={() => onSelect(num)}
            className="game-button"
          >
            {num * 2}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Memory(): JSX.Element {
  const musicRef = useRef<BackgroundMusicHandle>(null);
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [isMuted, setIsMuted] = useState(() => {
    // load persisted value (default false)
    return localStorage.getItem("isMuted") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isMuted", String(isMuted));
  }, [isMuted]);

  useCSSVariables(state.numPairs, state.bgImgIndex);

  const renderMenu = (): JSX.Element => {
    if (state.numPlayers === null) {
      return (
        <>
          <h1 className="fade-in-down">{TITLE}</h1>
          <div className="players-select fade-in-up">
            <button
              className="game-button"
              onClick={() => dispatch({ type: "SET_PLAYERS", players: 1 })}
            >
              1 Player
            </button>
            <button
              className="game-button"
              onClick={() => dispatch({ type: "SET_PLAYERS", players: 2 })}
            >
              2 Players
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="fade-in-up">{TITLE}</h1>
        <p className="fade-in-up">Select a number of cards</p>
        <LevelButtons
          onSelect={(num) => dispatch({ type: "START_GAME", numPairs: num })}
        />
      </>
    );
  };

  return (
    <main className={state.gameStatus === "START-GAME" ? "in-game" : undefined}>
      {/* Controls & App Navigation */}
      <span className="upper-right control-icons">
        <button className="house-icon" onClick={() => dispatch({type: "MENU"})}>
          <i className="bi bi-house-fill"></i>
        </button>
        <button onClick={() => setIsMuted((m) => !m)} className="volume-icon">
          {isMuted ? (
            <i className="bi bi-volume-mute-fill"></i>
          ) : (
            <i className="bi bi-volume-down-fill"></i>
          )}
        </button>
      </span>

      <BackgroundMusic ref={musicRef} track={state.track} isMuted={isMuted} />

      {/* Menu / Board */}
      {state.gameStatus === "MENU" ? (
        <div>{renderMenu()}</div>
      ) : (
        <Game
          pairCount={state.numPairs}
          backIndex={state.backIndex}
          maxPairs={PAIRS[PAIRS.length - 1]}
          isMultiplayer={state.numPlayers === 2}
          dispatch={dispatch}
        />
      )}
    </main>
  );
}
