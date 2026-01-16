import React from 'react';
import { View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';
import { PiecePreview } from './PiecePreview';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../store/gameStore';

interface DraggablePieceProps {
  piece: number[][];
  color: keyof typeof theme.colors.blocks;
  onDragEnd: (x: number, y: number) => void;
  size?: number;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({ 
  piece, 
  color, 
  onDragEnd,
  size = 29 
}) => {
  const selectPiece = useGameStore((state) => state.selectPiece);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  
  // Track where the user grabbed the piece relative to its top-left
  const touchOffsetX = useSharedValue(0);
  const touchOffsetY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      isDragging.value = true;
      touchOffsetX.value = event.x;
      touchOffsetY.value = event.y;
      selectPiece(piece);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      // Calculate the top-left position of the piece based on where it was grabbed
      // absoluteX is the finger position on screen
      // touchOffsetX is the distance from piece-left to finger
      // So: pieceLeft = finger - offset
      
      // We also need to account for the fact that during drag, the visual might be centered on finger
      // but translation moves the original frame.
      // Actually, absoluteX/Y tracks the finger.
      // If we subtract touchOffset, we get the coordinate of the view's origin (top-left).
      
      const adjustedX = event.absoluteX - touchOffsetX.value;
      const adjustedY = event.absoluteY - touchOffsetY.value;

      onDragEnd(adjustedX, adjustedY);
      
      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.2 : 1) },
      ],
      opacity: withSpring(isDragging.value ? 0.7 : 1),
      zIndex: isDragging.value ? 9999 : 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        testID="draggable-piece"
        style={animatedStyle}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <PiecePreview piece={piece} color={color} size={size} />
      </Animated.View>
    </GestureDetector>
  );
};