import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../components/Grid/Grid';
import { ScoreDisplay } from '../components/UI/ScoreDisplay';
import { PieceTray } from '../components/PieceTray/PieceTray';
import { PowerUpBar } from '../components/PowerUps/PowerUpBar';
import { GameOverModal } from '../components/UI/GameOverModal';
import { SettingsScreen } from './SettingsScreen';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../store/gameStore';

export const GameScreen: React.FC = () => {
  const { newGame, availablePieces, activePowerUpMode } = useGameStore();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

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
      <SettingsScreen visible={isSettingsVisible} onClose={() => setIsSettingsVisible(false)} />
      
      {/* Top Section: Score & Title */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Block Puzzle</Text>
        <ScoreDisplay />
        
        <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => {
                  Alert.alert(
                      "Restart Game",
                      "Are you sure you want to restart? Current progress will be lost.",
                      [
                          { text: "Cancel", style: "cancel" },
                          { text: "Restart", style: "destructive", onPress: () => newGame() }
                      ]
                  );
              }}
              style={styles.iconButton}
              testID="restart-button"
            >
              <Text style={styles.iconText}>🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsSettingsVisible(true)} 
              style={styles.iconButton}
              testID="settings-button"
            >
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
        </View>
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
    position: 'relative',
    width: '100%',
  },
  headerButtons: {
    position: 'absolute',
    right: 20,
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Removed old settingsButton style in favor of iconButton
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // blue-500
    marginBottom: 10,
    marginTop: 10, // Add space for buttons
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