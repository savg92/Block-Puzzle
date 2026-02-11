# Implementation Plan: Pivot to PWA

## Phase 1: PWA Infrastructure & Configuration
- [x] Task: Configure Web App Manifest in `app.json`
    - [x] Add `web` field to `expo` config.
    - [x] Define `name`, `shortName`, `themeColor`, `backgroundColor`, and `display: "standalone"`.
    - [x] Configure `favicon` and PWA icons.
- [x] Task: Implement Service Worker Registration
    - [x] Research best approach for Service Worker in Expo.
    - [x] Ensure Service Worker is registered in the web entry point.
- [x] Task: Verify Native iOS Integrity (Phase 1)
    - [x] Run iOS tests: `bun x jest src/__tests__/App.no-splash.test.tsx` (and other relevant tests).
    - [x] Ensure native build command still functions: `npx expo prebuild --platform ios`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: PWA Infrastructure & Configuration' (Protocol in workflow.md)

## Phase 2: Web-Compatible Sensory Feedback
- [x] Task: Refactor Haptics for Web
    - [x] Write Tests: Create unit tests for haptics utility handling both native and web.
    - [x] Implement: Update `src/utils/haptics.ts` to use `navigator.vibrate` when on web, keeping `expo-haptics` for native.
- [x] Task: Implement "Tap to Start" mechanic for Audio
    - [x] Write Tests: Create tests for audio unlock state.
    - [x] Implement: Add interaction requirement before game start to unlock web audio.
- [x] Task: Verify Native iOS Sensory Feedback
    - [x] Run haptics/audio tests on native mocks.
    - [x] Confirm `expo-haptics` is still called on native platform.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Web-Compatible Sensory Feedback' (Protocol in workflow.md)

## Phase 3: Persistence & Layout Optimization
- [x] Task: Verify AsyncStorage on Web
    - [x] Write Tests: Integration test verifying state persistence in browser-like environment.
    - [x] Implement: Ensure `@react-native-async-storage/async-storage` functions on web.
- [x] Task: Layout Optimization for Mobile Browsers
    - [x] Implement: Adjust styles for URL bars and safe area insets on web.
- [x] Task: Verify Native iOS Layout
    - [x] Confirm native safe area handling is unaffected.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Persistence & Layout Optimization' (Protocol in workflow.md)

## Phase 4: Final Export & Offline Validation
- [x] Task: Production Web Export
    - [x] Implement: Run `npx expo export:web` and verify output.
- [x] Task: Offline Functionality Audit
    - [x] Implement: Serve and verify 100% offline functionality.
- [x] Task: Final Native iOS Build Validation
    - [x] Run full test suite: `bun x jest`.
    - [x] Verify iOS prebuild one last time.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Export & Offline Validation' (Protocol in workflow.md)
