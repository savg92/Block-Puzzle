import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  Easing,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useGameStore } from '../../store/gameStore';
import { theme } from '../../styles/theme';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

export const GameOverModal: React.FC = () => {
  const { isGameOver, score, highScore, powerUps, usePowerUp, newGame } = useGameStore();
  const [shouldRender, setShouldRender] = useState(isGameOver);
  const { playTap } = useSensoryFeedback();

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isGameOver) {
      setShouldRender(true);
      scale.value = withSpring(1);
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0);
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [isGameOver]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleNewGame = () => {
    playTap();
    newGame();
  };

  if (!shouldRender) return null;

  return (
    <Modal
      transparent
      visible={shouldRender}
      animationType="none"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Text style={styles.title}>GAME OVER</Text>
          
          <View style={styles.scoreSection}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>BEST</Text>
              <Text style={styles.scoreValue}>{highScore}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.mainButton} onPress={handleNewGame}>
            <Text style={styles.mainButtonText}>NEW GAME</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.error,
    marginBottom: 24,
    fontStyle: 'italic',
    textShadowColor: 'rgba(239, 68, 68, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 16,
    padding: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreValue: {
    color: theme.colors.text.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  mainButtonText: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: '900',
  },
});