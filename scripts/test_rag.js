const fs = require('fs');
const readline = require('readline');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

const rl = readline.createInterface({
  input: fs.createReadStream('backend/rag_dataset.csv'),
  crlfDelay: Infinity
});

const regions = {};
let total = 0;

rl.on('line', (line) => {
  if (total === 0) { total++; return; }
  const parts = parseCSVLine(line);
  if (parts.length >= 2) {
    const r = parts[0];
    regions[r] = (regions[r] || 0) + 1;
  }
  total++;
});

rl.on('close', () => {
  console.log('Unique region_name in rag_dataset.csv:');
  console.log(regions);
});
