import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const port = process.env.PORT || 5000;

// Add health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Register all routes
const server = await registerRoutes(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});