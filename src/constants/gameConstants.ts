/**
 * Game configuration constants for Memory Game
 */

/** Title */
export const TITLE = "Card☆Symphony";

/** Maximum number of back of card variations available */
export const MAX_PATTERNS = 6;

/** Available pair counts for different difficulty levels */
export const PAIRS = [3, 8, 10, 15, 18, 21] as const;

/** Grid column limit for responsive design */
export const MAX_GRID_COLUMNS = 10;

/** Identify players when in multiplayer mode */
export const PLAYER_NAMES = { player1: "Pink", player2: "Blue" };
