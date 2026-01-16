import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Grid, Piece } from '../engine/types';
import { GameEngine } from '../engine';
import { getRandomPieces } from '../engine/pieces';
import { appStorage } from './storage';

interface GameState {
  grid: Grid;
  score: number;
  highScore: number;
  availablePieces: Piece[];
  selectedPiece: Piece | null;
  hoverPosition: { row: number; col: number } | null;
  gridLayout: { x: number; y: number; width: number; height: number } | null;
  isGameOver: boolean;
  powerUps: {
    deleteBlock: number;
    swapPiece: number;
  };
  history: Omit<GameState, 'newGame' | 'placePiece' | 'selectPiece' | 'undo' | 'history' | 'setGridLayout' | 'usePowerUp' | 'initStore' | 'setHoverPosition'>[];
  newGame: () => void;
  initStore: () => Promise<void>;
  placePiece: (piece: Piece, row: number, col: number, color: string) => void;
  selectPiece: (piece: Piece | null) => void;
  setHoverPosition: (pos: { row: number; col: number } | null) => void;
  setGridLayout: (layout: { x: number; y: number; width: number; height: number } | null) => void;
  usePowerUp: (type: 'deleteBlock' | 'swapPiece', row?: number, col?: number) => void;
  undo: () => void;
}

const HIGH_SCORE_KEY = 'high_score';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
      score: 0,
      highScore: 0,
      availablePieces: [],
      selectedPiece: null,
      hoverPosition: null,
      gridLayout: null,
      isGameOver: false,
      powerUps: {
        deleteBlock: 1,
        swapPiece: 1,
      },
      history: [],
      initStore: async () => {
        const saved = await appStorage.getItem(HIGH_SCORE_KEY);
        if (saved) {
          set({ highScore: parseInt(saved, 10) });
        }
      },
      newGame: () =>
        set({
          grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
          score: 0,
          availablePieces: getRandomPieces(3),
          selectedPiece: null,
          hoverPosition: null,
          isGameOver: false,
          powerUps: {
            deleteBlock: 1,
            swapPiece: 1,
          },
          history: [],
        }),
      placePiece: (piece, row, col, color) => {
        const { grid, score, highScore, availablePieces, selectedPiece, isGameOver, history, gridLayout, powerUps, hoverPosition } = get();
        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col, color);

        if (result.success) {
          // Push current state to history before updating
          const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition };
          const newHistory = [snapshot, ...history].slice(0, 20); // Limit to 20 moves

          // Remove the piece from available pieces
          const pieceIndex = availablePieces.findIndex((p) => p === piece);
          let newAvailablePieces = [...availablePieces];
          if (pieceIndex !== -1) {
            newAvailablePieces.splice(pieceIndex, 1);
          }
          
          // Refill if empty
          if (newAvailablePieces.length === 0) {
            newAvailablePieces = getRandomPieces(3);
          }

          // Check if game is over with the remaining pieces
          const gameOver = engine.checkGameOver(newAvailablePieces);

          const newScore = engine.getScore();
          const newHighScore = Math.max(highScore, newScore);

          if (newHighScore > highScore) {
            appStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
          }

          set({
            grid: engine.getGrid(),
            score: newScore,
            highScore: newHighScore,
            availablePieces: newAvailablePieces,
            selectedPiece: null,
            isGameOver: gameOver,
            history: newHistory,
            hoverPosition: null, // Clear hover
          });
        }
      },
      selectPiece: (piece) => set({ selectedPiece: piece }),
      setHoverPosition: (pos) => set({ hoverPosition: pos }),
      setGridLayout: (layout) => set({ gridLayout: layout }),
      usePowerUp: (type, row, col) => {
        const { grid, powerUps, history, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, hoverPosition } = get();
        
        if (powerUps[type] <= 0) return;

        // Push current state to history
        const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition };
        const newHistory = [snapshot, ...history].slice(0, 20);

        if (type === 'deleteBlock' && row !== undefined && col !== undefined) {
          const newGrid = grid.map((r) => [...r]);
          if (newGrid[row][col] !== 0) {
            newGrid[row][col] = 0;
            
            // Check if deleting the block saved the game
            const engine = new GameEngine(newGrid, score);
            const stillGameOver = engine.checkGameOver(availablePieces);

            set({
              grid: newGrid,
              powerUps: { ...powerUps, deleteBlock: powerUps.deleteBlock - 1 },
              isGameOver: stillGameOver,
              history: newHistory,
            });
          }
        } else if (type === 'swapPiece') {
          const newPieces = getRandomPieces(3);
          
          // Check if new pieces saved the game
          const engine = new GameEngine(grid, score);
          const stillGameOver = engine.checkGameOver(newPieces);

          set({
            availablePieces: newPieces,
            powerUps: { ...powerUps, swapPiece: powerUps.swapPiece - 1 },
            isGameOver: stillGameOver,
            history: newHistory,
          });
        }
      },
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