import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useGameStore, UserPreferences } from '../store/gameStore';
import { useTheme } from '../styles/ThemeContext';
import { useSensoryFeedback } from '../hooks/useSensoryFeedback';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { preferences, updatePreferences } = useGameStore();
  const { playTap } = useSensoryFeedback();

  const handleIntensityChange = (intensity: UserPreferences['hapticIntensity']) => {
    playTap();
    updatePreferences({ hapticIntensity: intensity });
  };

  const handleThemeChange = (newTheme: UserPreferences['theme']) => {
    playTap();
    updatePreferences({ theme: newTheme });
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.primary,
      letterSpacing: 2,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      color: theme.colors.text.secondary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    scroll: {
      flexGrow: 0,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
    },
    rowLabel: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    buttonGroup: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 4,
    },
    groupButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    groupButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    groupButtonText: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    groupButtonTextActive: {
      color: theme.colors.text.inverse,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.overlay}>
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.title}>SETTINGS</Text>
            <TouchableOpacity onPress={() => { playTap(); onClose(); }} style={dynamicStyles.closeButton}>
              <Text style={dynamicStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={dynamicStyles.scroll}>
            {/* Sound Section */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Sound</Text>
              <View style={dynamicStyles.row}>
                <Text style={dynamicStyles.rowLabel}>Mute Sound</Text>
                <Switch
                  testID="mute-toggle"
                  value={preferences.isMuted}
                  onValueChange={(value) => {
                    playTap();
                    updatePreferences({ isMuted: value });
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.isMuted ? theme.colors.text.inverse : theme.colors.text.secondary}
                />
              </View>
            </View>

            {/* Haptics Section */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Haptics</Text>
              <View style={dynamicStyles.buttonGroup}>
                {(['off', 'low', 'medium', 'high'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => handleIntensityChange(level)}
                    style={[
                      dynamicStyles.groupButton,
                      preferences.hapticIntensity === level && dynamicStyles.groupButtonActive
                    ]}
                  >
                    <Text style={[
                      dynamicStyles.groupButtonText,
                      preferences.hapticIntensity === level && dynamicStyles.groupButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Theme Section */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Theme</Text>
              <View style={dynamicStyles.buttonGroup}>
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => handleThemeChange(t)}
                    style={[
                      dynamicStyles.groupButton,
                      preferences.theme === t && dynamicStyles.groupButtonActive
                    ]}
                  >
                    <Text style={[
                      dynamicStyles.groupButtonText,
                      preferences.theme === t && dynamicStyles.groupButtonTextActive
                    ]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Visuals Section */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Visuals</Text>
              <View style={dynamicStyles.row}>
                <Text style={dynamicStyles.rowLabel}>Show Piece Shadow</Text>
                <Switch
                  testID="shadow-toggle"
                  value={preferences.showPieceShadow}
                  onValueChange={(value) => {
                    playTap();
                    updatePreferences({ showPieceShadow: value });
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.showPieceShadow ? theme.colors.text.inverse : theme.colors.text.secondary}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
