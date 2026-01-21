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
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

interface DraggablePieceProps {
  piece: number[][];
  color: keyof typeof theme.colors.blocks;
  onDragEnd: (x: number, y: number, gridPos?: { row: number; col: number }) => void;
  onPress?: () => void;
  size?: number;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({ 
  piece, 
  color, 
  onDragEnd,
  onPress,
  size = 29 
}) => {
  const selectPiece = useGameStore((state) => state.selectPiece);
  const setHoverPosition = useGameStore((state) => state.setHoverPosition);
  const gridLayout = useGameStore((state) => state.gridLayout);
  const { playPickup } = useSensoryFeedback();
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const isDragging = useSharedValue(false);
  
  // Visual Dimensions (Unscaled)
  const pieceWidth = piece[0].length * (size + 2);
  const pieceHeight = piece.length * (size + 2);

  // Trigger rotation animation when piece shape changes
  React.useEffect(() => {
    rotation.value = withSpring(rotation.value + 90);
  }, [piece]);
  
  // Track the initial touch point within the piece to allow centering
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  
  // Scale factor during drag
  const DRAG_SCALE = 1.2;
  
  // Vertical offset to float the piece above the finger (so it's not hidden)
  const DRAG_VERTICAL_OFFSET = 60;

  const getHoverPos = (absoluteX: number, absoluteY: number) => {
    if (!gridLayout) return null;

    // With the piece centered on the finger (see onUpdate), 
    // we map the finger position (adjusted for offsets) to the grid.
    const fingerX = absoluteX;
    const fingerY = absoluteY - DRAG_VERTICAL_OFFSET;

    const centerGridPos = mapScreenToGrid(
      fingerX,
      fingerY,
      gridLayout,
      10,
      8 // 4px padding + 4px border
    );

    if (!centerGridPos) return null;

    // Calculate centroid offsets
    // This aligns the block structure with the target grid cell
    const rowOffset = Math.floor(piece.length / 2);
    const colOffset = Math.floor(piece[0].length / 2);

    return {
      row: centerGridPos.row - rowOffset,
      col: centerGridPos.col - colOffset,
    };
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((event) => {
      isDragging.value = true;
      startX.value = event.x;
      startY.value = event.y;
      selectPiece(piece);
      playPickup();
    })
    .onUpdate((event) => {
      // Force Centering: Snap the piece's center to the finger.
      // We use UNSCALED dimensions because startX/Y are in the unscaled coordinate space.
      // Mixing scaled dimensions here caused alignment drifts depending on grab point.
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

      // Fallback coordinates
      const adjustedX = event.absoluteX - pieceWidth / 2;
      const adjustedY = event.absoluteY - pieceHeight / 2 - DRAG_VERTICAL_OFFSET;

      onDragEnd(adjustedX, adjustedY, gridPos);
      
      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      setHoverPosition(null);
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      if (onPress) onPress();
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
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