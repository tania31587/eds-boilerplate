import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK_LEVEL = /^(P|H[1-6]|UL|OL|DIV|BLOCKQUOTE|PICTURE|TABLE|PRE)$/;

/**
 * Turns a cell into a list of block-level elements, wrapping loose
 * text/inline nodes in paragraphs and dropping empty ones.
 * @param {Element} cell
 * @returns {Element[]}
 */
function normalizeCell(cell) {
  const out = [];
  let inline = null;
  [...cell.childNodes].forEach((node) => {
    const isBlock = node.nodeType === Node.ELEMENT_NODE && BLOCK_LEVEL.test(node.tagName);
    if (isBlock) {
      inline = null;
      if (node.textContent.trim() || node.querySelector('img, picture')) out.push(node);
      return;
    }
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
      if (inline) inline.append(node);
      return;
    }
    if (!inline) {
      inline = document.createElement('p');
      out.push(inline);
    }
    inline.append(node);
  });
  return out.filter((el) => el.textContent.trim() || el.querySelector('img, picture'));
}

/**
 * True when the element is just a single link (optionally wrapped in strong/em).
 * @param {Element} el
 * @returns {HTMLAnchorElement|null}
 */
function soleLink(el) {
  if (el.tagName === 'A') return el;
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  return el.textContent.trim() === links[0].textContent.trim() ? links[0] : null;
}

/**
 * Cards (promo): full-width photo, dark text panel with title, description, button.
 * One row per card; cells may be split or merged — content is read in order.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = row.children.length ? [...row.children] : [row];
    const picture = row.querySelector('picture');
    const elements = cells.flatMap(normalizeCell)
      .filter((el) => !(picture && el.contains(picture) && !el.textContent.trim()));

    if (!picture && !elements.length) return;

    const li = document.createElement('li');
    li.className = 'cards-promo-card';

    if (picture) {
      const image = document.createElement('div');
      image.className = 'cards-promo-card-image';
      image.append(picture);
      li.append(image);
    }

    // last element that is only a link becomes the CTA
    let ctaLink = null;
    for (let i = elements.length - 1; i >= 0; i -= 1) {
      const link = soleLink(elements[i]);
      if (link) {
        ctaLink = link;
        elements.splice(i, 1);
        break;
      }
    }

    const body = document.createElement('div');
    body.className = 'cards-promo-card-body';

    const [title, ...rest] = elements;
    if (title) {
      title.classList.add('cards-promo-card-title');
      body.append(title);
    }

    const description = document.createElement('div');
    description.className = 'cards-promo-card-description';
    description.append(...rest);
    body.append(description);

    if (ctaLink) {
      ctaLink.classList.remove('button', 'primary', 'secondary', 'accent');
      ctaLink.classList.add('cards-promo-card-link');
      const cta = document.createElement('div');
      cta.className = 'cards-promo-card-cta';
      cta.append(ctaLink);
      body.append(cta);
    }

    li.append(body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
