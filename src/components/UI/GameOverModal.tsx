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
import { useTheme } from '../../styles/ThemeContext';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

export const GameOverModal: React.FC = () => {
  const { theme } = useTheme();
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

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.isDark ? 'rgba(2, 6, 23, 0.85)' : 'rgba(15, 23, 42, 0.7)',
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
      textShadowColor: theme.isDark ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.3)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    scoreSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 32,
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      padding: 16,
      opacity: 0.8,
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
      color: theme.colors.text.inverse,
      fontSize: 20,
      fontWeight: '900',
    },
  });

  if (!shouldRender) return null;

  return (
    <Modal
      transparent
      visible={shouldRender}
      animationType="none"
    >
      <View style={dynamicStyles.overlay}>
        <Animated.View style={[dynamicStyles.container, animatedStyle]}>
          <Text style={dynamicStyles.title}>GAME OVER</Text>
          
          <View style={dynamicStyles.scoreSection}>
            <View style={dynamicStyles.scoreItem}>
              <Text style={dynamicStyles.scoreLabel}>SCORE</Text>
              <Text style={dynamicStyles.scoreValue}>{score}</Text>
            </View>
            <View style={dynamicStyles.scoreItem}>
              <Text style={dynamicStyles.scoreLabel}>BEST</Text>
              <Text style={dynamicStyles.scoreValue}>{highScore}</Text>
            </View>
          </View>

          <TouchableOpacity style={dynamicStyles.mainButton} onPress={handleNewGame}>
            <Text style={dynamicStyles.mainButtonText}>NEW GAME</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};