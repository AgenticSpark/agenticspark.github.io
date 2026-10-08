# Ethan — personal site

Static HTML, no build step, deployed via GitHub Pages at <https://agenticspark.github.io/>.

## Structure

```
/                    home — intro + recent writing
/about.html          about / résumé / contact (résumé PDF download)
/blog.html           writing index — all posts (paper / repo / practice)
/careers/            careers resource index
/careers/top-200-companies.html  Top 200 Companies Explorer
/careers/blind75.html             Blind 75 study list
/careers/system-design-20.html    curated system design questions
/careers/behavioral-30.html       curated behavioral interview questions
/learning.html       AI and systems learning roadmap (listed under Careers)
/password.html       tools index + cryptographically secure password generator
/posts/*.html        long-form posts (paper explainers, repo reviews, ComfyUI write-up)
/404.html            not-found page
/design.md           design system SSOT (read before extending the site)
/assets/css/site.css all styles
/assets/js/site.js   active-nav highlighter (only JS on the site)
/assets/img/og-card.png         branded social card (og:image)
/assets/ethan-jiang-resume.pdf  downloadable résumé
/assets/gallery/     ComfyUI sample images used by the ComfyUI post
```

## Preview

Open `index.html` directly in a browser — no server required.

## Extending the site

Point an agent at `design.md` first; it is the source of truth for color, type, spacing,
and components. Adding new tokens requires updating `design.md` before `site.css`.

## License

MIT for code. Generated images are subject to the upstream model and LoRA licenses.
