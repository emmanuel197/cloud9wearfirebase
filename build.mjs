import { mkdir, cp } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function copyServerFiles() {
  const distApiDir = join(__dirname, 'dist', 'api');
  
  try {
    // Create dist/api directory
    await mkdir(distApiDir, { recursive: true });
    
    // Copy server and shared directories
    await cp(join(__dirname, 'server'), join(distApiDir, 'server'), { recursive: true });
    await cp(join(__dirname, 'shared'), join(distApiDir, 'shared'), { recursive: true });
    
    console.log('Successfully copied server files');
  } catch (error) {
    console.error('Error copying server files:', error);
    process.exit(1);
  }
}

copyServerFiles(); 