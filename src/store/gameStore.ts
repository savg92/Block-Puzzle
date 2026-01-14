import { create } from 'zustand';
import { Grid, Piece } from '../engine/types';

interface GameState {
  grid: Grid;
  score: number;
  availablePieces: Piece[];
  isGameOver: boolean;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
  score: 0,
  availablePieces: [],
  isGameOver: false,
  resetGame: () => set({
    grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
    score: 0,
    availablePieces: [],
    isGameOver: false,
  }),
}));
