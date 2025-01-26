const sharp = require('sharp');
const path = require('path');

async function generateImages() {
  // Generate favicon
  await sharp(path.join(__dirname, '../public/logo.svg'))
    .resize(32, 32)
    .toFile(path.join(__dirname, '../public/favicon.ico'));

  // Generate app icons
  await sharp(path.join(__dirname, '../public/logo.svg'))
    .resize(192, 192)
    .toFile(path.join(__dirname, '../public/icon-192x192.png'));

  await sharp(path.join(__dirname, '../public/logo.svg'))
    .resize(512, 512)
    .toFile(path.join(__dirname, '../public/icon-512x512.png'));

  // Generate preview image
  await sharp(path.join(__dirname, '../public/taskflow-preview.svg'))
    .resize(1200, 630)
    .toFile(path.join(__dirname, '../public/taskflow-preview.png'));

  console.log('All images generated successfully!');
}

generateImages().catch(console.error);
