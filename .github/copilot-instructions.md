# Ethan site — workspace instructions

This repository is a static GitHub Pages site. Keep changes simple, local, and framework-free.

## Project shape

- Root pages: `index.html` (home), `about.html`, `404.html`.
- ComfyUI write-up: `posts/comfyui.html` (embeds `assets/gallery/*`).
- Shared styles: `assets/css/site.css`.
- Shared JavaScript: `assets/js/site.js`.
- Design source of truth: `design.md`.

## AgentAtlas install scope

Only the necessary AgentAtlas customization is installed here: the workspace `ui-ux` agent adapted from the AgentAtlas common UI/UX agent. Do not install or copy AgentAtlas `general`, `game`, `finance`, `video`, router, MCP, media, NUC, interview, or trading assets unless the user explicitly asks.

## Editing rules

1. Read `design.md` before changing visual design, layout, typography, motion, gallery presentation, cards, or navigation.
2. Reuse existing CSS custom properties in `assets/css/site.css`; add tokens only when the design system needs a new reusable value.
3. When adding pages, mirror the closest existing HTML structure and keep navigation/footer consistent (nav: ComfyUI · About).
4. The site is intentionally minimal (Home, About, ComfyUI). Confirm with the user before adding new top-level pages or sections.
5. For homepage card entries, use a `.card` with name, one-line description, stack chips, and link.
6. Preserve the no-build workflow: HTML/CSS/vanilla JS only unless the user explicitly changes the stack.
7. Keep generated or bulky gallery assets out of source unless the user confirms they belong in the repo.
