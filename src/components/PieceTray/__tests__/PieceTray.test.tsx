import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PieceTray } from '../PieceTray';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useGameStore } from '../../../store/gameStore';

// Mock sensory feedback
const mockPlayPlace = jest.fn();
const mockPlayClear = jest.fn();
const mockPlayGameOver = jest.fn();
const mockPlayTap = jest.fn();

jest.mock('../../../hooks/useSensoryFeedback', () => ({
  useSensoryFeedback: () => ({
    playPlace: mockPlayPlace,
    playClear: mockPlayClear,
    playGameOver: mockPlayGameOver,
    playTap: mockPlayTap,
  }),
}));

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

// Mock DraggablePiece to easily trigger handleDragEnd
jest.mock('../../Piece/DraggablePiece', () => {
  const { View } = require('react-native');
  return {
    DraggablePiece: ({ onDragEnd, onPress }: any) => (
      <View 
        testID="draggable-piece" 
        onTouchEnd={() => onDragEnd(100, 200, { row: 0, col: 0 })}
        onTouchStart={onPress}
      />
    ),
  };
});

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

describe('PieceTray', () => {
  const mockPieces = [[[1]], null, [[1, 1]]];
  const mockSelectPiece = jest.fn();
  const mockPlacePiece = jest.fn();
  const mockDiscardPiece = jest.fn();
  const mockSetClearingCells = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      availablePieces: mockPieces,
      selectedPiece: null,
      selectPiece: mockSelectPiece,
      gridLayout: { x: 0, y: 0, width: 300, height: 300 },
      placePiece: mockPlacePiece,
      activePowerUpMode: null,
      discardPiece: mockDiscardPiece,
      setClearingCells: mockSetClearingCells,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
        showPieceShadow: true,
      },
    });
  });

  it('renders pieces and placeholders', () => {
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const items = getAllByTestId('piece-tray-item');
    expect(items).toHaveLength(2); // Only non-null pieces have this testID
  });

  it('handles successful piece placement', () => {
    mockPlacePiece.mockReturnValue({ success: true, clearedLines: 0, isGameOver: false });
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchEnd');
    
    expect(mockPlacePiece).toHaveBeenCalled();
    expect(mockSelectPiece).toHaveBeenCalledWith(null);
    expect(mockPlayPlace).toHaveBeenCalled();
  });

  it('handles game over during placement', () => {
    mockPlacePiece.mockReturnValue({ success: true, clearedLines: 0, isGameOver: true });
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchEnd');
    
    expect(mockPlacePiece).toHaveBeenCalled();
    expect(mockPlayGameOver).toHaveBeenCalled();
  });

  it('handles line clearing animation', () => {
    jest.useFakeTimers();
    mockPlacePiece.mockReturnValue({ 
      success: true, 
      clearedLines: 1, 
      isGameOver: false,
      fullRows: [0],
      fullCols: []
    });
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchEnd');
    
    expect(mockSetClearingCells).toHaveBeenCalledWith({ rows: [0], cols: [] });
    
    act(() => {
      jest.advanceTimersByTime(150);
    });
    
    expect(mockSetClearingCells).toHaveBeenCalledWith(null);
    jest.useRealTimers();
  });

  it('handles discard powerup', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      availablePieces: mockPieces,
      selectedPiece: null,
      selectPiece: mockSelectPiece,
      activePowerUpMode: 'discard',
      discardPiece: mockDiscardPiece,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
        showPieceShadow: true,
      },
    });

    mockDiscardPiece.mockReturnValue(true);
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchStart'); // DraggablePiece mock calls onPress on touchStart
    
    expect(mockDiscardPiece).toHaveBeenCalledWith(0);
  });

  it('handles unsuccessful piece placement', () => {
    mockPlacePiece.mockReturnValue({ success: false, clearedLines: 0, isGameOver: false });
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchEnd');
    
    expect(mockPlacePiece).toHaveBeenCalled();
    expect(mockPlayPlace).not.toHaveBeenCalled();
  });

  it('handles discard powerup failure', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      availablePieces: mockPieces,
      selectedPiece: null,
      selectPiece: mockSelectPiece,
      activePowerUpMode: 'discard',
      discardPiece: mockDiscardPiece,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
        showPieceShadow: true,
      },
    });

    mockDiscardPiece.mockReturnValue(false); // Failed
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const pieces = getAllByTestId('draggable-piece');
    
    fireEvent(pieces[0], 'touchStart');
    
    expect(mockDiscardPiece).toHaveBeenCalledWith(0);
    expect(mockPlayTap).not.toHaveBeenCalled();
  });
});