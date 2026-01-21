module.exports = {
  projects: [
    {
      preset: 'jest-expo/universal',
      testMatch: ['**/src/**/*.test.tsx'],
      moduleNameMapper: {
        '\.css$': 'identity-obj-proxy',
        '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
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
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/engine/__tests__/**/*.test.ts', 
        '**/src/store/__tests__/**/*.test.ts',
        '**/src/utils/__tests__/**/*.test.ts',
        '**/src/hooks/__tests__/**/*.test.ts'
      ],
      moduleDirectories: ['node_modules', '<rootDir>'],
      moduleNameMapper: {
        '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
      },
      setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
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
