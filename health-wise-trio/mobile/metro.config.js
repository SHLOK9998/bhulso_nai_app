const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force supabase packages through Babel so private class fields are transpiled for Hermes
config.transformer.unstable_allowRequireContext = true;
config.resolver.unstable_enablePackageExports = false;

// Add supabase to the list of packages that should be transformed (not ignored)
const { blockList } = config.resolver;
config.resolver.blockList = blockList;

// Transform supabase packages through babel instead of leaving them as-is
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
