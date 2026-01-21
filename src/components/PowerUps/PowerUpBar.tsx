import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore, PowerUpType } from '../../store/gameStore';
import { theme } from '../../styles/theme';

interface PowerUpButtonProps {
  type: PowerUpType;
  icon: string;
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

const PowerUpButton: React.FC<PowerUpButtonProps> = ({ type, icon, label, count, isActive, onPress }) => {
  const isDisabled = count <= 0 && type !== 'undo'; // undo is special as it's an immediate action check
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={count <= 0}
      style={[
        styles.button,
        isActive && styles.activeButton,
        count <= 0 && styles.disabledButton
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const PowerUpBar: React.FC = () => {
  const { powerUps, usePowerUp, undo, activePowerUpMode } = useGameStore();

  const handlePress = (type: PowerUpType) => {
    if (type === 'undo') {
      undo();
    } else {
      usePowerUp(type);
    }
  };

  const handleCancel = () => {
    // Calling usePowerUp with the current type will toggle it off in our store logic
    if (activePowerUpMode) {
      usePowerUp(activePowerUpMode);
    }
  };

  return (
    <View style={styles.container}>
      {activePowerUpMode ? (
        <View style={styles.activeModeContainer}>
          <Text style={styles.activeModeText}>
            {activePowerUpMode === 'discard' && 'TAP A PIECE TO DISCARD'}
            {activePowerUpMode === 'forcePlace' && 'PLACE PIECE ANYWHERE'}
            {activePowerUpMode === 'addSingle' && 'TAP GRID TO PLACE BLOCK'}
          </Text>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    minWidth: 64,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
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
