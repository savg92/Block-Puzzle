export type Grid = (number | string)[][];
export type Piece = number[][];

export interface GameState {
  grid: Grid;
  score: number;
  availablePieces: Piece[];
  isGameOver: boolean;
}
