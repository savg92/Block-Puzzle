import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Grid } from '../Grid';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Grid', () => {
  const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));
  const mockSetGridLayout = jest.fn();
  const mockAddSingleBlock = jest.fn();
  const mockSetClearingCells = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: mockSetGridLayout,
      selectedPiece: null,
      hoverPosition: null,
      preferences: { showPieceShadow: true },
      activePowerUpMode: null,
      addSingleBlock: mockAddSingleBlock,
      clearingCells: null,
      setClearingCells: mockSetClearingCells,
    });
  });

  it('renders 100 cells for a 10x10 grid', () => {
    const { getAllByTestId } = renderWithTheme(<Grid />);
    const cells = getAllByTestId(/cell-\d+-\d+/);
    expect(cells).toHaveLength(100);
  });

  it('renders ghost piece when a piece is hovered', () => {
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: mockSetGridLayout,
      selectedPiece: [[1, 1]], 
      hoverPosition: { row: 0, col: 0 },
      clearingCells: null,
      preferences: { showPieceShadow: true },
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    expect(getByTestId('ghost-piece')).toBeTruthy();
  });

  it('does not render ghost piece if it goes out of bounds', () => {
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: mockSetGridLayout,
      selectedPiece: [[1, 1]], 
      hoverPosition: { row: 9, col: 9 }, // Bottom right corner, 1x2 won't fit horizontally
      clearingCells: null,
      preferences: { showPieceShadow: true },
    });

    const { queryByTestId } = renderWithTheme(<Grid />);
    expect(queryByTestId('ghost-piece')).toBeNull();
  });

  it('handles cell press in addSingle mode', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      activePowerUpMode: 'addSingle',
      addSingleBlock: mockAddSingleBlock,
      preferences: { showPieceShadow: true },
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    const cell = getByTestId('cell-0-0');
    
    mockAddSingleBlock.mockReturnValue({ success: true, clearedLines: 0, isGameOver: false });
    fireEvent.press(cell);
    
    expect(mockAddSingleBlock).toHaveBeenCalledWith(0, 0);
  });

  it('returns null ghost when out of bounds', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      selectedPiece: [[1, 1]],
      hoverPosition: { row: 9, col: 9 }, // Out of bounds for 1x2 piece
      gridLayout: { x: 0, y: 0, width: 300, height: 300 },
      preferences: { showPieceShadow: true },
    });

    const { queryByTestId } = renderWithTheme(<Grid />);
    expect(queryByTestId('ghost-piece')).toBeNull();
  });

  it('handles clearing cells animation after addSingleBlock', () => {
    jest.useFakeTimers();
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: mockSetGridLayout,
      selectedPiece: null,
      hoverPosition: null,
      activePowerUpMode: 'addSingle',
      addSingleBlock: mockAddSingleBlock,
      clearingCells: null,
      setClearingCells: mockSetClearingCells,
      preferences: { showPieceShadow: true },
    });

    mockAddSingleBlock.mockReturnValue({ 
      success: true, 
      clearedLines: 1, 
      isGameOver: false,
      fullRows: [5],
      fullCols: []
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    const cell = getByTestId('cell-5-5');
    fireEvent.press(cell);

    expect(mockSetClearingCells).toHaveBeenCalledWith({ rows: [5], cols: [] });
    
    act(() => {
      jest.advanceTimersByTime(150);
    });
    
    expect(mockSetClearingCells).toHaveBeenCalledWith(null);
    jest.useRealTimers();
  });

  it('measures grid layout on layout event', () => {
    const { getByTestId } = renderWithTheme(<Grid />);
    const container = getByTestId('grid-container');

    fireEvent(container, 'onLayout', {
      nativeEvent: { layout: { x: 10, y: 20, width: 300, height: 300 } }
    });

    expect(mockSetGridLayout).toHaveBeenCalledWith({ x: 10, y: 20, width: 300, height: 300 });
  });

  it('handles game over during addSingle', () => {
    const mockPlayGameOver = jest.fn();
    const mockPlayPlace = jest.fn();
    const mockPlayClear = jest.fn();
    
    // We need to mock useSensoryFeedback because it's used in Grid
    require('../../../hooks/useSensoryFeedback').useSensoryFeedback = () => ({
      playPlace: mockPlayPlace,
      playClear: mockPlayClear,
      playGameOver: mockPlayGameOver,
    });

    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      activePowerUpMode: 'addSingle',
      addSingleBlock: mockAddSingleBlock,
      preferences: { showPieceShadow: true },
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    const cell = getByTestId('cell-0-0');
    
    mockAddSingleBlock.mockReturnValue({ success: true, clearedLines: 0, isGameOver: true });
    fireEvent.press(cell);
    
    expect(mockPlayGameOver).toHaveBeenCalled();
  });

  it('does not show ghost if piece does not fit and not in forcePlace mode', () => {
    // Fill the grid to block placement
    const fullGrid = Array(10).fill(null).map(() => Array(10).fill('red'));
    (useGameStore as any).mockReturnValue({
      grid: fullGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      selectedPiece: [[1, 1]], 
      hoverPosition: { row: 0, col: 0 },
      activePowerUpMode: null,
      preferences: { showPieceShadow: true },
    });

    const { queryByTestId } = renderWithTheme(<Grid />);
    expect(queryByTestId('ghost-piece')).toBeNull();
  });

  it('shows ghost if in forcePlace mode even if piece does not fit', () => {
    const fullGrid = Array(10).fill(null).map(() => Array(10).fill('red'));
    (useGameStore as any).mockReturnValue({
      grid: fullGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      selectedPiece: [[1, 1]],
      hoverPosition: { row: 0, col: 0 },
      activePowerUpMode: 'forcePlace',
      preferences: { showPieceShadow: true },
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    expect(getByTestId('ghost-piece')).toBeTruthy();
  });

  it('does not show ghost if showPieceShadow is disabled', () => {
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: mockSetGridLayout,
      selectedPiece: [[1]],
      hoverPosition: { row: 0, col: 0 },
      preferences: { showPieceShadow: false },
      activePowerUpMode: null,
      addSingleBlock: mockAddSingleBlock,
      clearingCells: null,
      setClearingCells: mockSetClearingCells,
    });

    const { queryByTestId } = renderWithTheme(<Grid />);
    expect(queryByTestId('ghost-piece')).toBeNull();
  });
});

