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
  // Top 200 company tags ordered by thread count in the 1Point3Acres company
  // directory, captured 2026-08-30. Each tile links to its corresponding tag.
  const companies = [
    ['Amazon',56,'amazon.com'],['Google',36,'google.com'],['Meta',399,'meta.com'],['Microsoft',268,'microsoft.com'],['Bytedance',4142,'bytedance.com'],['LinkedIn',415,'linkedin.com'],['Uber',948,'uber.com'],['Bloomberg',334,'bloomberg.com'],['Apple',313,'apple.com'],['Airbnb',942,'airbnb.com'],
    ['DoorDash',1829,'doordash.com'],['Snapchat',802,'snapchat.com'],['Twitter',467,'x.com'],['Oracle',429,'oracle.com'],['AkunaCapital',677,'akunacapital.com'],['Citadel',692,'citadel.com'],['Pinterest',1012,'pinterest.com'],['NVIDIA',518,'nvidia.com'],['Stripe',2126,'stripe.com'],['Roblox',1873,'roblox.com'],
    ['Capital One',2732,'capitalone.com'],['Salesforce',499,'salesforce.com'],['Wayfair',1093,'wayfair.com'],['IBM',513,'ibm.com'],['Robinhood',2899,'robinhood.com'],['Yelp',365,'yelp.com'],['Goldman Sachs',8755,'goldmansachs.com'],['Databricks',1890,'databricks.com'],['JPMorgan Chase',1048,'jpmorganchase.com'],['Dropbox',638,'dropbox.com'],
    ['Two Sigma',1247,'twosigma.com'],['Walmart Global Tech',1322,'walmart.com'],['eBay',481,'ebay.com'],['Lyft',1725,'lyft.com'],['Cisco',378,'cisco.com'],['OpenAI',9407,'openai.com'],['Expedia',460,'expedia.com'],['MathWorks',475,'mathworks.com'],['Indeed',749,'indeed.com'],['Coinbase',2869,'coinbase.com'],
    ['VMware',333,'vmware.com'],['Snowflake',2246,'snowflake.com'],['Tesla',1193,'tesla.com'],['Yahoo',379,'yahoo.com'],['Visa',1118,'visa.com'],['Pure Storage',763,'purestorage.com'],['Intuit',1005,'intuit.com'],['Instacart',3356,'instacart.com'],['PayPal',542,'paypal.com'],['Square',482,'squareup.com'],
    ['Quora',983,'quora.com'],['Hudson River Trading',8698,'hudsonrivertrading.com'],['Zillow',505,'zillow.com'],['TuSimple',2013,'tusimple.com'],['Alibaba',1328,'alibabagroup.com'],['Palantir',847,'palantir.com'],['Adobe',1016,'adobe.com'],['Wish',48,'wish.com'],['Epic Systems',468,'epic.com'],['Netflix',1418,'netflix.com'],
    ['IMC',2057,'imc.com'],['Anthropic',9878,'anthropic.com'],['Coursera',988,'coursera.org'],['McKinsey',504,'mckinsey.com'],['SIG',905,'sig.com'],['WePay',1228,'wepay.com'],['Optiver',8331,'optiver.com'],['Huawei',797,'huawei.com'],['Qualcomm',331,'qualcomm.com'],['DRW',2833,'drw.com'],
    ['SAP',478,'sap.com'],['Intel',358,'intel.com'],['Affirm',2173,'affirm.com'],['Rippling',7716,'rippling.com'],['Waymo',3330,'waymo.com'],['Morgan Stanley',3491,'morganstanley.com'],['BlackRock',1027,'blackrock.com'],['TripAdvisor',484,'tripadvisor.com'],['Flexport',1827,'flexport.com'],['Tencent',53,'tencent.com'],
    ['LiveRamp',464,'liveramp.com'],['Twilio',1205,'twilio.com'],['Atlassian',2480,'atlassian.com'],['C3.ai',7990,'c3.ai'],['Compass',2324,'compass.com'],['Confluent',4152,'confluent.io'],['Nuro',2709,'nuro.ai'],['Coupang',2160,'coupang.com'],['WeRide',4382,'weride.ai'],['Zoox',2978,'zoox.com'],
    ['Cruise',2674,'getcruise.com'],['Houzz',978,'houzz.com'],['Reddit',3119,'reddit.com'],['Jane Street',2069,'janestreet.com'],['Didi',2665,'didiglobal.com'],['Point72 Asset Management',1529,'point72.com'],['Zenefits',1139,'zenefits.com'],['Rubrik',1703,'rubrik.com'],['Samsara',2992,'samsara.com'],['Qualtrics',1152,'qualtrics.com'],
    ['Boston Consulting Group',8717,'bcg.com'],['Barclays',627,'home.barclays'],['Hulu',664,'hulu.com'],['Shopify',6047,'shopify.com'],['Audible',1006,'audible.com'],['Spotify',1141,'spotify.com'],['Circle',3449,'circle.com'],['Samsung',717,'samsung.com'],['Fortinet',1517,'fortinet.com'],['Pony.ai',28,'pony.ai'],
    ['Antra',1680,'antra.com'],['Nutanix',1101,'nutanix.com'],['Palo Alto Networks',8710,'paloaltonetworks.com'],['Zoom',3139,'zoom.us'],['Datadog',4220,'datadoghq.com'],['Twitch',2170,'twitch.tv'],['Tableau',7,'tableau.com'],['IXL Learning',2536,'ixl.com'],['Citi',2307,'citigroup.com'],['HubSpot',829,'hubspot.com'],
    ['Splunk',1697,'splunk.com'],['Wells Fargo',8487,'wellsfargo.com'],['Citrix',815,'citrix.com'],['Asana',1198,'asana.com'],['xAI',9906,'x.ai'],['Ant Group',2851,'antgroup.com'],['Bank of America',472,'bankofamerica.com'],['ServiceNow',901,'servicenow.com'],['Workday',971,'workday.com'],['Thumbtack',1040,'thumbtack.com'],
    ['Upstart',3126,'upstart.com'],['AMD',879,'amd.com'],['Scale AI',8608,'scale.com'],['Arista Networks',737,'arista.com'],['Ramp',9787,'ramp.com'],['Electronic Arts',8701,'ea.com'],['CVS',2842,'cvshealth.com'],['FactSet',634,'factset.com'],['Quantcast',1112,'quantcast.com'],['Duolingo',4613,'duolingo.com'],
    ['GoDaddy',1210,'godaddy.com'],['CodeSignal',9703,'codesignal.com'],['Applied Intuition',8730,'applied.co'],['Baidu',2456,'baidu.com'],['Oscar Health',8707,'hioscar.com'],['Nordstrom',2937,'nordstrom.com'],['Okta',1066,'okta.com'],['Virtu Financial',2112,'virtu.com'],['Shopee',6372,'shopee.com'],['Disney',680,'disney.com'],
    ['Chewy',3630,'chewy.com'],['MongoDB',712,'mongodb.com'],['Chime',5682,'chime.com'],['Nextdoor',2372,'nextdoor.com'],['ZipRecruiter',9135,'ziprecruiter.com'],['Lucid Software',1724,'lucid.co'],['Voleon',2801,'voleon.com'],['Groupon',584,'groupon.com'],['Verkada',6254,'verkada.com'],['Cerner',1343,'cerner.com'],
    ['Squarepoint',2429,'squarepoint-capital.com'],['AppFolio',709,'appfolio.com'],['SoFi',8503,'sofi.com'],['Redfin',832,'redfin.com'],['American Express',8705,'americanexpress.com'],['DraftKings',2154,'draftkings.com'],['InterSystems',1438,'intersystems.com'],['OfferUp',1982,'offerup.com'],['The Trade Desk',8494,'thetradedesk.com'],['Jump Trading',8699,'jumptrading.com'],
    ['Aurora',4454,'aurora.tech'],['Box',968,'box.com'],['Chegg',1721,'chegg.com'],['Opendoor',2004,'opendoor.com'],['UBS',3903,'ubs.com'],['Viagogo',3655,'viagogo.com'],['Blend',2273,'blend.com'],['Unity',2158,'unity.com'],['Lime',3831,'li.me'],['PEAK6 Investments',1455,'peak6.com'],
    ['Interactive Brokers',8704,'interactivebrokers.com'],['NewsBreak',7741,'newsbreak.com'],['Pocket Gems',851,'pocketgems.com'],['DocuSign',1380,'docusign.com'],['D. E. Shaw',8325,'deshaw.com'],['Millennium Management',9708,'mlp.com'],['Deloitte',2838,'deloitte.com'],['Brex',4849,'brex.com'],['Autodesk',503,'autodesk.com'],['WeWork',2467,'wework.com'],
    ['Veeva',9288,'veeva.com'],['Factual',1070,'factual.com'],['Plaid',8593,'plaid.com'],['Pinduoduo',3995,'pddholdings.com'],['Cloudera',705,'cloudera.com'],['Fidelity',7964,'fidelity.com'],['Axon',2529,'axon.com'],['Roku',3358,'roku.com'],['Ericsson',947,'ericsson.com'],['Figma',8373,'figma.com']
  ];
  const search = document.querySelector('[data-company-search]');
  const count = document.querySelector('[data-company-count]');
  const initials = (name) => name.replace(/&/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  function render(query = '') {
    const normalized = query.trim().toLowerCase();
    const visible = companies.filter(([name]) => name.toLowerCase().includes(normalized));
    grid.replaceChildren(...visible.map(([name, tagId, domain]) => {
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
      const logo = document.createElement('img');
      logo.className = 'company-logo';
      logo.alt = '';
      logo.loading = 'lazy';
      logo.decoding = 'async';
      logo.referrerPolicy = 'no-referrer';
      logo.addEventListener('load', () => mark.classList.add('has-logo'));
      logo.addEventListener('error', () => {
        if (logo.dataset.fallback !== 'google') {
          logo.dataset.fallback = 'google';
          logo.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
        } else {
          logo.remove();
        }
      });
      logo.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      mark.append(logo);
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
