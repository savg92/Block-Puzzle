# Track Specification: Core Gameplay UI

## 1. Overview
The goal of this track is to assemble the main game screen by integrating the existing Grid and Piece components into a cohesive, interactive gameplay experience. This includes layout assembly, drag-and-drop logic with visual feedback, real-time scoring, and the game-over flow.

## 2. Functional Requirements
- **Game Screen Layout:**
  - Implement a portrait-focused layout: Score at the top, 10x10 Grid in the center, and Piece Tray at the bottom.
  - Ensure the layout is responsive and fits comfortably on various mobile screen sizes.
- **Piece Tray & Selection:**
  - Build a Piece Tray that displays 3 available pieces from the game store.
  - Synchronize the selection state between the UI and the Zustand store.
- **Drop Zone Logic:**
  - Implement "Ghost Piece" highlighting: show a semi-transparent version of the held piece on the grid where it would land if dropped.
  - Validate the drop position in real-time using the game engine.
  - Connect the drop action to the `placePiece` method in the game store.
- **Animated Score Display:**
  - Implement a score display that uses "Rapid Increment" animations (counting up) when points are gained.
  - Persist and display the High Score using AsyncStorage.
- **Game Over Flow:**
  - Trigger an "Arcade Modal" when no more moves are possible.
  - The modal must feature an "Emergency Save" section, allowing the player to use an available power-up (e.g., Delete Block, Swap Piece) to continue the game if they have one.
  - Display the final score and high score with a prominent "New Game" button.

## 3. Tech Stack Integration
- **Zustand:** Managing game state (grid, score, inventory).
- **React Native Reanimated:** Handling the ghost piece transition and score increment animations.
- **React Native Gesture Handler:** Managing the drag-to-grid interaction logic.
- **AsyncStorage:** Persisting high scores and active game state (Expo Go compatible).

## 4. Acceptance Criteria
- [ ] The game screen displays the score, 10x10 grid, and 3 pieces in a balanced portrait layout.
- [ ] Dragging a piece over a valid grid position shows a semi-transparent "ghost" preview.
- [ ] Dropping a piece correctly updates the board and clears full lines.
- [ ] The score counts up rapidly when lines are cleared.
- [ ] The Game Over modal appears correctly and allows for "Emergency Save" interactions.
- [ ] High score is updated and persisted correctly.

## 5. Out of Scope
- Detailed animations for line clearing (to be handled in a later "Polish" track).
- Sound effects or haptic feedback implementation.
- Complex power-up store or progression systems.
