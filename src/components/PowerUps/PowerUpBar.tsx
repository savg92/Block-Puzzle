import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore, PowerUpType } from '../../store/gameStore';
import { useTheme } from '../../styles/ThemeContext';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

interface PowerUpButtonProps {
  type: PowerUpType;
  icon: string;
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

const PowerUpButton: React.FC<PowerUpButtonProps> = ({ type, icon, label, count, isActive, onPress }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  // Use useMemo for persistent dynamic styles
  const buttonStyles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
      minWidth: 64,
      position: 'relative',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activeButton: {
      backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
      borderColor: theme.colors.primary,
    },
    disabledButton: {
      opacity: 0.4,
    },
    icon: {
      fontSize: 20,
      marginBottom: 4,
    },
    label: {
      fontSize: 10,
      color: theme.colors.text.secondary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.accent,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.background,
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: 10,
      fontWeight: '900',
    },
  });

  React.useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1, // infinite
        true
      );
    } else {
      scale.value = withTiming(1);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isActive ? theme.colors.primary : 'transparent',
    borderWidth: 1,
  }));
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={count <= 0}
    >
      <Animated.View style={[
        buttonStyles.button,
        isActive && buttonStyles.activeButton,
        count <= 0 && buttonStyles.disabledButton,
        animatedStyle
      ]}>
        <Text style={buttonStyles.icon}>{icon}</Text>
        <Text style={buttonStyles.label}>{label}</Text>
        <View style={buttonStyles.badge}>
          <Text style={buttonStyles.badgeText}>{count}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PowerUpBar: React.FC = () => {
  const { theme } = useTheme();
  const { powerUps, usePowerUp, undo, activePowerUpMode } = useGameStore();
  const { playTap } = useSensoryFeedback();

  const handlePress = (type: PowerUpType) => {
    playTap();
    if (type === 'undo') {
      undo();
    }
    else {
      usePowerUp(type);
    }
  };

  const handleCancel = () => {
    playTap();
    // Calling usePowerUp with the current type will toggle it off in our store logic
    if (activePowerUpMode) {
      usePowerUp(activePowerUpMode);
    }
  };

  const barStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: theme.isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 80,
    },
    activeModeContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    activeModeText: {
      color: theme.colors.primary,
      fontWeight: '900',
      fontSize: 14,
      letterSpacing: 1,
    },
    cancelButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: '900',
      fontSize: 12,
    },
  });

  return (
    <View style={barStyles.container}>
      {activePowerUpMode ? (
        <View style={barStyles.activeModeContainer}>
          <Text style={barStyles.activeModeText}>
            {activePowerUpMode === 'discard' && 'TAP A PIECE TO DISCARD'}
            {activePowerUpMode === 'forcePlace' && 'PLACE PIECE ANYWHERE'}
            {activePowerUpMode === 'addSingle' && 'TAP GRID TO PLACE BLOCK'}
          </Text>
          <TouchableOpacity onPress={handleCancel} style={barStyles.cancelButton}>
            <Text style={barStyles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <PowerUpButton 
            type="undo"
            icon="↩️"
            label="Undo"
            count={powerUps.undo}
            isActive={false}
            onPress={() => handlePress('undo')}
          />
          <PowerUpButton 
            type="rotate"
            icon="🔄"
            label="Rotate"
            count={powerUps.rotate}
            isActive={false}
            onPress={() => handlePress('rotate')}
          />
          <PowerUpButton 
            type="discard"
            icon="🗑️"
            label="Discard"
            count={powerUps.discard}
            isActive={activePowerUpMode === 'discard'}
            onPress={() => handlePress('discard')}
          />
          <PowerUpButton 
            type="forcePlace"
            icon="⚡"
            label="Force"
            count={powerUps.forcePlace}
            isActive={activePowerUpMode === 'forcePlace'}
            onPress={() => handlePress('forcePlace')}
          />
          <PowerUpButton 
            type="addSingle"
            icon="➕"
            label="Single"
            count={powerUps.addSingle}
            isActive={activePowerUpMode === 'addSingle'}
            onPress={() => handlePress('addSingle')}
          />
        </>
      )}
    </View>
  );
};
