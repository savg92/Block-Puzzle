# Product Guide: Block Puzzle 10x10

## 1. Project Overview
**Objective:** Build a high-quality, fully offline, single-player block puzzle game for iOS and Android using React Native and Expo.
**Vision:** Create a clean, responsive, and addictive puzzle experience that focuses on pure gameplay without the distractions of ads, monetization, or online requirements.
**Target Audience:**
- Casual mobile gamers looking for quick, engaging sessions.
- Puzzle enthusiasts who enjoy optimizing strategies and chasing high scores.
- Commuters or travelers specifically seeking reliable offline entertainment.

## 2. Core Gameplay
**Grid:** Fixed 10x10 grid with rounded square cells.
**Mechanics:**
- **Placement:** Drag and drop pieces from a set of 3 available options onto the grid.
- **Clearing:** Fill entire rows or columns to clear blocks and score points.
- **Piece Generation:** Pieces are randomly selected from 9 canonical shapes.
- **Game Over:** Occurs when no available piece can fit on the current board configuration.

**Piece Shapes:**
1.  **Single:** 1x1
2.  **Line-2:** 1x2
3.  **Line-3:** 1x3
4.  **Line-4:** 1x4
5.  **Line-5:** 1x5
6.  **Square-2:** 2x2
7.  **Square-3:** 3x3
8.  **Small-L:** 2x2 L-shape
9.  **Big-L:** 3x3 L-shape (Corner)

**Power-Ups:**
- **Undo:** Revert the last move (full state restoration).
- **Rotate:** Rotate all available pieces 90° clockwise.
- **Discard Piece:** Remove a single piece from the tray to free up space.
- **Force Place:** Place the next piece anywhere, overwriting existing blocks.
- **Add Single:** Spawn a 1x1 piece for tight spots.

## 3. Technical Constraints & Requirements
**Platform:** iOS, Android, and Web (Progressive Web App).
**Connectivity:** 100% Offline. No network calls, no backend, no analytics. Web version supports full offline play via Service Workers.
**Monetization:** None (No ads, no IAP).
**Persistence:** Robust local storage (AsyncStorage/LocalStorage) to save board state, score, inventory, and pieces instantly across all platforms.

## 4. Design Philosophy
**Visuals:** Light/Dark theme, modern aesthetic, smooth animations for interactions (clears, placement).
**UX:** Minimalist interface, focusing on the board and available pieces. Immediate feedback loops.

## 5. Success Metrics
- **Performance:** 60fps animations, instant load times.
- **Stability:** Crash-free experience, perfect state restoration after app close/kill.
- **Correctness:** Flawless logic for line detection and "game over" conditions.