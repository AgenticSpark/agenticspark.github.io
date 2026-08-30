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

// Cryptographically secure password generator. Loaded on every page but only
// activates when the generator form is present.
(function () {
  const form = document.querySelector('[data-password-generator]');
  if (!form) return;
  const output = form.querySelector('[data-password-output]');
  const lengthInput = form.querySelector('[name="length"]');
  const lengthValue = form.querySelector('[data-length-value]');
  const status = form.querySelector('[data-password-status]');
  const copyButton = form.querySelector('[data-copy-password]');
  const sets = {
    lowercase: 'abcdefghijkmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    numbers: '23456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?'
  };

  function randomIndex(max) {
    if (!Number.isSafeInteger(max) || max < 1 || max > 256) throw new Error('Invalid character set');
    const limit = Math.floor(256 / max) * max;
    const bytes = new Uint8Array(1);
    do { crypto.getRandomValues(bytes); } while (bytes[0] >= limit);
    return bytes[0] % max;
  }

  function generate() {
    const selected = [...form.querySelectorAll('input[name="characters"]:checked')];
    if (!selected.length) {
      status.textContent = 'Select at least one character type.';
      return;
    }
    const length = Number(lengthInput.value);
    if (!Number.isInteger(length) || length < 8 || length > 128) return;
    const pools = selected.map((input) => sets[input.value]);
    const all = pools.join('');
    const chars = pools.map((pool) => pool[randomIndex(pool.length)]);
    while (chars.length < length) chars.push(all[randomIndex(all.length)]);
    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    output.value = chars.join('');
    status.textContent = `Generated a ${length}-character password.`;
    copyButton.textContent = 'Copy password';
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); generate(); });
  lengthInput.addEventListener('input', () => { lengthValue.textContent = lengthInput.value; });
  copyButton.addEventListener('click', async () => {
    if (!output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
    } catch (_) {
      output.select();
      document.execCommand('copy');
      output.setSelectionRange(0, 0);
    }
    copyButton.textContent = 'Copied!';
    status.textContent = 'Password copied to clipboard.';
    window.setTimeout(() => { copyButton.textContent = 'Copy password'; }, 1800);
  });
  generate();
})();

// Career gallery data is rendered client-side to keep the page compact and
// make filtering immediate. Links open focused interview-preparation searches.
(function () {
  const grid = document.querySelector('[data-company-grid]');
  if (!grid) return;
  const companies = [
    'Amazon','Apple','Microsoft','Alphabet','Meta','NVIDIA','Tesla','JPMorgan Chase','Walmart','ExxonMobil',
    'UnitedHealth Group','Visa','Mastercard','Procter & Gamble','Johnson & Johnson','Home Depot','Costco','Netflix','Adobe','Salesforce',
    'Oracle','Cisco','IBM','Intel','AMD','Qualcomm','Broadcom','ServiceNow','Uber','Airbnb',
    'DoorDash','Snowflake','Palantir','Datadog','Cloudflare','Shopify','Block','PayPal','Stripe','Intuit',
    'Goldman Sachs','Morgan Stanley','Bank of America','Citigroup','Wells Fargo','Capital One','American Express','BlackRock','Charles Schwab','Fidelity Investments',
    'McKinsey & Company','Boston Consulting Group','Bain & Company','Deloitte','PwC','EY','KPMG','Accenture','Booz Allen Hamilton','Cognizant',
    'Eli Lilly','Pfizer','Merck','AbbVie','Bristol Myers Squibb','Amgen','Gilead Sciences','Moderna','CVS Health','Cigna',
    'Boeing','Lockheed Martin','RTX','Northrop Grumman','General Electric','Caterpillar','3M','Honeywell','Ford','General Motors',
    'Coca-Cola','PepsiCo','Nike','Starbucks','McDonald’s','Disney','Comcast','AT&T','Verizon','T-Mobile',
    'FedEx','UPS','Delta Air Lines','United Airlines','American Airlines','Marriott','Hilton','Target','Lowe’s','Kroger'
  ];
  const search = document.querySelector('[data-company-search]');
  const count = document.querySelector('[data-company-count]');
  const initials = (name) => name.replace(/&/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  function render(query = '') {
    const normalized = query.trim().toLowerCase();
    const visible = companies.filter((name) => name.toLowerCase().includes(normalized));
    grid.replaceChildren(...visible.map((name) => {
      const link = document.createElement('a');
      link.className = 'company-tile';
      link.href = `https://www.google.com/search?q=${encodeURIComponent(name + ' interview questions careers jobs')}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `${name}: interview and career resources (opens in a new tab)`);
      const mark = document.createElement('span');
      mark.className = 'company-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = initials(name);
      const label = document.createElement('span');
      label.className = 'company-name';
      label.textContent = name;
      link.append(mark, label);
      return link;
    }));
    count.textContent = `${visible.length} ${visible.length === 1 ? 'company' : 'companies'}`;
  }
  search.addEventListener('input', () => render(search.value));
  render();
})();
