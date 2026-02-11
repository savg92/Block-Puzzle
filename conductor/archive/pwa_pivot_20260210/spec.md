# Specification: Pivot to PWA (Progressive Web App)

## 1. Overview
The goal of this track is to pivot the project's primary target from native mobile apps to a Progressive Web App (PWA). This ensures the game can be "installed" on a user's phone via the browser's "Add to Home Screen" feature and played fully offline. CRITICAL: Existing native iOS and Android functionality must be maintained and unaffected by these changes.

## 2. Functional Requirements

### 2.1 PWA Infrastructure
- **Web App Manifest:** Configure `app.json` (or a dedicated `manifest.json`) to include icons, theme colors, and display properties (`standalone`) required for a native-like experience.
- **Service Worker:** Implement a service worker to cache all necessary scripts, styles, and assets (images, audio) for 100% offline gameplay after the initial load.

### 2.2 Web-Compatible Sensory Feedback
- **Haptics:** Augment `src/utils/haptics.ts` to use the `navigator.vibrate` API when running on web, while preserving `expo-haptics` for native platforms.
- **Audio:** Implement a "Tap to Start" interaction or updated LoadingScreen to comply with web browser policies that prevent auto-playing audio without user interaction.

### 2.3 Persistence
- Verify that the existing `AsyncStorage` implementation correctly persists game state, high scores, and preferences in the browser's storage when running on web.

### 2.4 UX/UI Adjustments
- Ensure the game layout is optimized for mobile browser viewports (handling URL bars and safe areas).
- Add clear instructions or a prompt for users on how to "Add to Home Screen".

### 2.5 Cross-Platform Integrity
- Ensure all changes use conditional logic (e.g., `Platform.OS`) to prevent breaking native iOS and Android builds.

## 3. Non-Functional Requirements
- **Offline Reliability:** Once cached, the game must load and function without any network connection.
- **Performance:** Maintain 60fps animations using existing Reanimated 3 logic on mobile browser engines.
- **Security:** Ensure the implementation remains secure within the browser sandbox.

## 4. Acceptance Criteria
- [ ] The app successfully builds for web via `bun expo export:web`.
- [ ] A manifest file is present and correctly defines the app as `standalone`.
- [ ] A Service Worker is registered and successfully caches assets for offline use.
- [ ] The game can be fully played while the device is in airplane mode.
- [ ] Haptic feedback (vibration) triggers on supported devices during block placement.
- [ ] Audio plays correctly after the first user interaction.
- [ ] Native iOS build continues to work correctly with existing haptics and audio logic.
- [ ] Game state is preserved after refreshing the browser or closing the "installed" PWA.

## 5. Out of Scope
- Native iOS (.ipa) or Android (.apk) binary distribution via App Stores.
- Server-side features or online leaderboards.
