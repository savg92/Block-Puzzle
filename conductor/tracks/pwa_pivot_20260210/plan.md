# Implementation Plan: Pivot to PWA

## Phase 1: PWA Infrastructure & Configuration
- [ ] Task: Configure Web App Manifest in `app.json`
    - [ ] Add `web` field to `expo` config.
    - [ ] Define `name`, `shortName`, `themeColor`, `backgroundColor`, and `display: "standalone"`.
    - [ ] Configure `favicon` and PWA icons.
- [ ] Task: Implement Service Worker Registration
    - [ ] Research best approach for Service Worker in Expo.
    - [ ] Ensure Service Worker is registered in the web entry point.
- [ ] Task: Verify Native iOS Integrity (Phase 1)
    - [ ] Run iOS tests: `bun x jest src/__tests__/App.no-splash.test.tsx` (and other relevant tests).
    - [ ] Ensure native build command still functions: `npx expo prebuild --platform ios`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: PWA Infrastructure & Configuration' (Protocol in workflow.md)

## Phase 2: Web-Compatible Sensory Feedback
- [ ] Task: Refactor Haptics for Web
    - [ ] Write Tests: Create unit tests for haptics utility handling both native and web.
    - [ ] Implement: Update `src/utils/haptics.ts` to use `navigator.vibrate` when on web, keeping `expo-haptics` for native.
- [ ] Task: Implement "Tap to Start" mechanic for Audio
    - [ ] Write Tests: Create tests for audio unlock state.
    - [ ] Implement: Add interaction requirement before game start to unlock web audio.
- [ ] Task: Verify Native iOS Sensory Feedback
    - [ ] Run haptics/audio tests on native mocks.
    - [ ] Confirm `expo-haptics` is still called on native platform.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Web-Compatible Sensory Feedback' (Protocol in workflow.md)

## Phase 3: Persistence & Layout Optimization
- [ ] Task: Verify AsyncStorage on Web
    - [ ] Write Tests: Integration test verifying state persistence in browser-like environment.
    - [ ] Implement: Ensure `@react-native-async-storage/async-storage` functions on web.
- [ ] Task: Layout Optimization for Mobile Browsers
    - [ ] Implement: Adjust styles for URL bars and safe area insets on web.
- [ ] Task: Verify Native iOS Layout
    - [ ] Confirm native safe area handling is unaffected.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Persistence & Layout Optimization' (Protocol in workflow.md)

## Phase 4: Final Export & Offline Validation
- [ ] Task: Production Web Export
    - [ ] Implement: Run `npx expo export:web` and verify output.
- [ ] Task: Offline Functionality Audit
    - [ ] Implement: Serve and verify 100% offline functionality.
- [ ] Task: Final Native iOS Build Validation
    - [ ] Run full test suite: `bun x jest`.
    - [ ] Verify iOS prebuild one last time.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Export & Offline Validation' (Protocol in workflow.md)
