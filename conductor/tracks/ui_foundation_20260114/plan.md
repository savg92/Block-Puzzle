# Track Plan: UI Foundation

## Phase 1: Project Setup & Theming
- [ ] Task: Initialize Expo Project Structure
  - [ ] Subtask: Configure NativeWind with Tailwind CSS
  - [ ] Subtask: Set up React Native Reanimated
  - [ ] Subtask: Configure React Native Gesture Handler
- [ ] Task: Create Theme System
  - [ ] Subtask: Define color palette in `src/styles/theme.ts` (Dark/Light)
  - [ ] Subtask: Create arcade-inspired color tokens
  - [ ] Subtask: Set up theme context with user preference persistence
- [ ] Task: Conductor - User Manual Verification 'Project Setup & Theming' (Protocol in workflow.md)

## Phase 2: Grid & Cell Components
- [ ] Task: Build Grid Component
  - [ ] Subtask: Create `src/components/Grid/Grid.tsx` with 10x10 layout
  - [ ] Subtask: Implement `Cell` component with rounded corners
  - [ ] Subtask: Add filled/empty state visual distinction
  - [ ] Subtask: Write component tests for grid rendering
- [ ] Task: Conductor - User Manual Verification 'Grid & Cell Components' (Protocol in workflow.md)

## Phase 3: Piece Components
- [ ] Task: Build Piece Preview Component
  - [ ] Subtask: Create `src/components/Piece/PiecePreview.tsx`
  - [ ] Subtask: Implement piece visualization from matrix data
  - [ ] Subtask: Add selection state styling
- [ ] Task: Build Draggable Piece Component
  - [ ] Subtask: Create `src/components/Piece/DraggablePiece.tsx`
  - [ ] Subtask: Integrate Gesture Handler for drag operations
  - [ ] Subtask: Add visual feedback during drag (transparency, shadow)
- [ ] Task: Conductor - User Manual Verification 'Piece Components' (Protocol in workflow.md)
