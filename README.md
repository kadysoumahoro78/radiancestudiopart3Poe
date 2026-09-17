# Radiance Studio — Website

A responsive multi-page website for Radiance Studio, a hair studio based in
Johannesburg. Built for the WEDE5020 (Web Development Introduction) Portfolio
of Evidence, Part 2.

## About the project

Radiance Studio's site introduces the salon, lists services and pricing,
showcases a gallery of past work, and gives visitors two ways to get in touch
— a service enquiry form and a contact/locations page.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `home page.html` | Studio introduction, highlights, services preview |
| About Us | `about us.html` | Studio story, mission & vision, team profiles |
| Services | `services.html` | Full price list by category |
| Gallery | `gallery.html` | Photo gallery of past transformations |
| Enquiry | `enquiry.html` | Service enquiry form |
| Contact | `contact.html` | Studio locations, hours and embedded maps |

## Tech stack

- **HTML5** — semantic page structure
- **CSS3** — a single external stylesheet (`CSS/style.css`) with:
  - CSS custom properties for a shared colour and type system
  - Flexbox and CSS Grid for layout
  - Pseudo-classes/elements (`:hover`, `:focus-visible`, `:active`,
    `:nth-child`, `:last-child`, `::before`, `::after`, `::marker`,
    `::selection`) for interactive and decorative styling
  - Two responsive breakpoints (tablet ≤900px, mobile ≤600px) covering
    layout, typography, navigation, and image/media adjustments
- **Google Fonts** — Cormorant Garamond (headings) and Jost (body text)

## Folder structure

```
Radiance studio/
├── home page.html
├── about us.html
├── services.html
├── gallery.html
├── enquiry.html
├── contact.html
├── CSS/
│   └── style.css
├── IMAGES/
│   ├── studioo.png
│   ├── baleb.jpg / diffstyles.jpg / menbraids.jpg / locs.jpg / wigs.jpg / dye.jpg
│   └── Download.mp4
├── DOCUMENTS/
│   └── Radiance Studio Proposal.pdf
├── README.md
├── CHANGELOG.md
└── REFERENCES.md
```

## Running the site locally

No build step is required — it's static HTML/CSS.

1. Download or clone the repository.
2. Open `home page.html` in a browser

## Design notes

The colour palette (plum, rose/pink, gold, brown, cream, ivory) and studio
branding were kept consistent from Part 1 and carried through every page.
Part 2 focused on turning the Part 1 skeleton into a fully styled,
responsive, professional site — see `CHANGELOG doucument` for the detailed list of
changes.

## Author

Student number: ST10524275
Module: WEDE5020 — Web Development
