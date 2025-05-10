// Vercel runtime configuration
module.exports = {
  includeFiles: [
    'uploads/**',   // Include all uploaded files
    'dist/**',      // Include built client files
  ],
  excludeFiles: [
    'node_modules/**',  // Exclude node_modules
    '.git/**',          // Exclude git files
  ]
};