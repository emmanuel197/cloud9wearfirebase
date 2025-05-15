import 'dotenv/config';
import express, { type Request, Response } from "express";
import { storage } from "./server/storage";

// Create Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database with demo data
const initializeData = async () => {
  try {
    await (storage as any).initializeDemoData();
    console.log("Demo data initialized successfully");
  } catch (error) {
    console.log(`Error initializing demo data: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Initialize routes
const initializeRoutes = async () => {
  const { registerRoutes } = await import("./server/routes");
  await registerRoutes(app);
};

// Initialize everything
let isInitialized = false;
const initialize = async () => {
  if (!isInitialized) {
    await initializeData();
    await initializeRoutes();
    isInitialized = true;
  }
};

export default async function handler(req: Request, res: Response) {
  // Only handle /api routes
  if (!req.url?.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Remove /api prefix for internal routing
  req.url = req.url.replace(/^\/api/, '');
  
  await initialize();
  return app(req, res);
} 