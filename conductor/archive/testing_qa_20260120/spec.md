# Specification: Testing & Quality Assurance

## Overview
This track aims to ensure the long-term stability and correctness of the Block Puzzle game. It establishes a rigorous testing environment covering core logic (Engine), state management (Zustand), UI components, and complex user flows. The goal is to move from 80% Engine coverage to 80% Global coverage and implement automated regression detection.

## Functional Requirements

### 1. Global Coverage & Unit Testing
- **Target:** 80%+ code coverage for all code modules (`src/engine`, `src/store`, `src/utils`, `src/styles`).
- **Scope:**
    - **Engine:** Add edge case tests for piece placement, line clearing, and game over detection.
    - **Store:** Validate every action (`newGame`, `placePiece`, `usePowerUp`, `undo`) and its side effects (high score persistence).
    - **Utils:** Ensure coordinate mapping and grid utilities are mathematically sound.

### 2. Component & Integration Testing
- **Tools:** `React Native Testing Library` (RNTL) and `Jest`.
- **Strategy:**
    - **Store Integration:** Most component tests will use the actual Zustand store (unmocked) to verify that UI actions correctly update the game state.
    - **Visual Snapshots:** Implement snapshot testing for `Grid`, `Cell`, and `PiecePreview` to prevent visual regressions.
    - **Gesture Simulation:** Simulate user drag-and-drop interactions to verify the full flow from Piece Tray to Grid.

### 3. Integrated Flow Testing (Pseudo-E2E)
- **Scope:** Implement high-level tests using RNTL that simulate:
    - **Full Game Loop:** Start game -> Place pieces -> Score points -> Clear lines -> Game over -> Restart.
    - **State Restoration:** Mock app backgrounding and reload to verify `AsyncStorage` restoration.
    - **Power-Up Workflows:** Use power-ups during a game session and verify inventory consumption and board impact.

### 4. Regression & QA Infrastructure
- **CI/CD Readiness:** Ensure all tests run in a single, non-interactive command (`bun run test`).
- **Automation:** Configure Jest to automatically run coverage reports.

## Acceptance Criteria
- [ ] Global code coverage is at or above 80%.
- [ ] Tests verify the interaction between `useGameStore` and `GameEngine`.
- [ ] Snapshot tests exist for all core visual components.
- [ ] At least 3 complex user flow integration tests (Full Loop, Persistence, Power-Ups) pass successfully.
- [ ] All tests pass without manual intervention.

## Out of Scope
- Full E2E testing with Detox or Maestro (deferred).
- Performance benchmarking within the test suite.
