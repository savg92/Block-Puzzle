# Implementation Plan: Polish & UX

## Phase 1: Sensory Infrastructure (Haptics & SFX) [checkpoint: 8d3a774]
Establish the underlying managers for haptic feedback and sound effects.

- [x] Task: Implement Haptic Utility 2653259
    - [ ] Subtask: Create `src/utils/haptics.ts` using `expo-haptics`.
    - [ ] Subtask: Define patterns for Pickup, Drop, Clear, and Game Over.
    - [ ] Subtask: Write unit tests to verify haptic trigger logic.
- [x] Task: Implement Audio Manager 8d01696
- [x] Task: Conductor - User Manual Verification 'Sensory Infrastructure' (Protocol in workflow.md) 8d3a774

## Phase 2: Settings System [checkpoint: e3f0f3f]
Create the interface for user preferences and ensure they persist.

- [x] Task: Extend State for User Preferences c071d00
    - [ ] Subtask: Add `preferences` object to `src/store/gameStore.ts` (sound volume, haptic intensity, etc.).
    - [ ] Subtask: Ensure preference state is persisted via `AsyncStorage`.
    - [ ] Subtask: Write tests for preference updates and persistence.
- [x] Task: Build Settings Screen UI e5593ad
    - [ ] Subtask: Create `src/screens/SettingsScreen.tsx` with sliders and toggles.
    - [ ] Subtask: Implement "Gear" icon in `GameScreen` header to access settings.
    - [ ] Subtask: Connect UI controls to the store preferences.
- [x] Task: Conductor - User Manual Verification 'Settings System' (Protocol in workflow.md) e3f0f3f

## Phase 3: Integration & Optimization
Hook sensory feedback into gameplay and optimize rendering.

- [x] Task: Integrate Haptics & SFX into Gameplay eaacf0b
    - [ ] Subtask: Trigger haptics/SFX on piece pickup and placement.
    - [ ] Subtask: Trigger line-clear feedback with pitch-shift for multiple lines.
    - [ ] Subtask: Add game-over feedback.
- [x] Task: Performance Profiling & Optimization 1c3fe6a
- [x] Task: Final Polish 56122bc
    - [x] Subtask: Memoize `Cell`, `Grid`, and `DraggablePiece` components.
    - [x] Subtask: Use React DevTools to identify and fix unnecessary re-renders.
    - [x] Subtask: Optimize line-clear animation loop for 60fps.
- [x] Task: Conductor - User Manual Verification 'Integration & Optimization' (Protocol in workflow.md)

## Phase 4: Final Polish
Finalize assets and perform cleanup.

- [x] Task: Bundle Size & Resource Cleanup 56122bc
    - [x] Subtask: Optimize audio assets (compression/format). (Note: Audio assets are placeholders)
    - [x] Subtask: Verify total bundle size is within targets.
- [x] Task: Final System Test 57108
    - [x] Subtask: Ensure >80% coverage for new modules.
    - [x] Subtask: Perform manual playthrough with all sensory feedback active.
- [x] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)
