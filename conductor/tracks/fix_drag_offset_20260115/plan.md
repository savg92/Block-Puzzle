# Track Plan: Fix Drag & Drop Offset

## Phase 1: Investigation & Fix
- [ ] Task: Reproduce and Analyze Offset
  - [ ] Subtask: Review `DraggablePiece.tsx` gesture coordinate handling.
  - [ ] Subtask: Review `gridUtils.ts` mapping logic.
  - [ ] Subtask: Calculate required offset (e.g., center of piece).
- [ ] Task: Implement Coordinate Correction
  - [ ] Subtask: Update `DraggablePiece` to pass adjusted coordinates (e.g., top-left of the piece based on touch center) OR Update `PieceTray`/`gridUtils` to handle centering.
  - [ ] Subtask: Verify visual alignment matches logical placement.
- [ ] Task: Conductor - User Manual Verification 'Fix Drag Offset'