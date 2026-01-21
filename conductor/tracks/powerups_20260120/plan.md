# Implementation Plan: Power-Ups System

## Phase 1: Engine & State Logic [checkpoint: a1368aa]
Implement the foundational logic for power-up consumption and state modification.

- [x] Task: Extend Game State for Power-Ups 5930949
    - [ ] Subtask: Update `GameState` in `src/store/gameStore.ts` to include inventory for all 5 power-ups.
    - [ ] Subtask: Add `activePowerUpMode` state (`null | 'discard' | 'force' | 'single'`) to track active modes.
    - [ ] Subtask: Update `undo` logic to consume a charge if it becomes a power-up.
- [x] Task: Implement Rotation Logic b7ee28c
    - [ ] Subtask: Add `rotateAllPieces` action to `gameStore.ts`.
    - [ ] Subtask: Write tests in `src/store/__tests__/gameStore.test.ts` for tray rotation.
- [x] Task: Implement Discard Logic 4bb2ab3
    - [ ] Subtask: Add `discardPiece(index)` action to `gameStore.ts`.
    - [ ] Subtask: Write tests for piece removal and refill prevention.
- [x] Task: Implement Force Place & Add Single Logic e5090e6
    - [ ] Subtask: Update `placePiece` in `gameStore.ts` to bypass collision if `activePowerUpMode === 'force'`.
    - [ ] Subtask: Add `addSingleBlock(row, col)` action to `gameStore.ts` with line-clear checks.
    - [ ] Subtask: Write tests for collision bypass and single placement.
- [ ] Task: Conductor - User Manual Verification 'Engine & State Logic' (Protocol in workflow.md)

## Phase 2: UI Components
Build the visual interface for accessing and tracking power-ups.

- [ ] Task: Create Power-Up Bar
    - [ ] Subtask: Build `src/components/PowerUps/PowerUpBar.tsx` using NativeWind.
    - [ ] Subtask: Implement `PowerUpButton` with icon, label, and inventory badge.
    - [ ] Subtask: Position the bar between the Grid and Piece Tray in `GameScreen.tsx`.
- [ ] Task: Visual Feedback for Active Modes
    - [ ] Subtask: Add visual highlight/indicator to the UI when a mode (Force, Single, Discard) is active.
    - [ ] Subtask: Add "Cancel" button to exit active modes without consuming.
- [ ] Task: Conductor - User Manual Verification 'UI Components' (Protocol in workflow.md)

## Phase 3: Interaction & Animation
Connect the UI to the state and add polished transitions.

- [ ] Task: Connect UI Actions to Store
    - [ ] Subtask: Link button taps to power-up activation and mode toggling.
    - [ ] Subtask: Update `PieceTray` to handle "Discard Mode" (tap to discard).
    - [ ] Subtask: Update `Grid` to handle "Single Mode" (tap to place block).
- [ ] Task: Add Power-Up Animations
    - [ ] Subtask: Implement rotation animation for tray pieces using Reanimated.
    - [ ] Subtask: Add activation feedback (e.g., screen flash or button pulse).
- [ ] Task: Conductor - User Manual Verification 'Interaction & Animation' (Protocol in workflow.md)

## Phase 4: Integration & Persistence
Finalize the system and ensure state reliability.

- [ ] Task: Verify Persistence
    - [ ] Subtask: Ensure power-up inventory is correctly saved/restored via `AsyncStorage`.
    - [ ] Subtask: Test state recovery after app reload during an active mode.
- [ ] Task: Final System Test
    - [ ] Subtask: Run all engine and component tests.
    - [ ] Subtask: Perform manual playthrough using all power-ups.
- [ ] Task: Conductor - User Manual Verification 'Integration & Persistence' (Protocol in workflow.md)
