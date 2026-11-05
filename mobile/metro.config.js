/* metro.config.js - Metro (bundler-ul folosit de Expo) poate citi si codul din ../shared (M v2.0.0) */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Metro urmareste si folderul shared, aflat in afara proiectului mobile/
config.watchFolders = [path.resolve(__dirname, '../shared')];
// pachetele importate din shared (de exemplu react) se cauta in mobile/node_modules
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

module.exports = config;
