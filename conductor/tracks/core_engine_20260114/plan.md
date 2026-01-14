# Track Plan: Core Game Engine

## Phase 1: Foundational Structures
- [x] Task: Define TypeScript interfaces and types d2ca29d

  - [ ] Subtask: Create `src/engine/types.ts` with `Grid`, `Piece`, and `GameState` definitions.
- [x] Task: Implement Canonical Piece Definitions 047305c
  - [ ] Subtask: Create `src/engine/pieces.ts` exporting the 9 fixed shapes.
  - [ ] Subtask: Implement `rotatePiece` utility function.
  - [ ] Subtask: Write unit tests for piece rotation.

## Phase 2: Board Mechanics
- [x] Task: Implement Board Validation Logic 8d909a2
  - [ ] Subtask: Write tests for `canPlacePiece` (boundary checks, collision checks).
  - [ ] Subtask: Implement `canPlacePiece` function.
- [x] Task: Implement Piece Placement 2c30373
  - [ ] Subtask: Write tests for `placePiece` (update grid correctly).
  - [ ] Subtask: Implement `placePiece` function to return new grid state.

## Phase 3: Rules & Scoring
- [x] Task: Implement Line Clearing Logic 0c85c1c
  - [ ] Subtask: Write tests for `checkLines` (detect full rows/cols).
  - [ ] Subtask: Implement `clearLines` to remove full lines and return count.
- [ ] Task: Implement Scoring System
  - [ ] Subtask: Write tests for score calculation (base points + line bonuses).
  - [ ] Subtask: Implement scoring function.
- [ ] Task: Implement Game Over Detection
  - [ ] Subtask: Write tests for `canAnyPieceFit` with various board states.
  - [ ] Subtask: Implement `canAnyPieceFit` logic.

## Phase 4: Integration & Review
- [ ] Task: Create specific Game Engine entry point
  - [ ] Subtask: Export a unified `GameEngine` class or set of functions.
  - [ ] Subtask: Write an integration test simulating a short game sequence.
- [ ] Task: Conductor - User Manual Verification 'Integration & Review' (Protocol in workflow.md)
