# Implementation Plan: Testing & Quality Assurance

## Phase 1: Unit Test Expansion & Coverage
Focus on reaching the 80% coverage milestone for all core logic modules.

- [x] Task: Expand Engine Tests 220ee4a
    - [x] Subtask: Add edge case tests for piece rotation and placement in `src/engine/__tests__/pieces.test.ts`.
    - [x] Subtask: Add exhaustive line-clear combination tests in `src/engine/__tests__/board.test.ts`.
    - [x] Subtask: Verify game-over detection with complex board states.
- [x] Task: Expand Store Tests 220ee4a
    - [x] Subtask: Write comprehensive tests for `undo` history depth and branching in `src/store/__tests__/gameStore.test.ts`.
    - [x] Subtask: Test high-score persistence logic with mocked `AsyncStorage`.
    - [x] Subtask: Verify state integrity after rapid sequential actions.
- [x] Task: Expand Utils & Styles Tests 220ee4a
    - [x] Subtask: Add boundary tests for coordinate mapping in `src/utils/__tests__/gridUtils.test.ts`.
    - [x] Subtask: Test theme context switching and system preference detection.
- [x] Task: Conductor - User Manual Verification 'Unit Test Expansion & Coverage' (Protocol in workflow.md)

## Phase 2: Component & Snapshot Testing
Ensure visual stability and basic UI interaction correctness.

- [x] Task: Infrastructure Setup 220ee4a
    - [x] Subtask: Configure Jest for snapshot testing of NativeWind components. (Note: Standard RNTL snapshots used as NativeWind is not yet active in components)
- [x] Task: Visual Regression (Snapshots) 220ee4a
    - [x] Subtask: Create snapshots for `Grid`, `Cell`, `PiecePreview`, and `ScoreDisplay`.
    - [x] Subtask: Create snapshots for `GameOverModal` in different states (new high score vs. standard).
- [x] Task: UI Interaction Tests 220ee4a
    - [x] Subtask: Test Piece selection/deselection visual changes using RNTL.
    - [x] Subtask: Simulate piece placement and verify `onDragEnd` calls the store correctly.
- [x] Task: Conductor - User Manual Verification 'Component & Snapshot Testing' (Protocol in workflow.md)

## Phase 3: Integration & Pseudo-E2E Flows
Verify that multiple systems work together seamlessly in realistic scenarios.

- [x] Task: Full Game Loop Integration 220ee4a
    - [x] Subtask: Write a test that plays a partial game (placing 3-6 pieces) and verifies score accumulation.
    - [x] Subtask: Verify that clearing a line updates the grid and score simultaneously.
- [x] Task: Persistence Flow 220ee4a
    - [x] Subtask: Simulate app closure/re-hydration and verify the board state is identical.
- [x] Task: Power-Up Workflows 220ee4a
    - [x] Subtask: Test the end-to-end flow of using "Discard" and "Rotate" power-ups via UI triggers.
- [x] Task: Conductor - User Manual Verification 'Integration & Pseudo-E2E Flows' (Protocol in workflow.md)

## Phase 4: QA Infrastructure & Cleanup
Finalize the testing environment for continuous integration.

- [x] Task: Coverage Reporting Automation 220ee4a
    - [x] Subtask: Configure `package.json` to fail if global coverage drops below 80%. (Note: Configured in jest.config.cjs which package.json uses)
- [x] Task: Final Regression Sweep 220ee4a
    - [x] Subtask: Run the entire suite (`bun run test`) and ensure 100% pass rate. (Note: Achieved 100% pass rate and >90% statement coverage)
- [x] Task: Conductor - User Manual Verification 'QA Infrastructure & Cleanup' (Protocol in workflow.md)
