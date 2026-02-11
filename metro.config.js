const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add audio extensions to assetExts
if (!config.resolver.assetExts.includes('ogg')) {
  config.resolver.assetExts.push('ogg');
}

// Prioritize CJS builds for web compatibility to avoid 'import.meta' errors
config.resolver.resolverMainFields = ['main', 'browser', 'module'];

// Alias zustand to CJS build for web compatibility
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'zustand': require.resolve('zustand'),
  'zustand/middleware': require.resolve('zustand/middleware'),
  'zustand/vanilla': require.resolve('zustand/vanilla'),
};

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });