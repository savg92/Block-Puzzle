# Block Puzzle 10x10

![License](https://img.shields.io/badge/license-Private-red.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)

A premium, fully offline, single-player block puzzle game built with React Native and Expo. Designed for performance, aesthetics, and pure gameplay focus without the distractions of ads or monetization.

---

## 🎮 Gameplay & Features

**The Goal:** Drag and drop blocks onto the 10x10 grid to create full rows or columns. Cleared lines score points and free up space. The game ends when no available pieces fit on the board.

### Key Features
- **Arcade Aesthetic:** Polished visual theme with selectable Dark/Light modes.
- **Improved UX:** Pieces center under your finger automatically with a vertical offset for visibility, accompanied by a precise "ghost" shadow on the grid.
- **Sensory Feedback:** Rich haptic feedback patterns (via `expo-haptics`) and custom sound effects for satisfying interaction.
- **State Persistence:** Your game is saved instantly. Close the app and resume exactly where you left off.

### 🚀 Power-Ups
Strategize with 5 unique game-changing abilities:
1.  **Undo:** Made a mistake? Revert your last move instantly.
2.  **Rotate:** Rotate all current pieces in the tray 90° clockwise.
3.  **Discard:** Remove a difficult piece from your tray to get a new set sooner.
4.  **Force Place:** Smash a piece onto the board, overwriting any existing blocks.
5.  **Add Single:** Spawn a flexible 1x1 block to fill tight gaps.

---

## 🛠 Tech Stack

Built with a focus on **Clean Architecture** and **Performance**.

| Layer | Technology | Description |
|-------|------------|-------------|
| **Core** | **Expo (SDK 50)** | Managed workflow for cross-platform stability. |
| **Logic** | **TypeScript** | Pure, dependency-free game engine (`src/engine`). |
| **State** | **Zustand** | Lightweight store for reactive state and actions. |
| **UI** | **NativeWind** | Utility-first styling (Tailwind CSS) for React Native. |
| **Motion** | **Reanimated 3** | 60fps+ animations running on the UI thread. |
| **Gestures** | **Gesture Handler** | Native-driven drag-and-drop interactions. |
| **Storage** | **AsyncStorage** | robust local persistence for game state. |
| **Testing** | **Jest + RNTL** | Comprehensive Unit and Integration testing (>90% coverage). |

---

## 📂 Project Structure

```bash
src/
├── components/         # Atomic UI components
│   ├── Grid/           # Board rendering (Memoized)
│   ├── Piece/          # Draggable and Ghost pieces
│   ├── PieceTray/      # Selection area
│   └── UI/             # HUD, Modals, Score
├── engine/             # PURE LOGIC (No React deps)
│   ├── board.ts        # Grid validation & clearing
│   ├── pieces.ts       # Canonical shapes
│   └── scoring.ts      # Score calculation
├── hooks/              # Reusable React logic (Sensory, Theme)
├── screens/            # Route controllers (Game, Settings)
├── store/              # Zustand state & persistence
├── styles/             # Global theme tokens
└── utils/              # Haptics, Audio, Math helpers
```

---

## ⚡️ Getting Started

### Prerequisites
- [Bun](https://bun.sh) (Recommended) or Node.js
- [Expo Go](https://expo.dev/client) app on your mobile device

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd block-puzzle
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Start the development server:**
    ```bash
    bun start
    ```
    *Scan the QR code with your iPhone (Camera) or Android (Expo Go).*

---

## 🧪 Testing

This project follows a strict **Test-Driven Development (TDD)** workflow.

### Running Tests
```bash
# Run all unit and integration tests
bun test

# Run tests in watch mode
bun test --watch

# Generate coverage report
bun test --coverage
```

### Coverage Targets
- **Global:** >80% (Currently >90%)
- **Critical Paths:** 100% (Engine logic, State management)

---

## 📈 Development Tracks

We use a "Conductor" framework to track feature implementation. See [`conductor/tracks.md`](conductor/tracks.md) for the full history.

- ✅ **Core Engine** (Logic & Rules)
- ✅ **State Management** (Zustand & Persistence)
- ✅ **UI Foundation** (Grid & Pieces)
- ✅ **Core Gameplay** (Drag & Drop, Clearing)
- ✅ **Power-Ups** (Implementation & UI)
- ✅ **Polish & UX** (Haptics, Audio, Settings)
- ✅ **Drag UX Refinement** (Centering & Ghost Alignment)

---

## 📄 License

**Private & Confidential**
All rights reserved. Unauthorized copying or distribution is strictly prohibited.
