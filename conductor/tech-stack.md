# Technology Stack: Block Puzzle 10x10

## 1. Core Frameworks & Languages
- **Language:** TypeScript (v5+)
  - Strict mode enabled for type safety.
  - No `any` policy for core game logic.
- **Framework:** Expo (SDK 50+)
  - Managed workflow for cross-platform compatibility.
  - iOS and Android targeting.
- **Base:** React Native

## 2. State Management & Logic
- **Store:** Zustand
  - Lightweight and performant state management.
  - Used to wrap the pure TypeScript game engine.
  - Serializable state to support robust undo/redo and persistence.
- **Engine:** Pure TypeScript Game Engine
  - Zero dependencies on React or React Native APIs.
  - Handles board state, piece validation, clearing logic, and scoring.
  - Fully unit-testable in a Node.js environment.

## 3. Styling & UI
- **Styling:** NativeWind (Tailwind CSS for React Native)
  - Utility-first CSS approach for rapid UI development.
  - Consistent styling across iOS and Android.
- **Animations:** React Native Reanimated (v3+)
  - High-performance, worklet-based animations for 60fps interaction.
- **Interactions:** React Native Gesture Handler
  - Native-driven gesture handling for piece dragging and dropping.

## 4. Sensory Feedback
- **Haptics:** `expo-haptics`
  - Integrated into piece pickup, drop, line clears, and game over.
- **Audio:** `expo-av`
  - Handles pre-loading and playback of sound effects.

## 5. Persistence & Storage
- **Local Storage:** AsyncStorage (Required for Expo Go)
  - Provides reliable persistence compatible with the standard Expo Go environment.
  - Used for persisting high scores, game state, and theme settings.
- **Offline Strategy:** 100% Local-first. No external data dependencies.

## 5. Development & Testing
- **Unit Testing:** Jest
  - Global code coverage threshold set to 80%.
  - **Integration Testing:** React Native Testing Library (RNTL) for verifying Store-Component interactions and complex user flows.
  - **Visual Testing:** Snapshot testing for core UI components to prevent regressions.
- **Linting:** Default Expo linting (`eslint-config-expo`) + Prettier
- **Package Manager:** `bun` (User Preference)

## 6. Project Architecture
- **Clean Architecture:** 
  - `src/engine`: Pure logic layer.
  - `src/store`: Zustand integration.
  - `src/components`: UI components (Atomic design).
  - `src/hooks`: Reusable React logic.
  - `src/styles`: Global themes and Tailwind config.
