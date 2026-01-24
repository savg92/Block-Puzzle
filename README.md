# Block Puzzle 10x10

A high-quality, fully offline, single-player block puzzle game for iOS and Android.

## Features

- **Core Engine:** Full 10x10 logic, line clearing, and scoring system.

- **UI Foundation:** High-performance 10x10 Grid and Draggable Piece components.

- **Arcade Aesthetic:** Polished slate/blue/emerald theme with smooth animations.

- **Improved UX:** Centered piece dragging with vertical offset and precise ghost alignment.

- **Power-Ups:** Full suite of game-changers: Undo, Rotate, Discard, Force Place, and Add Single Block.

- **Sensory Feedback:** Rich haptic feedback patterns and sound effects (configurable).

- **State Persistence:** Robust state saving via AsyncStorage (optimized for Expo Go).

## Getting Started

1.  **Install Dependencies:**
    ```bash
    bun install
    ```

2.  **Run Development Server:**
    ```bash
    bun start
    ```

3.  **Run Tests:**
    ```bash
    bun test
    ```

## Current Status

✅ **Core Engine Complete** - Board logic, piece mechanics, scoring, line clearing.

✅ **State Management Complete** - Zustand integration, Persistence, Undo system.

✅ **UI & Gameplay Complete** - Centered dragging, Perfect ghost alignment, 60fps animations.

✅ **Power-Ups System Complete** - All 5 power-up types implemented and integrated.

✅ **Polish & UX Complete** - Haptics, Audio, Settings screen, and Performance optimizations.

✅ **Quality Assurance** - >90% Code Coverage, Integration Tests, and Snapshot testing.

See [`conductor/plan.md`](conductor/plan.md) for detailed progress.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo + React Native |
| Language | TypeScript (strict) |
| State | Zustand |
| Styling | NativeWind |
| Storage | AsyncStorage |
| Testing | Jest, RNTL, Snapshots |

## Contributing

This project follows a TDD workflow. See [`conductor/workflow.md`](conductor/workflow.md) for development guidelines.

## License

Private - All rights reserved.