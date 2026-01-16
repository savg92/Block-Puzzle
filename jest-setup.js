global.__DEV__ = true;
process.env.NATIVEWIND_NATIVE = 'true';

// Mock react-native
jest.mock('react-native', () => {
  const React = require('react');
  const mockView = (props) => React.createElement('View', props);
  mockView.displayName = 'View';
  
  const mockText = (props) => React.createElement('Text', props);
  mockText.displayName = 'Text';

  return {
    View: mockView,
    Text: mockText,
    SafeAreaView: mockView,
    ScrollView: mockView,
    Modal: mockView,
    TouchableOpacity: mockView,
    Pressable: mockView,
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => {
        if (Array.isArray(styles)) {
          return Object.assign({}, ...styles.flat().filter(Boolean));
        }
        return styles || {};
      },
    },
    Platform: {
      OS: 'ios',
      select: (objs) => objs.ios,
    },
    Appearance: {
      getColorScheme: () => 'light',
      addChangeListener: () => ({ remove: () => {} }),
    },
    useColorScheme: jest.fn(() => 'light'),
    NativeModules: {},
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const View = (props) => React.createElement('View', props);
  return {
    SafeAreaProvider: View,
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock mmkv
jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn(),
      getString: jest.fn(),
      remove: jest.fn(),
    })),
  };
});

// Mock css-interop
jest.mock('react-native-css-interop', () => {
  return {
    cssInterop: (component) => component,
    remapProps: (component) => component,
    StyleSheet: {
      register: () => {},
      create: () => ({}),
    }
  };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  return {
    default: {
      call: () => {},
    },
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (cb) => cb(),
    withSpring: (val) => val,
    withTiming: (val) => val,
    runOnJS: (fn) => fn,
    View: (props) => React.createElement('View', props),
    Easing: {
      out: (fn) => fn,
      quad: (n) => n,
      linear: (n) => n,
    },
    useDerivedValue: (cb) => ({ value: cb() }),
    useAnimatedProps: (cb) => cb(),
  };
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => {
  return {
    StatusBar: () => null,
  };
});

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const View = (props) => React.createElement('View', props);
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    GestureDetector: View,
    Gesture: {
      Pan: () => ({
        onStart: function() { return this; },
        onUpdate: function() { return this; },
        onEnd: function() { return this; },
        runOnJS: function() { return this; },
      }),
    },
    runOnJS: (fn) => fn,
    State: {},
  };
});