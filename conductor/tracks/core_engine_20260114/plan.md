# Track Plan: Core Game Engine

## Phase 1: Foundational Structures
- [ ] Task: Define TypeScript interfaces and types
  - [ ] Subtask: Create `src/engine/types.ts` with `Grid`, `Piece`, and `GameState` definitions.
- [ ] Task: Implement Canonical Piece Definitions
  - [ ] Subtask: Create `src/engine/pieces.ts` exporting the 9 fixed shapes.
  - [ ] Subtask: Implement `rotatePiece` utility function.
  - [ ] Subtask: Write unit tests for piece rotation.

## Phase 2: Board Mechanics
- [ ] Task: Implement Board Validation Logic
  - [ ] Subtask: Write tests for `canPlacePiece` (boundary checks, collision checks).
  - [ ] Subtask: Implement `canPlacePiece` function.
- [ ] Task: Implement Piece Placement
  - [ ] Subtask: Write tests for `placePiece` (update grid correctly).
  - [ ] Subtask: Implement `placePiece` function to return new grid state.

## Phase 3: Rules & Scoring
- [ ] Task: Implement Line Clearing Logic
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
