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
  history: Omit<GameState, 'newGame' | 'placePiece' | 'selectPiece' | 'undo' | 'history'>[];
  newGame: () => void;
  placePiece: (piece: Piece, row: number, col: number) => void;
  selectPiece: (piece: Piece | null) => void;
  undo: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
      score: 0,
      availablePieces: [],
      selectedPiece: null,
      isGameOver: false,
      history: [],
      newGame: () =>
        set({
          grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
          score: 0,
          availablePieces: [],
          selectedPiece: null,
          isGameOver: false,
          history: [],
        }),
      placePiece: (piece, row, col) => {
        const { grid, score, availablePieces, selectedPiece, isGameOver, history } = get();
        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col);

        if (result.success) {
          // Push current state to history before updating
          const snapshot = { grid, score, availablePieces, selectedPiece, isGameOver };
          const newHistory = [snapshot, ...history].slice(0, 20); // Limit to 20 moves

          set({
            grid: engine.getGrid(),
            score: engine.getScore(),
            history: newHistory,
          });
        }
      },
      selectPiece: (piece) => set({ selectedPiece: piece }),
      undo: () => {
        const { history } = get();
        if (history.length === 0) return;

        const [previousState, ...remainingHistory] = history;
        set({
          ...previousState,
          history: remainingHistory,
        });
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist the core game state, not the history
      partialize: (state) => {
        const { history, ...rest } = state;
        return rest;
      },
    }
  )
);
