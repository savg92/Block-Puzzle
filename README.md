# Block Puzzle 10x10

A high-quality, fully offline, single-player block puzzle game for iOS and Android.

## Features
- **Core Engine:** Full 10x10 logic, line clearing, and scoring system.
- **UI Foundation:** High-performance 10x10 Grid and Draggable Piece components.
- **Arcade Aesthetic:** Polished slate/blue/emerald theme with smooth animations.
- **State Persistence:** Synchronous, high-speed state saving via MMKV.
- **Undo System:** Revert moves with full state restoration.


## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3+)
- [Node.js](https://nodejs.org/) (v18+)
- Expo CLI (for mobile development)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd block-puzzle

# Install dependencies
bun install
```

### Development

```bash
# Run tests
bun x jest

# Run tests with coverage
bun x jest --coverage

# Run linting
bun run lint
```

### Mobile Development (Coming Soon)

```bash
# Start Expo dev server
bun start

# iOS simulator
bun run ios

# Android emulator
bun run android
```

## Project Structure

```
├── src/
│   └── engine/          # Pure TypeScript game logic ✅
│       ├── types.ts     # Core type definitions
│       ├── pieces.ts    # 9 canonical piece shapes
│       ├── board.ts     # Board validation & line clearing
│       ├── scoring.ts   # Score calculation
│       └── index.ts     # Engine entry point
69: │   └── store/           # Zustand state management ✅
70: │       ├── gameStore.ts # Central game state & actions
71: │       └── storage.ts   # MMKV persistence adapter
├── conductor/           # Project documentation
│   ├── plan.md          # Development roadmap
│   ├── workflow.md      # Development process
│   ├── product.md       # Game specifications
│   └── tech-stack.md    # Technology decisions
└── README.md
```

## Current Status

✅ **Core Engine Complete** - Board logic, piece mechanics, scoring, line clearing

✅ **State Management Complete** - Zustand integration, MMKV persistence, Undo system

🚧 **In Progress:**
- UI Foundation (NativeWind)
- Core Gameplay Screen

See [`conductor/plan.md`](conductor/plan.md) for detailed progress.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo + React Native |
| Language | TypeScript (strict) |
| State | Zustand |
| Styling | NativeWind |
| Storage | MMKV |
| Testing | Jest |

## Contributing

This project follows a TDD workflow. See [`conductor/workflow.md`](conductor/workflow.md) for development guidelines.

## License

Private - All rights reserved.
