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

const REGION_MAP_REV = {
  "ಉತ್ತರ ಕಲ್ಯಾಣ": "uttara_kalyana",
  "ತುಂಗಭದ್ರಾ ತೀರ": "tungabhadra_belt",
  "ಕೃಷ್ಣಾ ಕಣಿವೆ": "krishna_valley",
  "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ": "hubballi_heartland",
  "Dharwad-labelled (source dataset label)": "hubballi_heartland",
  "ಕರಾವಳಿ ಕರ್ನಾಟಕ": "karavali_coast",
  "ಮಲೆನಾಡು ಗಿರಿಧಾಮ": "malnad_ghats",
  "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ": "bayalu_seeme",
  "ಕಾವೇರಿ ಕಣಿವೆ": "kaveri_basin",
  "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು": "dakshina_ghats",
  "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ": "kolar_bengaluru",
};

const rl = readline.createInterface({
  input: fs.createReadStream('backend/rag_dataset.csv'),
  crlfDelay: Infinity
});

const regionPhrases = {
  uttara_kalyana: [],
  tungabhadra_belt: [],
  krishna_valley: [],
  hubballi_heartland: [],
  karavali_coast: [],
  malnad_ghats: [],
  bayalu_seeme: [],
  kaveri_basin: [],
  dakshina_ghats: [],
  kolar_bengaluru: []
};

let lineNo = 0;
rl.on('line', (line) => {
  lineNo++;
  if (lineNo === 1) return;
  const parts = parseCSVLine(line);
  if (parts.length < 2) return;
  const regName = parts[0].trim();
  const text = parts[1].trim();

  const regKey = REGION_MAP_REV[regName];
  if (!regKey || !regionPhrases[regKey]) return;

  // Check parallel
  const mPar = text.match(/Dharwad-labelled target form:\s*(.*?)(?:\.\.|\n|$)/);
  const mStd1 = text.match(/Bookish\/standard Kannada source:\s*(.*?)(?:\.\.|\n|$)/);
  if (mPar && mStd1) {
    const regClean = mPar[1].replace(/Caveat:.*$/, '').trim();
    const stdClean = mStd1[1].replace(/Caveat:.*$/, '').trim();
    if (regClean && stdClean && regionPhrases[regKey].length < 12) {
      regionPhrases[regKey].push({
        textbook: stdClean,
        regional: regClean,
        meaning: "ಪ್ರಾದೇಶಿಕ ಆಡುಮಾತಿನ ವಾಕ್ಯ"
      });
      return;
    }
  }

  // Check regional sentence
  const mReg = text.match(/Regional Kannada example:\s*(.*?)(?:\.\.|\.|\n|$)/);
  const mStd2 = text.match(/Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)/);
  const mMean2 = text.match(/Meaning\/context:\s*(.*?)(?:\.\.|\.|\n|$)/);
  if (mReg && mStd2) {
    if (regionPhrases[regKey].length < 12) {
      regionPhrases[regKey].push({
        textbook: mStd2[1].trim(),
        regional: mReg[1].trim(),
        meaning: mMean2 ? mMean2[1].trim() : "ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟು"
      });
      return;
    }
  }

  // Check lexicon
  const mLex = text.match(/Regional or colloquial form:\s*(.*?)(?:\.\.|\.|\n|$)/);
  const mStd3 = text.match(/Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)/);
  const mMean3 = text.match(/English meaning:\s*(.*?)(?:\.\.|\.|\n|$)/);
  if (mLex && mStd3) {
    if (regionPhrases[regKey].length < 12) {
      regionPhrases[regKey].push({
        textbook: mStd3[1].trim(),
        regional: mLex[1].trim(),
        meaning: mMean3 ? mMean3[1].trim() : "ಪ್ರಾದೇಶಿಕ ಪದ"
      });
      return;
    }
  }
});

rl.on('close', () => {
  for (const [k, v] of Object.entries(regionPhrases)) {
    console.log(k, 'count:', v.length);
  }
  fs.writeFileSync('scripts/extracted_region_phrases.json', JSON.stringify(regionPhrases, null, 2), 'utf8');
  console.log('Saved to scripts/extracted_region_phrases.json');
});

