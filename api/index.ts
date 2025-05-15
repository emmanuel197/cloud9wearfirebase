import 'dotenv/config';
import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";
import { storage } from "../server/storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the routes
await registerRoutes(app);

// Initialize database with demo data
try {
  await (storage as any).initializeDemoData();
  console.log("Demo data initialized successfully");
} catch (error) {
  console.log(`Error initializing demo data: ${error instanceof Error ? error.message : String(error)}`);
}

export default async function handler(req: Request, res: Response) {
  return app(req, res);
} 