const fs = require('fs');
const d3Geo = require('d3-geo');

const geoData = JSON.parse(fs.readFileSync('public/karnataka_districts.geojson', 'utf8'));
const width = 800;
const height = 1000;

// Fit to 800 x 1000 with 30px padding
const projection = d3Geo.geoMercator().fitExtent([[30, 30], [width - 30, height - 30]], geoData);
const pathGenerator = d3Geo.geoPath().projection(projection);

// Regional dialect colors
const REGION_PALETTE = {
  uttara_kalyana: '#FFE500',      // Arishina yellow
  krishna_valley: '#F59E0B',      // Amber
  tungabhadra_belt: '#F97316',    // Orange
  hubballi_heartland: '#FB923C',  // Light orange
  karavali_coast: '#0EA5E9',      // Ocean blue
  malnad_ghats: '#10B981',        // Lush green
  bayalu_seeme: '#F43F5E',        // Rose
  kaveri_basin: '#D92D20',        // Kumkuma crimson
  dakshina_ghats: '#B91C1C',      // Deep red
  kolar_bengaluru: '#EAAA08'      // Karnataka gold
};

const DISTRICT_TO_REGION = {
  'Bidar': 'uttara_kalyana', 'Kalaburagi': 'uttara_kalyana', 'Yadgir': 'uttara_kalyana',
  'Belagavi': 'krishna_valley', 'Bagalkote': 'krishna_valley', 'Vijayapura': 'krishna_valley',
  'Raichur': 'tungabhadra_belt', 'Koppal': 'tungabhadra_belt', 'Ballari': 'tungabhadra_belt', 'Vijayanagara': 'tungabhadra_belt',
  'Dharwad': 'hubballi_heartland', 'Gadag': 'hubballi_heartland', 'Haveri': 'hubballi_heartland',
  'Uttara Kannada': 'karavali_coast', 'Udupi': 'karavali_coast', 'Dakshina Kannada': 'karavali_coast',
  'Shivamogga': 'malnad_ghats', 'Chikkamagaluru': 'malnad_ghats', 'Kodagu': 'malnad_ghats', 'Hassan': 'malnad_ghats',
  'Davangere': 'bayalu_seeme', 'Chitradurga': 'bayalu_seeme', 'Tumakuru': 'bayalu_seeme',
  'Mysuru': 'kaveri_basin', 'Mandya': 'kaveri_basin', 'Chamarajanagara': 'dakshina_ghats',
  'Bengaluru Urban': 'kolar_bengaluru', 'Bengaluru Rural': 'kolar_bengaluru', 'Ramanagara': 'kolar_bengaluru',
  'Kolar': 'kolar_bengaluru', 'Chikkaballapura': 'kolar_bengaluru'
};

let paths = '';
let centroidMarkers = '';

geoData.features.forEach((f, idx) => {
  const d = pathGenerator(f);
  const name = f.properties.district || '';
  const region = DISTRICT_TO_REGION[name] || 'kaveri_basin';
  const color = REGION_PALETTE[region] || '#EAAA08';
  const [cx, cy] = pathGenerator.centroid(f);

  paths += `  <path id="district-${idx}" d="${d}" fill="${color}" fill-opacity="0.88" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round" class="district-path transition-all duration-200 hover:fill-opacity-100 hover:brightness-105 cursor-pointer">
    <title>${name} (${region.replace('_', ' ')})</title>
  </path>\n`;

  if (!isNaN(cx) && !isNaN(cy)) {
    centroidMarkers += `  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.5" fill="#FFFFFF" opacity="0.75" pointer-events="none" />\n`;
  }
});

// Full detailed authentic Karnataka Map SVG
const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <filter id="map-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#D92D20" flood-opacity="0.16" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#EAAA08" flood-opacity="0.22" />
    </filter>
  </defs>
  <g filter="url(#map-glow)">
${paths}
${centroidMarkers}
  </g>
</svg>`;

fs.writeFileSync('public/karnataka-real-map.svg', fullSvg);
console.log('Successfully wrote public/karnataka-real-map.svg (' + fullSvg.length + ' bytes)');

// Also generate a dedicated clean logo SVG (100x100 square viewBox)
const logoProjection = d3Geo.geoMercator().fitExtent([[6, 6], [94, 94]], geoData);
const logoPathGen = d3Geo.geoPath().projection(logoProjection);

let logoPaths = '';
geoData.features.forEach(f => {
  const d = logoPathGen(f);
  const name = f.properties.district || '';
  const region = DISTRICT_TO_REGION[name] || 'kaveri_basin';
  const color = REGION_PALETTE[region] || '#EAAA08';
  logoPaths += `<path d="${d}" fill="${color}" stroke="#FFFFFF" stroke-width="0.8" />`;
});

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="flag-glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EAAA08" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#D92D20" stop-opacity="0.2" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#flag-glow)" />
  <g transform="translate(0, 0)">
    ${logoPaths}
  </g>
</svg>`;

fs.writeFileSync('public/karnataka-logo.svg', logoSvg);
console.log('Successfully wrote public/karnataka-logo.svg (' + logoSvg.length + ' bytes)');

