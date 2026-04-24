const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add audio extensions to assetExts
if (!config.resolver.assetExts.includes('ogg')) {
  config.resolver.assetExts.push('ogg');
}

// Removed custom resolverMainFields to allow web builds to correctly resolve the 'browser' and 'module' fields instead of forcing 'main' (which causes Node.js modules to be bundled on web).

// Alias zustand to CJS build for web compatibility
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'zustand': require.resolve('zustand'),
  'zustand/middleware': require.resolve('zustand/middleware'),
  'zustand/vanilla': require.resolve('zustand/vanilla'),
};

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });