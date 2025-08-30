import type { JSX } from "react";

import { loackBack } from "../utilities/images";

const back = loackBack()

export type Players = 1 | 0 | null;

type CardProps = {
  flipped: boolean;
  frontImg: string;
  matched: Players;
  backIndex: number;
  disabled: boolean;
  onClick?: () => void;
};

export type Card = {
  id: string;
  img: string;
  matched: Players;
  flipped: boolean;
  cardIndex: number;
};

export default function Card({
  flipped,
  matched,
  frontImg,
  backIndex,
  disabled,
  onClick = () => {},
}: CardProps): JSX.Element {
  const className = flipped
    ? matched !== null
      ? matched === 0
        ? "player1"
        : "player2"
      : "flip"
    : "back";

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      <img src={flipped ? frontImg : back[backIndex]} />
    </button>
  );
}
