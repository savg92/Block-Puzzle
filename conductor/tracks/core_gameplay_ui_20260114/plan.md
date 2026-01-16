# Track Plan: Core Gameplay UI

## Phase 1: Main Layout & Score Display ✅ [checkpoint: 98c5c21]
- [x] Task: Create Game Screen Container (631edb4)
  - [x] Subtask: Build `src/screens/GameScreen.tsx` with safe area support
  - [x] Subtask: Integrate `Grid` and placeholder components for Score/Tray
- [x] Task: Build Score Display Component (5dbdba9)
  - [x] Subtask: Create `src/components/UI/ScoreDisplay.tsx`
  - [x] Subtask: Implement rapid-increment animation using Reanimated
  - [x] Subtask: Add High Score persistence logic with AsyncStorage
- [x] Task: Conductor - User Manual Verification 'Main Layout & Score Display' (98c5c21)

## Phase 2: Piece Tray & Selection [~]
- [x] Task: Build Piece Tray Component (6a12c9f)
  - [x] Subtask: Create `src/components/PieceTray/PieceTray.tsx`
  - [x] Subtask: Fetch and display `availablePieces` from `gameStore`
- [x] Task: Synchronize Selection State (d364dca)
  - [x] Subtask: Update `DraggablePiece` to trigger `selectPiece` on drag start
  - [x] Subtask: Add visual feedback for the selected piece in the tray (e.g., dimming)
- [ ] Task: Conductor - User Manual Verification 'Piece Tray & Selection' (Protocol in workflow.md)

## Phase 3: Drag & Drop Logic
- [ ] Task: Implement Grid Hit Detection
  - [ ] Subtask: Create utility to map screen coordinates to 10x10 grid indices
  - [ ] Subtask: Optimize hit detection for 60fps performance
- [ ] Task: Implement Ghost Piece Preview
  - [ ] Subtask: Add `ghostPiece` state to UI layer
  - [ ] Subtask: Update `Grid` to render semi-transparent cells for valid hover positions
- [ ] Task: Finalize Piece Placement
  - [ ] Subtask: Connect `onDragEnd` to `store.placePiece`
  - [ ] Subtask: Implement snap-to-grid visual feedback on drop
- [ ] Task: Conductor - User Manual Verification 'Drag & Drop Logic' (Protocol in workflow.md)

## Phase 4: Game Flow & Game Over
- [ ] Task: Build Game Over Modal
  - [ ] Subtask: Create `src/components/UI/GameOverModal.tsx` with arcade styling
  - [ ] Subtask: Implement "Emergency Save" section for power-up usage
- [ ] Task: Implement New Game Flow
  - [ ] Subtask: Add reset logic and High Score comparison
  - [ ] Subtask: Test end-to-end game cycle
- [ ] Task: Conductor - User Manual Verification 'Game Flow & Game Over' (Protocol in workflow.md)
