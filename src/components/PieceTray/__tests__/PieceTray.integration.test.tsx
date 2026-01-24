import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PieceTray } from '../PieceTray';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { useGameStore } from '../../../store/gameStore';
import { useSensoryFeedback } from '../../../hooks/useSensoryFeedback';

// Mock everything needed
jest.mock('../../../store/gameStore');
jest.mock('../../../hooks/useSensoryFeedback');

describe('PieceTray Integration', () => {
  const mockPlacePiece = jest.fn();
  const mockSelectPiece = jest.fn();
  const mockSetClearingCells = jest.fn();
  const mockSetHoverPosition = jest.fn();
  const mockPlayPlace = jest.fn();
  
  const mockPieces = [[[1]]]; // SINGLE piece

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as any).mockImplementation((selector?: any) => {
      const state = {
        availablePieces: mockPieces,
        selectedPiece: null,
        selectPiece: mockSelectPiece,
        gridLayout: { x: 0, y: 0, width: 300, height: 300 },
        placePiece: mockPlacePiece,
        activePowerUpMode: null,
        discardPiece: jest.fn(),
        setClearingCells: mockSetClearingCells,
        setHoverPosition: mockSetHoverPosition,
      };
      return selector ? selector(state) : state;
    });
    (useSensoryFeedback as any).mockReturnValue({
      playPlace: mockPlayPlace,
      playClear: jest.fn(),
      playGameOver: jest.fn(),
      playTap: jest.fn(),
      playPickup: jest.fn(),
    });
  });

  it('calls placePiece and playPlace on successful drop', () => {
    mockPlacePiece.mockReturnValue({ success: true, clearedLines: 0 });
    
    const { getAllByTestId } = render(
      <ThemeProvider>
        <PieceTray />
      </ThemeProvider>
    );

    const draggables = getAllByTestId('draggable-piece');
    
    // Simulate drop at specific grid coordinates
    // onDragEnd(centerX, centerY, topLeftX, topLeftY) -> gridPos is pre-calculated by DraggablePiece internal toGridPos
    // But since we use the exposed onDragEnd on the View, we can pass what it expects.
    // The exposed onDragEnd in DraggablePiece is: (centerX, centerY, topLeftX, topLeftY) => { ... }
    
    // centerX=15, centerY=15 should map to row 0, col 0 in our 300x300 grid (10 cells of 30px)
    fireEvent(draggables[0], 'dragEnd', 15, 15, 0, 0);

    expect(mockPlacePiece).toHaveBeenCalled();
    expect(mockPlayPlace).toHaveBeenCalled();
    expect(mockSelectPiece).toHaveBeenCalledWith(null);
  });

  it('selects piece on drag start and deselects on end', () => {
    const { getAllByTestId } = render(
      <ThemeProvider>
        <PieceTray />
      </ThemeProvider>
    );

    const draggables = getAllByTestId('draggable-piece');
    
    // Simulate drag start
    fireEvent(draggables[0], 'dragStart');
    expect(mockSelectPiece).toHaveBeenCalledWith(mockPieces[0]);

    // Simulate drag end
    fireEvent(draggables[0], 'dragEnd', 0, 0, 0, 0);
    expect(mockSelectPiece).toHaveBeenCalledWith(null);
  });
});
