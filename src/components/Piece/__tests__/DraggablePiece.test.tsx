import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DraggablePiece, calculatePiecePosition } from '../DraggablePiece';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameStore } from '../../../store/gameStore';

// Mock sensory feedback
const mockPlayPickup = jest.fn();

jest.mock('../../../hooks/useSensoryFeedback', () => ({
  useSensoryFeedback: () => ({
    playPickup: mockPlayPickup,
  }),
}));

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

describe('DraggablePiece', () => {
  const mockPiece = [[1]];
  const onDragEnd = jest.fn();
  const onPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    useGameStore.getState().newGame();
    useGameStore.setState({
        gridLayout: { x: 10, y: 10, width: 100, height: 100 }
    });
  });

  it('calculatePiecePosition returns correct coordinates', () => {
    const fingerX = 100;
    const fingerY = 200;
    const grabX = 20;
    const grabY = 30;
    const pieceWidth = 50;
    const pieceHeight = 50;
    const lift = 100;

    const result = calculatePiecePosition(fingerX, fingerY, grabX, grabY, pieceWidth, pieceHeight, lift);
    
    expect(result.pieceTopLeftX).toBe(fingerX - grabX);
    expect(result.pieceTopLeftY).toBe(fingerY - grabY - lift);
    expect(result.centerX).toBe(fingerX - grabX + pieceWidth / 2);
    expect(result.centerY).toBe(fingerY - grabY - lift + pieceHeight / 2);
  });

  it('renders the piece correctly', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    expect(getByTestId('draggable-piece')).toBeDefined();
  });

  it('triggers onStart when dragging starts', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    fireEvent(piece, 'dragStart');
    
    expect(useGameStore.getState().selectedPiece).toEqual(mockPiece);
    expect(mockPlayPickup).toHaveBeenCalled();
  });

  it('triggers onEnd when dragging ends with snapping', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    // Snap to (0,0)
    fireEvent(piece, 'dragEnd', 22, 22, 10, 10);
    
    expect(onDragEnd).toHaveBeenCalledWith(10, 10, { row: 0, col: 0 });
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });

  it('triggers onEnd when dragging ends outside grid', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    fireEvent(piece, 'dragEnd', 500, 500, 490, 490);
    
    expect(onDragEnd).toHaveBeenCalledWith(490, 490, undefined);
  });

  it('triggers onMove and updates hover position', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    
    // Move to a valid spot
    fireEvent(piece, 'dragMove', 22, 22);
    expect(useGameStore.getState().hoverPosition).toEqual({ row: 0, col: 0 });
    
    // Move to invalid spot
    fireEvent(piece, 'dragMove', 500, 500);
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });

  it('allows placement in forcePlace mode even if blocked', () => {
    useGameStore.setState({ 
        grid: Array(10).fill(null).map(() => Array(10).fill('red')),
        activePowerUpMode: 'forcePlace'
    });

    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    
    // Should snap even if grid is full because of forcePlace
    fireEvent(piece, 'dragEnd', 22, 22, 10, 10);
    expect(onDragEnd).toHaveBeenCalledWith(10, 10, { row: 0, col: 0 });
  });

  it('triggers onPress when tapped', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} onPress={onPress} />
    );
    
    const piece = getByTestId('draggable-piece');
    fireEvent(piece, 'piecePress');
    
    expect(onPress).toHaveBeenCalled();
  });

  it('handles piece press without onPress handler', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    // Should not crash
    fireEvent(piece, 'piecePress');
  });

  it('returns null for grid position if gridLayout is missing', () => {
    useGameStore.setState({ gridLayout: null });
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    fireEvent(piece, 'dragMove', 22, 22);
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });

  it('snaps piece to best valid spot in 3x3 area', () => {
    const grid = Array(10).fill(null).map(() => Array(10).fill(0));
    grid[0][0] = 'red';
    useGameStore.setState({ grid });
    
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');
    
    // Move near (0,0) - it should snap to (0,1) instead of null if (0,1) is valid
    fireEvent(piece, 'dragMove', 22, 22);
    expect(useGameStore.getState().hoverPosition).toEqual({ row: 0, col: 1 });
    
    // Now move to a blocked area
    const blockedGrid = Array(10).fill(null).map(() => Array(10).fill('red'));
    useGameStore.setState({ grid: blockedGrid });
    // Note: Component might need re-render to pick up new grid for isValidPlacement if it's in a closure
    // but isValidPlacement depends on 'grid' which is from store.
    // However, fireEvent 'dragMove' calls the CURRENT onMove.
    // If the component didn't re-render, onMove might still have the old 'grid' in its closure if it's not careful.
    // But onMove depends on getSmartSnapPos, which depends on isValidPlacement, which depends on grid.
    // All are from useGameStore.
    
    fireEvent(piece, 'dragMove', 32, 32); 
    // If it still hasn't re-rendered, it might use the old grid.
    // But in tests, setState usually triggers re-render if using ThemeProvider/etc.
  });

  it('does not snap if distance is too great', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={onDragEnd} />
    );
    
    const piece = getByTestId('draggable-piece');

    // Move far away
    fireEvent(piece, 'dragMove', 500, 500);
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });

  it('isValidPlacement returns false for out of bounds', () => {
    const piece2x2 = [[1, 1], [1, 1]];
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={piece2x2} color="blue" onDragEnd={onDragEnd} />
    );
    const piece = getByTestId('draggable-piece');
    
    // Drag to far right - should NOT snap because it overflows 10x10 grid
    fireEvent(piece, 'dragMove', 200, 22);
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });

  it('forcePlace mode still returns false for out of bounds', () => {
    useGameStore.setState({ activePowerUpMode: 'forcePlace' });
    const piece2x2 = [[1, 1], [1, 1]];
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={piece2x2} color="blue" onDragEnd={onDragEnd} />
    );
    const piece = getByTestId('draggable-piece');
    
    // Drag to far right even in forcePlace - should NOT snap
    fireEvent(piece, 'dragMove', 200, 22);
    expect(useGameStore.getState().hoverPosition).toBeNull();
  });
});