import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Grid, Piece } from '../engine/types';
import { GameEngine } from '../engine';
import { getRandomPieces } from '../engine/pieces';
import { appStorage } from './storage';

interface GameState {
  grid: Grid;
  score: number;
  availablePieces: Piece[];
  selectedPiece: Piece | null;
  hoverPosition: { row: number; col: number } | null;
  gridLayout: { x: number; y: number; width: number; height: number } | null;
  isGameOver: boolean;
  history: Omit<GameState, 'newGame' | 'placePiece' | 'selectPiece' | 'undo' | 'history' | 'setHoverPosition' | 'setGridLayout'>[];
  newGame: () => void;
  placePiece: (piece: Piece, row: number, col: number) => void;
  selectPiece: (piece: Piece | null) => void;
  setHoverPosition: (pos: { row: number; col: number } | null) => void;
  setGridLayout: (layout: { x: number; y: number; width: number; height: number } | null) => void;
  undo: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
      score: 0,
      availablePieces: [],
      selectedPiece: null,
      hoverPosition: null,
      gridLayout: null,
      isGameOver: false,
      history: [],
      newGame: () =>
        set({
          grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
          score: 0,
          availablePieces: getRandomPieces(3),
          selectedPiece: null,
          hoverPosition: null,
          isGameOver: false,
          history: [],
        }),
      placePiece: (piece, row, col) => {
        const { grid, score, availablePieces, selectedPiece, isGameOver, history, hoverPosition, gridLayout } = get();
        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col);

        if (result.success) {
          // Push current state to history before updating
          const snapshot = { grid, score, availablePieces, selectedPiece, isGameOver, hoverPosition, gridLayout };
          const newHistory = [snapshot, ...history].slice(0, 20); // Limit to 20 moves

          set({
            grid: engine.getGrid(),
            score: engine.getScore(),
            history: newHistory,
            hoverPosition: null,
          });
        }
      },
      selectPiece: (piece) => set({ selectedPiece: piece }),
      setHoverPosition: (pos) => set({ hoverPosition: pos }),
      setGridLayout: (layout) => set({ gridLayout: layout }),
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
      storage: createJSONStorage(() => appStorage),
      // Only persist the core game state, not the history
      partialize: (state) => {
        const { history, ...rest } = state;
        return rest;
      },
    }
  )
);