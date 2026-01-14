# Track Specification: Core Game Engine

## 1. Objective
Implement the pure TypeScript logic layer for the Block Puzzle game. This engine must be UI-agnostic, handling the 10x10 grid state, piece validation, placement, line clearing, and scoring. It will serve as the single source of truth for the game's rules.

## 2. Core Components

### 2.1 Board Representation
- **Grid:** A 10x10 matrix (2D array) of 0s (empty) and 1s (filled).
- **State:** The board must be immutable or managed in a way that supports easy copying for the "Undo" feature later.

### 2.2 Piece System
- **Definitions:** Define the 9 canonical piece shapes as constant boolean matrices.
- **Rotation:** Implement logic to rotate a piece matrix 90 degrees (needed for random spawns of L-pieces and the future Rotate power-up).

### 2.3 Game Logic
- **Validation:** `canPlacePiece(board, piece, x, y)` -> Boolean. Checks boundaries and collisions.
- **Placement:** `placePiece(board, piece, x, y)` -> New Board State.
- **Line Clearing:** Detect full rows and columns. Return a new board with those lines cleared and a count of cleared lines.
- **Game Over:** `canAnyPieceFit(board, availablePieces)` -> Boolean. If false, the game is over.

### 2.4 Scoring
- **Base Points:** Points for placing a piece (e.g., number of blocks).
- **Line Bonuses:** Points for clearing lines.
- **Combo System:** Multipliers for clearing multiple lines at once.

## 3. Interfaces
```typescript
type Grid = number[][];
type Piece = number[][];

interface GameState {
  grid: Grid;
  score: number;
  availablePieces: Piece[];
  isGameOver: boolean;
}
```

## 4. Testing Requirements
- **Unit Tests:** 100% coverage for all logic functions (validation, clearing, scoring).
- **Edge Cases:** Test placing near boundaries, clearing intersecting lines, and game over conditions.
