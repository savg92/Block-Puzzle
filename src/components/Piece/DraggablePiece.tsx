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
import { mapScreenToGrid } from '../../utils/gridUtils';

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
  const setHoverPosition = useGameStore((state) => state.setHoverPosition);
  const gridLayout = useGameStore((state) => state.gridLayout);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  
  // Visual dimensions of the piece
  const pieceWidth = piece[0].length * size;
  const pieceHeight = piece.length * size;
  
  // Vertical offset to float the piece above the finger (so it's not hidden)
  const DRAG_VERTICAL_OFFSET = 60;

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      isDragging.value = true;
      selectPiece(piece);
      
      // When we start, we want to animate the piece to be centered under the finger
      // with the vertical offset. Translation is relative to the start position.
      // But GestureHandler's translationX/Y handles the delta.
      // To "jump" to center, we'd need to adjust the visual offset.
      // However, usually we just want the LOGIC to be centered.
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY - DRAG_VERTICAL_OFFSET;

      if (gridLayout) {
        // Calculate the top-left of the piece if it were centered on the finger
        // absoluteX/Y is the finger position
        const adjustedX = event.absoluteX - pieceWidth / 2;
        const adjustedY = event.absoluteY - pieceHeight / 2 - DRAG_VERTICAL_OFFSET;
        
        const hoverPos = mapScreenToGrid(
          adjustedX,
          adjustedY,
          gridLayout
        );
        setHoverPosition(hoverPos);
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      const adjustedX = event.absoluteX - pieceWidth / 2;
      const adjustedY = event.absoluteY - pieceHeight / 2 - DRAG_VERTICAL_OFFSET;

      onDragEnd(adjustedX, adjustedY);
      
      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      setHoverPosition(null);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.2 : 1) },
      ],
      opacity: withSpring(isDragging.value ? 0.8 : 1),
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