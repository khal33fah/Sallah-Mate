import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const svgPath = path.resolve('public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');

  // 180x180 Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  // 512x512 maskable (with 15% safe-zone margin)
  await sharp(svgBuffer)
    .resize(390, 390)
    .extend({
      top: 61,
      bottom: 61,
      left: 61,
      right: 61,
      background: '#022c22'
    })
    .png()
    .toFile('public/pwa-maskable-512x512.png');

  console.log('PWA icons successfully generated!');
}

generate().catch(console.error);
