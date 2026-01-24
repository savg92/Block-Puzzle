import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Grid, Piece } from '../engine/types';
import { GameEngine } from '../engine';
import { getRandomPieces, rotatePiece, PIECES, getPieceColor } from '../engine/pieces';
import { appStorage } from './storage';

export type PowerUpType = 'undo' | 'rotate' | 'discard' | 'forcePlace' | 'addSingle';

export interface UserPreferences {
  soundVolume: number;
  isMuted: boolean;
  hapticIntensity: 'off' | 'low' | 'medium' | 'high';
  theme: 'light' | 'dark' | 'system';
  showPieceShadow: boolean;
}

interface GameState {
  grid: Grid;
  score: number;
  highScore: number;
  availablePieces: (Piece | null)[];
  selectedPiece: Piece | null;
  hoverPosition: { row: number; col: number } | null;
  gridLayout: { x: number; y: number; width: number; height: number } | null;
  isGameOver: boolean;
  scoreAtLastPowerUp: number;
  
  activePowerUpMode: null | 'discard' | 'forcePlace' | 'addSingle';
  powerUps: Record<PowerUpType, number>;
  preferences: UserPreferences;
  clearingCells: { rows: number[]; cols: number[] } | null;

  history: Omit<GameState, 'newGame' | 'placePiece' | 'selectPiece' | 'undo' | 'discardPiece' | 'addSingleBlock' | 'history' | 'setGridLayout' | 'usePowerUp' | 'initStore' | 'setHoverPosition' | 'updatePreferences' | 'setClearingCells'>[];
  
  newGame: () => void;
  initStore: () => Promise<void>;
  placePiece: (piece: Piece, row: number, col: number, color: string, sourceIndex?: number) => { success: boolean; clearedLines: number; isGameOver: boolean; fullRows: number[]; fullCols: number[] } | undefined;
  selectPiece: (piece: Piece | null) => void;
  setHoverPosition: (pos: { row: number; col: number } | null) => void;
  setGridLayout: (layout: { x: number; y: number; width: number; height: number } | null) => void;
  usePowerUp: (type: PowerUpType, row?: number, col?: number) => void;
  discardPiece: (index: number) => boolean;
  addSingleBlock: (row: number, col: number) => { success: boolean; clearedLines: number; isGameOver: boolean; fullRows: number[]; fullCols: number[] } | undefined;
  undo: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setClearingCells: (cells: { rows: number[]; cols: number[] } | null) => void;
}

const HIGH_SCORE_KEY = 'high_score';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ... (rest of initial state)
      grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
      score: 0,
      highScore: 0,
      availablePieces: [],
      selectedPiece: null,
      hoverPosition: null,
      gridLayout: null,
      isGameOver: false,
      scoreAtLastPowerUp: 0,
      
      activePowerUpMode: null,
      powerUps: {
        undo: 1,
        rotate: 1,
        discard: 1,
        forcePlace: 1,
        addSingle: 1,
      },
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
        showPieceShadow: true,
      },
      clearingCells: null,

      history: [],
      initStore: async () => {
        const saved = await appStorage.getItem(HIGH_SCORE_KEY);
        if (saved) {
          set({ highScore: parseInt(saved, 10) });
        }
      },
      newGame: () =>
        set((state) => ({
          grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
          score: 0,
          availablePieces: getRandomPieces(3),
          selectedPiece: null,
          hoverPosition: null,
          isGameOver: false,
          scoreAtLastPowerUp: 0,
          
          activePowerUpMode: null,
          powerUps: {
            undo: 1,
            rotate: 1,
            discard: 1,
            forcePlace: 1,
            addSingle: 1,
          },
          
          history: [],
          // preferences are NOT reset on new game
        })),
      placePiece: (piece, row, col, color, sourceIndex) => {
        const { grid, score, highScore, availablePieces, selectedPiece, isGameOver, history, gridLayout, powerUps, hoverPosition, activePowerUpMode, preferences = { soundVolume: 1.0, isMuted: false, hapticIntensity: 'medium', theme: 'system', showPieceShadow: true }, clearingCells, scoreAtLastPowerUp } = get();
        
        const isForcePlace = activePowerUpMode === 'forcePlace';
        if (isForcePlace && powerUps.forcePlace <= 0) return; // Should not happen via UI logic but safe check

        const engine = new GameEngine(grid, score);
        const result = engine.makeMove(piece, row, col, color, { ignoreCollision: isForcePlace });

        if (result.success) {
          // Push current state to history before updating
          const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition, activePowerUpMode, preferences, clearingCells, scoreAtLastPowerUp };
          const newHistory = [snapshot, ...history].slice(0, 20); // Limit to 20 moves

          // Consume PowerUp if used
          const newPowerUps = { ...powerUps };
          if (isForcePlace) {
            newPowerUps.forcePlace = Math.max(0, newPowerUps.forcePlace - 1);
          }

          // Remove the piece from available pieces (mark as null)
          let newAvailablePieces = [...availablePieces];
          if (sourceIndex !== undefined && sourceIndex >= 0 && sourceIndex < newAvailablePieces.length) {
             newAvailablePieces[sourceIndex] = null;
          } else {
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

          // Power-Up Acquisition Logic
          let { powerUps: finalPowerUps, scoreAtLastPowerUp: finalScoreAtLastPowerUp } = get();
          finalPowerUps = { ...newPowerUps }; // Use newPowerUps from forcePlace check
          
          // 1. Every 500 points
          const milestoneIncrement = 500;
          if (newScore >= finalScoreAtLastPowerUp + milestoneIncrement) {
            const types: PowerUpType[] = ['undo', 'rotate', 'discard', 'forcePlace', 'addSingle'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            finalPowerUps[randomType]++;
            finalScoreAtLastPowerUp = Math.floor(newScore / milestoneIncrement) * milestoneIncrement;
          }

          // 2. Combo Clear (3+ lines)
          if (result.clearedLines >= 3) {
            const types: PowerUpType[] = ['undo', 'rotate', 'discard', 'forcePlace', 'addSingle'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            finalPowerUps[randomType]++;
          }

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
            powerUps: finalPowerUps,
            scoreAtLastPowerUp: finalScoreAtLastPowerUp,
            activePowerUpMode: isForcePlace ? null : activePowerUpMode, // Reset mode if used
          });

          return { 
            success: true, 
            clearedLines: result.clearedLines, 
            isGameOver: gameOver,
            fullRows: result.fullRows,
            fullCols: result.fullCols
          };
        }
        return { success: false, clearedLines: 0, isGameOver, fullRows: [], fullCols: [] };
      },
      selectPiece: (piece) => set({ selectedPiece: piece }),
      setHoverPosition: (pos) => set({ hoverPosition: pos }),
      setGridLayout: (layout) => set({ gridLayout: layout }),
      
      usePowerUp: (type, row, col) => {
        const { grid, powerUps, availablePieces, activePowerUpMode } = get();
        
        if (powerUps[type] <= 0) return;

        if (type === 'rotate') {
          const newPieces = availablePieces.map(p => p ? rotatePiece(p) : null);
          set({
            availablePieces: newPieces,
            powerUps: { ...powerUps, rotate: powerUps.rotate - 1 }
          });
        } else if (type === 'discard' || type === 'forcePlace' || type === 'addSingle') {
          // Toggle mode
          const newMode = activePowerUpMode === type ? null : type;
          set({ activePowerUpMode: newMode });
        } else {
          console.log('usePowerUp', type);
        }
      },

      discardPiece: (index) => {
        const { activePowerUpMode, powerUps, availablePieces, history, grid, score, highScore, selectedPiece, isGameOver, gridLayout, hoverPosition, preferences = { soundVolume: 1.0, isMuted: false, hapticIntensity: 'medium', theme: 'system', showPieceShadow: true }, clearingCells, scoreAtLastPowerUp } = get();
        
        if (activePowerUpMode !== 'discard') return false;
        if (powerUps.discard <= 0) return false;
        if (index < 0 || index >= availablePieces.length) return false;
        if (availablePieces[index] === null) return false; 

        // Push state to history? (Assuming Discard is permanent step)
        const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition, activePowerUpMode, preferences, clearingCells, scoreAtLastPowerUp };
        const newHistory = [snapshot, ...history].slice(0, 20);
        
        let newAvailablePieces = [...availablePieces];
        newAvailablePieces[index] = null;

        if (newAvailablePieces.every(p => p === null)) {
            newAvailablePieces = getRandomPieces(3);
        }

        set({
            availablePieces: newAvailablePieces,
            powerUps: { ...powerUps, discard: powerUps.discard - 1 },
            activePowerUpMode: null, 
            history: newHistory,
        });
        return true;
      },

      addSingleBlock: (row, col) => {
        const { activePowerUpMode, powerUps, grid, score, highScore, availablePieces, history, selectedPiece, isGameOver, gridLayout, hoverPosition, preferences = { soundVolume: 1.0, isMuted: false, hapticIntensity: 'medium', theme: 'system', showPieceShadow: true }, clearingCells, scoreAtLastPowerUp } = get();

        if (activePowerUpMode !== 'addSingle') return;
        if (powerUps.addSingle <= 0) return;
        
        // Validate target cell is empty
        if (grid[row][col] !== 0) return;

        const engine = new GameEngine(grid, score);
        // Place SINGLE piece
        const result = engine.makeMove(PIECES.SINGLE, row, col, getPieceColor(PIECES.SINGLE) as string);

        if (result.success) {
            const snapshot = { grid, score, highScore, availablePieces, selectedPiece, isGameOver, gridLayout, powerUps, hoverPosition, activePowerUpMode, preferences, clearingCells, scoreAtLastPowerUp };
            const newHistory = [snapshot, ...history].slice(0, 20);

            const newScore = engine.getScore();
            const newHighScore = Math.max(highScore, newScore);

            // Power-Up Acquisition Logic
            let finalPowerUps = { ...powerUps };
            finalPowerUps.addSingle = Math.max(0, finalPowerUps.addSingle - 1); // Consume the one we just used
            
            let finalScoreAtLastPowerUp = scoreAtLastPowerUp;
            
            // 1. Every 500 points
            const milestoneIncrement = 500;
            if (newScore >= finalScoreAtLastPowerUp + milestoneIncrement) {
              const types: PowerUpType[] = ['undo', 'rotate', 'discard', 'forcePlace', 'addSingle'];
              const randomType = types[Math.floor(Math.random() * types.length)];
              finalPowerUps[randomType]++;
              finalScoreAtLastPowerUp = Math.floor(newScore / milestoneIncrement) * milestoneIncrement;
            }

            // 2. Combo Clear (3+ lines)
            if (result.clearedLines >= 3) {
              const types: PowerUpType[] = ['undo', 'rotate', 'discard', 'forcePlace', 'addSingle'];
              const randomType = types[Math.floor(Math.random() * types.length)];
              finalPowerUps[randomType]++;
            }

            if (newHighScore > highScore) appStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());

            const remainingPieces = availablePieces.filter((p): p is Piece => p !== null);
            const gameOver = engine.checkGameOver(remainingPieces);

            set({
                grid: engine.getGrid(),
                score: newScore,
                highScore: newHighScore,
                powerUps: finalPowerUps,
                scoreAtLastPowerUp: finalScoreAtLastPowerUp,
                activePowerUpMode: null,
                isGameOver: gameOver,
                history: newHistory,
            });

            return { 
              success: true, 
              clearedLines: result.clearedLines, 
              isGameOver: gameOver,
              fullRows: result.fullRows,
              fullCols: result.fullCols
            };
        }
        return { success: false, clearedLines: 0, isGameOver, fullRows: [], fullCols: [] };
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

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...(state.preferences || {}), ...prefs }
        }));
      },

      setClearingCells: (cells) => set({ clearingCells: cells }),
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