import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
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
import { useResponsiveSize } from '../../hooks/useResponsiveSize';


export const PowerUpNotification: React.FC = () => {
  const { theme } = useTheme();
  const { lastEarnedPowerUp, notificationId, clearNotification } = useGameStore();
  const { playSuccess } = useSensoryFeedback();
  const { width } = useWindowDimensions();
  const rs = useResponsiveSize();
  
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
  }, [notificationId, lastEarnedPowerUp, playSuccess, translateY, clearNotification, opacity, scale]); // Trigger on every new notification

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
      boxShadow: '0 4px 5px rgba(0,0,0,0.3)',
      elevation: 8,
      maxWidth: width - Math.floor(40 * rs.scale),
    },
    icon: {
      fontSize: Math.floor(24 * rs.scale),
      marginRight: Math.floor(12 * rs.scale),
    },
    content: {
      flexDirection: 'column',
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      fontSize: rs.notificationTitleSize,
    },
    subtitle: {
      color: theme.colors.text.secondary,
      fontSize: rs.notificationSubSize,
    },
  });

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
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
