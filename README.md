# Gifting Registry

Prototype of noon's Gifting Registry — a 375pt phone-frame app (Vite + React + TypeScript, Field DS) hosting the Gifter, Creator and Create-list flows. Deployed on Vercel (project `gifting-registry`).

- Entry: `landing/Root.tsx` → `landing/App.tsx` (frame scaled via `landing/useDeviceScale.ts`).
- Gifter home: `src/components/GifterHome.tsx` → `src/components/PageHeaderHero.tsx`.

## Develop

```bash
npm install
npm run dev:landing   # or: npx vite --config vite.landing.config.ts
```

## Build & deploy

```bash
npm run build:landing   # emits to dist/
npx vercel --prod
```
