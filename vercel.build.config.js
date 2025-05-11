module.exports = {
  // Custom build script configuration
  builds: {
    // Prioritize JavaScript/JSX files over TypeScript files
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    // Exclude TypeScript files from the build process
    exclude: ['**/*.ts', '**/*.tsx']
  },
  // Use JavaScript files for entry points
  entryPoints: {
    server: 'server/index.js',
    client: 'client/src/main.jsx'
  }
};