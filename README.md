# Cyber Report Redesign (design prototype)

An **independent design prototype** of a citizen-first cybercrime reporting experience.
It is **not** an official government service. It does not connect to any police, UIDAI, bank or
government system, and it cannot file real complaints. Do not enter real personal details.

## Run locally (VS Code)
```bash
npm install
npm run dev        # http://localhost:5173
```
Other scripts: `npm run build` (output in `dist/`), `npm run preview`, `npm run typecheck`.

## Deploy
The build is a static site and uses hash routing (`#report`, `#track`), so no server rewrites are needed.
- **Netlify / Cloudflare Pages / Vercel:** build command `npm run build`, output directory `dist`.
- **GitHub Pages / S3 / any static host:** upload the contents of `dist/` (the base path is relative).
- Keep the "independent prototype, not an official service" banner and footer in any public deployment.

## Structure
- `src/App.tsx`: the whole app (components, content, translations, report flow). Suggested split when you grow it:
  `components/`, `pages/` (Home, Report, Track, Help), `i18n/` (T0, FT0), `data/` (CATEGORIES, STATES, DISTRICTS).
- `src/index.css`: Tailwind plus theme tokens (light, dark, high contrast) as CSS variables.
- `tailwind.config.js`: colour tokens map to those variables.

## What is simulated
- Aadhaar + OTP check: the OTP is generated in the browser and shown on screen. No real verification.
- Save and resume: stored in this browser's localStorage only (files and identity check are never saved).
- Complaint tracking: any `DEMO-YYYY-NNNNNN` number returns sample data.
- "Demo routing" to a district cyber cell is illustrative, not a real assignment.
- Evidence limits (JPG/PNG/PDF, 5 MB, 5 files) are demo values, not official requirements.

## Needs review before any real use
- All non-English text is a machine-written draft and needs native-speaker review.
- Form labels, errors and the evidence/OTP/review screens are not yet translated.
- Safety tips and FAQ copy are general guidance written for this prototype; verify against official sources.
- The only official details used are the 1930 financial-fraud helpline and 112 emergency number; confirm them before launch.
- Run an accessibility audit (keyboard, screen reader, RTL for Urdu) before treating WCAG 2.1 AA as met.
