# Personal Sticker Website

An interactive personal website prototype built with Vinext/React. The first screen uses a large sticker-style character, floating collage tags, pointer-follow motion, and peel interactions.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by the dev server.

## Build

```bash
npm run build
```

## Main Files

- `app/page.tsx` - home page structure and sticker interactions
- `app/globals.css` - visual style, layout, responsive behavior, animations
- `public/characters/` - character sticker image assets

## Notes

The sticker peel effect loads `https://sticker.oooo.so/embed/sticker-forge.es.js` in the browser. If that service is unavailable, the page still renders the layout but the peel interaction will not initialize.
