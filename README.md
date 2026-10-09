# The Jean Pouch

Static site: denim donation form and a shop with a bag. Plain HTML, CSS and JavaScript. No build step, no backend.

## Structure

```
index.html        page markup
css/styles.css    all styles (colour tokens at the top)
js/boot.js        applies saved theme and language early; splash once per visit
js/i18n.js        English, Sinhala and Tamil text
js/config.js      business details, drop-off points, where forms are sent
js/products.js    shop catalogue
js/art.js         product illustrations (used when a product has no photo)
js/app.js         shop, bag, donation form
netlify.toml      Netlify settings and headers
vercel.json       Vercel settings and headers
```

## Run locally

```
npx serve .
```

## Deploy

- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repo. Publish directory is `.`, no build command.
- **Vercel**: `npx vercel` in this folder, or import the repo. Framework preset "Other", no build command.

## Before launch

1. `js/config.js`: set `whatsappNumber`, `email`, drop-off points and the facts. All current values are samples.
2. `js/products.js`: replace the sample products and prices. Add `image: "assets/photo.jpg"` to use a real photo.
3. Choose how donations and orders reach you (set in `js/config.js`):

| Setting | Result |
| --- | --- |
| `formEndpoint` (e.g. Formspree URL) | Sent silently in the background. Works on any host. |
| `useNetlifyForms: true` | Donations land in the Netlify dashboard. Netlify only. |
| `whatsappNumber` | Opens WhatsApp with the details filled in. |
| none of the above | Opens the visitor's mail app addressed to `email`. |

If you use a form service other than Formspree, add its domain to `connect-src` in the Content-Security-Policy meta tag in `index.html`.

## Pages

Home, How it works, Donate denim, Shop, About and Contact are separate page views inside `index.html`. Each `<section>` is tagged `data-page="name"` and the address shows `#name` (for example `yoursite.com/#shop`), so pages can be linked and the Back button works. The header, footer and bag are shared. To add a page: add a section with a new `data-page`, add its name to `PAGES` in `js/app.js`, and link to `#name`.

## Languages and theme

- The bar at the top switches between English, Sinhala and Tamil, and between light and dark. Both choices are remembered on the visitor's device.
- First visit: the language follows the browser (falls back to English) and the theme follows the device setting.
- Fixed page text: English is in `index.html` on elements marked `data-i18n="key"`; Sinhala and Tamil for the same key are in `js/i18n.js`.
- Products, drop-off points and facts carry their own `{ en, si, ta }` text in `js/products.js` and `js/config.js`.
- Donation and order details always arrive in English, with the visitor's language noted.
- Dark colours are the two dark blocks near the top of `css/styles.css`. Keep them identical.

## Screen sizes

Checked from 320px phones to desktop in all three languages: no sideways scrolling, and every button is at least 44px tall for touch. Breakpoints are at 1040px (menu collapses), 900px (sections stack), 700px (phone layout) and 420px (compact header).

## Payments

There is no online payment. An order sends the bag contents and delivery details to you, and you arrange payment with the buyer. Card payments would need a payment provider's hosted checkout.
