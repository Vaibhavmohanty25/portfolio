# Vaibhav Mohanty — Acidwave Portfolio

An interactive AI/ML portfolio with black and cosmic violet surfaces, acid green,
neon pink, cyan and yellow accents, stretched Syne typography, distorted SVG waves,
chrome artwork, halftone, grain, scanlines, and a moving rave ticker.

## Live sites

- https://vaibhavmohanty-portfolio.vercel.app
- https://vaibhavmohanty25.github.io/portfolio/

## Explore

- Preview four featured systems and open their project briefings.
- Explore twelve projects, including PRISM, ClaimPilot, Saarthi, and JARVIS.
- Filter the additional projects and follow their GitHub links.
- Play Signal Lab to match four tasks to the appropriate AI projects.
- Change the accent with four live color swatches.
- Use Reduce Effects or the operating system's reduced-motion preference.

The hero reads **Vaibhav Mohanty**, with no decorative asterisk. Exploration and
game progress last for the current visit. Contact opens an email draft; no form
data is sent to a server. The previous static implementation is available in Git history.

## Edit and run

Use Node.js 22.18 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Update profile details and projects in
`src/data/portfolio.ts`, typography and colors in `src/app/acidwave.css`,
and game tasks in `src/lib/signal-game.ts`.

```sh
npm test
npm run typecheck
npm run build
```

The build creates a static export in `out/`. No Node server is needed for hosting.
The checked-in root `index.html`, `_next/` assets, and supporting exported files
are the published snapshot, so the existing static Vercel and GitHub Pages
configuration continues to work. After changing source, run `npm run build`,
copy the contents of `out/` to the repository root, and commit the updated
source and static snapshot together. Keep `.nojekyll` so Pages serves `_next/`.

The original `resume.pdf` is retained. `scripts/check.cjs` validates the exported
HTML and assets; `scripts/verify.cjs` runs the Signal Lab behavior tests.
