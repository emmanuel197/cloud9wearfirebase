/**
 * This script runs during the build process on Vercel
 * to ensure all upload directories exist
 */
const fs = require('fs');
const path = require('path');

const createDirectories = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const productUploadsDir = path.join(uploadDir, 'products');

  if (!fs.existsSync(uploadDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (!fs.existsSync(productUploadsDir)) {
    console.log('Creating products uploads directory...');
    fs.mkdirSync(productUploadsDir, { recursive: true });
  }

  console.log('Upload directories successfully created');
};

createDirectories();