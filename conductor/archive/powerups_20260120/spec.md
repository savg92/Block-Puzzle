# Specification: Power-Ups System

## Overview
This track implements a suite of 5 power-up mechanics to enhance gameplay strategy and provide "emergency saves" for the user. These power-ups will be accessible via a dedicated Power-Up Bar and will interact directly with the game state managed by Zustand.

## Functional Requirements

### 1. Power-Up Inventory & State
- Each power-up will have an associated integer count (inventory).
- Power-ups are consumed upon successful use.
- The state must be persisted along with the rest of the game state.

### 2. Mechanics
- **Undo**: 
    - Reverts the board, score, and available pieces to the state immediately before the last placement.
    - Only the single most recent move is undoable per activation.
- **Rotate (Global)**:
    - Rotates all non-null pieces in the Piece Tray 90 degrees clockwise.
    - Consumes one charge per tap.
- **Discard Piece**:
    - Activation enters "Discard Mode".
    - Tapping a piece in the tray removes it from play (slot becomes `null`).
    - The tray does not refill until all slots are empty.
- **Force Place**:
    - Activation enters "Force Mode".
    - The next piece dragged from the tray can be dropped anywhere on the grid.
    - **Collision Bypass**: Overwrites any existing blocks at the target location.
    - Standard line clearing and scoring rules apply after placement.
- **Add Single**:
    - Activation enters "Single Placement Mode".
    - Tapping any **empty** cell on the grid places a 1x1 block of a random/standard color.
    - Triggers line clearing checks and scoring.

### 3. User Interface
- **Power-Up Bar**: A horizontal bar positioned between the Grid and the Piece Tray.
- **Buttons**: Each power-up has an icon, a label, and a badge showing the remaining count.
- **Visual Feedback**:
    - "Active Mode" state (e.g., for Add Single or Discard) should be visually distinct (highlighting the bar or changing the cursor/overlay).
    - Use animations (via Reanimated) for rotation and piece removal.

## Acceptance Criteria
- [ ] All 5 power-ups correctly modify the game state and consume inventory.
- [ ] **Force Place** correctly ignores occupied cells and clears lines.
- [ ] **Rotate** updates all pieces in the tray simultaneously.
- [ ] **Add Single** only allows placement in empty cells.
- [ ] Power-up actions are reflected in the high score and persisted across sessions.
- [ ] UI provides clear feedback when a power-up "Mode" is active.

## Out of Scope
- Purchasing power-ups with real currency or in-game currency (to be added in a future track).
- Rewarding power-ups during gameplay (e.g., clear 4 lines at once).
