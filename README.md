# Vaibhav Mohanty — AI/ML Portfolio

**Live portfolio:** https://vaibhavmohanty-portfolio.vercel.app

An original, interactive Acidwave portfolio containing 12 projects, including PRISM, ClaimPilot, Saarthi, and JARVIS.

## What's included

- Responsive neon and chrome design, project filters, and 12 mission briefings with direct GitHub links.
- Editable player identity, XP, five ranks, ten achievements, daily streaks, and saved exploration progress.
- Eight collectible Acid Drops, a secret track, a Catch the Acid canvas game, a local high score, and a completion certificate.
- Terminal commands, command history, four accent themes, and opt-in procedural audio.
- Keyboard navigation, native accessible dialogs, visible focus, reduced-motion support, and a Reduce Effects toggle.
- Recruiter shortcuts to the résumé, GitHub, LinkedIn, and contact email.

Featured projects: PRISM, ClaimPilot, Saarthi, and JARVIS. The workbench also includes Content Intelligence Engine, StockSenseAI, MY_LLM, mini-blogger, University Management System, FaceSense, CIVITAS, and Deadlock Detection System.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server. No installation or build step is required. Tailwind and Google Fonts load through their CDNs; the core layout also has inline CSS.

## Customize

Edit `index.html` in Cursor. Search for `PROJECTS` to change project content, `XP` to tune rewards, `BADGES` to edit achievements, and `EDIT ME` for theme settings.

## Interactions

- Progress and local high scores stay in the visitor's browser, with a memory fallback when storage is unavailable.
- Sound starts off and can be enabled explicitly.
- System reduced-motion preferences and the Reduce Effects control simplify animation.
- The contact form opens an email draft. It does not send messages or collect submissions on a server.

## Deploy

This repository is connected to the production Vercel project `acidwave-portfolio`, using the personalized domain above. Push updates to `master` to deploy automatically. It uses static hosting with no framework, build command, or environment variables.

GitHub Pages also serves the repository root from `master`: https://vaibhavmohanty25.github.io/portfolio/

## Verification

With Node.js installed, run these commands from the repository root:

```bash
node scripts/check.cjs
node scripts/verify.cjs
```

These checks cover JavaScript syntax, unique HTML IDs, section anchors, safe storage fallbacks, XP deduplication, game scoring and pause behavior, and certificate unlocks.

## Files

- `index.html`: complete application, styles, project data, and interactions.
- `vercel.json`: static deployment configuration.
- `.nojekyll`: direct static serving on GitHub Pages.
- `scripts/`: checks requiring no third-party packages.
- `resume.pdf`: the repository's downloadable résumé.

GitHub: https://github.com/Vaibhavmohanty25/portfolio
