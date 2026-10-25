const fs = require('fs');
const { PNG } = require('pngjs');

// Read the first uploaded image (clean white background)
const data = fs.readFileSync('C:\\Users\\Ganesh\\.gemini\\antigravity-ide\\brain\\f8941051-2275-4e20-aa3a-3877950085db\\.user_uploaded\\media_1792925960859.png');
const png = PNG.sync.read(data);
console.log('Image 1 Size:', png.width, png.height);

const w = png.width;
const h = png.height;

// Flood fill from outer borders to find all background pixels
const visited = new Uint8Array(w * h);
const queue = new Int32Array(w * h * 2);
let qHead = 0;
let qTail = 0;

function isBackgroundPixel(r, g, b) {
  // Pure white or very near white outer background
  // Yellow map is ~ (255, 230-255, 0), Red map is ~ (230, 20, 30), Black borders are ~ (0,0,0), Blue water is ~ (0, 100-180, 255)
  // Outside white background is (250-255, 250-255, 250-255)
  return r > 240 && g > 240 && b > 240;
}

// Push all boundary pixels into queue if they match background
for (let x = 0; x < w; x++) {
  // top row
  let idx = x << 2;
  if (isBackgroundPixel(png.data[idx], png.data[idx+1], png.data[idx+2])) {
    visited[x] = 1;
    queue[qTail++] = x;
    queue[qTail++] = 0;
  }
  // bottom row
  let bIdx = (w * (h - 1) + x) << 2;
  if (isBackgroundPixel(png.data[bIdx], png.data[bIdx+1], png.data[bIdx+2])) {
    visited[w * (h - 1) + x] = 1;
    queue[qTail++] = x;
    queue[qTail++] = h - 1;
  }
}

for (let y = 0; y < h; y++) {
  // left col
  let idx = (w * y) << 2;
  if (!visited[w * y] && isBackgroundPixel(png.data[idx], png.data[idx+1], png.data[idx+2])) {
    visited[w * y] = 1;
    queue[qTail++] = 0;
    queue[qTail++] = y;
  }
  // right col
  let rIdx = (w * y + (w - 1)) << 2;
  if (!visited[w * y + (w - 1)] && isBackgroundPixel(png.data[rIdx], png.data[rIdx+1], png.data[rIdx+2])) {
    visited[w * y + (w - 1)] = 1;
    queue[qTail++] = w - 1;
    queue[qTail++] = y;
  }
}

console.log('Initial boundary seed pixels:', qTail / 2);

while (qHead < qTail) {
  const cx = queue[qHead++];
  const cy = queue[qHead++];

  const neighbors = [
    [cx + 1, cy],
    [cx - 1, cy],
    [cx, cy + 1],
    [cx, cy - 1]
  ];

  for (let i = 0; i < 4; i++) {
    const nx = neighbors[i][0];
    const ny = neighbors[i][1];

    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
      const nPos = w * ny + nx;
      if (!visited[nPos]) {
        const pIdx = nPos << 2;
        const r = png.data[pIdx];
        const g = png.data[pIdx + 1];
        const b = png.data[pIdx + 2];

        if (isBackgroundPixel(r, g, b)) {
          visited[nPos] = 1;
          queue[qTail++] = nx;
          queue[qTail++] = ny;
        }
      }
    }
  }
}

console.log('Total transparent background pixels found:', qTail / 2);

// Make all flood-filled visited background pixels completely transparent (Alpha = 0)
let minX = w, maxX = 0, minY = h, maxY = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const pos = w * y + x;
    const idx = pos << 2;
    if (visited[pos] === 1) {
      png.data[idx + 3] = 0; // Transparent!
    } else {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('Karnataka Bounding Box:', { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 });

// Create tightly cropped PNG with only the Karnataka map on transparent background
const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;
const cropped = new PNG({ width: cropW, height: cropH });

for (let cy = 0; cy < cropH; cy++) {
  for (let cx = 0; cx < cropW; cx++) {
    const srcX = minX + cx;
    const srcY = minY + cy;
    const srcIdx = (w * srcY + srcX) << 2;
    const dstIdx = (cropW * cy + cx) << 2;

    cropped.data[dstIdx] = png.data[srcIdx];
    cropped.data[dstIdx + 1] = png.data[srcIdx + 1];
    cropped.data[dstIdx + 2] = png.data[srcIdx + 2];
    cropped.data[dstIdx + 3] = png.data[srcIdx + 3];
  }
}

const outBuf = PNG.sync.write(cropped);
fs.writeFileSync('d:\\Kannada_project\\public\\karnataka_map.png', outBuf);
console.log('Saved d:\\Kannada_project\\public\\karnataka_map.png successfully! Size:', outBuf.length);
