# Track Specification: Ghost Piece Alignment Fix

## 1. Issue Description
Users report that the "shadow" (ghost piece) is appearing below the actual piece during a drag. The visual piece and its logical preview on the grid should align perfectly.

## 2. Root Cause Analysis (Hypothesis)
In `DraggablePiece.tsx`, we apply a `DRAG_VERTICAL_OFFSET = 60` to the visual translation. We also apply the same offset to the `adjustedY` coordinate used for `mapScreenToGrid`. 
If the shadow appears "below" the piece, it means the `adjustedY` being passed to the grid logic is "higher" (more positive Y) than the visual representation, or the visual representation is being shifted further than the logic.

However, if they don't align, it might be due to:
1.  **Scaling:** The piece is scaled by 1.2x. Scaling from center might be shifting the perceived top-left.
2.  **Calculation Error:** The logic for `adjustedY` might be missing a factor or using the wrong anchor point relative to the finger.

## 3. Proposed Solution
- **Synchronize Offsets:** Verify that the `translateY` and `adjustedY` logic use exactly the same base coordinates and offsets.
- **Remove Offset (If Preferred):** If the user wants the "shadow at the same position", they might mean they want the piece to be *on* the shadow (no vertical float). However, the vertical float was added to avoid finger occlusion.
- **Refine Centering:** Ensure `startX/Y` capture and centering math is consistent.

## 4. Acceptance Criteria
- [ ] The ghost piece (shadow) on the grid is always directly underneath the dragged piece.
- [ ] No vertical or horizontal "drift" between the piece and its preview.
