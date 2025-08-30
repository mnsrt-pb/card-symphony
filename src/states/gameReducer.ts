import { loadBg } from "../utilities/images";
import { bgMusic } from "../utilities/music";
import { randomInt } from "../utilities/utils";

import { MAX_PATTERNS, PAIRS } from "../constants/gameConstants";

const bgImgsLen = loadBg().length;

export type Status = "MENU" | "START-GAME";

export type GameState = {
  gameStatus: Status;
  numPairs: number;
  backIndex: number;
  bgImgIndex: number;
  track: string;
  numPlayers: 1 | 2 | null;
};

export type GameAction =
  | { type: "MENU" }
  | { type: "START_GAME"; numPairs: number }
  | { type: "SET_PLAYERS"; players: 1 | 2 };

export const INITIAL_STATE: GameState = {
  gameStatus: "MENU",
  numPairs: 6,
  bgImgIndex: randomInt(bgImgsLen),
  backIndex: randomInt(MAX_PATTERNS),
  track: bgMusic,
  numPlayers: null,
};

/**
 * Game state reducer for Memory Game
 * Manages game flow, player selection, and audio tracks
 * @param state - Current game state
 * @param action - Action to perform
 * @returns New game state
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MENU":
      return {
        ...INITIAL_STATE,
        bgImgIndex: randomInt(bgImgsLen),
      };

    case "START_GAME": {
      const pairsIndex = PAIRS.indexOf(
        action.numPairs as (typeof PAIRS)[number],
      );
      if (pairsIndex === -1)
        throw new Error(`Invalid pairs count: ${action.numPairs}`);

      return {
        ...state,
        gameStatus: "START-GAME",
        numPairs: action.numPairs,
        backIndex: randomInt(MAX_PATTERNS),
      };
    }

    case "SET_PLAYERS":
      return { ...state, numPlayers: action.players };

    default:
      return state;
  }
}
