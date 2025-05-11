// Custom build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to remove all TypeScript files that have JavaScript equivalents
function removeRedundantTypeScriptFiles() {
  console.log('Removing redundant TypeScript files...');
  
  // Check client directories for .tsx files with .jsx equivalents
  const checkDirectory = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        checkDirectory(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        const baseName = file.name.replace(/\.tsx?$/, '');
        const jsxEquivalent = path.join(dir, `${baseName}.jsx`);
        const jsEquivalent = path.join(dir, `${baseName}.js`);
        
        // If equivalent JS/JSX file exists, remove the TS/TSX file
        if (fs.existsSync(jsxEquivalent) || fs.existsSync(jsEquivalent)) {
          fs.unlinkSync(fullPath);
          console.log(`Removed: ${fullPath}`);
        }
      }
    });
  };
  
  // Start checking from client directory
  checkDirectory('./client/src');
}

// Main build process
async function buildForVercel() {
  try {
    // 1. Remove .tsx files that have .jsx equivalents
    removeRedundantTypeScriptFiles();
    
    // 2. Update index.html to make sure it points to the JSX file
    const indexHtmlPath = './client/index.html';
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      indexHtml = indexHtml.replace(/src="\/src\/main\.tsx"/, 'src="/src/main.jsx"');
      fs.writeFileSync(indexHtmlPath, indexHtml);
      console.log('Updated index.html to use main.jsx');
    }
    
    // 3. Run the actual build
    console.log('Running build...');
    
    // We can't modify package.json, so we'll execute the commands directly
    exec('vite build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Build error: ${error.message}`);
        return;
      }
      
      console.log('Build completed successfully');
      console.log(stdout);
      
      if (stderr) {
        console.error(`Build warnings: ${stderr}`);
      }
    });
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build process
buildForVercel();