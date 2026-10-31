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

const samples = [];
let n = 0;

rl.on('line', (line) => {
  if (n === 0) { n++; return; }
  const parts = parseCSVLine(line);
  if (parts.length >= 2) {
    const reg = parts[0];
    const text = parts[1];
    if (text.includes('Regional or colloquial form:') || text.includes('Regional Kannada example:') || text.includes('Dharwad-labelled target form:')) {
      samples.push({ reg, text });
    }
  }
  n++;
});

rl.on('close', () => {
  console.log(`Total candidate samples: ${samples.length}`);
  // pick interesting ones
  const byRegion = {};
  for (const s of samples) {
    if (!byRegion[s.reg]) byRegion[s.reg] = [];
    if (byRegion[s.reg].length < 4) {
      byRegion[s.reg].push(s.text);
    }
  }
  console.log(JSON.stringify(byRegion, null, 2));
});

