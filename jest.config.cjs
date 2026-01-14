module.exports = {
  projects: [
    {
      preset: 'jest-expo/universal',
      testMatch: ['**/src/App.test.tsx', '**/src/components/**/*.test.tsx'],
      moduleNameMapper: {
        '\.css$': 'identity-obj-proxy',
      },
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|react-native-reanimated|react-native-gesture-handler)',
      ],
      moduleDirectories: ['node_modules', '<rootDir>'],
      modulePathIgnorePatterns: ['<rootDir>/.expo/'],
      setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/src/engine/__tests__/**/*.test.ts', '**/src/store/__tests__/**/*.test.ts'],
      moduleDirectories: ['node_modules', '<rootDir>'],
    }
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
