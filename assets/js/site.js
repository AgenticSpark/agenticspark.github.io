// site.js — minimal, no framework.
// Marks the active nav link based on current path. Resolves relative hrefs so
// post pages (e.g. /posts/<slug>.html) still light up the Posts nav link.
(function () {
  const strip = (s) => s
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '/') || '/';
  const here = strip(location.pathname);
  document.querySelectorAll('.nav a').forEach((a) => {
    const raw = a.getAttribute('href');
    if (!raw) return;
    let target;
    try { target = strip(new URL(raw, location.href).pathname); }
    catch (_) { return; }
    const base = target.replace(/\/$/, '');
    const isInside = base !== '' && here.startsWith(base + '/');
    if (here === target || isInside) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();
