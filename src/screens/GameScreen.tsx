import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../components/Grid/Grid';
import { ScoreDisplay } from '../components/UI/ScoreDisplay';
import { PieceTray } from '../components/PieceTray/PieceTray';
import { PowerUpBar } from '../components/PowerUps/PowerUpBar';
import { GameOverModal } from '../components/UI/GameOverModal';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../store/gameStore';

export const GameScreen: React.FC = () => {
  const { newGame, availablePieces, activePowerUpMode } = useGameStore();

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
      <View style={[
        styles.gridSection,
        (activePowerUpMode === 'addSingle' || activePowerUpMode === 'forcePlace') && styles.activeGridSection
      ]}>
        <View testID="game-grid">
          <Grid />
        </View>
      </View>

      {/* Bottom Section: Piece Tray */}
      <View style={[
        styles.bottomSection,
        activePowerUpMode === 'discard' && styles.activeTraySection
      ]}>
        <PieceTray />
      </View>

      {/* Power-Ups Bar */}
      <PowerUpBar />
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeGridSection: {
    borderColor: '#3b82f6', // blue-500 highlight
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  bottomSection: {
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
    zIndex: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeTraySection: {
    borderColor: '#ef4444', // red-500 for discard
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
});