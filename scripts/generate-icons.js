import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG with ICFES MASTER H 2.5 branding
const createSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B2F64"/>
      <stop offset="50%" stop-color="#103D7C"/>
      <stop offset="100%" stop-color="#082249"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#AFF2D4"/>
      <stop offset="100%" stop-color="#4ECCA3"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>

  <!-- Inner border ring -->
  <rect x="24" y="24" width="464" height="464" rx="96" fill="none" stroke="url(#gold)" stroke-width="6" stroke-opacity="0.3"/>

  <!-- Center Crest / Logo Badge -->
  <g filter="url(#shadow)">
    <!-- Shield / Cap Emblem -->
    <path d="M256 100 L380 160 L256 220 L132 160 Z" fill="url(#gold)"/>
    <path d="M172 186 L172 270 Q256 320 340 270 L340 186 L256 226 Z" fill="#0B2F64" stroke="url(#gold)" stroke-width="8"/>
    
    <!-- Letters IM -->
    <text x="256" y="266" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#ffffff" letter-spacing="4">
      IM
    </text>
  </g>

  <!-- Title Text -->
  <text x="256" y="375" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#ffffff" letter-spacing="2">
    ICFES MASTER
  </text>

  <!-- Badge H 2.5 -->
  <rect x="186" y="405" width="140" height="40" rx="20" fill="url(#gold)"/>
  <text x="256" y="432" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#0B2F64" letter-spacing="2">
    H 2.5
  </text>
</svg>
`;

async function generate() {
  const svgBuffer = Buffer.from(createSvg(512));

  // Save icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgBuffer);
  console.log('Saved icon.svg');

  // Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Saved icon-512.png');

  // Generate 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Saved icon-192.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved apple-touch-icon.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
