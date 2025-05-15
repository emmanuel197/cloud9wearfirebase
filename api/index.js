import 'dotenv/config';
import express from 'express';
import { storage } from '../server/storage.js';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize everything
let isInitialized = false;
const initialize = async () => {
  if (!isInitialized) {
    try {
      await storage.initializeDemoData();
      await registerRoutes(app);
      isInitialized = true;
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }
};

// Export the Vercel serverless function
export default async function handler(req, res) {
  try {
    // Initialize on first request
    await initialize();
    
    // Remove /api prefix for internal routing
    req.url = req.url.replace(/^\/api/, '');
    
    // Handle the request with Express
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 