# Enactus JOOUST Website

A modern, responsive, static website for Enactus JOOUST built with HTML5, Tailwind CSS (CDN), vanilla JavaScript, AOS, Swiper.js, and Chart.js. Designed for GitHub Pages and local `file://` viewing.

## Tech Stack
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- AOS (Animate On Scroll)
- Swiper.js
- Chart.js (CDN)

## Folder Structure
```
/enactus-jooust/
│── index.html
│── about.html
│── projects.html
│── events.html
│── team.html
│── join.html
│
├── /assets/
│   ├── /css/styles.css
│   ├── /js/main.js
│   ├── /images/
│   └── /videos/
│
├── /data/
│   ├── projects.json
│   ├── events.json
│   ├── team.json
│   └── partners.json
│
└── README.md
```

## GitHub Pages Deployment
1. Push the `enactus-jooust` folder to your GitHub repository.
2. In repository settings, enable GitHub Pages and set the source to the branch containing this folder.
3. If the site is served from the repository root, move files into the root or configure Pages to serve from `/docs` and copy the folder contents there.

## Updating Content (JSON Only)
All dynamic content is loaded from `/data/*.json` with a JavaScript fallback for `file://` usage. Update the JSON files and reload the page.

### Add a project
Append a new object in `data/projects.json`:
- `id`, `name`, `category`, `status`, `shortDescription`
- `problem`, `solution`, `impact`, `images`, `testimonials`

### Add an event
Append a new object in `data/events.json`:
- `status: "upcoming"` or `"past"`
- `date` should be an ISO format string (e.g. `2025-11-15T10:00:00`)

### Add a team member
Append a new object in `data/team.json`:
- `era: "current"` or `"past"`
- `type: "executive"` or `"department"`
- `yearServed` for past leadership

### Add a partner
Append a new object in `data/partners.json`:
- `tier: "Gold"`, `"Silver"`, or `"Bronze"`
- `logo` image path or URL

## Notes
- The site is fully static and works offline when opened via `index.html`.
- Update image URLs to local `assets/images` paths when you have brand assets ready.
