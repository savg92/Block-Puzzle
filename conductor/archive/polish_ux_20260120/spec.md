# Specification: Polish & UX

## Overview
This track aims to elevate the Block Puzzle experience from "functional prototype" to a "premium, arcade-style" game. This includes implementing a robust sensory feedback system (haptics and audio), a comprehensive settings interface, and performance optimizations ensuring a smooth 60fps experience on modern devices.

## Functional Requirements

### 1. Haptic Feedback System
- **Patterns:**
    - **Pickup:** Light impact.
    - **Drop (Valid):** Medium impact.
    - **Line Clear:** Success pattern (multi-impact).
    - **Game Over:** Heavy long impact.
- **Granularity:** Support "Low", "Medium", and "High" intensity levels, plus an "Off" toggle.

### 2. Sound Effect System (SFX)
- **Library:**
    - **Tap/UI:** Short clicking sound.
    - **Pickup:** Swish/Pop sound.
    - **Place:** Solid impact sound.
    - **Clear:** Rewarding "ding" or "explosion" sound (pitch shifts for multiple lines).
    - **Game Over:** Melancholy "crash" or "game over" jingle.
- **Control:** Volume slider (0% to 100%) and a master mute toggle.

### 3. Settings Screen
- **Access:** A "Gear" icon positioned in the top-right header of the `GameScreen`.
- **Navigation:** Modal or separate screen layout.
- **Options:**
    - **Theme:** Switch between Light, Dark, and System preferences.
    - **Audio:** Master volume slider and Sound toggle.
    - **Haptics:** Intensity selector (Off, Light, Medium, Heavy).
    - **Persistence:** All preferences must be saved via `AsyncStorage`.

### 4. Performance & UX Polishing
- **Animations:** Ensure all line-clear and placement animations are optimized for 60fps on modern devices.
- **Memoization:** Review and memoize functional components (`Grid`, `Cell`, `DraggablePiece`) to prevent unnecessary re-renders.
- **Bundle Size:** Target < 10MB total bundle size.

## Acceptance Criteria
- [ ] Haptic feedback fires correctly for all specified gameplay actions.
- [ ] Audio manager correctly handles SFX playback with volume control.
- [ ] Settings screen correctly updates game preferences and persists them across reloads.
- [ ] The game maintains a consistent 60fps during intense line-clear animations.
- [ ] Gear icon is functional and accessible from the main game screen.

## Out of Scope
- Background music implementation (SFX only for now).
- Localized translations (English only).
