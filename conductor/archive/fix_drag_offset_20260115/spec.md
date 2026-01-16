# Track Specification: Fix Drag & Drop Offset

## 1. Issue Description
Users report difficulty placing pieces on the grid. The placement logic seems to place the piece "mostly to the right" of the expected position (where the user's finger is).

## 2. Root Cause Analysis (Hypothesis)
The current implementation likely maps the *top-left* coordinate of the dragged view directly to the grid index.
- If the user grabs the piece in the middle, the top-left is to the left of their finger.
- If the logic uses the `absoluteX` from the gesture event, this is usually the pointer position.
- If `mapScreenToGrid` uses this pointer position as the "top-left" of the piece, it effectively shifts the piece *right* (and down) relative to the grid if the user intends for the pointer to be the center.
- Alternatively, visual scaling (1.2x during drag) might be shifting the visual center without adjusting the logic coordinate.

## 3. Proposed Solution
- **Center-based Alignment:** Adjust the hit detection to account for the touch offset within the piece.
- **Visual Offset:** Ensure the piece "floats" correctly under the finger (typically slightly above to be visible).
- **Coordinate Correction:** When dropping, map the *center* of the piece (or the specific cell under the finger) to the grid, rather than an arbitrary point.

## 4. Acceptance Criteria
- [ ] Dragging a piece feels natural; the piece follows the finger.
- [ ] Dropping a piece places it exactly where the visual representation indicates.
- [ ] The "ghost piece" (if re-enabled or implied by snap logic) or the actual drop happens at the expected grid cells.
- [ ] No "drift" to the right or bottom.

## 5. Technical Approach
1.  **Analyze `DraggablePiece.tsx`**: Check how `onDragEnd` passes coordinates.
2.  **Analyze `gridUtils.ts`**: Check how `mapScreenToGrid` calculates indices.
3.  **Implement Offset Calculation**: Adjust the `absoluteX/Y` by subtracting half the piece width/height (or specific cell offset) before mapping to grid.
