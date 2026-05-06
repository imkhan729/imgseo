# IMGSEO

A fully client-side image SEO SaaS tool that helps local businesses optimize images for better Google ranking — all processing runs in the browser with zero server uploads.

## Run & Operate

- `pnpm --filter @workspace/imgseo run dev` — run the frontend (port auto-assigned via workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- No backend, no database, no env vars required for the frontend

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, framer-motion
- Image processing: HTML5 Canvas API (browser-native, no server)
- Bulk download: JSZip
- Routing: wouter
- Theming: next-themes (dark/light mode)

## Where things live

- `artifacts/imgseo/` — main React + Vite frontend app
- `artifacts/imgseo/src/pages/home.tsx` — single page layout
- `artifacts/imgseo/src/components/tool/tool-section.tsx` — core image tool (upload, process, SEO, geo)
- `artifacts/imgseo/src/components/sections/` — marketing sections (hero, features, FAQ, blog, etc.)
- `artifacts/imgseo/src/components/layout/` — navbar, footer
- `artifacts/imgseo/src/index.css` — theme (violet/indigo primary, dark mode supported)
- `artifacts/imgseo/index.html` — SEO meta tags + JSON-LD schema markup

## Architecture decisions

- **100% client-side** — no backend, no API calls, no data persistence; everything runs in browser memory via HTML5 Canvas API
- **Canvas API for image processing** — `canvas.toBlob()` for compression and format conversion (WebP, JPG, PNG); resize via canvas `drawImage` with preset dimensions
- **JSZip for bulk export** — imported as `import JSZip from 'jszip'`; ZIP built in-memory and downloaded via object URL
- **SEO text generated reactively** — file name, ALT text, title, caption all derived from keyword + business name + location inputs with no debounce (instant)
- **Geo tag helper** — generates formatted metadata text for download/copy since browsers cannot write EXIF data directly

## Product

- Image upload (drag & drop, multi-file, JPG/PNG/WebP)
- Canvas-based compression with quality slider (10–100%) and format conversion
- Resize presets: original, Google Business (720×720), Thumbnail (320×240)
- SEO file name, ALT text, title, and caption generators with copy buttons
- Geo tag helper with downloadable .txt and copy button
- Single-image download + bulk ZIP download
- Full marketing homepage: hero, features, how-it-works, benefits, use cases, SEO content, FAQ, blog
- Dark mode toggle

## User preferences

- Mobile responsive layout required
- 3D modern stylish design with glassmorphism touches
- Lightweight — no unnecessary dependencies

## Gotchas

- Google Fonts `@import url(...)` MUST be the first line in `index.css` (before `@import "tailwindcss"`) — PostCSS fails silently otherwise
- Canvas PNG conversion ignores quality param — use canvas scale for size reduction
- The app has no backend, so `DATABASE_URL` is not needed and the api-server workflow is not used

## Pointers

- See the `pnpm-workspace` skill for workspace structure details
- See `react-vite` skill for frontend conventions
