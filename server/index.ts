// This is a TypeScript adapter that simply imports and re-exports the JavaScript implementation
// This allows us to keep the package.json scripts unchanged while using JavaScript under the hood

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Import the JavaScript implementation
const indexJsPath = resolve(__dirname, 'index.js');

// This will execute the JavaScript file
import(indexJsPath).catch(error => {
  console.error('Error importing JavaScript implementation:', error);
  process.exit(1);
});