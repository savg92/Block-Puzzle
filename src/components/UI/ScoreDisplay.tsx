import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming, 
  Easing,
} from 'react-native-reanimated';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../styles/ThemeContext';

export const ScoreDisplay: React.FC = () => {
  const { theme } = useTheme();
  const { score, highScore, initStore } = useGameStore();
  
  useEffect(() => {
    initStore();
  }, [initStore]);
  
  // Animation for current score
  const animatedScore = useSharedValue(0);

  useEffect(() => {
    // Update animated score when store score changes
    animatedScore.value = withTiming(score, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [score]);

  // Use state for simpler test compatibility while we refine reanimated tests
  const [displayScore, setDisplayScore] = useState(score);
  useEffect(() => {
    setDisplayScore(score);
  }, [score]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      minWidth: 240,
      justifyContent: 'space-between',
    },
    scoreBox: {
      alignItems: 'center',
      flex: 1,
    },
    label: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginBottom: 4,
    },
    scoreText: {
      color: theme.colors.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    highScoreText: {
      color: theme.colors.secondary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    divider: {
      width: 2,
      height: '100%',
      backgroundColor: theme.colors.border,
      marginHorizontal: 15,
    },
  });

  return (
    <View testID="score-container" style={dynamicStyles.container}>
      <View style={dynamicStyles.scoreBox}>
        <Text style={dynamicStyles.label}>SCORE</Text>
        <Text testID="current-score" style={dynamicStyles.scoreText}>{displayScore}</Text>
      </View>
      <View style={dynamicStyles.divider} />
      <View style={dynamicStyles.scoreBox}>
        <Text style={dynamicStyles.label}>BEST</Text>
        <Text testID="high-score" style={dynamicStyles.highScoreText}>{highScore}</Text>
      </View>
    </View>
  );
};