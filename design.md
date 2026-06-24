# Design System — Ethan

> Single source of truth for the visual and interaction design of this site.
> When generating UI, read this file first. Token values here override any ad-hoc choices.

---

## 1. Brand & Voice

**Name:** Ethan
**Tagline:** Senior Software Engineer — AI systems and large-scale data platforms.
**Audience:** Recruiters, hiring managers, and engineers exploring my work.

**Voice:**
- Precise, lower-case-ish, no exclamation marks.
- Show artifacts before opinions. Code, screenshots, generated images > prose.
- Honest about failure modes. If a workflow flakes, the post says so.

**Anti-voice:** Hype, "10x", emoji-as-punctuation, breathless lists.

---

## 2. Design Principles

1. **Content is the chrome.** No decoration that doesn't earn its pixels.
2. **Read first, ornament second.** Body line-length 60–75ch, generous leading.
3. **Dark, but not black.** Backgrounds sit slightly off zero so images glow.
4. **One accent at a time.** A page uses at most two non-neutral hues.
5. **Static & instant.** No framework, no build step, no client-side router.
6. **Images breathe.** Gallery items reach edge-to-edge on mobile; no inner padding cage.

---

## 3. Color Tokens

CSS custom properties live in `assets/css/site.css` under `:root`.
Warm editorial palette following the Claude design system (getdesign.md/claude): warm cream background, terracotta accent.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#faf9f5` | Page background (warm cream) |
| `--bg-elev-1` | `#ffffff` | Card / panel |
| `--bg-elev-2` | `#f0ebe1` | Hover state, code block, nested panel |
| `--border` | `#e6dfd8` | 1px dividers |
| `--border-strong` | `#d4ccb7` | Focus rings, active borders |
| `--text` | `#141413` | Primary text (near-black) |
| `--text-muted` | `#6c6a64` | Meta, captions |
| `--text-dim` | `#8e8b82` | Footer, tertiary |
| `--accent` | `#cc785c` | Terracotta — links, primary actions |
| `--accent-ink` | `#a9583e` | Hover state for accent |
| `--accent-warm` | `#d4a37c` | Secondary accent |
| `--on-accent` | `#faf9f5` | Text on a filled accent surface (primary button) |
| `--header-bg` | `rgba(250,249,245,0.88)` | Sticky-header translucent backdrop |
| `--success` | `#5db872` | "ok" states |
| `--warn` | `#e8a55a` | Warnings |
| `--danger` | `#c64545` | Errors |

**Rules:**
- Never use pure `#000` or `#fff` for text.
- Body text contrast ≥ 7:1 against `--bg` (AAA).
- Accents only on interactive elements, key category labels (eyebrows), and category tags.

### 3.1 Dark mode

The site honours `@media (prefers-color-scheme: dark)` by overriding the `:root`
tokens only — every component is token-driven, so no per-component dark rules
are needed. Warm dark palette (matches the dark `theme-color` meta):

| Token | Dark hex | Note |
|---|---|---|
| `--bg` | `#1a1916` | Warm near-black |
| `--bg-elev-1` / `--bg-elev-2` | `#232220` / `#2c2a26` | Cards / nested panels, code |
| `--border` / `--border-strong` | `#38342e` / `#4d473e` | Dividers / active borders |
| `--text` / `--text-muted` / `--text-dim` | `#ece8e1` / `#a8a299` / `#837d73` | All ≥ 4.3:1 on `--bg` |
| `--accent` | `#e0926e` | Lifted terracotta — links (7.1:1) |
| `--accent-ink` | `#d98c6a` | Button surface / chip text / focus |
| `--on-accent` | `#1a1916` | Dark text on the terracotta button (6.6:1) |
| `--header-bg` | `rgba(26,25,22,0.85)` | Sticky-header backdrop |

- All dark pairings are verified WCAG AA (≥ 4.5:1) for body/links/buttons.
- Add new colors as tokens with a light **and** dark value — never hard-code a
  hex outside `:root` (the only exceptions are image overlays).

---

## 4. Typography

**Stacks:**
- `--font-sans`: `"Inter", -apple-system, "Segoe UI", "PingFang SC", system-ui, sans-serif`
- `--font-serif`: `"EB Garamond", "Iowan Old Style", Georgia, serif`
- `--font-mono`: `"JetBrains Mono", "SF Mono", Consolas, monospace`

**Usage:**
- Page titles, post titles, h1–h3: **serif (EB Garamond), weight 500**, tight negative tracking.
- Long-form body (post content): **serif, 18px, line-height 1.75**.
- UI, nav, eyebrows: **sans (Inter)**; eyebrows weight 600, uppercase.
- Captions, meta, code: **mono, 13px**.

**Type scale (rem, 16px base):**

| Step | Size | Used for |
|---|---|---|
| `--fs-1` | 0.8125 | Captions, meta |
| `--fs-2` | 0.9375 | Small UI, nav |
| `--fs-3` | 1.0625 | Body UI |
| `--fs-4` | 1.125 | Body prose (mobile) |
| `--fs-5` | 1.25 | Lede |
| `--fs-6` | 1.5 | h3 |
| `--fs-7` | 2.0 | h2 |
| `--fs-8` | 2.75 | h1, hero |
| `--fs-9` | 4.0 | Display only |

---

## 5. Spacing & Layout

Spacing is a 4px-rooted scale exposed as `--s-*`.

| Token | px |
|---|---|
| `--s-1` | 4 |
| `--s-2` | 8 |
| `--s-3` | 12 |
| `--s-4` | 16 |
| `--s-5` | 24 |
| `--s-6` | 32 |
| `--s-7` | 48 |
| `--s-8` | 64 |
| `--s-9` | 96 |

**Containers:**
- Reading column: `max-width: 68ch`, centered.
- Wide column (gallery, toolhub grid): `max-width: 1200px`.
- Page gutters: `clamp(16px, 4vw, 48px)`.

**Grid:**
- Toolhub / gallery: `repeat(auto-fill, minmax(280px, 1fr))`, gap `--s-5`.
- Post list: single column on the reading width.

---

## 6. Radii, Borders, Shadows

| Token | Value |
|---|---|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 14px |
| `--border-w` | 1px |
| `--shadow-1` | `0 1px 0 rgba(255,255,255,0.02), 0 1px 2px rgba(0,0,0,0.4)` |
| `--shadow-2` | `0 8px 24px -8px rgba(0,0,0,0.6)` |

Borders use `--border` by default; on hover/focus switch to `--border-strong`.
Shadows are subtle — they exist to lift cards off the background, not announce themselves.

---

## 7. Motion

- Default transition: `150ms cubic-bezier(0.2, 0, 0, 1)` on `color, background, border, transform, opacity`.
- Hover lift on cards: `translateY(-2px)` only — no scale.
- Respect `prefers-reduced-motion: reduce` — disable all non-essential transitions.

---

## 8. Components

### 8.1 Header
- Sticky top, `--bg` with 88% opacity + `backdrop-filter: blur(10px)` and `--border` bottom.
- Left: wordmark `Ethan` in serif.
- Right: nav links — `Blog`, `About`. Sans, `--fs-2`, weight 500.
- Header links meet the 44px target size. Active/hover states use text color plus a restrained underline,
  so color is not the only state carrier.

### 8.2 Page heading
- Used at top of every page. Serif h1 (clamp 2.25rem → 4.25rem), short serif dek beneath.
- Bottom border `1px` + `--s-8` margin-bottom separates it from the page body.

### 8.3 Eyebrow / category label
- Sans, uppercase, weight 600, tracking 0.08em, color `--accent`, `--fs-1`.
- Sits above the title in cards and post pages.

### 8.4 Featured post (homepage)
- Reserved for rare editorial moments; not currently used on the homepage. Do not reinstate a large
  featured hero unless a post genuinely merits that treatment.
- Two-column grid: 4:3 hero image on the left, body on the right (collapses to single column below 900px).
- Title is serif, clamp 1.75rem → 2.75rem, weight 600.
- Dek is serif, `--fs-5`, color `--text-muted`.

### 8.5 Post card (grid)
- Vertical: 4:3 media → eyebrow → serif h3 (--fs-5) → meta line.
- Grid is `repeat(3, 1fr)` desktop, 2 cols at ≤900px, 1 col at ≤600px.
- Hover: image scales `1.03` over 500ms; no card transform.

### 8.6 Tag chip
- Rounded pill (`border-radius: 999px`), padding `3px 10px`, sans `--fs-1`.
- Background `--bg-elev-2`, border `--border`, color `--text-muted`.

### 8.7 Toolhub card
- `--bg-elev-1` with shadow `--shadow-1`, hover lifts 2px and switches to `--shadow-2`.
- Serif h3 title, sans body copy, chips at the bottom.

### 8.8 Gallery tile
- Square aspect by default. Image fills, no padding. Caption appears as a dark gradient overlay along the bottom.
- Lazy-load via `loading="lazy"`.

### 8.9 Post hero
- `aspect-ratio: 21 / 9`, full-width within the reading column. Optional — posts can omit.

### 8.10 Code block
- `--font-mono`, `--fs-2`, `--bg-elev-2`, `--radius-md`, padding `--s-4 --s-5`.
- Inline code: `--bg-elev-2` chip, mono, color `--accent-ink`.

### 8.11 Footer
- Sans, `--text-dim`, `--fs-2`. Three lines max on `--bg-elev-1` strip.

### 8.12 Blog post · explainer components
- Shared by every long-form post under `/posts/` (paper explainers + repo reviews).
  Defined in one block in `site.css`; reuses tokens only, no new colors.
- **Reading column.** Posts use `main.reading.wide` (`max-width: min(880px, 94vw)`) so
  tables, diagrams, and stat grids have room. Plain pages keep `.reading` (~70ch).
- **Post head.** `.back-link` (← Blog) → `article.post.explainer` → `.post-head`
  (`.eyebrow` + `h1.post-title` + `p.post-dek`) → `dl.meta-grid` (key/value strip:
  Paper · Code · Authors · Published / Repo · License · Stack · Version · Reviewed …).
- **Section headers.** Paper posts use `.sec-eyebrow` + `.sec-num` (`01 What`) above an
  `h2`. Repo/STAR posts put the number inline in the `h2` (`1 · Situation — …`).
- **Stat grid.** `.stat-grid` of `.stat` blocks, each a serif `.num` + sans `.label`.
- **Callouts.** `.callout-grid` of `.callout` (heading + paragraph). `.callout.accent`
  marks a single standout claim / verdict / TL;DR.
- **Chips row.** `.chip-row` of `.chip` for short pull-phrases or tags.
- **Formula.** `.formula` (mono, centered) with optional `.formula-label`.
- **Prose tables.** Wrap in `.table-wrap` for horizontal scroll; `thead` uses sans caps.
- **Category chip.** `.chip.cat` (accent-tinted) tags a post's source on the blog index:
  `paper` · `repo` · `practice`.

### 8.13 Button / action
- `.btn` base: sans, weight 600, `--fs-2`, `--radius-md`, min-height 44px, icon gap `--s-2`.
- `.btn-primary`: solid `--accent-ink` (terracotta passes AA on cream/white text at this
  ink shade; the lighter `--accent` does not), cream label, hover darkens via `brightness`
  + 1px lift + `--shadow-2`.
- `.btn-ghost`: `--bg-elev-1` surface, `--border-strong` outline, hover fills `--bg-elev-2`.
- Group multiple actions in a `.btn-row` (wraps, gap `--s-3`). Used for résumé downloads
  and compact page actions.

### 8.14 Homepage intro
- `.home-heading` is a page-heading variant for the homepage now that no large featured hero is present.
- Structure: eyebrow → focused serif h1 → short value line → `.btn-row` primary actions → optional
  mono `.home-kicker` for location/team context.
- Keep it text-first and compact; no image hero. Use existing button and spacing tokens only.

### 8.15 Contact panel
- `.contact-panel` is a restrained card used for recruiter-facing contact details on `about.html`
  and at the foot of the homepage (`index.html`).
- Structure: h2 + short sentence + optional `.btn-row` + two-column `dl.contact-list`.
- Labels are sans uppercase/meta style; values are sans `--fs-2`. Collapse to one column on mobile.
- Capped at `max-width: 70ch` so it reads well inside the wide homepage `.container`.
- Use existing surfaces, borders, radii, and shadows; no new color tokens.

---

## 9. Accessibility

- All interactive elements: visible focus ring using `--border-strong` at 2px.
- Min target size 44×44 on touch.
- Images: meaningful `alt`. Decorative gallery thumbnails may use `alt=""`.
- Color is never the sole carrier of state — pair with text or icon.

---

## 10. File & Page Map

```
/                   index.html        Home: text intro + recent writing
/about.html         About / résumé / contact
/blog.html          Writing index — all posts, tagged paper / repo / practice
/posts/comfyui.html ComfyUI LoRA style matrix (embeds /assets/gallery/*)   · practice
/posts/elf.html              ELF · Embedded Language Flows                  · paper
/posts/drifting-models.html  Drifting Models                               · paper
/posts/leworldmodel.html     LeWorldModel                                  · paper
/posts/openhuman.html        OpenHuman                                     · repo
/posts/agentmemory.html      agentmemory                                   · repo
/posts/codegraph.html        CodeGraph                                     · repo
/posts/headroom.html         Headroom                                      · repo
/posts/sail.html             Sail                                          · repo
/posts/vllm.html             vLLM · PagedAttention serving engine          · repo
/posts/sglang.html           SGLang · LLM serving runtime                  · repo
/posts/tensorrt.html         TensorRT · GPU inference compiler             · repo
/posts/deepspeed.html        DeepSpeed · training at scale                 · repo
/posts/langgraph.html        LangGraph · agent orchestration               · repo
/posts/mlflow.html           MLflow · ML lifecycle platform                · repo
/posts/delta.html            Delta Lake · ACID lakehouse storage           · repo
/posts/evals.html            OpenAI Evals · LLM evaluation                 · repo
/404.html           Not-found page
/design.md          This file (read before extending the site)
/assets/css/site.css
/assets/js/site.js
/assets/img/og-card.png          Branded 1200×630 social card (og:image on home + about)
/assets/ethan-jiang-resume.pdf   Downloadable résumé (linked from about.html)
```

---

## 11. Authoring Rules

This is a small personal/portfolio site. Keep it minimal: Home, About, and the Blog
(paper explainers, repo reviews, and the ComfyUI write-up). Before changing anything
visual, read this file.

When adding or editing a page:
1. Mirror an existing page's structure; keep the header nav and footer consistent
   (nav: **Blog · About**). New posts mirror `posts/elf.html` (paper) or
   `posts/sail.html` (repo), and get an entry on `blog.html` + `sitemap.xml`.
2. Do **not** invent new color tokens. If a need arises, propose a token here first.
3. Keep prose in serif, UI in sans, code/meta in mono.
4. Reuse the `.card` / `.grid` components for any card entries on the homepage:
   name, one-line description, stack chips, link.
5. Keep social/SEO metadata consistent: every page sets canonical + Open Graph/Twitter
   tags; home and about share `assets/img/og-card.png` (`summary_large_image`) and embed
   `application/ld+json` (`WebSite` + `Person` on home, `ProfilePage` on about). Keep the
   `#person` node and résumé/contact facts in sync across pages.
