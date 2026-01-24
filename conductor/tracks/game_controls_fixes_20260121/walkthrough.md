
# Walkthrough - Game Controls & UX Polish

I have successfully address the three requests: fixing ghost alignment, enabling Force Place visibility, and reducing the need for reloads by adding a Restart button.

## Changes

### 1. Ghost Piece Alignment
**File:** `src/components/Piece/DraggablePiece.tsx`
- **Issue:** The user perceived the ghost piece as appearing "above" the actual piece.
- **Fix:** Adjusted the logical `CALC_LIFT` (40px) to be significantly smaller than the visual `DRAG_LIFT` (110px).
- **Result:** This creates a logical offset where the system "sees" the finger lower down the screen than the visual representation, pushing the ghost piece DOWN relative to the dragged piece.

### 2. Force Place Visibility
**File:** `src/components/Grid/Grid.tsx`
- **Issue:** The ghost piece was hidden if `canPlacePiece` returned false (occupied cells), making the "Force" power-up feel blind.
- **Fix:** Added logic to bypass strict collision checks when `activePowerUpMode === 'forcePlace'`.
- **Result:** The ghost now renders even if it overlaps existing blocks, providing clear targeting feedback.

### 3. Restart Game Feature
**File:** `src/screens/GameScreen.tsx`
- **Feature:** Added a "Restart" (🔄) button to the header.
- **Safety:** Implemented a confirmation `Alert` ("Are you sure?").
- **Action:** Calls `newGame()` from the store to reset the board, score, and inventory.

## Verification

### Automated Tests
- `src/store/__tests__/gameStore.test.ts` confirms `newGame` correctly resets state.

### Manual Verification Protocol
1. **Ghost Alignment:**
   - Drag a piece. Confirm the ghost appears directly UNDER or slightly below the lifted piece, correcting the "jumping above" issue.
2. **Force Place:**
   - Activate "Force". Drag over occupied blocks.
   - Confirm the ghost IS visible (showing where the smash will happen).
3. **Restart:**
   - Press the refresh icon in the top right.
   - Confirm dialog appears.
   - Confirm accepting resets the game.
