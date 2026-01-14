import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Grid, Piece } from '../engine/types';
import { GameEngine } from '../engine';
import { mmkvStorage } from './storage';

interface GameState {
  grid: Grid;
  score: number;
  availablePieces: Piece[];
  selectedPiece: Piece | null;
  isGameOver: boolean;
  newGame: () => void;
  placePiece: (piece: Piece, row: number, col: number) => void;
  selectPiece: (piece: Piece | null) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
      score: 0,
      availablePieces: [],
      selectedPiece: null,
      isGameOver: false,
      newGame: () =>
        set({
          grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
          score: 0,
          availablePieces: [],
          selectedPiece: null,
          isGameOver: false,
        }),
      placePiece: (piece, row, col) => {
        const { grid, score } = get();
        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col);

        if (result.success) {
          set({
            grid: engine.getGrid(),
            score: engine.getScore(),
          });
        }
      },
      selectPiece: (piece) => set({ selectedPiece: piece }),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
