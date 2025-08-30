import type { Card } from "../components/Game";
import { nanoid } from "nanoid";

import { loadDeck } from "./images";

const deck = loadDeck();

export function playSoundOnce(src: string, volume: number = 1): void {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch((error: DOMException) => {
      console.error("Sound playback failed:", error);
    });
  } catch (error) {
    console.error("Failed to create or play sound:", error);
  }
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function initCards(pairs: number): Card[] {
  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const randInd = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[randInd]] = [arr[randInd], arr[i]];
    }
    return arr;
  }

  const shuffledDeck = shuffle(deck.slice());

  const pairsArr = new Array(pairs).fill(0).map((_, i) => {
    const id = nanoid();
    return [
      {
        id,
        img: shuffledDeck[i],
        flipped: false,
        matched: null,
        cardIndex: 0,
      },
      {
        id,
        img: shuffledDeck[i],
        flipped: false,
        matched: null,
        cardIndex: 1,
      },
    ];
  });
  return shuffle(pairsArr.flat());
}

export function playWinningSound(
  isMuted: boolean,
  audio: string,
  volume: number,
  audioDuration: number,
  dispatch: () => void,
) {
  if (isMuted) {
    // skip playing, dispatch after delay
    setTimeout(dispatch, 3000);
    return;
  }

  setTimeout(() => {
    playSoundOnce(audio, volume);
    setTimeout(() => {
      dispatch();
    }, audioDuration);
  }, 500);
}
