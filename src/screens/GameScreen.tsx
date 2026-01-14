import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../components/Grid/Grid';
import { StatusBar } from 'expo-status-bar';

export const GameScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Section: Score & Title */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Block Puzzle</Text>
        <View testID="score-container" style={styles.scorePlaceholder}>
          {/* ScoreDisplay will go here */}
          <Text style={styles.placeholderText}>Score: 0</Text>
        </View>
      </View>

      {/* Center Section: Grid */}
      <View style={styles.gridSection}>
        <View testID="game-grid">
          <Grid />
        </View>
      </View>

      {/* Bottom Section: Piece Tray */}
      <View style={styles.bottomSection}>
        <View testID="piece-tray" style={styles.trayPlaceholder}>
          {/* PieceTray will go here */}
          <Text style={styles.placeholderText}>Piece Tray</Text>
        </View>
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
  scorePlaceholder: {
    padding: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  gridSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  trayPlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});
