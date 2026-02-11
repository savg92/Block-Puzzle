import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../components/Grid/Grid';
import { ScoreDisplay } from '../components/UI/ScoreDisplay';
import { PieceTray } from '../components/PieceTray/PieceTray';
import { PowerUpBar } from '../components/PowerUps/PowerUpBar';
import { GameOverModal } from '../components/UI/GameOverModal';
import { PowerUpNotification } from '../components/UI/PowerUpNotification';
import { SettingsScreen } from './SettingsScreen';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../styles/ThemeContext';
import { audioManager } from '../utils/audio';

export const GameScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { newGame, availablePieces, activePowerUpMode, isAudioUnlocked, unlockAudio } = useGameStore();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    // Initialize game if no pieces are available (e.g. first launch)
    if (availablePieces.length === 0) {
      newGame();
    }
  }, [availablePieces.length, newGame]);

  const handleUnlockAudio = () => {
    audioManager.playSound('tap');
    unlockAudio();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    iconButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    iconText: {
      fontSize: 22,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 10,
      marginTop: 10,
    },
    gridSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeGridSection: {
      borderColor: theme.colors.primary,
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.05)',
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
      borderColor: theme.colors.error,
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(220, 38, 38, 0.05)',
    },
    webAudioOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    webAudioText: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    webAudioSubText: {
      color: '#cccccc',
      fontSize: 16,
      marginTop: 10,
    }
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <GameOverModal />
      <PowerUpNotification />
      <SettingsScreen visible={isSettingsVisible} onClose={() => setIsSettingsVisible(false)} />
      
      {Platform.OS === 'web' && !isAudioUnlocked && (
        <TouchableOpacity 
          activeOpacity={1} 
          style={dynamicStyles.webAudioOverlay} 
          onPress={handleUnlockAudio}
        >
          <Text style={dynamicStyles.webAudioText}>Tap to Start</Text>
          <Text style={dynamicStyles.webAudioSubText}>Unlocks audio for web play</Text>
        </TouchableOpacity>
      )}

      {/* Top Section: Score & Title */}
      <View style={dynamicStyles.topSection}>
        <Text style={dynamicStyles.title}>Block Puzzle</Text>
        <ScoreDisplay />
        
        <View style={dynamicStyles.headerButtons}>
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
              style={dynamicStyles.iconButton}
              testID="restart-button"
            >
              <Text style={dynamicStyles.iconText}>🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsSettingsVisible(true)} 
              style={dynamicStyles.iconButton}
              testID="settings-button"
            >
              <Text style={dynamicStyles.iconText}>⚙️</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Center Section: Grid */}
      <View style={[
        dynamicStyles.gridSection,
        (activePowerUpMode === 'addSingle' || activePowerUpMode === 'forcePlace') && dynamicStyles.activeGridSection
      ]}>
        <View testID="game-grid">
          <Grid />
        </View>
      </View>

      {/* Bottom Section: Piece Tray */}
      <View style={[
        dynamicStyles.bottomSection,
        activePowerUpMode === 'discard' && dynamicStyles.activeTraySection
      ]}>
        <PieceTray />
      </View>

      {/* Power-Ups Bar */}
      <PowerUpBar />
    </SafeAreaView>
  );
};