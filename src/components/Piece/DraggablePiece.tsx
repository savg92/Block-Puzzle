/**

* DraggablePiece - Fixed implementation
 * 
 * Fixes:
 * 1. Shadow alignment - tracks grab offset within piece
 * 2. Smooth return - no bounce animation
 */
import React, { memo, useCallback, useRef } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { PiecePreview } from './PiecePreview';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../store/gameStore';
import { mapScreenToGrid } from '../../utils/gridUtils';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

interface Props {
  piece: number[][];
  color: keyof typeof theme.colors.blocks;
  onDragEnd: (x: number, y: number, gridPos?: { row: number; col: number }) => void;
  onPress?: () => void;
  size?: number;
}

// How much to lift the piece above the touch point
const DRAG_LIFT = 110;
// Correction to move shadow UP (user reported shadow was below piece)
// Increasing this value makes the system think the piece is higher up
const CALC_LIFT = 40;

// Helper to calculate positions (exported for testing)
export const calculatePiecePosition = (
  fingerX: number, 
  fingerY: number, 
  grabX: number, 
  grabY: number,
  pieceWidth: number, 
  pieceHeight: number, 
  lift: number
) => {
  'worklet';
  const pieceTopLeftX = fingerX - grabX;
  const pieceTopLeftY = fingerY - grabY - lift;
  
  const centerX = pieceTopLeftX + pieceWidth / 2;
  const centerY = pieceTopLeftY + pieceHeight / 2;
  
  return { centerX, centerY, pieceTopLeftX, pieceTopLeftY };
};

export const DraggablePiece: React.FC<Props> = memo(({ 
  piece, 
  color, 
  onDragEnd,
  onPress,
  size = 29 
}) => {
  // Store access
  const selectPiece = useGameStore(s => s.selectPiece);
  const setHoverPosition = useGameStore(s => s.setHoverPosition);
  const gridLayout = useGameStore(s => s.gridLayout);
  const { playPickup } = useSensoryFeedback();
  
  // Shared values for animation (UI thread)
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Track where user grabbed within the piece (relative to piece top-left)
  const initialGrabX = useSharedValue(0);
  const initialGrabY = useSharedValue(0);
  const effectiveGrabX = useSharedValue(0);
  const effectiveGrabY = useSharedValue(0);
  
  // Piece measurements
  const gap = 2;
  const width = piece[0].length * (size + gap);
  const height = piece.length * (size + gap);
  
  // Track last hover position to avoid redundant updates
  const lastHover = useRef<string | null>(null);

  // Convert screen coords to grid position
  const toGridPos = useCallback((screenX: number, screenY: number) => {
    if (!gridLayout) return null;
    
    // Map screen point to grid cell
    const cell = mapScreenToGrid(screenX, screenY, gridLayout, 10, 8);
    if (!cell) return null;
    
    // Offset to align piece top-left with grid
    const rowOff = Math.floor(piece.length / 2);
    const colOff = Math.floor(piece[0].length / 2);
    
    return { row: cell.row - rowOff, col: cell.col - colOff };
  }, [gridLayout, piece]);

  // Called when drag starts
  const onStart = useCallback(() => {
    selectPiece(piece);
    playPickup();
    lastHover.current = null;
  }, [selectPiece, piece, playPickup]);

  // Called during drag - update shadow position
  const onMove = useCallback((centerX: number, centerY: number) => {
    const pos = toGridPos(centerX, centerY);
    const key = pos ? `${pos.row},${pos.col}` : null;
    
    // Only update if changed
    if (key !== lastHover.current) {
      lastHover.current = key;
      setHoverPosition(pos);
    }
  }, [toGridPos, setHoverPosition]);

  // Called when drag ends
  const onEnd = useCallback((centerX: number, centerY: number, topLeftX: number, topLeftY: number) => {
    const gridPos = toGridPos(centerX, centerY) || undefined;
    onDragEnd(topLeftX, topLeftY, gridPos);
    setHoverPosition(null);
    lastHover.current = null;
  }, [toGridPos, onDragEnd, setHoverPosition]);

  // Gesture handler
  const pan = Gesture.Pan()
    .onStart((e) => {
      'worklet';
      initialGrabX.value = e.x;
      initialGrabY.value = e.y;
      
      // Initialize effective grab to current finger position
      effectiveGrabX.value = e.x;
      effectiveGrabY.value = e.y;
      
      // Animate effective grab to center of piece
      effectiveGrabX.value = withTiming(width / 2, { duration: 200 });
      effectiveGrabY.value = withTiming(height / 2, { duration: 200 });
      
      offsetY.value = -DRAG_LIFT;
      scale.value = 1.1;
      
      runOnJS(onStart)();
    })
    .onUpdate((e) => {
      'worklet';
      const { translationX, translationY, absoluteX, absoluteY } = e;
      
      // Move piece with finger
      // Apply translation PLUS the shift from centering (initial - effective)
      offsetX.value = translationX + (initialGrabX.value - effectiveGrabX.value);
      offsetY.value = translationY - DRAG_LIFT + (initialGrabY.value - effectiveGrabY.value);
      
      // Calculate positions with correction
      const { centerX, centerY } = calculatePiecePosition(
        absoluteX, 
        absoluteY, 
        effectiveGrabX.value,
        effectiveGrabY.value,
        width, 
        height, 
        CALC_LIFT
      );
      
      runOnJS(onMove)(centerX, centerY);
    })
    .onEnd((e) => {
      'worklet';
      const { absoluteX, absoluteY } = e;
      const { centerX, centerY, pieceTopLeftX, pieceTopLeftY } = calculatePiecePosition(
        absoluteX, 
        absoluteY, 
        effectiveGrabX.value,
        effectiveGrabY.value,
        width, 
        height, 
        CALC_LIFT
      );
      
      runOnJS(onEnd)(centerX, centerY, pieceTopLeftX, pieceTopLeftY);
      
      // Smooth return
      const returnConfig = { duration: 200, easing: Easing.out(Easing.quad) };
      
      // Reset centering offsets so piece returns to original visual box
      // (This might need tweaking depending on how onDragEnd handles placement, 
      // but for returning to tray, we just want to zero everything out)
      effectiveGrabX.value = withTiming(initialGrabX.value, returnConfig);
      effectiveGrabY.value = withTiming(initialGrabY.value, returnConfig);
      
      offsetX.value = withTiming(0, returnConfig);
      offsetY.value = withTiming(0, returnConfig);
      scale.value = withTiming(1, returnConfig);
    });

  const tap = Gesture.Tap().onEnd(() => {
    'worklet';
    if (onPress) runOnJS(onPress)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  // Animated styles
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
    zIndex: scale.value > 1 ? 1000 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        testID="draggable-piece"
        // @ts-ignore - Exposing for testing simulation
        onDragStart={onStart}
        // @ts-ignore - Exposing for testing simulation
        onDragEnd={onEnd}
        // @ts-ignore - Exposing for testing simulation
        onPiecePress={onPress}
        style={style}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <PiecePreview piece={piece} color={color} size={size} />
      </Animated.View>
    </GestureDetector>
  );
});