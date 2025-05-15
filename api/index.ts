import 'dotenv/config';
import express, { type Request, Response } from "express";
import { storage } from "../server/storage.js";
import { registerRoutes } from "../server/routes.js";

// Create Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database with demo data
const initializeData = async () => {
  try {
    await storage.initializeDemoData();
    console.log("Demo data initialized successfully");
  } catch (error) {
    console.log(`Error initializing demo data: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Initialize everything
let isInitialized = false;
const initialize = async () => {
  if (!isInitialized) {
    await initializeData();
    await registerRoutes(app);
    isInitialized = true;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: Response) {
  // Only handle /api routes
  if (!req.url?.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Remove /api prefix for internal routing
  req.url = req.url.replace(/^\/api/, '');
  
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 