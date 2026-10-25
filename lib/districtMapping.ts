/**
 * Server-safe District to Region mapping and metadata
 */

export const DISTRICT_TO_REGION_MAP: Record<string, string> = {
  // 1. Uttara Kalyana (3 districts)
  "Bidar": "uttara_kalyana",
  "Kalaburagi": "uttara_kalyana",
  "Yadgir": "uttara_kalyana",

  // 2. Tungabhadra Belt (4 districts)
  "Raichur": "tungabhadra_belt",
  "Koppal": "tungabhadra_belt",
  "Ballari": "tungabhadra_belt",
  "Vijayanagara": "tungabhadra_belt",

  // 3. Krishna Valley (3 districts)
  "Belagavi": "krishna_valley",
  "Bagalkote": "krishna_valley",
  "Vijayapura": "krishna_valley",

  // 4. Central Hubballi Heartland (3 districts)
  "Dharwad": "hubballi_heartland",
  "Gadag": "hubballi_heartland",
  "Haveri": "hubballi_heartland",

  // 5. Karavali Coast (3 districts)
  "Uttara Kannada": "karavali_coast",
  "Udupi": "karavali_coast",
  "Dakshina Kannada": "karavali_coast",

  // 6. Malnad Ghats (3 districts)
  "Shivamogga": "malnad_ghats",
  "Chikkamagaluru": "malnad_ghats",
  "Kodagu": "malnad_ghats",

  // 7. Bayalu Seeme (3 districts)
  "Davanagere": "bayalu_seeme",
  "Chitradurga": "bayalu_seeme",
  "Tumakuru": "bayalu_seeme",

  // 8. Kaveri Basin (3 districts)
  "Mysuru": "kaveri_basin",
  "Mandya": "kaveri_basin",
  "Chamarajanagara": "kaveri_basin",

  // 9. Southern Heartland (2 districts)
  "Hassan": "dakshina_ghats",
  "Ramanagara": "dakshina_ghats",

  // 10. Eastern Plateau (4 districts)
  "Bengaluru Urban": "kolar_bengaluru",
  "Bengaluru Rural": "kolar_bengaluru",
  "Kolar": "kolar_bengaluru",
  "Chikkaballapura": "kolar_bengaluru",
};

export const KANNADA_DISTRICT_NAMES: Record<string, string> = {
  "Bidar": "ಬೀದರ್",
  "Kalaburagi": "ಕಲಬುರಗಿ",
  "Belagavi": "ಬೆಳಗಾವಿ",
  "Yadgir": "ಯಾದಗಿರಿ",
  "Bagalkote": "ಬಾಗಲಕೋಟೆ",
  "Raichur": "ರಾಯಚೂರು",
  "Koppal": "ಕೊಪ್ಪಳ",
  "Gadag": "ಗದಗ",
  "Ballari": "ಬಳ್ಳಾರಿ",
  "Dharwad": "ಧಾರವಾಡ",
  "Uttara Kannada": "ಉತ್ತರ ಕನ್ನಡ",
  "Haveri": "ಹಾವೇರಿ",
  "Chitradurga": "ಚಿತ್ರದುರ್ಗ",
  "Davanagere": "ದಾವಣಗೆರೆ",
  "Shivamogga": "ಶಿವಮೊಗ್ಗ",
  "Udupi": "ಉಡುಪಿ",
  "Chikkamagaluru": "ಚಿಕ್ಕಮಗಳೂರು",
  "Chikkaballapura": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
  "Hassan": "ಹಾಸನ",
  "Kolar": "ಕೋಲಾರ",
  "Bengaluru Rural": "ಬೆಂಗಳೂರು ಗ್ರಾ.",
  "Dakshina Kannada": "ದಕ್ಷಿಣ ಕನ್ನಡ",
  "Bengaluru Urban": "ಬೆಂಗಳೂರು ನಗರ",
  "Kodagu": "ಕೊಡಗು",
  "Chamarajanagara": "ಚಾಮರಾಜನಗರ",
  "Tumakuru": "ತುಮಕೂರು",
  "Ramanagara": "ರಾಮನಗರ",
  "Mandya": "ಮಂಡ್ಯ",
  "Mysuru": "ಮೈಸೂರು",
  "Vijayapura": "ವಿಜಯಪುರ",
  "Vijayanagara": "ವಿಜಯನಗರ",
};
