/**
 * Site settings. Edit this file only; no build step is needed.
 * Everything marked SAMPLE is placeholder content to replace before launch.
 * Any text shown to visitors can be a plain string, or { en, si, ta } to translate it.
 */
window.SITE_CONFIG = Object.freeze({
  businessName: "The Jean Pouch",
  currency: "Rs.",

  // Contact details (SAMPLE). WhatsApp number in international format, digits only, e.g. "94771234567".
  whatsappNumber: "",
  email: "hello@thejeanpouch.example",
  phoneDisplay: "",
  instagram: "",

  /**
   * Where donation and order details are sent, tried in this order:
   * 1. formEndpoint  - a form service URL such as https://formspree.io/f/xxxx (works on any host)
   * 2. useNetlifyForms - set true when hosting on Netlify (donation and contact forms)
   * 3. whatsappNumber - opens WhatsApp with the details filled in
   * 4. email          - opens the visitor's mail app with the details filled in
   * Details always arrive in English, whichever language the visitor used.
   */
  // Set true to demo the site without sending anything (used by the in-Claude preview).
  previewMode: false,

  formEndpoint: "",
  useNetlifyForms: false,

  // SAMPLE drop-off points.
  dropoffs: [
    {
      name: { en: "Workshop", si: "වැඩපොළ", ta: "பணிமனை" },
      address: { en: "Sample address line, City", si: "නියැදි ලිපිනය, නගරය", ta: "மாதிரி முகவரி, நகரம்" },
      hours: { en: "Mon to Sat, 9am to 5pm", si: "සඳුදා සිට සෙනසුරාදා, පෙ.ව. 9 සිට ප.ව. 5", ta: "திங்கள் முதல் சனி, காலை 9 முதல் மாலை 5" }
    },
    {
      name: { en: "Partner cafe", si: "හවුල්කාර කැෆේ", ta: "கூட்டாளர் கஃபே" },
      address: { en: "Sample address line, City", si: "නියැදි ලිපිනය, නගරය", ta: "மாதிரி முகவரி, நகரம்" },
      hours: { en: "Daily, 8am to 8pm", si: "දිනපතා, පෙ.ව. 8 සිට ප.ව. 8", ta: "தினமும், காலை 8 முதல் இரவு 8" }
    }
  ],

  // SAMPLE figures. Replace with your own numbers.
  facts: [
    { value: "3", label: { en: "pouches from one pair of adult jeans, on average", si: "සාමාන්‍යයෙන් වැඩිහිටි ජීන්ස් එකකින් සෑදෙන පවුච් ගණන", ta: "சராசரியாக ஒரு பெரியவர் ஜீன்ஸிலிருந்து கிடைக்கும் பவுச்கள்" } },
    { value: "100%", label: { en: "cotton lining in every piece", si: "සෑම නිෂ්පාදනයකම කපු ලයිනිං", ta: "ஒவ்வொரு பொருளிலும் பருத்தி உள்ளுறை" } },
    { value: "0", label: { en: "denim sent to landfill from our workshop", si: "අපේ වැඩපොළෙන් කසළ බිමට යවන ඩෙනිම්", ta: "எங்கள் பணிமனையிலிருந்து குப்பைக்குச் செல்லும் டெனிம்" } }
  ]
});
