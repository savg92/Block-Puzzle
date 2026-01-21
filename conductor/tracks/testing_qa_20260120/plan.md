# Implementation Plan: Testing & Quality Assurance

## Phase 1: Unit Test Expansion & Coverage
Focus on reaching the 80% coverage milestone for all core logic modules.

- [ ] Task: Expand Engine Tests
    - [ ] Subtask: Add edge case tests for piece rotation and placement in `src/engine/__tests__/pieces.test.ts`.
    - [ ] Subtask: Add exhaustive line-clear combination tests in `src/engine/__tests__/board.test.ts`.
    - [ ] Subtask: Verify game-over detection with complex board states.
- [ ] Task: Expand Store Tests
    - [ ] Subtask: Write comprehensive tests for `undo` history depth and branching in `src/store/__tests__/gameStore.test.ts`.
    - [ ] Subtask: Test high-score persistence logic with mocked `AsyncStorage`.
    - [ ] Subtask: Verify state integrity after rapid sequential actions.
- [ ] Task: Expand Utils & Styles Tests
    - [ ] Subtask: Add boundary tests for coordinate mapping in `src/utils/__tests__/gridUtils.test.ts`.
    - [ ] Subtask: Test theme context switching and system preference detection.
- [ ] Task: Conductor - User Manual Verification 'Unit Test Expansion & Coverage' (Protocol in workflow.md)

## Phase 2: Component & Snapshot Testing
Ensure visual stability and basic UI interaction correctness.

- [ ] Task: Infrastructure Setup
    - [ ] Subtask: Configure Jest for snapshot testing of NativeWind components.
- [ ] Task: Visual Regression (Snapshots)
    - [ ] Subtask: Create snapshots for `Grid`, `Cell`, `PiecePreview`, and `ScoreDisplay`.
    - [ ] Subtask: Create snapshots for `GameOverModal` in different states (new high score vs. standard).
- [ ] Task: UI Interaction Tests
    - [ ] Subtask: Test Piece selection/deselection visual changes using RNTL.
    - [ ] Subtask: Simulate piece placement and verify `onDragEnd` calls the store correctly.
- [ ] Task: Conductor - User Manual Verification 'Component & Snapshot Testing' (Protocol in workflow.md)

## Phase 3: Integration & Pseudo-E2E Flows
Verify that multiple systems work together seamlessly in realistic scenarios.

- [ ] Task: Full Game Loop Integration
    - [ ] Subtask: Write a test that plays a partial game (placing 3-6 pieces) and verifies score accumulation.
    - [ ] Subtask: Verify that clearing a line updates the grid and score simultaneously.
- [ ] Task: Persistence Flow
    - [ ] Subtask: Simulate app closure/re-hydration and verify the board state is identical.
- [ ] Task: Power-Up Workflows
    - [ ] Subtask: Test the end-to-end flow of using "Discard" and "Rotate" power-ups via UI triggers.
- [ ] Task: Conductor - User Manual Verification 'Integration & Pseudo-E2E Flows' (Protocol in workflow.md)

## Phase 4: QA Infrastructure & Cleanup
Finalize the testing environment for continuous integration.

- [ ] Task: Coverage Reporting Automation
    - [ ] Subtask: Configure `package.json` to fail if global coverage drops below 80%.
- [ ] Task: Final Regression Sweep
    - [ ] Subtask: Run the entire suite (`bun run test`) and ensure 100% pass rate.
- [ ] Task: Conductor - User Manual Verification 'QA Infrastructure & Cleanup' (Protocol in workflow.md)
