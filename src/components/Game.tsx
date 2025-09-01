import type { Dispatch, JSX } from "react";
import { useEffect, useRef, useState } from "react";

import type { GameAction } from "../states/gameReducer";

import { initCards, randomInt } from "../utilities/utils";

import { PLAYER_NAMES } from "../constants/gameConstants";

import type { Players } from "./Card";
import Card from "./Card";

import "../styles/Game.css";
import "../styles/Transitions.css";

type GameProps = {
  isMultiplayer: boolean;
  pairCount: number;
  backIndex: number;
  maxPairs: number;
  dispatch: Dispatch<GameAction>;
};

export type Card = {
  id: string; // same for both copies of a pair
  img: string;
  matched: Players;
  flipped: boolean;
  cardIndex: number; // 0 or 1, distinguishes the two cards
};

type Scores = {
  player1: number;
  player2: number;
};

function nextPlayer(curr: 0 | 1): 0 | 1 {
  return curr === 0 ? 1 : 0;
}

function awardPoint(scores: Scores, player: 0 | 1): Scores {
  return {
    ...scores,
    [player === 0 ? "player1" : "player2"]:
      scores[player === 0 ? "player1" : "player2"] + 1,
  };
}

export default function Game({
  isMultiplayer,
  pairCount,
  backIndex,
  maxPairs,
  dispatch,
}: GameProps): JSX.Element {
  const [game, setGame] = useState({
    deck: initCards(pairCount),
    flippedIndices: [] as number[],
    scores: { player1: 0, player2: 0 },
    activePlayer: randomInt(2) as 0 | 1,
    winningPhrase: "",
  });

  const randomPlayer = useRef(randomInt(2)).current;
  const pairsLeft =
    pairCount - game.deck.filter((card) => card.matched !== null).length / 2;
  const won = pairsLeft === 0;
  const winner = isMultiplayer
    ? game.scores.player1 !== game.scores.player2
      ? game.scores.player1 > game.scores.player2
        ? 1
        : 2
      : null
    : null;

  // Handle winning
  useEffect(() => {
    if (won) {
      const winningPhrases = [
        "All paired up!",
        "Flawless finish!",
        "You nailed it!",
        "Every match found!",
        "Nothing left unmatched!",
      ];
      let winningPhrase = null;

      setGame((prevGame) => {
        if (isMultiplayer) {
          winningPhrase =
            winner === null
              ? "It's a tie!"
              : `${winner === 1 ? PLAYER_NAMES.player1.toUpperCase() : PLAYER_NAMES.player2.toUpperCase()} WINS`;
        } else {
          winningPhrase =
            pairCount === maxPairs
              ? "WINNER!"
              : winningPhrases[randomInt(winningPhrases.length - 1)];
        }
        return { ...prevGame, winningPhrase };
      });

      setTimeout(() => {
        dispatch({ type: "MENU" });
      }, 3000);
    }
  }, [won]);

  // Handle two flipped cards
  useEffect(() => {
    if (game.flippedIndices.length === 2) {
      const [firstIdx, secondIdx] = game.flippedIndices;
      const first = game.deck[firstIdx];
      const second = game.deck[secondIdx];

      if (first.id === second.id && firstIdx !== secondIdx) {
        if (isMultiplayer) {
          const scores = awardPoint(game.scores, game.activePlayer);
          setGame((prev) => ({ ...prev, scores }));
        }

        setTimeout(() => {
          setGame((prev) => {
            const deck = prev.deck.map((c, i) =>
              i === firstIdx || i === secondIdx
                ? {
                    ...c,
                    matched: (isMultiplayer
                      ? prev.activePlayer
                      : randomPlayer) as 0 | 1,
                  }
                : c,
            );
            return { ...prev, deck, flippedIndices: [] };
          });
        }, 500);
      } else {
        // mismatch
        setTimeout(() => {
          setGame((prev) => {
            const deck = prev.deck.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c,
            );
            return {
              ...prev,
              deck,
              flippedIndices: [],
              activePlayer: nextPlayer(prev.activePlayer),
            };
          });
        }, 1000);
      }
    }
  }, [game.flippedIndices, game.deck]);

  function handleFlip(cardInd: number) {
    setGame((prev) => {
      const deck = prev.deck.map((c, i) =>
        i === cardInd ? { ...c, flipped: true } : c,
      );
      return {
        ...prev,
        deck,
        flippedIndices: [...prev.flippedIndices, cardInd],
      };
    });
  }

  const cardWidthStyle: string | undefined =
    pairCount < 10
      ? "xsmall-board"
      : pairCount == 10
        ? "small-board"
        : pairCount == 15
          ? "medium-board"
          : pairCount == 18
            ? "large-board"
            : pairCount > 18
              ? "xlarge-board"
              : undefined;

  return (
    <>
      {/* Winner Message */}
      {won && isMultiplayer && (
        <h2 className={`bam-bam player${winner}`}>{game.winningPhrase}</h2>
      )}

      {!isMultiplayer &&
        (won ? (
          <h2 className={pairCount === maxPairs ? "bam-bam" : "bam"}>
            {game.winningPhrase}
          </h2>
        ) : (
          <h2>
            {pairsLeft} Pair{pairsLeft !== 1 && "s"} left
          </h2>
        ))}

      {/* Active Player Turn (multiplayer, ongoing game) */}
      {isMultiplayer && !won && (
        <div className="fade-in-down">
          <h2 className={game.activePlayer === 0 ? "player1" : "player2"}>
            {PLAYER_NAMES[game.activePlayer === 0 ? "player1" : "player2"]}'s
            Turn
          </h2>
        </div>
      )}

      {/* Scoreboard / Current Player */}
      {isMultiplayer && (
        <p className="upper-left">
          <span className="player1">
            {PLAYER_NAMES.player1}: {game.scores.player1}
          </span>
          <br />
          <br />
          <span className="player2">
            {PLAYER_NAMES.player2}: {game.scores.player2}
          </span>
        </p>
      )}

      {/* Board */}
      <section
        className={`board slow-fade-in ${cardWidthStyle} ${isMultiplayer && "multiplayer"}`}
      >
        {game.deck.map((card, i) => (
          <Card
            key={`${card.id}-${card.cardIndex}`}
            frontImg={card.img}
            backIndex={backIndex}
            matched={card.matched}
            flipped={card.flipped}
            disabled={card.flipped || game.flippedIndices.length == 2}
            onClick={() => handleFlip(i)}
          />
        ))}
      </section>
    </>
  );
}
