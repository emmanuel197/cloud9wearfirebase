// Special Vercel deployment entry point
// This file is specifically for Vercel Functions

import { app } from '../server/index.js';

// Create a serverless handler that processes all incoming requests
export default async function handler(req, res) {
  // For vercel serverless, we need to manually invoke the Express app
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Express middleware error:', err);
        return reject(err);
      }
      return resolve();
    });
  });
}