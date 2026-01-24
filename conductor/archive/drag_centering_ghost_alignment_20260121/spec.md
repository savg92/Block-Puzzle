# Specification: Drag UX Centering & Ghost Alignment

## Overview
This track focuses on improving the drag-and-drop user experience (UX) by ensuring pieces are perfectly aligned with the user's interaction point and providing clear visual feedback during grid movement. When a piece is picked up, it will automatically center itself horizontally on the finger with a vertical offset to ensure visibility. A "ghost" shadow will follow the piece on the grid to indicate the predicted drop location.

## Functional Requirements

### 1. Selection & Centering Logic
- Upon selecting a piece from the tray, the piece must immediately reposition itself relative to the touch point.
- **Horizontal Alignment**: The piece must be centered horizontally on the finger.
- **Vertical Alignment**: The piece must have a fixed vertical offset (floating above the finger) to prevent the user's hand from obscuring the piece.
- This centering must occur regardless of where the piece was initially grabbed in the tray.

### 2. Grid Shadow (Ghost Piece)
- While a piece is being dragged over the game grid, a "ghost" version of that piece must appear.
- **Visuals**: The ghost piece should be a semi-transparent version of the active piece.
- **Behavior**: The ghost must snap to the grid coordinates representing the "predicted" placement.
- **Precision**: The ghost piece MUST share the exact coordinate calculation logic as the placement engine. It must never "drift" from the piece's logical grid position.

### 3. Assistive Snapping
- The main piece remains under the finger with smooth movement.
- The ghost piece provides discrete "snapped" feedback on the grid.
- Logic should determine the closest cell when the piece is between positions to aid visualization.

## Non-Functional Requirements
- **Robust Coordinate Testing**: A dedicated test suite must be implemented to verify that the piece's logical grid position and the ghost's visual grid position are identical across various drag trajectories.
- **Performance**: High-frequency updates (onUpdate) must maintain a minimum of 50fps, scaling up to the device's maximum (e.g., 120fps on ProMotion displays) using Reanimated worklets.

## Acceptance Criteria
- [ ] Dragging a piece from any part of its shape results in the piece floating at a consistent offset above the finger.
- [ ] A semi-transparent ghost piece appears on the grid when the active piece is within the grid boundaries.
- [ ] The ghost piece snaps to grid cells while the active piece moves smoothly.
- [ ] **Verification**: A full unit and integration test suite confirms that the `ghostPosition` and `dropPosition` are derived from the same source of truth and never diverge.
- [ ] UI interaction remains fluid (min 50fps) during rapid movement.

## Out of Scope
- Changing the grid size or canonical piece shapes.
- Permanent visual changes to the grid.
