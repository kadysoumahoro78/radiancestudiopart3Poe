# Radiance Studio — SEO Strategy

## 1. Keyword research

Target audience: people in Johannesburg (Sandton, Rosebank and surrounding
suburbs) looking for braiding, locs, colour, wigs, treatments and bridal hair.
Keywords were chosen from the studio's actual services and typical local search
phrasing ("service + place", "near me", price questions). Search volumes were not
measured with a paid tool; before launch, check them in Google Keyword Planner or
Google Trends and adjust.

| Intent | Primary keywords | Used on |
|---|---|---|
| Brand / general | hair salon Johannesburg, Radiance Studio | Home |
| Braids | braiding Johannesburg, knotless braids Sandton, men's braids, kids braiding | Home, Services, Gallery |
| Locs | locs styling Johannesburg, starter locs, locs colouring | Services, Gallery |
| Colour | balayage Johannesburg, hair colour Rosebank, colour correction | Services, Gallery |
| Treatments | keratin treatment Johannesburg, deep conditioning, scalp treatment | Services, About |
| Wigs & bridal | wig installation Sandton, lace front wig, bridal hair Rosebank, matric hair | Services, Gallery |
| Price / action | hair prices Johannesburg, book hair appointment Sandton | Services, Enquiry |
| Local | hair salon Sandton, hair salon Rosebank, hair salon near me | Contact, Footer |

## 2. On-page SEO (implemented)

| Item | What was done |
|---|---|
| Keyword use | Keywords appear naturally in `<h1>`/`<h2>`, the first paragraph, alt text, file names and meta data (no keyword stuffing). |
| Title tags | Unique per page, about 50–60 characters, keyword first, brand last. |
| Meta descriptions | Unique per page, about 140–160 characters, with a call to action. |
| Header tags | Exactly one `<h1>` per page; `<h2>` for sections; `<h3>` for cards / sub-sections; no skipped levels. |
| Image optimisation | Descriptive file names (`balayage-braids-johannesburg.jpg`), meaningful alt text, `width`/`height`, WebP + JPEG, lazy-loading. |
| URL structure | Short, lowercase, no spaces: `index.html`, `about.html`, `services.html`, `gallery.html`, `enquiry.html`, `contact.html`. Deep links such as `services.html#colouring`. |
| Internal linking | Contextual links between related pages, service-category deep links, footer navigation, logo → home, "Enquire about this service" links. |
| Mobile-friendliness | Viewport meta tag, responsive layouts at ≤900px and ≤600px, tap-friendly navigation, readable font sizes. |
| Structured data | `HairSalon` JSON-LD for both studios (address, phone, hours, coordinates). |
| Social previews | Open Graph and Twitter Card tags. |

## 3. Off-page SEO (plan and what is built in)

**Backlinks** (build slowly and only from relevant, reputable sites):
- Google Business Profile and Bing Places listings for each studio, linking to the site.
- Local directories (for example Yellow Pages South Africa, local business associations).
- Guest tips or collaborations with local hair, beauty, bridal and matric-dance bloggers and photographers, linking back to the relevant service page.
- Sharing the gallery with stylists' and clients' own pages (with permission).

**Social media:**
- Share links for Facebook, WhatsApp, Pinterest and X are built into every page footer.
- Recommended: post gallery photos on Instagram, TikTok and Pinterest with local hashtags (#JohannesburgBraider, #SandtonHairSalon) and link to the matching page in the profile.

**Local SEO:**
- Keep the studio **name, address and phone** identical on the website, Google Business Profile and directories (they are already identical in the footer, contact page and JSON-LD).
- Encourage satisfied clients to leave Google reviews, and reply to them.
- Add opening hours and photos to each Google Business Profile.

## 4. Technical SEO

- `robots.txt` — allows crawling, blocks `/DOCUMENTS/`, points to the sitemap.
- `sitemap.xml` — lists all six pages with priority and change frequency; submit it in Google Search Console.
- Canonical URL on every page.
- **Placeholder domain:** `https://radiancestudio.example/` is used in canonical tags, Open Graph tags, `sitemap.xml`, `robots.txt` and JSON-LD. Replace it with the real domain when the site is published.

### Page speed
- Images resized (640px thumbnails, 736px originals) and WebP versions added.
- Below-the-fold images use `loading="lazy"`; all scripts use `defer`.
- Showreel video: `preload="none"` plus poster image.
- Google Fonts: `preconnect` + `display=swap`.
- jQuery and Leaflet served locally (no extra DNS/TLS lookups).
- On a real host, also enable GZIP/Brotli and long cache lifetimes for `/IMAGES`, `/CSS` and `/js`.

### Security
- Content-Security-Policy meta tag (scripts and forms limited to this site; map tiles from OpenStreetMap; form posts to the configured endpoint).
- Referrer policy; `rel="noopener noreferrer"` on all `target="_blank"` links.
- No inline scripts or styles; no `innerHTML` with user input (everything is inserted with `.text()`).
- Form validation on the client, a honeypot field for bots, and a consent checkbox.
- Note: some protections (HTTPS, `X-Frame-Options`, `Strict-Transport-Security`) are HTTP headers that must be set by the web host. GitHub Pages provides HTTPS automatically.
- Client-side validation is not a substitute for server-side validation: if the enquiry endpoint is later replaced by a real back end, validate again on the server.
