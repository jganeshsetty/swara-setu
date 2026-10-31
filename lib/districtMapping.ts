/**
 * Server-safe District to Region mapping and metadata
 */

export const DISTRICT_TO_REGION_MAP: Record<string, string> = {
  // 1. Uttara Kalyana (3 districts + aliases)
  "Bidar": "uttara_kalyana",
  "Kalaburagi": "uttara_kalyana",
  "Gulbarga": "uttara_kalyana",
  "Yadgir": "uttara_kalyana",

  // 2. Tungabhadra Belt (4 districts + aliases)
  "Raichur": "tungabhadra_belt",
  "Koppal": "tungabhadra_belt",
  "Ballari": "tungabhadra_belt",
  "Bellary": "tungabhadra_belt",
  "Vijayanagara": "tungabhadra_belt",
  "Hosapete": "tungabhadra_belt",
  "Hampi": "tungabhadra_belt",

  // 3. Krishna Valley (3 districts + aliases)
  "Belagavi": "krishna_valley",
  "Belgaum": "krishna_valley",
  "Bagalkote": "krishna_valley",
  "Bagalkot": "krishna_valley",
  "Vijayapura": "krishna_valley",
  "Bijapur": "krishna_valley",

  // 4. Central Hubballi Heartland (3 districts + aliases)
  "Dharwad": "hubballi_heartland",
  "Hubballi": "hubballi_heartland",
  "Hubli": "hubballi_heartland",
  "Gadag": "hubballi_heartland",
  "Haveri": "hubballi_heartland",

  // 5. Karavali Coast (3 districts + aliases)
  "Uttara Kannada": "karavali_coast",
  "Udupi": "karavali_coast",
  "Dakshina Kannada": "karavali_coast",
  "Mangaluru": "karavali_coast",
  "Mangalore": "karavali_coast",
  "Karwar": "karavali_coast",

  // 6. Malnad Ghats (3 districts + aliases)
  "Shivamogga": "malnad_ghats",
  "Shimoga": "malnad_ghats",
  "Chikkamagaluru": "malnad_ghats",
  "Chikmagalur": "malnad_ghats",
  "Kodagu": "malnad_ghats",
  "Coorg": "malnad_ghats",

  // 7. Bayalu Seeme (3 districts + aliases)
  "Davanagere": "bayalu_seeme",
  "Chitradurga": "bayalu_seeme",
  "Tumakuru": "bayalu_seeme",
  "Tumkur": "bayalu_seeme",

  // 8. Kaveri Basin (3 districts + aliases)
  "Mysuru": "kaveri_basin",
  "Mysore": "kaveri_basin",
  "Mandya": "kaveri_basin",
  "Chamarajanagara": "kaveri_basin",
  "Chamarajanagar": "kaveri_basin",

  // 9. Southern Heartland (2 districts)
  "Hassan": "dakshina_ghats",
  "Ramanagara": "dakshina_ghats",
  "Ramanagar": "dakshina_ghats",

  // 10. Eastern Plateau (4 districts + aliases)
  "Bengaluru Urban": "kolar_bengaluru",
  "Bengaluru Rural": "kolar_bengaluru",
  "Bengaluru": "kolar_bengaluru",
  "Bangalore": "kolar_bengaluru",
  "Kolar": "kolar_bengaluru",
  "Chikkaballapura": "kolar_bengaluru",
  "Chikkaballapur": "kolar_bengaluru",
};

export const KANNADA_DISTRICT_NAMES: Record<string, string> = {
  "Bidar": "ಬೀದರ್",
  "Kalaburagi": "ಕಲಬುರಗಿ",
  "Gulbarga": "ಕಲಬುರಗಿ",
  "Belagavi": "ಬೆಳಗಾವಿ",
  "Belgaum": "ಬೆಳಗಾವಿ",
  "Yadgir": "ಯಾದಗಿರಿ",
  "Bagalkote": "ಬಾಗಲಕೋಟೆ",
  "Bagalkot": "ಬಾಗಲಕೋಟೆ",
  "Raichur": "ರಾಯಚೂರು",
  "Koppal": "ಕೊಪ್ಪಳ",
  "Gadag": "ಗದಗ",
  "Ballari": "ಬಳ್ಳಾರಿ",
  "Bellary": "ಬಳ್ಳಾರಿ",
  "Dharwad": "ಧಾರವಾಡ",
  "Hubballi": "ಹುಬ್ಬಳ್ಳಿ",
  "Hubli": "ಹುಬ್ಬಳ್ಳಿ",
  "Uttara Kannada": "ಉತ್ತರ ಕನ್ನಡ",
  "Karwar": "ಕಾರವಾರ",
  "Haveri": "ಹಾವೇರಿ",
  "Chitradurga": "ಚಿತ್ರದುರ್ಗ",
  "Davanagere": "ದಾವಣಗೆರೆ",
  "Shivamogga": "ಶಿವಮೊಗ್ಗ",
  "Shimoga": "ಶಿವಮೊಗ್ಗ",
  "Udupi": "ಉಡುಪಿ",
  "Chikkamagaluru": "ಚಿಕ್ಕಮಗಳೂರು",
  "Chikmagalur": "ಚಿಕ್ಕಮಗಳೂರು",
  "Chikkaballapura": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
  "Chikkaballapur": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
  "Hassan": "ಹಾಸನ",
  "Kolar": "ಕೋಲಾರ",
  "Bengaluru Rural": "ಬೆಂಗಳೂರು ಗ್ರಾ.",
  "Dakshina Kannada": "ದಕ್ಷಿಣ ಕನ್ನಡ",
  "Bengaluru Urban": "ಬೆಂಗಳೂರು ನಗರ",
  "Bengaluru": "ಬೆಂಗಳೂರು",
  "Bangalore": "ಬೆಂಗಳೂರು",
  "Kodagu": "ಕೊಡಗು",
  "Coorg": "ಕೊಡಗು",
  "Chamarajanagara": "ಚಾಮರಾಜನಗರ",
  "Chamarajanagar": "ಚಾಮರಾಜನಗರ",
  "Tumakuru": "ತುಮಕೂರು",
  "Tumkur": "ತುಮಕೂರು",
  "Ramanagara": "ರಾಮನಗರ",
  "Ramanagar": "ರಾಮನಗರ",
  "Mandya": "ಮಂಡ್ಯ",
  "Mysuru": "ಮೈಸೂರು",
  "Mysore": "ಮೈಸೂರು",
  "Vijayapura": "ವಿಜಯಪುರ",
  "Bijapur": "ವಿಜಯಪುರ",
  "Vijayanagara": "ವಿಜಯನಗರ",
  "Hosapete": "ಹೊಸಪೇಟೆ",
  "Hampi": "ಹಂಪಿ",
  "Mangaluru": "ಮಂಗಳೂರು",
  "Mangalore": "ಮಂಗಳೂರು",
};

/**
 * Case-insensitive lookup for district region ID
 */
export function getRegionIdForDistrict(districtName: string): string {
  if (!districtName) return "kaveri_basin";
  if (DISTRICT_TO_REGION_MAP[districtName]) {
    return DISTRICT_TO_REGION_MAP[districtName];
  }
  const lower = districtName.toLowerCase().trim();
  const entry = Object.entries(DISTRICT_TO_REGION_MAP).find(
    ([k]) => k.toLowerCase() === lower
  );
  return entry ? entry[1] : "kaveri_basin";
}

/**
 * Safe lookup for Kannada district name
 */
export function getKannadaDistrictName(districtName: string): string {
  if (!districtName) return "";
  if (KANNADA_DISTRICT_NAMES[districtName]) {
    return KANNADA_DISTRICT_NAMES[districtName];
  }
  const lower = districtName.toLowerCase().trim();
  const entry = Object.entries(KANNADA_DISTRICT_NAMES).find(
    ([k]) => k.toLowerCase() === lower
  );
  return entry ? entry[1] : districtName;
}
