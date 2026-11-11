# Cutline

Marketing site and web app UI for an automatic stream-clipping product. Vite + React + TypeScript + Tailwind.
"Cutline" is a placeholder name. Search and replace it (and the logo in `src/components/ui.tsx`) when you pick a real one.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: Add New → Project → import the repo. It detects Vite automatically
   (build command `npm run build`, output `dist`). Click Deploy.
`vercel.json` already rewrites all routes to `index.html`, so links like `/app/library` work on refresh.

## Where things live
- `src/index.css`: design tokens, glass panels, buttons
- `tailwind.config.js`: colors (ember accent), fonts
- `src/lib/data.ts`: all mock data (channels, streams, clips, schedule). Swap for real API calls later.
- `src/pages/Landing.tsx`: marketing site (hero, features, pricing, FAQ)
- `src/pages/Auth.tsx`: login and signup
- `src/pages/app/*`: dashboard, streams, stream detail, clip editor, library, publishing, settings

## Not built yet
Everything runs on sample data. The real clipping backend (pulling VODs, transcription,
moment scoring, FFmpeg rendering, posting to TikTok/YouTube/Instagram) and real auth are the next step.
