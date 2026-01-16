import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../components/Grid/Grid';
import { ScoreDisplay } from '../components/UI/ScoreDisplay';
import { PieceTray } from '../components/PieceTray/PieceTray';
import { GameOverModal } from '../components/UI/GameOverModal';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../store/gameStore';

export const GameScreen: React.FC = () => {
  const { newGame, availablePieces } = useGameStore();

  useEffect(() => {
    // Initialize game if no pieces are available (e.g. first launch)
    if (availablePieces.length === 0) {
      newGame();
    }
  }, [availablePieces.length, newGame]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <GameOverModal />
      
      {/* Top Section: Score & Title */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Block Puzzle</Text>
        <ScoreDisplay />
      </View>

      {/* Center Section: Grid */}
      <View style={styles.gridSection}>
        <View testID="game-grid">
          <Grid />
        </View>
      </View>

      {/* Bottom Section: Piece Tray */}
      <View style={styles.bottomSection}>
        <PieceTray />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
  },
  topSection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // blue-500
    marginBottom: 10,
  },
  gridSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
    zIndex: 100,
  },
});