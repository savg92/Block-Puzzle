# Track Specification: Drag UX Centering

## 1. Issue Description
Currently, when a user drags a piece, the visual anchor point remains where the user first touched the piece. This makes placement inconsistent because the user has to manually account for their finger's offset from the piece's center.

## 2. Goal
Automatically center the piece under the user's finger (with a vertical offset for visibility) as soon as the drag begins. This ensures a consistent interaction regardless of whether the user grabbed the piece by a corner or the middle.

## 3. Technical Approach
- **Initial Offset Capture:** In the `onStart` callback of the `Pan` gesture, capture the local touch coordinates (`x`, `y`).
- **Dynamic Centering:** In `onUpdate`, adjust the `translateX` and `translateY` values to shift the view so its center aligns with the finger position.
  - Formula: `translateX = translationX + (startX - pieceWidth / 2)`
  - Formula: `translateY = translationY + (startY - pieceHeight / 2) - verticalOffset`
- **Logic Consistency:** Ensure that the `hoverPosition` and `onDragEnd` coordinates still use the center-aligned logic.

## 4. Acceptance Criteria
- [ ] Dragging a piece from any point causes it to immediately (or smoothly) center itself under/above the finger.
- [ ] The "Ghost Piece" on the grid correctly reflects the centered position.
- [ ] Dropping the piece results in placement at the grid cell indicated by the centered ghost.
