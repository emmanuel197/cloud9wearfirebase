
import express from 'express';
import { registerRoutes } from './routes';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Register API routes
const server = await registerRoutes(app);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
