/*
 * Header block
 * Builds a multi-row masthead from the authored nav fragment.
 * Section order in the nav document (each top-level <div>):
 *   1. utility links (audience/site selector)
 *   2. brand (logo)
 *   3. primary navigation (each item: label + nested list = dropdown)
 *   4. tools (search link, call-to-action)
 *   5. contact / share row
 *   6. breadcrumb root (Home link)
 * All copy, links and images come from the nav document; this file only
 * adds structure, controls and behaviour.
 */

// desktop layout matches the source site's breakpoint
const isDesktop = window.matchMedia('(width >= 1224px)');

const SECTION_NAMES = ['utility', 'brand', 'sections', 'tools', 'contact', 'breadcrumb'];

/**
 * Fetches the nav fragment. Local preview serves it under /content,
 * Edge Delivery serves it at the site root.
 * @returns {Promise<Document|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  // resolve relative media against the fragment location
  doc.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.tagName === 'IMG' ? 'src' : 'srcset';
    const val = el.getAttribute(attr);
    if (val && !/^(https?:|data:|\/)/.test(val)) {
      el.setAttribute(attr, new URL(val, resp.url).href);
    }
  });
  return doc;
}

function closeAllPanels(nav, except) {
  nav.querySelectorAll('[aria-expanded="true"][aria-controls]').forEach((btn) => {
    // below the desktop breakpoint the menu item toggles the whole menu, not a dropdown
    const isMenuToggle = !isDesktop.matches && btn.closest('.nav-item-menu');
    if (btn !== except && !isMenuToggle) {
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.nav-item')?.classList.remove('is-open');
    }
  });
}

function togglePanel(nav, btn, force) {
  const expanded = force !== undefined ? force : btn.getAttribute('aria-expanded') !== 'true';
  closeAllPanels(nav, btn);
  btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  btn.closest('.nav-item')?.classList.toggle('is-open', expanded);
  if (expanded) {
    const input = document.getElementById(btn.getAttribute('aria-controls'))?.querySelector('input');
    if (input) input.focus();
  }
}

let panelCount = 0;
function nextId(prefix) {
  panelCount += 1;
  return `${prefix}-${panelCount}`;
}

/**
 * Turns an authored list item (label + nested list) into a dropdown.
 * @param {Element} li
 */
function decorateDropdownItem(li) {
  const panel = li.querySelector(':scope > ul');
  li.classList.add('nav-item');
  if (!panel) {
    li.classList.add('nav-item-link');
    return;
  }
  const label = li.querySelector(':scope > p') || li.firstElementChild;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-drop-trigger nav-trigger';
  const img = label?.querySelector('img');
  if (img && !label.textContent.trim()) {
    // icon-only trigger (e.g. menu)
    li.classList.add('nav-item-icon');
    const text = document.createElement('span');
    text.className = 'nav-visually-hidden nav-trigger-label';
    text.textContent = img.alt || 'Menu';
    img.alt = '';
    btn.append(img, text);
  } else {
    li.classList.add('nav-item-drop');
    btn.textContent = label ? label.textContent.trim() : '';
  }
  panel.id = nextId('nav-panel');
  panel.classList.add('nav-drop-panel');
  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('aria-expanded', 'false');
  if (label) label.replaceWith(btn);
  else li.prepend(btn);
}

/**
 * Builds the search toggle + panel from an authored search link.
 * @param {Element} p paragraph containing the search link
 * @returns {Element} list item
 */
function buildSearch(p) {
  const link = p.querySelector('a');
  const img = p.querySelector('img');
  const action = link ? link.href : '/search';
  const li = document.createElement('li');
  li.className = 'nav-item nav-item-icon nav-item-search';
  const searchLabel = img?.alt || link?.textContent.trim() || 'Search';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-drop-trigger nav-trigger nav-search-toggle';
  if (img) {
    img.alt = '';
    btn.append(img);
  }
  const hidden = document.createElement('span');
  hidden.className = 'nav-visually-hidden';
  hidden.textContent = searchLabel;
  btn.append(hidden);

  const panel = document.createElement('div');
  panel.id = nextId('nav-search');
  panel.className = 'nav-search-panel';
  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  const field = document.createElement('div');
  field.className = 'nav-search-field';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `${panel.id}-input`;
  input.name = 'q';
  input.autocomplete = 'off';
  const label = document.createElement('label');
  label.htmlFor = input.id;
  label.textContent = searchLabel;
  input.addEventListener('input', () => field.classList.toggle('has-value', !!input.value));
  field.append(input, label);
  form.append(field);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `${action}#?cludoquery=${encodeURIComponent(q)}&cludopage=1`;
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-search-close';
  close.setAttribute('aria-label', 'Close search');
  close.textContent = '✕';
  close.addEventListener('click', () => togglePanel(close.closest('nav'), btn, false));
  panel.append(form, close);

  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('aria-expanded', 'false');
  li.append(btn, panel);
  return li;
}

function decorateTools(section) {
  const wrapper = document.createElement('ul');
  wrapper.className = 'nav-tools-list nav-list';
  [...section.children].forEach((child) => {
    const link = child.querySelector('a');
    if (child.querySelector('img') && link && !link.textContent.trim()) {
      wrapper.append(buildSearch(child));
    } else if (link) {
      const item = document.createElement('li');
      item.className = 'nav-item nav-item-cta';
      link.classList.add('nav-cta', 'nav-trigger');
      item.append(link);
      wrapper.append(item);
    }
  });
  section.replaceChildren(wrapper);
}

function decorateContact(section) {
  const url = encodeURIComponent(window.location.href);
  const row = document.createElement('div');
  row.className = 'nav-contact-row';
  const paragraphs = [...section.querySelectorAll(':scope > p')];
  const list = section.querySelector(':scope > ul');
  paragraphs.forEach((p, i) => {
    const img = p.querySelector('img');
    const item = document.createElement('div');
    if (!img) {
      item.className = 'nav-contact-text';
      item.textContent = p.textContent.trim();
    } else if (list && i === paragraphs.length - 1) {
      item.className = 'nav-share-label';
      img.alt = '';
      const span = document.createElement('span');
      span.textContent = p.textContent.trim();
      item.append(img, span);
    } else {
      item.className = 'nav-contact-phone';
      img.alt = '';
      const span = document.createElement('span');
      span.textContent = p.textContent.trim();
      item.append(img, span);
    }
    row.append(item);
  });
  if (list) {
    const divider = document.createElement('span');
    divider.className = 'nav-contact-divider';
    divider.setAttribute('aria-hidden', 'true');
    const share = row.querySelector('.nav-share-label');
    if (share) share.before(divider);
    else row.append(divider);
    list.classList.add('nav-share-links');
    list.querySelectorAll('a').forEach((a) => {
      const label = a.title || a.querySelector('img')?.alt || '';
      a.setAttribute('aria-label', label);
      a.target = '_blank';
      a.rel = 'noopener';
      const icon = a.querySelector('img');
      if (icon) icon.alt = '';
      const slug = label.toLowerCase();
      ['facebook', 'twitter', 'linked', 'email'].forEach((n) => {
        if (slug.includes(n)) a.classList.add(`nav-share-${n === 'linked' ? 'linkedin' : n}`);
      });
      const href = a.getAttribute('href') || '';
      if (/^https?:/.test(href) && href.endsWith('=')) a.href = `${href}${url}`;
      const circle = document.createElement('span');
      circle.className = 'nav-share-icon';
      circle.append(...a.childNodes);
      a.append(circle);
    });
    row.append(list);
  }
  section.replaceChildren(row);
}

function humanize(segment) {
  const text = decodeURIComponent(segment).replace(/\.html$/, '').replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function decorateBreadcrumb(section) {
  const home = section.querySelector('a');
  const ol = document.createElement('ol');
  const addCrumb = (label, href) => {
    const li = document.createElement('li');
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
    } else {
      li.setAttribute('aria-current', 'page');
      li.textContent = label;
    }
    ol.append(li);
  };
  if (home) addCrumb(home.textContent.trim(), home.getAttribute('href') || '/');
  const segments = window.location.pathname.split('/').filter(Boolean)
    .map((s) => s.replace(/\.html$/, ''))
    .filter((s, i) => !(i === 0 && s === 'content'))
    .filter((s) => s !== 'index');
  segments.forEach((seg, i) => {
    const last = i === segments.length - 1;
    if (last) {
      const title = document.title.split(' | ')[0].trim();
      addCrumb(title || humanize(seg));
    } else {
      addCrumb(humanize(seg), `/${segments.slice(0, i + 1).join('/')}`);
    }
  });
  const navEl = document.createElement('nav');
  navEl.setAttribute('aria-label', 'Breadcrumb');
  navEl.append(ol);
  section.replaceChildren(navEl);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  nav.setAttribute('aria-expanded', 'false');

  const sections = {};
  [...fragment.body.children].filter((el) => el.tagName === 'DIV').forEach((div, i) => {
    const name = SECTION_NAMES[i] || `extra-${i}`;
    div.className = `nav-${name}`;
    sections[name] = div;
  });

  // row 2: brand + navigation + tools share one bar
  const main = document.createElement('div');
  main.className = 'nav-main';

  if (sections.brand) {
    const brandLink = sections.brand.querySelector('a');
    if (brandLink) brandLink.setAttribute('aria-label', brandLink.querySelector('img')?.alt || 'Home');
    main.append(sections.brand);
  }

  let menuToggle = null;
  if (sections.sections) {
    const ul = sections.sections.querySelector(':scope > ul');
    if (ul) {
      ul.classList.add('nav-list');
      [...ul.children].forEach((li) => decorateDropdownItem(li));
      // an icon-only item doubles as the menu toggle below the desktop breakpoint
      menuToggle = ul.querySelector(':scope > .nav-item-icon > .nav-drop-trigger');
      if (menuToggle) {
        menuToggle.closest('.nav-item').classList.add('nav-item-menu');
        menuToggle.classList.add('nav-menu-toggle');
        menuToggle.setAttribute('aria-label', menuToggle.textContent.trim() || 'Menu');
      }
    }
    main.append(sections.sections);
  }
  if (sections.tools) {
    decorateTools(sections.tools);
    main.append(sections.tools);
  }

  if (sections.utility) {
    sections.utility.querySelectorAll('strong > a').forEach((a) => {
      a.setAttribute('aria-current', 'true');
      a.classList.add('is-active');
    });
    nav.append(sections.utility);
  }
  nav.append(main);
  if (sections.contact) {
    decorateContact(sections.contact);
    nav.append(sections.contact);
  }
  if (sections.breadcrumb) {
    decorateBreadcrumb(sections.breadcrumb);
    nav.append(sections.breadcrumb);
  }

  const setMenuOpen = (open) => {
    nav.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menuToggle && !isDesktop.matches) menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAllPanels(nav);
  };

  // small-screen menu panel head: logo, call to action and close button (copies of the bar's)
  if (sections.sections && menuToggle) {
    const head = document.createElement('div');
    head.className = 'nav-sheet-head';
    const brand = sections.brand?.querySelector('a');
    if (brand) head.append(brand.cloneNode(true));
    const cta = sections.tools?.querySelector('.nav-cta');
    if (cta) {
      const wrap = document.createElement('div');
      wrap.className = 'nav-sheet-cta';
      const copy = cta.cloneNode(true);
      copy.className = 'nav-sheet-cta-link';
      wrap.append(copy);
      head.append(wrap);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'nav-sheet-close';
    close.setAttribute('aria-label', 'Close menu');
    close.textContent = '✕';
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuOpen(false);
      menuToggle.focus();
    });
    head.append(close);
    sections.sections.prepend(head);
  }

  // panel triggers (dropdowns, menu, search)
  nav.querySelectorAll('.nav-drop-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn === menuToggle && !isDesktop.matches) {
        closeAllPanels(nav);
        setMenuOpen(nav.getAttribute('aria-expanded') !== 'true');
        return;
      }
      togglePanel(nav, btn);
    });
  });

  // close on outside click / Escape
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllPanels(nav);
  });
  nav.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) closeAllPanels(nav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const open = [...nav.querySelectorAll('[aria-expanded="true"][aria-controls]')]
      .find((b) => b !== menuToggle || isDesktop.matches);
    if (open) {
      togglePanel(nav, open, false);
      open.focus();
    } else if (nav.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle?.focus();
    }
  });

  // reset state when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    nav.setAttribute('aria-expanded', 'false');
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
