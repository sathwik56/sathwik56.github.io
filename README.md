# Sathwik Acharya — Developer Portfolio

Personal developer portfolio built with HTML, CSS and vanilla JavaScript. No frameworks, no build tools, no dependencies — just clean, hand-written code.

**Live site:** [sathwik56.github.io](https://sathwik56.github.io)

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page |
| `contact.html` | Dedicated contact experience |
| `puzzle.html` | Interactive sliding puzzle easter egg |

---

## Sections (index.html)

- **Hero** — name, tagline, three CTA buttons, social links
- **About** — background, education, interests, detail grid
- **Projects** — four project cards with live links
- **Skills** — development and tools/productivity groups
- **Learning** — what's currently being explored
- **Journey** — timeline of milestones
- **Contact** — quick-access social/email links + link to contact page

---

## Projects Featured

| # | Project | Tech |
|---|---------|------|
| 01 | Virtual Interior Designer | Python, Flask, HTML, CSS, JavaScript, Three.js |
| 02 | Fitness Portfolio | HTML, CSS, JavaScript |
| 03 | Aura Music | JavaScript, API, Web |
| 04 | Aakriti Khandari | HTML, CSS, JavaScript |

---

## Features

- Fully responsive — tested from 360px to 1440px+
- Smooth scroll reveal animations via `IntersectionObserver`
- Subtle floating particle background (canvas, no library)
- Active nav highlight as you scroll through sections
- Animated hamburger menu with Escape key support
- 3D tilt on project cards (desktop only, disabled on touch)
- Hero portrait parallax on mouse move (desktop only)
- Back-to-top button
- Page loader
- Separate contact page with icon links
- Working sliding puzzle with timer, move counter, keyboard support, win screen
- Reduced-motion support (`prefers-reduced-motion`)
- Accessible: semantic HTML, ARIA labels, focus states

---

## Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── contact.html
├── contact.css
├── contact.js
├── puzzle.html
├── puzzle.css
├── puzzle.js
├── images/
│   ├── profile.jpg
│   └── profile1.jpg
└── README.md
```

---

## Running Locally

No server or build step needed. Open `index.html` directly in any browser, or use VS Code Live Server for auto-reload.

```bash
# With Python (optional)
python -m http.server 3000
```

---

## Deploying

**Netlify (recommended):**
1. Push this folder to a GitHub repo
2. Connect the repo on netlify.com
3. Deploy — done, it's live

**GitHub Pages:**
1. Push to a repo named `username.github.io` or any repo
2. Go to Settings → Pages → Source: main branch / root
3. Your site is live at `https://username.github.io/repo-name`

---

## Links

- GitHub: [github.com/sathwik56](https://github.com/sathwik56)
- LinkedIn: [linkedin.com/in/sathwik-acharya-07447a357](https://in.linkedin.com/in/sathwik-acharya-07447a357)
- Instagram: [@sathwik.acharya_](https://www.instagram.com/sathwik.acharya_/)
- Email: sathwikacharya022@gmail.com

---

*Built while learning.*
