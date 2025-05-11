console.log('Starting the application in development mode...');
import('./server/index.js').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
