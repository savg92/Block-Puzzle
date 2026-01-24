import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withDelay, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useGameStore } from '../../store/gameStore';
import { POWER_UP_METADATA } from '../../store/powerUpMetadata';
import { useTheme } from '../../styles/ThemeContext';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

const { width } = Dimensions.get('window');

export const PowerUpNotification: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { lastEarnedPowerUp, notificationId, clearNotification } = useGameStore();
  const { playSuccess } = useSensoryFeedback();
  
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const [visiblePowerUp, setVisiblePowerUp] = useState(lastEarnedPowerUp);

  useEffect(() => {
    if (lastEarnedPowerUp) {
      setVisiblePowerUp(lastEarnedPowerUp);
      playSuccess();

      // Start animation
      translateY.value = withSequence(
        withSpring(50, { damping: 15 }),
        withDelay(2000, withSpring(-100, { damping: 15 }, (finished) => {
          if (finished) {
            runOnJS(clearNotification)();
          }
        }))
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 300 }))
      );

      scale.value = withSequence(
        withSpring(1, { damping: 15 }),
        withDelay(2000, withSpring(0.8, { damping: 15 }))
      );
    }
  }, [notificationId]); // Trigger on every new notification

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  if (!visiblePowerUp) return null;

  const metadata = POWER_UP_METADATA[visiblePowerUp];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1000,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
      maxWidth: width - 40,
    },
    icon: {
      fontSize: 24,
      marginRight: 12,
    },
    content: {
      flexDirection: 'column',
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    subtitle: {
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.toast, animatedStyle]}>
        <Text style={styles.icon}>{metadata.icon}</Text>
        <View style={styles.content}>
          <Text style={styles.title}>Power-Up Earned!</Text>
          <Text style={styles.subtitle}>{metadata.label}: {metadata.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};
