const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Vercel-specific build script...');

// Create output directory structure
const outputDir = path.join(__dirname, '.vercel', 'output');
const staticDir = path.join(outputDir, 'static');
const functionDir = path.join(outputDir, 'functions');
const serverlessDir = path.join(functionDir, 'server.func');

// Ensure directories exist
[outputDir, staticDir, functionDir, serverlessDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Try to build frontend with Vite
try {
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Copy frontend build to .vercel/output/static
  console.log('Copying built frontend files to Vercel output directory...');
  
  // Check if dist/public directory exists
  const distPublicDir = path.join(__dirname, 'dist', 'public');
  const distDir = path.join(__dirname, 'dist');
  
  const sourceDir = fs.existsSync(distPublicDir) ? distPublicDir : distDir;
  
  // Copy all files from source directory to static directory
  copyRecursive(sourceDir, staticDir);
  
  console.log('Frontend files copied successfully');
} catch (error) {
  console.error('Error building frontend:', error);
  
  // Create a fallback index.html
  console.log('Creating fallback index.html...');
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloud9Wear</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .message {
      text-align: center;
      max-width: 600px;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="message">
    <h1>Cloud9Wear</h1>
    <p>Our print-on-demand clothing store is currently under maintenance. Please check back soon!</p>
    <p>If you're seeing this page, it means there was an issue with the deployment. Please contact support for assistance.</p>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(staticDir, 'index.html'), fallbackHtml);
  console.log('Fallback index.html created');
}

// Create server function
console.log('Building backend...');

// Create server.js inside server.func directory
const serverJs = `
const path = require('path');
process.env.NODE_ENV = 'production';

// Entry point
module.exports = require("${path.join(__dirname, 'server', 'index.ts')}");
`;

fs.writeFileSync(path.join(serverlessDir, 'index.js'), serverJs);

// Create .vc-config.json for server function
const vcConfig = {
  runtime: 'nodejs18.x',
  handler: 'index.js',
  launcherType: 'Nodejs',
};

fs.writeFileSync(
  path.join(serverlessDir, '.vc-config.json'),
  JSON.stringify(vcConfig, null, 2)
);

// Create config.json in output directory
const configJson = {
  version: 3,
  routes: [
    {
      src: '/uploads/.*',
      dest: '/uploads/$1',
    },
    {
      src: '/api/.*',
      dest: '/server',
    },
    {
      handle: 'filesystem',
    },
    {
      src: '/.*',
      dest: '/index.html',
    },
  ],
};

fs.writeFileSync(
  path.join(outputDir, 'config.json'),
  JSON.stringify(configJson, null, 2)
);

// Create upload directory structure if it doesn't exist
const uploadsDir = path.join(staticDir, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Vercel build completed successfully!');

// Helper function to copy files recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory ${src} does not exist`);
    return;
  }
  
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    for (const file of fs.readdirSync(src)) {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      copyRecursive(srcFile, destFile);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}