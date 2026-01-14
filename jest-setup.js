global.__DEV__ = true;
process.env.NATIVEWIND_NATIVE = 'true';

// Mock react-native
jest.mock('react-native', () => {
  const mockReact = require('react');
  const mockPropTypes = require('prop-types');

  const mockView = (props) => mockReact.createElement('View', props);
  mockView.displayName = 'View';
  mockView.propTypes = {
    children: mockPropTypes.node,
    style: mockPropTypes.any,
  };

  const mockText = (props) => mockReact.createElement('Text', props);
  mockText.displayName = 'Text';

  return {
    View: mockView,
    Text: mockText,
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
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
  return {
    default: {
      call: () => {},
    },
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (cb) => cb(),
    withSpring: (val) => val,
    withTiming: (val) => val,
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
  const mockReact = require('react');
  return {
    GestureHandlerRootView: (props) => mockReact.createElement('View', props),
    PanGestureHandler: (props) => mockReact.createElement('View', props),
    State: {},
  };
});