import express from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { storage } from "./storage.js";

// Create the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize the server
async function initializeServer() {
  // Initialize database with demo data
  try {
    await storage.initializeDemoData();
    log("Demo data initialized successfully");
  } catch (error) {
    log(`Error initializing demo data: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return server;
}

// Check if being run directly (not imported)
const isDirectExecution = import.meta.url === `file://${process.argv[1]}`;

// For Vercel serverless function export
export { app };

// For local development and traditional hosting
if (isDirectExecution) {
  (async () => {
    const server = await initializeServer();
    
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}