/*
 * Footer block
 * Renders the authored footer fragment. Section order in the footer document:
 *   1. link columns: each heading followed by its list of links
 *   2. bottom row: copyright paragraph, a list of legal links, a list of image links (social)
 *   3. disclosures: badge link (image only), notice (bold only), then paragraphs
 * All copy, links and images come from the fragment; this file only adds
 * structure and behaviour.
 */

// links to these hosts are part of the site and keep opening in the same tab
const OWN_HOSTS = ['www.jackson.com', 'jackson.com'];

/**
 * Fetches the footer fragment. Local preview serves it under /content,
 * Edge Delivery serves it at the site root.
 * @returns {Promise<Document|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  doc.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.tagName === 'IMG' ? 'src' : 'srcset';
    const val = el.getAttribute(attr);
    if (val && !/^(https?:|data:|\/)/.test(val)) {
      el.setAttribute(attr, new URL(val, resp.url).href);
    }
  });
  return doc;
}

function isExternal(a) {
  try {
    const url = new URL(a.href, window.location.href);
    if (url.origin === window.location.origin) return false;
    return !OWN_HOSTS.includes(url.hostname);
  } catch (e) {
    return false;
  }
}

function openInNewTab(a) {
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
}

/** Groups each heading with the list that follows it into a column. */
function buildColumns(section) {
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  let current = null;
  [...section.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      current = document.createElement('div');
      current.className = 'footer-column';
      el.classList.add('footer-column-title');
      current.append(el);
      columns.append(current);
    } else if (current) {
      current.append(el);
    } else {
      columns.append(el);
    }
  });
  columns.querySelectorAll('a').forEach((a) => {
    if (isExternal(a)) openInNewTab(a);
    if (a.title) a.setAttribute('aria-label', a.title);
  });
  return columns;
}

/** Copyright + legal links on one side, image links (social) on the other. */
function buildBottomRow(section) {
  const row = document.createElement('div');
  row.className = 'footer-bottom';
  const legal = document.createElement('div');
  legal.className = 'footer-legal';
  const social = document.createElement('ul');
  social.className = 'footer-social';
  [...section.children].forEach((el) => {
    if (el.tagName === 'UL' && el.querySelector('img')) {
      [...el.children].forEach((li) => {
        const a = li.querySelector('a');
        const img = li.querySelector('img');
        if (a && img) {
          a.classList.add('footer-social-link');
          a.setAttribute('aria-label', img.alt || a.title || '');
          openInNewTab(a);
          const icon = document.createElement('span');
          icon.className = 'footer-social-icon';
          icon.style.setProperty('--icon', `url("${img.src}")`);
          img.alt = '';
          img.setAttribute('aria-hidden', 'true');
          icon.append(img);
          a.replaceChildren(icon);
        }
        social.append(li);
      });
    } else if (el.tagName === 'UL') {
      el.classList.add('footer-legal-links');
      legal.append(el);
    } else {
      el.classList.add('footer-copyright');
      legal.append(el);
    }
  });
  row.append(legal);
  if (social.children.length) row.append(social);
  return row;
}

/** Badge (image-only link), notice (bold-only paragraph) and the remaining copy. */
function buildDisclosures(section) {
  const wrap = document.createElement('div');
  wrap.className = 'footer-disclosures';
  [...section.children].forEach((el) => {
    const text = el.textContent.trim();
    const img = el.querySelector('img');
    const strong = el.querySelector('strong');
    if (img && !text) {
      el.classList.add('footer-badge');
      el.querySelectorAll('a').forEach((a) => {
        openInNewTab(a);
        if (!a.getAttribute('aria-label') && img.alt) a.setAttribute('aria-label', img.alt);
      });
    } else if (strong && strong.textContent.trim() === text) {
      el.classList.add('footer-notice');
    } else {
      el.classList.add('footer-disclosure-text');
    }
    wrap.append(el);
  });
  wrap.querySelectorAll('a:not(.footer-badge a)').forEach((a) => {
    if (isExternal(a)) openInNewTab(a);
  });
  return wrap;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.body.children].filter((el) => el.tagName === 'DIV');
  const main = document.createElement('div');
  main.className = 'footer-main';
  const mainInner = document.createElement('div');
  mainInner.className = 'footer-inner';
  main.append(mainInner);

  const [linkSection, bottomSection, ...rest] = sections;
  if (linkSection) mainInner.append(buildColumns(linkSection));
  if (bottomSection) {
    mainInner.append(document.createElement('hr'));
    mainInner.append(buildBottomRow(bottomSection));
  }
  block.append(main);

  rest.forEach((section) => {
    const band = document.createElement('div');
    band.className = 'footer-secondary';
    const inner = document.createElement('div');
    inner.className = 'footer-inner';
    inner.append(buildDisclosures(section));
    band.append(inner);
    block.append(band);
  });
}
