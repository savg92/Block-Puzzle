import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Grid, Piece } from '../engine/types';
import { GameEngine } from '../engine';
import { getRandomPieces, rotatePiece } from '../engine/pieces';
import { appStorage } from './storage';

export type PowerUpType = 'undo' | 'rotate' | 'discard' | 'forcePlace' | 'addSingle';

interface GameState {
  grid: Grid;
  score: number;
  highScore: number;
  availablePieces: (Piece | null)[];
  selectedPiece: Piece | null;
  hoverPosition: { row: number; col: number } | null;
  gridLayout: { x: number; y: number; width: number; height: number } | null;
  isGameOver: boolean;
  
  activePowerUpMode: null | 'discard' | 'force' | 'single';
  powerUps: Record<PowerUpType, number>;

  history: Omit<GameState, 'newGame' | 'placePiece' | 'selectPiece' | 'undo' | 'history' | 'setGridLayout' | 'usePowerUp' | 'initStore' | 'setHoverPosition'>[];
  
  newGame: () => void;
  initStore: () => Promise<void>;
  placePiece: (piece: Piece, row: number, col: number, color: string, sourceIndex?: number) => void;
  selectPiece: (piece: Piece | null) => void;
  setHoverPosition: (pos: { row: number; col: number } | null) => void;
  setGridLayout: (layout: { x: number; y: number; width: number; height: number } | null) => void;
  usePowerUp: (type: PowerUpType, row?: number, col?: number) => void;
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
      
      activePowerUpMode: null,
      powerUps: {
        undo: 1,
        rotate: 1,
        discard: 1,
        forcePlace: 1,
        addSingle: 1,
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
          
          activePowerUpMode: null,
          powerUps: {
            undo: 1,
            rotate: 1,
            discard: 1,
            forcePlace: 1,
            addSingle: 1,
          },
          
          history: [],
        }),
      placePiece: (piece, row, col, color, sourceIndex) => {
        const { grid, score, highScore, availablePieces, selectedPiece, isGameOver, history, gridLayout, powerUps, hoverPosition, activePowerUpMode } = get();
        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col, color);

        if (result.success) {
          // Push current state to history before updating
          // Note: We snapshot 'activePowerUpMode' too
          const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition, activePowerUpMode };
          const newHistory = [snapshot, ...history].slice(0, 20); // Limit to 20 moves

          // Remove the piece from available pieces (mark as null)
          let newAvailablePieces = [...availablePieces];
          if (sourceIndex !== undefined && sourceIndex >= 0 && sourceIndex < newAvailablePieces.length) {
             newAvailablePieces[sourceIndex] = null;
          } else {
             // Fallback for compatibility or tests without index
             const pieceIndex = availablePieces.findIndex((p) => p === piece);
             if (pieceIndex !== -1) {
               newAvailablePieces[pieceIndex] = null;
             }
          }
          
          // Refill if all are null
          if (newAvailablePieces.every(p => p === null)) {
            newAvailablePieces = getRandomPieces(3);
          }

          // Check if game is over with the remaining pieces (filter out nulls)
          const remainingPieces = newAvailablePieces.filter((p): p is Piece => p !== null);
          const gameOver = engine.checkGameOver(remainingPieces);

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
        const { grid, powerUps, availablePieces } = get();
        
        if (powerUps[type] <= 0) return;

        if (type === 'rotate') {
          const newPieces = availablePieces.map(p => p ? rotatePiece(p) : null);
          set({
            availablePieces: newPieces,
            powerUps: { ...powerUps, rotate: powerUps.rotate - 1 }
          });
        } else {
          // Implementation for other power-ups will be added in subsequent tasks
          console.log('usePowerUp', type);
        }
      },

      undo: () => {
        const { history, powerUps } = get();
        if (history.length === 0) return;
        
        // Check inventory
        if (powerUps.undo <= 0) return;

        const [previousState, ...remainingHistory] = history;
        
        set({
          ...previousState,
          history: remainingHistory,
        });
        
        // Decrement the inventory from the restored state (paying the cost)
        set((state) => ({
            powerUps: {
                ...state.powerUps,
                undo: Math.max(0, state.powerUps.undo - 1)
            }
        }));
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => {
        const { history, ...rest } = state;
        return rest;
      },
    }
  )
);