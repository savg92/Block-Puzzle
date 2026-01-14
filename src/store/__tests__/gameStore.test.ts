import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  it('should have correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.grid).toHaveLength(10);
    expect(state.grid[0]).toHaveLength(10);
    expect(state.score).toBe(0);
    expect(state.availablePieces).toHaveLength(0);
    expect(state.isGameOver).toBe(false);
  });

  it('should reset game state', () => {
    // Manually set some state
    useGameStore.setState({
      score: 100,
      isGameOver: true,
    });

    useGameStore.getState().resetGame();

    const state = useGameStore.getState();
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
  });
});
