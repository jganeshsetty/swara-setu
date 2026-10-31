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

const inputPath = 'final_best_kannada_rag_dataset.csv';
const outputPath = 'backend/rag_dataset.csv';

const readStream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity
});

let header = null;
let regIdx = -1;
let retIdx = -1;
let count = 0;

writeStream.write('region_name,retrieval_text\n');

rl.on('line', (line) => {
  if (!header) {
    header = parseCSVLine(line);
    // remove BOM if present
    if (header[0].charCodeAt(0) === 0xFEFF) {
      header[0] = header[0].substring(1);
    }
    regIdx = header.indexOf('region_name');
    retIdx = header.indexOf('retrieval_text');
    console.log('Header parsed. region_name index:', regIdx, 'retrieval_text index:', retIdx);
    return;
  }
  const parts = parseCSVLine(line);
  if (parts.length > retIdx && parts[retIdx]) {
    const reg = (parts[regIdx] || '').replace(/"/g, '""');
    const ret = (parts[retIdx] || '').replace(/"/g, '""');
    writeStream.write(`"${reg}","${ret}"\n`);
    count++;
  }
});

rl.on('close', () => {
  writeStream.end();
  console.log(`Compact dataset written to ${outputPath} with ${count} records.`);
});

