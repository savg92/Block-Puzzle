import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const LoadingScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.back(1.5)) 
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={[styles.logoContainer, { backgroundColor: isDark ? theme.colors.surface : '#ffffff' }]}>
            <Image 
                source={require('../../assets/splash-png.png')} 
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
        <Text 
          style={[
            styles.title, 
            { color: isDark ? '#ffffff' : '#000000' }
          ]}
        >
          Block Puzzle
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#ffffff', 
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: 24,
    // Add shadow and border for better visibility on white backgrounds
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 10,
  },
});
