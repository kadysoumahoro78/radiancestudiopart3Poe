# Changelog

All notable changes to the Radiance Studio website are recorded in this file
(and mirrored in the Changelog section of `README.md`), from the Part 1
submission through to Part 3.

## [3.0.0] — Part 3 submission

### 1. Working through feedback from Part 2
Corrections and improvements made to what was submitted in Part 2:

- **Fixed — page was not truly responsive on phones.** None of the six pages had a
  `<meta name="viewport">` tag, so the Part 2 media queries (≤900px / ≤600px) would
  not trigger on real mobile devices. Added `charset` and `viewport` meta tags to
  every page.
- **Fixed — video path case mismatch.** Pages referenced `IMAGES/download.mp4`
  while the file was `Download.mp4`; this works on Windows but breaks on
  case-sensitive hosting such as GitHub Pages/Linux. The video is now
  `IMAGES/radiance-studio-showreel.mp4` and referenced consistently.
- **Fixed — documentation gaps.** The README listed a `REFERENCES.md` that did not
  exist, had an unfinished "Open `home page.html` in a browser, **or**" step, and
  pointed to the old file names. Added `REFERENCES.md`, completed the run
  instructions, updated the structure and page table, and added this changelog
  section to the README as required.
- **Improved — hero video.** The showreel is a portrait (9:16) clip that was being
  stretched and cropped across a 1080px-wide banner. It now appears as a centred
  portrait card with a poster image and `preload="none"`.
- **Improved — heading structure.** Every page used the same `<h1>`
  ("Radiance Studio"). Each page now has its own descriptive `<h1>`, and card
  headings that skipped from `<h2>` to `<h4>` were corrected to `<h3>`.
- **Improved — table markup.** Pricing tables used a `<tr>` of `<th>` with no
  `<thead>`/`<tbody>` and relied on `!important` overrides to hide the old
  `border="4"` attribute. They are now proper `<thead>`/`<tbody>` tables
  generated from data, and the `!important` overrides were removed.
- **Improved — text and copy.** Corrected spelling, spacing and run-on sentences
  (e.g. "yours.gives you confidence", "hairdressing.We believe", "african",
  "one of the best braider in the business") and the "Get In Touch" intro, which
  ended mid-thought ("give us a call.").
- **Improved — colour contrast.** Primary buttons, outline buttons and links used
  the lighter rose/brown, which was below the WCAG AA contrast ratio for small
  text. Added darker `--rose-deep` and `--brown-deep` tokens for text and button
  backgrounds; the original palette is still used for accents.
- **Improved — navigation label.** "service" renamed to "services".
- **Changed — `@import` for Google Fonts** (render-blocking, inside the CSS)
  replaced with `<link rel="preconnect">` + `<link rel="stylesheet">` in each
  page `<head>`.

### 2. Functionality — JavaScript enhancements
#### 2.1 Interactive elements
- **Added** jQuery 3.7.1 (local copy) and shared script `js/main.js`.
- **Added** accordion (home page FAQ) — jQuery slide animation, keyboard + ARIA.
- **Added** tabs (services page categories) — ARIA tablist with arrow-key support.
- **Added** modal dialog (service "Details") with focus trap and Escape-to-close.
- **Added** interactive map (contact page) using Leaflet + OpenStreetMap, with a
  marker and popup per studio, "Show on map" buttons, a "Show both studios"
  button and a "Find my nearest studio" geolocation feature. **Replaced** the two
  Google Maps `<iframe>`s (kept inside `<noscript>` as a fallback).
- **Added** animations and transitions: page fade-in, hero entrance, scroll-reveal,
  animated counters, header shrink on scroll, card/button hover lifts,
  gallery zoom, mobile menu icon animation; all disabled for users who prefer
  reduced motion.
- **Added** advanced DOM manipulation: dynamically created back-to-top button,
  lightbox, modal, tabs, result panels, inline errors and counters; grouped
  `<optgroup>` service list; share links pointed at the current page.
- **Added** gallery lightbox (click to enlarge, previous/next, keyboard, swipe,
  focus trap) and a category filter (All / Braids / Locs / Wigs / Colour).
  Gallery images are wrapped in links to the full-size image so they still open
  without JavaScript.
- **Added** mobile navigation toggle (hamburger) — the menu stays fully visible
  when JavaScript is off.

#### 2.2 Dynamic content
- **Added** `js/services-data.js` (price list data) and `js/services.js`, which
  renders the price list dynamically.
- **Added** live search, category filter, and sort (price ascending/descending,
  name A–Z/Z–A) on the services page, with a result counter and an empty-state
  message. Deep links such as `services.html#colouring` open the matching tab.
- **Changed** the static pricing tables into generated tables; a `<noscript>`
  copy preserves the list without JavaScript.

### 3. Search Engine Optimisation (SEO)
#### 3.1 On-page
- **Added** keyword research (`SEO.md`) and worked target keywords into headings,
  copy, alt text and meta data.
- **Added** unique, keyword-based `<title>` and `<meta name="description">` for each
  page; plus `keywords`, `robots`, canonical, Open Graph and Twitter Card tags.
- **Changed** header tags: one `<h1>` per page, logical `<h2>`/`<h3>` order.
- **Changed** image optimisation: descriptive file names
  (`baleb.jpg` → `balayage-braids-johannesburg.jpg`, `diffstyles.jpg` →
  `braiding-styles-menu.jpg`, `menbraids.jpg` → `mens-cornrow-braids.jpg`,
  `locs.jpg` → `coloured-locs-burgundy.jpg`, `wigs.jpg` →
  `wig-installation-lace-front.jpg`, `dye.jpg` → `hair-colour-inspiration.jpg`,
  `studioo.png` → `radiance-studio-logo.png`); descriptive alt text; explicit
  `width`/`height`; WebP versions with JPEG fallback in `<picture>`.
- **Changed** URL structure: `home page.html` → `index.html`,
  `about us.html` → `about.html` (no spaces, clean lowercase names). All links,
  navigation and the sitemap were updated.
- **Added** internal linking between related pages (home ↔ services/gallery/about,
  services ↔ enquiry, team profiles → matching service sections, deep links to
  service categories, footer navigation, logo → home).
- **Added** mobile-friendliness: viewport meta, responsive layout kept and extended,
  tap-friendly navigation.
- **Added** `HairSalon` structured data (JSON-LD) for both studios (address, phone,
  opening hours, coordinates) on the home and contact pages.
#### 3.2 Off-page
- **Added** social share links in the footer (Facebook, WhatsApp, Pinterest, X),
  automatically pointing at the page being viewed.
- **Added** a documented backlink, social media and local-SEO plan in `SEO.md`
  (Google Business Profile, directory listings, consistent name/address/phone).
#### 3.3 Additional requests
- **Added** `robots.txt` (allows the site, blocks `/DOCUMENTS/`, links the sitemap).
- **Added** `sitemap.xml` listing all six pages.
- **Added** page-speed work: images resized and converted to WebP, lazy-loading
  below the fold, `decoding="async"`, deferred scripts, video `preload="none"` with
  poster, font preconnect, local jQuery/Leaflet.
- **Added** security: Content-Security-Policy meta tag, referrer policy,
  `rel="noopener noreferrer"` on external links, user input only ever written with
  `.text()`, input validation, honeypot field, no inline scripts or styles.

### 4. Forms
- **Changed** `enquiry.html`: rebuilt the form with grouped service selection,
  conditional hair-length field, date limits, message counter and consent box.
  Validated input is processed into a response showing **estimated cost** and
  **availability**, and is submitted with **AJAX**. Supports pre-selecting a service
  from the Services page (`enquiry.html?service=balayage`).
- **Added** form on `contact.html`: contact details, **type of message**, full
  message; validated and **compiled into an email** the visitor sends to the
  recipient set in the code (`mailto:`), with copy-to-clipboard.
- **Added** `js/forms.js`: client-side validation (phone, dates, name, email,
  lengths), inline accessible error messages, `novalidate` only when JavaScript
  is running (HTML5 validation remains the fallback).

### 5. Design (visual) — no change to page structure
- **Changed** `CSS/style.css` — same palette, fonts and layout approach, with:
  decorative hero rings, portrait video card, stats band, numbered "why choose us"
  items, card layouts for services and team, richer tables, pill buttons, dark
  result panels, redesigned footer with four columns, focus styles, skip link.
  New sections for the accordion, tabs, modal, lightbox, map and forms; the
  responsive tablet/mobile breakpoints were retained and extended.
- **Added** stats band on the home page (2 studios · 6 days a week · 12+ years).
- **Removed** the empty `JAVA SCRIPT/` folder from the project; scripts live in `js/`.

## [2.0.0] — Part 2 submission

### Added
- **External stylesheet** (`CSS/style.css`) linked from every page, replacing
  Part 1's unstyled markup and inline `style=""` attributes.
- **Design system**: CSS custom properties for colour palette, fonts, spacing and
  border radius, reused consistently across every page.
- **Typography system**: Cormorant Garamond (headings) with Jost (body), fluid
  type scale using `clamp()`.
- **Layout structure**: sticky header, full-width pink hero band with an
  overlapping video card, centred `<main>` column, card/grid layouts.
- **Pseudo-classes / pseudo-elements**: `:hover`, `:focus-visible`, `:active`,
  `:nth-child(even)`, `:last-child`, `:first-of-type`/`:last-of-type`, `::before`,
  `::after`, `::marker`, `::selection`.
- **Responsive design** with tablet (≤900px) and mobile (≤600px) breakpoints.
- **Navigation menu** with animated underline and pink current-page indicator.
- **Image adjustments**: consistent gallery crops, hover-zoom with caption overlay,
  circular outlined logo.
- **Enquiry page** wired into the shared stylesheet and navigation.
- `README.md`, `CHANGELOG.md` and `REFERENCES.md` planned to document the project.

### Changed
- Pricing tables rebuilt from bare `border="4"` tables to a styled component.
- Plain-text calls-to-action replaced with a consistent `.btn` component.
- Removed redundant `<u>`/`<i>` heading wrappers.
- Hero heading shortened to "Radiance Studio".
- Logo enlarged with a pink ring.
- Colour balance iterated twice (more pink/rose accents; flat pink hero band).

### Fixed
- Removed inline `background-color` on `<body>`.
- Removed inline `width`/`height` on logo and gallery images.
- Fixed case-mismatched stylesheet path (`css/style.css` → `CSS/style.css`) and
  removed a reference to a non-existent script (`js/script.js`).
- Corrected image paths to the shared `IMAGES/` folder.

## [1.0.0] — Part 1 submission (baseline)
- Six-page site structure: Home, About Us, Services, Gallery, Enquiry, Contact.
- Semantic HTML skeleton with header, nav, main/section content, footer.
- Services pricing as plain HTML tables.
- Enquiry page with a service-enquiry form.
- Contact page with two studio locations and embedded Google Maps.
- Known limitations carried into Part 2: no external stylesheet, no responsive
  behaviour, no consistent type/colour/spacing system, broken stylesheet/script
  references on the Enquiry page, no README/changelog/references.
