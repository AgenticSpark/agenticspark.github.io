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
  // Top 100 company tags ordered by thread count in the 1Point3Acres company
  // directory, captured 2026-08-30. Each tile links to its corresponding tag.
  const companies = [
    ['Amazon',56],['Google',36],['Meta',399],['Microsoft',268],['Bytedance',4142],['LinkedIn',415],['Uber',948],['Bloomberg',334],['Apple',313],['Airbnb',942],
    ['DoorDash',1829],['Snapchat',802],['Twitter',467],['Oracle',429],['AkunaCapital',677],['Citadel',692],['Pinterest',1012],['NVIDIA',518],['Stripe',2126],['Roblox',1873],
    ['Capital One',2732],['Salesforce',499],['Wayfair',1093],['IBM',513],['Robinhood',2899],['Yelp',365],['Goldman Sachs',8755],['Databricks',1890],['JPMorgan Chase',1048],['Dropbox',638],
    ['Two Sigma',1247],['Walmart Global Tech',1322],['eBay',481],['Lyft',1725],['Cisco',378],['OpenAI',9407],['Expedia',460],['MathWorks',475],['Indeed',749],['Coinbase',2869],
    ['VMware',333],['Snowflake',2246],['Tesla',1193],['Yahoo',379],['Visa',1118],['Pure Storage',763],['Intuit',1005],['Instacart',3356],['PayPal',542],['Square',482],
    ['Quora',983],['Hudson River Trading',8698],['Zillow',505],['TuSimple',2013],['Alibaba',1328],['Palantir',847],['Adobe',1016],['Wish',48],['Epic Systems',468],['Netflix',1418],
    ['IMC',2057],['Anthropic',9878],['Coursera',988],['McKinsey',504],['SIG',905],['WePay',1228],['Optiver',8331],['Huawei',797],['Qualcomm',331],['DRW',2833],
    ['SAP',478],['Intel',358],['Affirm',2173],['Rippling',7716],['Waymo',3330],['Morgan Stanley',3491],['BlackRock',1027],['TripAdvisor',484],['Flexport',1827],['Tencent',53],
    ['LiveRamp',464],['Twilio',1205],['Atlassian',2480],['C3.ai',7990],['Compass',2324],['Confluent',4152],['Nuro',2709],['Coupang',2160],['WeRide',4382],['Zoox',2978],
    ['Cruise',2674],['Houzz',978],['Reddit',3119],['Jane Street',2069],['Didi',2665],['Point72 Asset Management',1529],['Zenefits',1139],['Rubrik',1703],['Samsara',2992],['Qualtrics',1152]
  ];
  const search = document.querySelector('[data-company-search]');
  const count = document.querySelector('[data-company-count]');
  const initials = (name) => name.replace(/&/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  function render(query = '') {
    const normalized = query.trim().toLowerCase();
    const visible = companies.filter(([name]) => name.toLowerCase().includes(normalized));
    grid.replaceChildren(...visible.map(([name, tagId]) => {
      const link = document.createElement('a');
      link.className = 'company-tile';
      link.href = `https://www.1point3acres.com/bbs/tag-${tagId}-1.html`;
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
