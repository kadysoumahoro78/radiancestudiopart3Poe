# Radiance Studio — Website

A responsive, multi-page website for Radiance Studio, a hair studio based in
Johannesburg (Sandton and Rosebank). Built for the WEDE5020 (Web Development
Introduction) Portfolio of Evidence — Part 2 (styling) and Part 3
(JavaScript, SEO, forms).

## About the project

The site introduces the salon, lists services and pricing, showcases a gallery
of past work, and gives visitors two ways to get in touch: an online service
enquiry (instant cost estimate and availability) and a contact page with an
interactive map and a message form.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Studio introduction, highlights, services preview, FAQ accordion |
| About Us | `about.html` | Studio story, mission & vision, team profiles |
| Services | `services.html` | Dynamic price list with tabs, search, sorting and detail pop-ups |
| Gallery | `gallery.html` | Filterable photo gallery with a lightbox |
| Enquiry | `enquiry.html` | Service enquiry form → estimated cost + availability |
| Contact | `contact.html` | Interactive Leaflet map, studio details, message form → email |

## Tech stack

- **HTML5** — semantic page structure, structured data (JSON-LD)
- **CSS3** — one external stylesheet (`CSS/style.css`): custom properties,
  Flexbox/Grid, pseudo-classes/elements, two responsive breakpoints
  (tablet ≤900px, mobile ≤600px), animations and transitions
- **JavaScript + jQuery 3.7.1** — interactivity, dynamic content, form
  validation and AJAX (`js/`)
- **Leaflet 1.9.4** + OpenStreetMap tiles — interactive studio map
- **Google Fonts** — Cormorant Garamond (headings) and Jost (body text)

jQuery and Leaflet are stored locally in `js/vendor/` (no CDN dependency, faster
and safer). See `REFERENCES.md` for licences and sources.

## Part 3 features

### JavaScript enhancements
| Requirement | Where | How |
|---|---|---|
| Accordion | Home → FAQ | jQuery `slideDown/slideUp`, ARIA `aria-expanded`, one panel open at a time |
| Tabs | Services | Category tabs (`role="tablist"`) with arrow-key navigation |
| Modal | Services → "Details" | Accessible dialog: focus trap, Escape to close, links to the enquiry form |
| Interactive map | Contact | Leaflet map, two markers + popups, "Show on map", **"Find my nearest studio"** (geolocation) |
| Animations / transitions | All pages | CSS keyframes, scroll-reveal (IntersectionObserver), animated counters, header shrink, hover lifts. Respects `prefers-reduced-motion` |
| Advanced DOM manipulation | `main.js`, `services.js`, `forms.js` | Elements created in JS (back-to-top button, lightbox, modal, tabs, result panels, error messages, character counters, rebuilt `<select>` with `<optgroup>`s); all user text inserted with `.text()` |
| Gallery + lightbox | Gallery | Click to enlarge, next/previous, keyboard arrows, swipe, Escape, focus trap, category filter |

### Dynamic content
- `js/services-data.js` holds the price list (single source of truth).
- `services.html` builds its tables from that data with JavaScript, and offers
  **search** (live), **category filtering** (tabs) and **sorting** (price low/high,
  name A–Z/Z–A; "price on consultation" always sorts last).
- The same data builds the service drop-down on the enquiry page and drives the
  cost estimate.
- A `<noscript>` copy of the price list keeps the page useful without JavaScript.

### Forms (`enquiry.html` and `contact.html`)
- **Enquiry form** — service (grouped drop-down), hair length (appears only when
  the price depends on it), preferred date, studio, message, consent.
  After validation it shows a response with the **estimated cost** and
  **availability** for the chosen date/studio, and submits asynchronously with
  **AJAX** (`$.ajax`) to the form's `action` URL.
- **Contact form** — name, email, optional phone, **type of message**, full
  message. After validation it **compiles an email** (recipient, subject, body)
  that the visitor sends with one click ("Send email" opens their mail app via
  `mailto:`) or copies. The recipient is set in the form's `data-recipient` /
  `action` attribute in `contact.html`.
- **Validation** — HTML5 attributes (`required`, `type`, `pattern`, `minlength`,
  `maxlength`) as a no-JavaScript fallback, plus JavaScript validation with
  inline error messages: South African phone numbers, dates (no past dates, no
  Sundays, within 12 months), name characters, email format, message lengths.
- **Spam protection** — hidden honeypot field.

> **Before deploying — two values to set**
> 1. **Contact recipient:** replace `hello@radiancestudio.example` in
>    `contact.html` (both the `action` and `data-recipient` attributes).
> 2. **AJAX endpoint:** `enquiry.html` posts to
>    `https://formspree.io/f/REPLACE_WITH_FORM_ID`. Until a real form ID (or any
>    endpoint that accepts form posts and returns JSON) is set, the page runs in
>    *demo mode*: it validates and shows the cost/availability response in the
>    browser and clearly says no email was sent.
>
> Availability times are **indicative** (generated per date and studio), and
> are labelled that way to the visitor; cost estimates come from the price list.

### Search Engine Optimisation (SEO)
Full details and the keyword research are in `SEO.md`. In short:
- **On-page:** unique `<title>` and meta description per page, one `<h1>` per
  page with a logical H2/H3 hierarchy, descriptive image file names and alt text,
  clean URLs (`index.html`, `about.html`, …), internal links between related
  pages, mobile-friendly viewport and responsive layout, canonical URLs, Open
  Graph / Twitter cards, `HairSalon` structured data (JSON-LD) for both studios.
- **Off-page / local:** share links, consistent name-address-phone details,
  local-business markup and a documented backlink / social / Google Business
  Profile plan in `SEO.md`.
- **Additional requests:** `robots.txt`, `sitemap.xml`, page-speed work
  (WebP images with JPEG fallback, correct image sizes, lazy-loading, deferred
  scripts, video `preload="none"` with a poster, font preconnect, local
  libraries) and security measures (Content-Security-Policy, referrer policy,
  `rel="noopener noreferrer"`, no `innerHTML` with user input, validation, honeypot).

> The domain `https://radiancestudio.example/` used in canonical links,
> `sitemap.xml`, `robots.txt` and structured data is a **placeholder**. Replace
> it with the real address when the site is published.

## Folder structure

```
Radiance studio/
├── index.html
├── about.html
├── services.html
├── gallery.html
├── enquiry.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── CSS/
│   └── style.css
├── js/
│   ├── main.js            shared: nav, animations, accordion, modal, gallery + lightbox
│   ├── services-data.js   price list data
│   ├── services.js        dynamic services page, tabs, search, sort
│   ├── forms.js           validation, enquiry response + AJAX, contact email
│   ├── map.js             Leaflet map
│   └── vendor/            jQuery + Leaflet (local copies)
├── IMAGES/                optimised images (WebP + JPEG), logo, poster, showreel video
├── DOCUMENTS/
├── README.md              (repository root)
├── CHANGELOG.md           (repository root)
├── REFERENCES.md          (repository root)
└── SEO.md                 (repository root)
```

## Running the site locally

No build step is required — it is static HTML, CSS and JavaScript.

1. Download or clone the repository.
2. Open `Radiance studio/index.html` in a browser, **or** serve the folder
   (for example `python -m http.server` inside `Radiance studio/`) and visit
   `http://localhost:8000`.

An internet connection is needed for the Google Fonts and the map tiles; the
rest works offline.

## Design notes

The colour palette (plum, rose/pink, gold, brown, cream, ivory), fonts and page
structure were kept from Part 1 and Part 2. Part 3 refined the visual design
(decorative hero, card layouts, stats band, dark result panels, footer) and added
the interactive layer on top without restructuring the original markup.
Accessibility: skip link, visible focus states, ARIA for tabs/accordion/dialogs,
darker rose for text contrast, reduced-motion support.

## Changelog

> Every edit made after the Part 2 marks and feedback is recorded here (the same
> text is kept in `CHANGELOG.md`). Part 1 → Part 2 history is retained below it.

### [3.0.0] — Part 3 submission

#### 1. Working through feedback from Part 2
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

#### 2. Functionality — JavaScript enhancements
##### 2.1 Interactive elements
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

##### 2.2 Dynamic content
- **Added** `js/services-data.js` (price list data) and `js/services.js`, which
  renders the price list dynamically.
- **Added** live search, category filter, and sort (price ascending/descending,
  name A–Z/Z–A) on the services page, with a result counter and an empty-state
  message. Deep links such as `services.html#colouring` open the matching tab.
- **Changed** the static pricing tables into generated tables; a `<noscript>`
  copy preserves the list without JavaScript.

#### 3. Search Engine Optimisation (SEO)
##### 3.1 On-page
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
##### 3.2 Off-page
- **Added** social share links in the footer (Facebook, WhatsApp, Pinterest, X),
  automatically pointing at the page being viewed.
- **Added** a documented backlink, social media and local-SEO plan in `SEO.md`
  (Google Business Profile, directory listings, consistent name/address/phone).
##### 3.3 Additional requests
- **Added** `robots.txt` (allows the site, blocks `/DOCUMENTS/`, links the sitemap).
- **Added** `sitemap.xml` listing all six pages.
- **Added** page-speed work: images resized and converted to WebP, lazy-loading
  below the fold, `decoding="async"`, deferred scripts, video `preload="none"` with
  poster, font preconnect, local jQuery/Leaflet.
- **Added** security: Content-Security-Policy meta tag, referrer policy,
  `rel="noopener noreferrer"` on external links, user input only ever written with
  `.text()`, input validation, honeypot field, no inline scripts or styles.

#### 4. Forms
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

#### 5. Design (visual) — no change to page structure
- **Changed** `CSS/style.css` — same palette, fonts and layout approach, with:
  decorative hero rings, portrait video card, stats band, numbered "why choose us"
  items, card layouts for services and team, richer tables, pill buttons, dark
  result panels, redesigned footer with four columns, focus styles, skip link.
  New sections for the accordion, tabs, modal, lightbox, map and forms; the
  responsive tablet/mobile breakpoints were retained and extended.
- **Added** stats band on the home page (2 studios · 6 days a week · 12+ years).
- **Removed** the empty `JAVA SCRIPT/` folder from the project; scripts live in `js/`.

### [2.0.0] — Part 2 submission

#### Added
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

#### Changed
- Pricing tables rebuilt from bare `border="4"` tables to a styled component.
- Plain-text calls-to-action replaced with a consistent `.btn` component.
- Removed redundant `<u>`/`<i>` heading wrappers.
- Hero heading shortened to "Radiance Studio".
- Logo enlarged with a pink ring.
- Colour balance iterated twice (more pink/rose accents; flat pink hero band).

#### Fixed
- Removed inline `background-color` on `<body>`.
- Removed inline `width`/`height` on logo and gallery images.
- Fixed case-mismatched stylesheet path (`css/style.css` → `CSS/style.css`) and
  removed a reference to a non-existent script (`js/script.js`).
- Corrected image paths to the shared `IMAGES/` folder.

### [1.0.0] — Part 1 submission (baseline)
- Six-page site structure: Home, About Us, Services, Gallery, Enquiry, Contact.
- Semantic HTML skeleton with header, nav, main/section content, footer.
- Services pricing as plain HTML tables.
- Enquiry page with a service-enquiry form.
- Contact page with two studio locations and embedded Google Maps.
- Known limitations carried into Part 2: no external stylesheet, no responsive
  behaviour, no consistent type/colour/spacing system, broken stylesheet/script
  references on the Enquiry page, no README/changelog/references.

## Author

Student number: ST10524275
Module: WEDE5020 — Web Development
