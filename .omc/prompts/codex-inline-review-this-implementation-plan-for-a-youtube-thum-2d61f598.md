Review this implementation plan for a YouTube Thumbnail AI Service hero section redesign. The project is a Next.js 16 + React 19 + Tailwind CSS 4 + Framer Motion app.

## Current State
- Landing page has an interactive "Infinite Grid" demo with mouse-tracking SVG grid animation, gradient overlays, and Framer Motion
- Component at `components/ui/the-infinite-grid.tsx` (122 lines) - contains the grid pattern, mouse tracking, and hero content
- Hero wrapper at `components/main/hero.tsx` - simple wrapper importing the grid component
- Uses shadcn/ui design system with OKLch color variables, dark mode support

## Plan Summary
1. Replace headline/text: "The Infinite Grid" → "AI로 완성하는 유튜브 썸네일" with service description and CTA buttons
2. Add SVG decorations: play button, image frame, AI sparkle elements with Framer Motion animations (float, fade-in)
3. Add thumbnail preview mockup: 2-3 overlapping SVG cards showing what the service produces
4. Add "AI Powered" badge above headline
5. Rename Component export to HeroContent

## Constraints
- Keep existing infinite grid background, mouse tracking, gradient overlays
- NO icon libraries (lucide-react) — all visuals must be inline SVG
- Keep existing tech stack unchanged
- Responsive (mobile/desktop breakpoints)
- Dark mode compatible

## Files Changed
- `components/ui/the-infinite-grid.tsx` — modify content, add SVGs, rename export
- `components/main/hero.tsx` — update import

## Questions for Review
1. Is the file structure appropriate? Should SVG decorations be extracted into separate components?
2. Is keeping everything in `the-infinite-grid.tsx` a good idea or should we split?
3. Any performance concerns with multiple animated SVGs + the grid animation?
4. Is the z-index layering approach sound (grid bg → gradient overlays → SVG decorations → content)?