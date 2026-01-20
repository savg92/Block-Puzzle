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
  onDragEnd: (x: number, y: number, gridPos?: { row: number; col: number }) => void;
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
  
  // Visual dimensions of the piece, including Cell margin (1px on all sides = 2px total per cell)
  const pieceWidth = piece[0].length * (size + 2);
  const pieceHeight = piece.length * (size + 2);
  
  // Scale factor during drag
  const DRAG_SCALE = 1.2;
  
  // Vertical offset to float the piece above the finger (so it's not hidden)
  const DRAG_VERTICAL_OFFSET = 60;
  
  // Correction for vertical misalignment (Shadow appearing below piece)
  // "Half block below" -> ~16px offset correction
  const Y_FIX_OFFSET = 16;

  const getHoverPos = (absoluteX: number, absoluteY: number) => {
    if (!gridLayout) return null;

    // Use the finger position directly (adjusted for vertical offset and correction)
    const fingerX = absoluteX;
    const fingerY = absoluteY - DRAG_VERTICAL_OFFSET - Y_FIX_OFFSET;

    const fingerGridPos = mapScreenToGrid(
      fingerX,
      fingerY,
      gridLayout,
      10,
      8 // 4px padding + 4px border
    );

    if (!fingerGridPos) return null;

    // Calculate centroid offsets
    // This aligns the block under the finger with the target grid cell
    const rowOffset = Math.floor(piece.length / 2);
    const colOffset = Math.floor(piece[0].length / 2);

    return {
      row: fingerGridPos.row - rowOffset,
      col: fingerGridPos.col - colOffset,
    };
  };

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
      // We want the piece's center to align with the finger position (minus vertical offset).
      // Visual offset should account for the difference between touch point and center.
      const centetingOffsetX = pieceWidth / 2 - startX.value;
      const centetingOffsetY = pieceHeight / 2 - startY.value;

      translateX.value = event.translationX - centetingOffsetX;
      translateY.value = event.translationY - centetingOffsetY - DRAG_VERTICAL_OFFSET;

      if (gridLayout) {
        const hoverPos = getHoverPos(event.absoluteX, event.absoluteY);
        setHoverPosition(hoverPos);
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      // Calculate final grid position
      const gridPos = getHoverPos(event.absoluteX, event.absoluteY) || undefined;

      // Legacy adjusted coordinates (Top Left)
      const adjustedX = event.absoluteX - pieceWidth / 2;
      const adjustedY = event.absoluteY - pieceHeight / 2 - DRAG_VERTICAL_OFFSET - Y_FIX_OFFSET;

      onDragEnd(adjustedX, adjustedY, gridPos);
      
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
        { scale: withSpring(isDragging.value ? DRAG_SCALE : 1) },
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