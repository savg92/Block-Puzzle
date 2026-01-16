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
  
  // Track the initial touch point within the piece to allow centering
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  
  // Visual dimensions of the piece
  const pieceWidth = piece[0].length * size;
  const pieceHeight = piece.length * size;
  
  // Vertical offset to float the piece above the finger (so it's not hidden)
  const DRAG_VERTICAL_OFFSET = 60;

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      isDragging.value = true;
      startX.value = event.x;
      startY.value = event.y;
      selectPiece(piece);
    })
    .onUpdate((event) => {
      // Centering logic:
      // event.translationX is delta from start.
      // startX is where we touched relative to piece top-left.
      // To center piece on finger: pieceTopLeft = fingerPos - pieceDimensions/2
      // fingerPos = initialPos + translation
      // So visual offset should account for the difference between touch point and center.
      
      const centetingOffsetX = pieceWidth / 2 - startX.value;
      const centetingOffsetY = pieceHeight / 2 - startY.value;

      translateX.value = event.translationX - centetingOffsetX;
      translateY.value = event.translationY - centetingOffsetY - DRAG_VERTICAL_OFFSET;

      if (gridLayout) {
        // Logical coordinates for grid mapping (center of piece on finger)
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