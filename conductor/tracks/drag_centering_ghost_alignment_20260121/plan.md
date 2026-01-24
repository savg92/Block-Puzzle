# Implementation Plan: Drag UX Centering & Ghost Alignment

## Phase 1: Selection & Centering Infrastructure
Implement the core logic for piece centering and vertical offset upon selection.

- [x] Task: Update DraggablePiece State for Centering 220ee4a
    - [x] Subtask: Define `touchOffsetX` and `touchOffsetY` shared values in `DraggablePiece.tsx`. (Note: Implemented as initialGrabX/Y and effectiveGrabX/Y)
    - [x] Subtask: Implement logic in `onStart` to capture touch point relative to piece.
- [x] Task: Implement Centering and Offset Animation 220ee4a
    - [x] Subtask: Update `onUpdate` to adjust `translateX` and `translateY` using the captured offsets and `DRAG_VERTICAL_OFFSET`.
    - [x] Subtask: Use `withSpring` for smooth transition if needed, or immediate worklet update for direct finger following.
- [x] Task: Write Tests for Centering Logic 220ee4a
    - [x] Subtask: Create `src/components/Piece/__tests__/draggableUtils.test.ts` to verify coordinate transformations.
    - [x] Subtask: Assert that the piece's logical center aligns with the finger position (plus offset).
- [ ] Task: Conductor - User Manual Verification 'Selection & Centering Infrastructure' (Protocol in workflow.md)

## Phase 2: Ghost Piece (Shadow) Implementation
Create the visual "ghost" version of the piece that snaps to the grid.

- [ ] Task: Create GhostPiece Component
    - [ ] Subtask: Implement `GhostPiece.tsx` (or update `PiecePreview.tsx` to handle semi-transparency).
    - [ ] Subtask: Integrate `GhostPiece` into the `Grid.tsx` or as a separate layer above it.
- [ ] Task: Shared Coordinate Calculation
    - [ ] Subtask: Extract grid position calculation logic from `PieceTray.tsx` / `DraggablePiece.tsx` into a shared utility in `src/utils/gridUtils.ts`.
    - [ ] Subtask: Ensure both `onUpdate` (for ghost) and `onEnd` (for drop) use this identical logic.
- [ ] Task: Ghost Visibility and Snapping
    - [ ] Subtask: Trigger ghost visibility only when the active piece is over the grid.
    - [ ] Subtask: Implement 60fps-120fps snapping updates within the Reanimated worklet.
- [ ] Task: Conductor - User Manual Verification 'Ghost Piece (Shadow) Implementation' (Protocol in workflow.md)

## Phase 3: Alignment Verification & Robust Testing
Implement the dedicated test suite to ensure the piece and shadow never diverge.

- [ ] Task: Robust Coordinate Test Suite
    - [ ] Subtask: Implement integration tests simulating various complex drag trajectories.
    - [ ] Subtask: Verify that at every point in the trajectory, the `ghostPosition` matches the engine's `predictedDropPosition`.
- [ ] Task: Performance Benchmarking (Validation)
    - [ ] Subtask: Verify worklet performance manually on device to ensure min 50fps / max ProMotion frame rates.
- [ ] Task: Conductor - User Manual Verification 'Alignment Verification & Robust Testing' (Protocol in workflow.md)
