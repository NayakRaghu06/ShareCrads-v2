
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Metro should treat project root as this workspace
config.projectRoot = __dirname;
config.watchFolders = [];

// Add blockList rules
config.resolver.blockList = [
  /@expo[\\/]cli[\\/].*/,
  /node_modules[\\/].*?[\\/]node_modules[\\/]@expo[\\/]cli[\\/].*/,
  /@expo[\\/]cli[\\/]build[\\/]metro-require[\\/]require\.js$/,
];

module.exports = config;