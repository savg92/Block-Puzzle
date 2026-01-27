# Block Puzzle 10x10 - AI Agent Context

> **This file provides context for AI agents working on this project.**

---

## Quick Reference

| Document | Purpose |
|----------|---------|
| `conductor/plan.md` | **Source of Truth** - All tasks and progress tracking |
| `conductor/workflow.md` | Task lifecycle, TDD process, quality gates |
| `conductor/product.md` | Game specifications and mechanics |
| `conductor/product-guidelines.md` | Visual identity, UX, and personalization |
| `conductor/tech-stack.md` | Technology decisions and architecture |
| `conductor/code_styleguides/` | Code style rules (TypeScript, JavaScript, HTML/CSS) |
| `README.md` | Project overview and setup instructions |

---

## Project Overview

A high-quality, fully offline, single-player block puzzle game for iOS and Android using React Native and Expo.

**Key Constraints:**
- 100% Offline - No network calls, no backend, no analytics
- No monetization - No ads, no IAP
- iOS-first optimization, but cross-platform
- 60fps animations, instant load times, crash-free experience

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Language** | TypeScript (v5+, strict mode, no `any`) |
| **Framework** | Expo (SDK 54) with React Native |
| **State** | Zustand + Pure TypeScript Engine |
| **Styling** | NativeWind (Tailwind CSS for RN) |
| **Animations** | React Native Reanimated (v3+) |
| **Gestures** | React Native Gesture Handler |
| **Persistence** | AsyncStorage |
| **Testing** | Jest |
| **Package Manager** | `bun` |

---

## Key Commands

```bash
# Install dependencies
bun install

# Run tests
bun x jest

# Run tests with coverage
bun x jest --coverage

# Lint code
bun run lint
```

---

## Development Workflow

### Before Starting Any Task

1. **Read the plan:** Check `conductor/plan.md` for current status and next tasks
2. **Understand the product:** Reference `conductor/product.md` and `conductor/product-guidelines.md`
3. **Follow the workflow:** Adhere to `conductor/workflow.md` for TDD and quality gates

### Task Lifecycle (from workflow.md)

1. Select task from `plan.md` in sequential order
2. Mark task as `[~]` (in progress) in `plan.md`
3. **Write failing tests first** (Red phase)
4. **Implement to pass tests** (Green phase)
5. **Refactor** with test safety net
6. Verify coverage (>80% required)
7. Commit with conventional message
8. Attach git note with task summary
9. Mark task as `[x]` with commit SHA in `plan.md`

### When Completing a Track

When all tasks in a track are complete:

1. **Update `plan.md`:**
   - Mark all track tasks as `[x]` with commit SHAs
   - Add checkpoint SHA to phase heading: `[checkpoint: <sha>]`
   - Move track to "Completed Work" section if fully done

2. **Update `README.md`:**
   - Add any new setup instructions
   - Update "Features" section with new capabilities
   - Update commands if new scripts were added

3. **Archive if applicable:**
   - Move track's spec/plan files to `conductor/archive/<track_id>/`
   - Create `metadata.json` with track completion info

4. **Commit changes:**
   - Commit all changes with conventional message
   - Attach git note with task summary
   - Push changes to remote

### Quality Gates (from workflow.md)

Before marking any task complete, verify:
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] Code follows `conductor/code_styleguides/`
- [ ] All public functions are documented
- [ ] Type safety enforced (no `any`)
- [ ] No linting errors
- [ ] Works on mobile (if applicable)

---

## Project Architecture

```
src/
├── engine/          # Pure TypeScript game logic (no React deps)
│   ├── types.ts     # Grid, Piece, GameState interfaces
│   ├── pieces.ts    # 9 canonical piece definitions
│   ├── board.ts     # Validation, placement, line clearing
│   ├── scoring.ts   # Score calculation
│   └── index.ts     # Engine entry point
├── store/           # Zustand state management
├── components/      # UI components (Atomic design)
├── screens/         # App screens
├── hooks/           # Reusable React hooks
└── styles/          # Themes and Tailwind config
```

---

## Code Style Quick Reference

### TypeScript (from code_styleguides/typescript.md)
- Use `const` by default, `let` if reassignment needed, **never `var`**
- Use named exports, **no default exports**
- Use `private` modifier, **not `#private` fields**
- Always use `===` and `!==`
- **Avoid `any`** - use `unknown` or specific types

### Naming Conventions
- **Classes/Interfaces/Types:** `UpperCamelCase`
- **Functions/Methods/Variables:** `lowerCamelCase`
- **Constants:** `CONSTANT_CASE`
- **Files:** lowercase with dashes (`game-engine.ts`)

### Commit Message Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(engine): Add line clearing logic
```

---

## Current Status

Check `conductor/plan.md` for:
- ✅ Completed tracks and checkpoints
- 📋 Active tracks and current phase
- ⏳ Upcoming work

