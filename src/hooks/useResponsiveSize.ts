import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

// Base width: iPhone 14 (390px). All sizes scale relative to this.
const BASE_WIDTH = 390;
const MIN_SCALE = 0.7;
const MAX_SCALE = 1.3;

export const useResponsiveSize = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const rawScale = width / BASE_WIDTH;
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));

    return {
      scale,
      screenWidth: width,
      screenHeight: height,
      // Grid
      cellSize: Math.floor(30 * scale),
      // Pieces
      pieceSize: Math.floor(25 * scale),
      // Piece tray
      trayHeight: Math.floor(120 * scale),
      trayPaddingH: Math.floor(20 * scale),
      trayMinHeight: Math.floor(100 * scale),
      // GameScreen
      titleFontSize: Math.floor(28 * scale),
      screenPadding: Math.floor(20 * scale),
      iconSize: Math.floor(22 * scale),
      iconButtonPadding: Math.floor(8 * scale),
      // Score
      scoreFontSize: Math.floor(28 * scale),
      scoreMinWidth: Math.floor(240 * scale),
      scorePaddingV: Math.floor(12 * scale),
      scorePaddingH: Math.floor(20 * scale),
      // PowerUpBar
      powerUpMinWidth: Math.floor(64 * scale),
      powerUpMinHeight: Math.floor(80 * scale),
      powerUpPaddingV: Math.floor(12 * scale),
      powerUpPaddingH: Math.floor(8 * scale),
      powerUpIconSize: Math.floor(20 * scale),
      powerUpLabelSize: Math.floor(10 * scale),
      powerUpBadgeSize: Math.floor(10 * scale),
      // GameOverModal
      gameOverTitleSize: Math.floor(42 * scale),
      gameOverScoreSize: Math.floor(28 * scale),
      gameOverButtonSize: Math.floor(20 * scale),
      gameOverPadding: Math.floor(32 * scale),
      // Notification
      notificationTitleSize: Math.floor(16 * scale),
      notificationSubSize: Math.floor(12 * scale),
    };
  }, [width, height]);
};
