# Track Plan: Fix Drag & Drop Offset

## Phase 1: Investigation & Fix ✅ [checkpoint: dd26e51]
- [x] Task: Reproduce and Analyze Offset
  - [x] Subtask: Review `DraggablePiece.tsx` gesture coordinate handling.
  - [x] Subtask: Review `gridUtils.ts` mapping logic.
  - [x] Subtask: Calculate required offset (e.g., center of piece).
- [x] Task: Implement Coordinate Correction
  - [x] Subtask: Update `DraggablePiece` to pass adjusted coordinates (e.g., top-left of the piece based on touch center) OR Update `PieceTray`/`gridUtils` to handle centering.
  - [x] Subtask: Verify visual alignment matches logical placement.
- [ ] Task: Conductor - User Manual Verification 'Fix Drag Offset'

## Phase 2: Restore Ghost Piece for Feedback
- [~] Task: Restore Hover State
  - [ ] Subtask: Add `hoverPosition` back to `gameStore`.
  - [ ] Subtask: Update `DraggablePiece` to call `setHoverPosition` with adjusted coordinates.
- [ ] Task: Enable Visuals
  - [ ] Subtask: Update `Grid` to render ghost cells at `hoverPosition`.