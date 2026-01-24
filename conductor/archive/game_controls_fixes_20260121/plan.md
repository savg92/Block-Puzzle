# Implementation Plan: Game Controls & UX Polish

## Goal
Address three critical user feedback items:
1.  **Ghost Alignment:** The ghost pieces are appearing strictly "above" the piece. I need to reverse the lift offset logic to pull the ghost "down" relative to the user's perception.
2.  **Force Place Visibility:** When using the "Force" power-up, the ghost piece is hidden because of collision checks. It should be visible to show where the piece will land and destroy blocks.
3.  **Restart Game:** Add a button to reset the game state.

## Phase 1: Ghost Alignment Fix
- [ ] Task: Adjust `CALC_LIFT` Logic
    - [ ] In `DraggablePiece.tsx`: Set `CALC_LIFT` to be *significantly smaller* than `DRAG_LIFT` (or even 0).
    - [ ] Logic: `DRAG_LIFT` moves the visual piece UP (`-Y`). If `CALC_LIFT` is smaller, the logical Y is "lower" (larger value) than the visual Y. Mapping a larger Y to the grid results in a larger Row index (lower down the board). This should fix the "ghost is on top" issue.
    - [ ] Proposed Value: `DRAG_LIFT = 110`, `CALC_LIFT = 40`. (Net downward shift of ~70px relative to previous sync).

## Phase 2: Force Place Ghost
- [ ] Task: Update Grid Ghost Logic
    - [ ] In `Grid.tsx`: Modify the `ghost` memoization logic.
    - [ ] If `activePowerUpMode === 'forcePlace'`, ignore the `canPlacePiece` check.
    - [ ] Ensure valid bounds check still applies (cannot ghost partial off-screen).

## Phase 3: Restart Game
- [ ] Task: Add Restart Button
    - [ ] In `GameScreen.tsx`: Add a "Restart" button to the top UI (near Settings or Score).
    - [ ] On Press: Show `Alert` confirmation ("Restart Game?", "Current progress will be lost").
    - [ ] On Confirm: Call `newGame()`.

## Verification Plan

### Automated Tests
- Run `src/components/Piece/__tests__/draggableUtils.test.ts` to ensure coordinate math allows for decoupled lift values.
- Existing tests cover `newGame` state reset.

### Manual Verification
1. **Ghost Alignment:**
   - Drag a piece.
   - **Expect:** Ghost appears directly *under* the lifted piece, not above it.
   - Drop piece.
   - **Expect:** Piece lands exactly where ghost was.

2. **Force Place:**
   - Activate "Force".
   - Drag piece over occupied blocks.
   - **Expect:** Ghost appears (red/valid color) overlapping the blocks.
   - Drop.
   - **Expect:** Blocks destroyed and piece placed.

3. **Restart:**
   - Tap Restart -> Cancel. **Expect:** No change.
   - Tap Restart -> OK. **Expect:** Board resets, score 0.
