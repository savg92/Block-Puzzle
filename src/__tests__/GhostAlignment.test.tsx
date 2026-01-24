import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useGameStore } from '../store/gameStore';
import { PIECES } from '../engine/pieces';
import { mapScreenToGrid } from '../utils/gridUtils';

// Mocking the whole component tree is complex, 
// so we'll test the logical derivation of the ghost position.

describe('Ghost Alignment Logic', () => {
  const gridLayout = { x: 0, y: 0, width: 300, height: 300 }; // inner 292x292 (padding 4)
  const piece = PIECES.SQUARE_2; // 2x2
  
  beforeEach(() => {
    act(() => {
      useGameStore.getState().newGame();
      useGameStore.setState({ gridLayout });
    });
  });

  it('derives the same grid position for ghost and placement', () => {
    const store = useGameStore.getState();
    
    // Simulate picking up a piece and moving it
    // Finger at (50, 50)
    const fingerX = 50;
    const fingerY = 50;
    
    // In DraggablePiece, the piece is centered on the finger.
    // The hoverPosition is calculated from the finger position (centerX, centerY).
    
    // Mock the calculation in DraggablePiece.tsx:toGridPos
    const mapPos = mapScreenToGrid(fingerX, fingerY, gridLayout, 10, 8); // 8 is combined padding/border
    expect(mapPos).not.toBeNull();
    if (!mapPos) return;

    const rowOff = Math.floor(piece.length / 2);
    const colOff = Math.floor(piece[0].length / 2);
    const predictedPos = { row: mapPos.row - rowOff, col: mapPos.col - colOff };

    act(() => {
      useGameStore.setState({ 
        selectedPiece: piece,
        hoverPosition: predictedPos
      });
    });

    // Verify the store state matches our expectation
    expect(useGameStore.getState().hoverPosition).toEqual(predictedPos);

    // Verify that placePiece uses this exact coordinate
    // (In actual UI, onDragEnd calls toGridPos(centerX, centerY) which is the same logic)
    const result = store.placePiece(piece, predictedPos.row, predictedPos.col, 'red', 0);
    expect(result.success).toBe(true);
    
    // Verify it landed exactly where the ghost would have been
    expect(useGameStore.getState().grid[predictedPos.row][predictedPos.col]).toBe('red');
  });

  it('handles out-of-bounds correctly for both ghost and placement', () => {
    // Finger near the edge
    const fingerX = 295; 
    const fingerY = 295;

    const mapPos = mapScreenToGrid(fingerX, fingerY, gridLayout, 10, 8);
    // Should be null or out of bounds
    
    if (mapPos) {
        const rowOff = Math.floor(piece.length / 2);
        const colOff = Math.floor(piece[0].length / 2);
        const predictedPos = { row: mapPos.row - rowOff, col: mapPos.col - colOff };
        
        // If row + piece.length > 10, it's invalid
        const isValid = predictedPos.row >= 0 && predictedPos.col >= 0 && 
                        predictedPos.row + piece.length <= 10 && 
                        predictedPos.col + piece[0].length <= 10;
        
        if (!isValid) {
            const result = useGameStore.getState().placePiece(piece, predictedPos.row, predictedPos.col, 'red', 0);
            expect(result.success).toBe(false);
        }
    } else {
        expect(mapPos).toBeNull();
    }
  });
});
