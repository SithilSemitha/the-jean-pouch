/**
 * Shop catalogue (SAMPLE). Add, remove or edit entries here.
 * category: "pouches" | "carriers" | "bags"  (labels are in js/i18n.js under cat.*)
 * shape: "pencil" | "bottle" | "tote" | "pouch" | "sleeve"  (picks the illustration)
 * name and blurb can be a plain string, or { en, si, ta }.
 * To use a photo instead of the illustration, add image: "assets/your-photo.jpg".
 */
window.PRODUCTS = Object.freeze([
  { id: "bottle-cover", category: "carriers", price: 600, shape: "bottle", tones: [1, 3, 0, 2],
    name: { en: "Bottle cover", si: "බෝතල් කවරය", ta: "பாட்டில் உறை" },
    blurb: { en: "A reusable cover made from denim.", si: "ඩෙනිම්වලින් මැසූ නැවත භාවිත කළ හැකි කවරයක්.", ta: "டெனிமால் செய்யப்பட்ட மீண்டும் பயன்படுத்தக்கூடிய உறை." } },
  { id: "pouch", category: "pouches", price: 750, shape: "pouch", tones: [3, 1, 2, 0],
    name: { en: "Pouch", si: "පවුච්", ta: "பவுச்" },
    blurb: { en: "A handy pouch made from repurposed denim.", si: "නැවත භාවිත කළ ඩෙනිම්වලින් සෑදූ ප්‍රයෝජනවත් පවුච් එකක්.", ta: "மறுபயன்பாட்டு டெனிமால் செய்யப்பட்ட பயனுள்ள பவுச்." } },
  { id: "laptop-bag", category: "bags", price: 1000, shape: "sleeve", tones: [1, 0, 2, 3],
    name: { en: "Laptop bag", si: "ලැප්ටොප් බෑගය", ta: "லேப்டாப் பை" },
    blurb: { en: "A protective laptop bag made from denim.", si: "ඩෙනිම්වලින් සෑදූ ලැප්ටොප් ආරක්ෂිත බෑගයක්.", ta: "டெனிமால் செய்யப்பட்ட பாதுகாப்பான லேப்டாப் பை." } }
]);
