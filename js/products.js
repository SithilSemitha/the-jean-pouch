/**
 * Shop catalogue (SAMPLE). Add, remove or edit entries here.
 * category: "pouches" | "carriers" | "bags"  (labels are in js/i18n.js under cat.*)
 * shape: "pencil" | "bottle" | "tote" | "pouch" | "sleeve"  (picks the illustration)
 * name and blurb can be a plain string, or { en, si, ta }.
 * To use a photo instead of the illustration, add image: "assets/your-photo.jpg".
 */
window.PRODUCTS = Object.freeze([
  { id: "pencil-case", category: "pouches", price: 1450, shape: "pencil", tones: [2, 0, 3, 1],
    name: { en: "Patchwork pencil case", si: "පැච්වර්ක් පැන්සල් කවරය", ta: "பேட்ச்வொர்க் பென்சில் பெட்டி" },
    blurb: { en: "Zip top, cotton lined. Holds about 20 pens.", si: "සිප් එකක් සහ කපු ලයිනිං සහිතයි. පෑන් 20ක් පමණ දැමිය හැක.", ta: "மேலே ஜிப், பருத்தி உள்ளுறை. சுமார் 20 பேனாக்கள் வைக்கலாம்." } },
  { id: "bottle-sling", category: "carriers", price: 1950, shape: "bottle", tones: [1, 3, 0, 2],
    name: { en: "Bottle sling", si: "බෝතල් බෑගය", ta: "பாட்டில் பை" },
    blurb: { en: "Adjustable strap. Fits bottles up to 750 ml.", si: "සකස් කළ හැකි පටියක්. මි.ලී. 750 දක්වා බෝතල් සඳහා.", ta: "சரிசெய்யக்கூடிய பட்டை. 750 மி.லி. வரையிலான பாட்டில்களுக்கு." } },
  { id: "market-tote", category: "bags", price: 3200, shape: "tote", tones: [0, 2, 1, 3],
    name: { en: "Market tote", si: "වෙළඳපොළ ටෝට් බෑගය", ta: "சந்தை டோட் பை" },
    blurb: { en: "Wide base, inner pocket, handles cut from waistbands.", si: "පළල් පතුල, ඇතුළු සාක්කුව, ඉණ පටිවලින් කැපූ අත්ලි.", ta: "அகலமான அடிப்பகுதி, உள் பாக்கெட், இடுப்புப் பட்டியிலிருந்து வெட்டிய கைப்பிடிகள்." } },
  { id: "pocket-pouch", category: "pouches", price: 1250, shape: "pouch", tones: [3, 1, 2, 0],
    name: { en: "Back-pocket pouch", si: "පසුපස සාක්කු පවුච් එක", ta: "பின் பாக்கெட் பவுச்" },
    blurb: { en: "Made around an original jeans pocket. Zip closure.", si: "මුල් ජීන්ස් සාක්කුවක් වටා සාදා ඇත. සිප් එකක් සහිතයි.", ta: "அசல் ஜீன்ஸ் பாக்கெட்டைச் சுற்றி உருவாக்கப்பட்டது. ஜிப் மூடி." } },
  { id: "laptop-sleeve", category: "carriers", price: 3600, shape: "sleeve", tones: [1, 0, 2, 3],
    name: { en: "Laptop sleeve, 14 inch", si: "ලැප්ටොප් කවරය, අඟල් 14", ta: "லேப்டாப் உறை, 14 அங்குலம்" },
    blurb: { en: "Padded and lined, with a button flap.", si: "පෑඩ් සහ ලයිනිං සහිතයි, බොත්තම් පියනක් ඇත.", ta: "மெத்தை மற்றும் உள்ளுறையுடன், பொத்தான் மடிப்பு." } },
  { id: "coin-purse", category: "pouches", price: 750, shape: "pouch", tones: [0, 3, 1, 2],
    name: { en: "Coin purse", si: "කාසි පසුම්බිය", ta: "நாணயப் பை" },
    blurb: { en: "Palm sized. Cut from the smallest offcuts.", si: "අත්ලට ගැළපෙන ප්‍රමාණය. කුඩාම රෙදි කැබලිවලින් කපා ඇත.", ta: "உள்ளங்கை அளவு. மிகச் சிறிய துண்டுகளிலிருந்து வெட்டப்பட்டது." } },
  { id: "mini-tote", category: "bags", price: 2400, shape: "tote", tones: [2, 3, 0, 1],
    name: { en: "Lunch tote", si: "දිවා ආහාර බෑගය", ta: "மதிய உணவுப் பை" },
    blurb: { en: "Upright shape for a lunch box and a bottle.", si: "කෑම පෙට්ටියකට සහ බෝතලයකට ගැළපෙන සිරස් හැඩය.", ta: "உணவுப் பெட்டி மற்றும் பாட்டிலுக்கு ஏற்ற நிமிர்ந்த வடிவம்." } },
  { id: "brush-roll", category: "pouches", price: 1650, shape: "pencil", tones: [3, 2, 1, 0],
    name: { en: "Makeup and brush case", si: "මේකප් සහ බුරුසු කවරය", ta: "மேக்கப் மற்றும் பிரஷ் பெட்டி" },
    blurb: { en: "Wipe-clean lining, wide zip opening.", si: "පිස දැමිය හැකි ලයිනිං, පළල් සිප් විවරය.", ta: "துடைத்துச் சுத்தம் செய்யக்கூடிய உள்ளுறை, அகலமான ஜிப் திறப்பு." } }
]);
