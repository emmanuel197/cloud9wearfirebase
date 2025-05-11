// Special Vercel deployment entry point
// This file is specifically for Vercel Functions

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Adjust path to find the server's entry point
const serverPath = resolve(__dirname, '../server/index.js');

// Import and execute the server code
export default async (req, res) => {
  try {
    const { app } = await import(serverPath);
    return app(req, res);
  } catch (error) {
    console.error('Error in Vercel Function:', error);
    res.status(500).send('Server Error');
  }
};