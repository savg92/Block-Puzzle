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
import { Theme } from '../../styles/theme';
import { useGameStore } from '../../store/gameStore';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';
import { canPlacePiece } from '../../engine/board';

interface Props {
  piece: number[][];
  color: keyof Theme['colors'];
  onDragEnd: (x: number, y: number, gridPos?: { row: number; col: number }) => void;
  onPress?: () => void;
  size?: number;
}

// How much to lift the piece above the touch point
const DRAG_LIFT = 110;
// Correction to move shadow UP (user reported shadow was below piece)
// Increasing this value makes the system think the piece is higher up
const CALC_LIFT = DRAG_LIFT;

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
  const grid = useGameStore(s => s.grid);
  const activePowerUpMode = useGameStore(s => s.activePowerUpMode);
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

  // Helper to check if a specific placement is valid (Logic mirrored from Grid/Engine)
  const isValidPlacement = useCallback((r: number, c: number) => {
      const isForcePlace = activePowerUpMode === 'forcePlace';
      
      // Basic bounds check (forcePlace still needs to be on grid)
      const pieceRows = piece.length;
      const pieceCols = piece[0].length;
      if (r < 0 || c < 0 || r + pieceRows > 10 || c + pieceCols > 10) return false;

      // Logic check
      if (isForcePlace) return true;
      return canPlacePiece(grid, piece, r, c);
  }, [grid, piece, activePowerUpMode]);

  // Helper to find the best placement cell using distance-based snapping
  const getSmartSnapPos = useCallback((centerX: number, centerY: number) => {
      if (!gridLayout) return null;

      // 1. Map absolute finger position to a "float" grid position
      const padding = 8;
      const innerX = gridLayout.x + padding;
      const innerY = gridLayout.y + padding;
      const innerWidth = gridLayout.width - padding * 2;
      const innerHeight = gridLayout.height - padding * 2;
      
      const cellWidth = innerWidth / 10;
      const cellHeight = innerHeight / 10;

      // Where the finger is in grid row/col units
      const fingerRowFloat = (centerY - innerY) / cellHeight;
      const fingerColFloat = (centerX - innerX) / cellWidth;

      // Where the top-left of the piece should be in grid units (if snapped exactly to finger)
      const pieceCenterRowOff = piece.length / 2;
      const pieceCenterColOff = piece[0].length / 2;
      
      const targetRow = fingerRowFloat - pieceCenterRowOff;
      const targetCol = fingerColFloat - pieceCenterColOff;

      // Central candidate (rounded to nearest cell)
      const baseRow = Math.round(targetRow);
      const baseCol = Math.round(targetCol);

      let bestPos = null;
      let minDistanceSq = Infinity;

      // Search a 3x3 area around the base candidate
      // This ensures we find the best valid spot within reasonable reach
      for (let r = baseRow - 1; r <= baseRow + 1; r++) {
          for (let c = baseCol - 1; c <= baseCol + 1; c++) {
              if (isValidPlacement(r, c)) {
                  // Distance from candidate top-left (r,c) to the ideal top-left (targetRow, targetCol)
                  const dr = r - targetRow;
                  const dc = c - targetCol;
                  const distSq = dr * dr + dc * dc;

                  if (distSq < minDistanceSq) {
                      minDistanceSq = distSq;
                      bestPos = { row: r, col: c };
                  }
              }
          }
      }

      // Max snap distance: 1.5 grid units. 
      // Prevents snapping to a far-away spot if nothing nearby is valid.
      if (minDistanceSq > 1.5 * 1.5) return null;

      return bestPos;
  }, [gridLayout, piece, isValidPlacement]);

  // Called when drag starts
  const onStart = useCallback(() => {
    selectPiece(piece);
    playPickup();
    lastHover.current = null;
  }, [selectPiece, piece, playPickup]);

  // Called during drag - update shadow position with Smart Snap
  const onMove = useCallback((centerX: number, centerY: number) => {
    const finalPos = getSmartSnapPos(centerX, centerY);
    const key = finalPos ? `${finalPos.row},${finalPos.col}` : null;
    
    // Only update if changed
    if (key !== lastHover.current) {
      lastHover.current = key;
      setHoverPosition(finalPos); // Pass the best found position or null
    }
  }, [getSmartSnapPos, setHoverPosition]);

  // Called when drag ends
  const onEnd = useCallback((centerX: number, centerY: number, topLeftX: number, topLeftY: number) => {
    const finalPos = getSmartSnapPos(centerX, centerY) || undefined;
    onDragEnd(topLeftX, topLeftY, finalPos);
    setHoverPosition(null);
    lastHover.current = null;
  }, [getSmartSnapPos, onDragEnd, setHoverPosition]);

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
        onDragMove={onMove}
        // @ts-ignore - Exposing for testing simulation
        onDragEnd={onEnd}
        // @ts-ignore - Exposing for testing simulation
        onPiecePress={onPress}
        style={[style, { cursor: 'grab' } as any]}
        hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
      >
        <PiecePreview piece={piece} color={color} size={size} />
      </Animated.View>
    </GestureDetector>
  );
});

DraggablePiece.displayName = 'DraggablePiece';