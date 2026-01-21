import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useGameStore, UserPreferences } from '../store/gameStore';
import { theme } from '../styles/theme';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const { preferences, updatePreferences } = useGameStore();

  const handleIntensityChange = (intensity: UserPreferences['hapticIntensity']) => {
    updatePreferences({ hapticIntensity: intensity });
  };

  const handleThemeChange = (newTheme: UserPreferences['theme']) => {
    updatePreferences({ theme: newTheme });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>SETTINGS</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* Sound Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sound</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Mute Sound</Text>
                <Switch
                  testID="mute-toggle"
                  value={preferences.isMuted}
                  onValueChange={(value) => updatePreferences({ isMuted: value })}
                  trackColor={{ false: '#334155', true: theme.colors.primary }}
                  thumbColor={preferences.isMuted ? '#fff' : '#94a3b8'}
                />
              </View>
            </View>

            {/* Haptics Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Haptics</Text>
              <View style={styles.buttonGroup}>
                {(['off', 'low', 'medium', 'high'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => handleIntensityChange(level)}
                    style={[
                      styles.groupButton,
                      preferences.hapticIntensity === level && styles.groupButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.groupButtonText,
                      preferences.hapticIntensity === level && styles.groupButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Theme Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Theme</Text>
              <View style={styles.buttonGroup}>
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => handleThemeChange(t)}
                    style={[
                      styles.groupButton,
                      preferences.theme === t && styles.groupButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.groupButtonText,
                      preferences.theme === t && styles.groupButtonTextActive
                    ]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
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
    backgroundColor: '#1e293b',
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
    backgroundColor: '#1e293b',
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
    color: '#fff',
  },
});
