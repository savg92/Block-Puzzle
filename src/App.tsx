import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './styles/ThemeContext';
import { GameScreen } from './screens/GameScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import "./styles/global.css";

// Dynamic require to prevent crash if module fails to resolve in target env
let SplashScreen: any = null;

export const initSplashScreen = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SplashScreen = require('expo-splash-screen');
    SplashScreen?.preventAutoHideAsync?.().catch(() => {});
  } catch (e) {
    console.warn('SplashScreen module failed to load:', e);
  }
};

initSplashScreen();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const prepare = async () => {
      try {
        // Minimum time to show our custom loading screen
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setIsReady(true);
        if (SplashScreen?.hideAsync) {
            await SplashScreen.hideAsync().catch(() => {});
        }
      }
    };
    prepare();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          {!isReady && <LoadingScreen />}
          <GameScreen />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
