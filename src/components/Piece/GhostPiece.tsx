import React, { memo, useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { PiecePreview } from './PiecePreview';
import { Theme } from '../../styles/theme';
import { useTheme } from '../../styles/ThemeContext';

interface GhostPieceProps {
  piece: number[][];
  color: keyof Theme['colors'];
  x: number;
  y: number;
  visible: boolean;
  size?: number;
}

export const GhostPiece: React.FC<GhostPieceProps> = memo(({ 
  piece, 
  color, 
  x, 
  y, 
  visible,
  size = 29
}) => {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Snap to new position with a short, non-bouncy timing for stability
    translateX.value = withTiming(x, { duration: 80 });
    translateY.value = withTiming(y, { duration: 80 });
  }, [x, y]);

  useEffect(() => {
    opacity.value = withTiming(visible ? 0.4 : 0, { duration: 150 });
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
    zIndex: 10, // Above grid cells, below dragged piece
  }));

  return (
    <Animated.View testID="ghost-piece" style={[style, { pointerEvents: 'none' }]}>
      <PiecePreview 
        piece={piece} 
        color={color} 
        size={size} 
      />
    </Animated.View>
  );
});
