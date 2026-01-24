import React, { memo, useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';

interface CellProps {
  color?: string | number | null;
  size?: number;
  testID?: string;
  onPress?: () => void;
  isClearing?: boolean;
}

export const Cell: React.FC<CellProps> = memo(({ color, size = 30, testID, onPress, isClearing }) => {
  const isFilled = typeof color === 'string';
  const isEmpty = !color || color === 0;
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isClearing) {
      scale.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.back(1.5)) });
      opacity.value = withTiming(0, { duration: 150 });
    } else {
      // Reset or animate in
      if (isFilled && scale.value === 0) {
        scale.value = 0;
        scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
        opacity.value = 1;
      } else {
        scale.value = 1;
        opacity.value = 1;
      }
    }
  }, [isClearing, isFilled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Animated.View
        testID={testID}
        style={[
          {
            width: size,
            height: size,
            borderRadius: 4,
            margin: 1,
            backgroundColor: isFilled ? (color as string) : (isEmpty ? '#1e293b' : 'transparent'),
            borderColor: isFilled ? 'rgba(255,255,255,0.3)' : '#334155',
            borderWidth: isEmpty && color !== 'transparent' ? 1 : 0,
          },
          animatedStyle
        ]}
      />
    </Pressable>
  );
});
