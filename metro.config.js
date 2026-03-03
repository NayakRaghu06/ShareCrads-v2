/**
 * Metro config for Windows/OneDrive environments.
 *
 * Avoid requiring internal metro-config helpers (which may be ESM-loaded
 * and cause Windows path/url loader errors). Instead provide a simple
 * regex-based blockList which Metro accepts.
 */
const path = require('path');

// Metro should treat project root as this workspace and not walk parent folders.
// Set `projectRoot` explicitly and add blockList entries that match any
// occurrence of `@expo/cli` so Metro doesn't try to include duplicated CLI
// packages that live outside the project (common on Windows/OneDrive setups).
module.exports = {
  projectRoot: __dirname,
  watchFolders: [],
  resolver: {
    blockList: [
      // Any path containing @expo/cli (works for nested and absolute locations)
      /@expo[\\/]cli[\\/].*/,
      // Any nested @expo/cli inside node_modules
      /node_modules[\\/].*?[\\/]node_modules[\\/]@expo[\\/]cli[\\/].*/,
      // Specific require.js file anywhere
      /@expo[\\/]cli[\\/]build[\\/]metro-require[\\/]require\.js$/,
    ],
  },
};
