# Track Specification: UI Foundation

## 1. Overview
The goal of this track is to build the core visual components of the Block Puzzle game using NativeWind and React Native Reanimated. This involves setting up the layout, implementing the theme system, and creating the interactive grid and piece components with an arcade-inspired aesthetic.

## 2. Functional Requirements
- **Project Setup & Theming:**
  - Initialize the Expo project structure with NativeWind, Reanimated, and Gesture Handler.
  - Implement a theme system that respects device preference by default but allows for a manual toggle.
  - The default "Arcade" aesthetic will follow a "Flat Retro" style (high-contrast solid colors with thick outlines).
- **Grid & Cell Components:**
  - Create a 10x10 Grid component optimized for safe areas (pieces at bottom, board centered).
  - Implement individual Cell components with filled and empty visual states.
- **Piece Components:**
  - Build a PiecePreview component to visualize available pieces based on their matrix data.
  - Create a DraggablePiece component that uses Gesture Handler for movement.
  - Implement visual feedback during drag operations, specifically transparency and shadows to indicate the piece is "lifted."

## 3. Tech Stack Integration
- **NativeWind:** Styling the UI with utility classes.
- **React Native Reanimated:** Handling smooth transitions and feedback animations.
- **React Native Gesture Handler:** Implementing draggable pieces.
- **Expo:** Core project environment.

## 4. Acceptance Criteria
- [ ] The app initializes correctly with a centered 10x10 grid.
- [ ] Theme switches between light and dark modes based on system preference and manual control.
- [ ] Pieces can be dragged around the screen using touch gestures.
- [ ] Dragged pieces exhibit the specified "lifted" visual feedback (transparency/shadows).
- [ ] The layout is responsive across different device sizes, prioritizing bottom-reachability for piece selection.

## 5. Out of Scope
- Implementation of core game engine logic (validation, clearing, scoring) within the UI layer (this should use the existing store/engine).
- Advanced line-clear or game-over animations (to be handled in a later polish track).
- Detailed settings menu beyond the basic theme/style toggle.
