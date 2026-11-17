import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Returns true when an element carries no visible content.
 * @param {Element} el
 * @returns {boolean}
 */
function isEmpty(el) {
  return !el.textContent.trim() && !el.querySelector('img, picture, video, iframe');
}

/**
 * Hero (split): text panel on the left, photo flush right.
 * Authoring: any row/cell may hold the picture; every other piece of content
 * (title, subheading, CTA) goes into the text panel, in authored order.
 * @param {Element} block
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const pictureHolder = picture ? picture.parentElement : null;

  const content = document.createElement('div');
  content.className = 'hero-split-content';

  const media = document.createElement('div');
  media.className = 'hero-split-image';

  if (picture) {
    media.append(picture);
    // drop the paragraph that only wrapped the picture
    if (pictureHolder && pictureHolder.tagName === 'P' && isEmpty(pictureHolder)) pictureHolder.remove();
  }

  [...block.children].forEach((row) => {
    const cells = row.children.length ? [...row.children] : [row];
    cells.forEach((cell) => {
      [...cell.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (!node.textContent.trim()) return;
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          content.append(p);
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE || isEmpty(node)) return;
        content.append(node);
      });
    });
  });

  // a title authored as a plain paragraph still reads as the hero heading
  if (!content.querySelector('h1, h2, h3, h4, h5, h6') && content.firstElementChild) {
    content.firstElementChild.classList.add('hero-split-title');
  }

  media.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 976px)', width: '1240' },
      { width: '750' },
    ]));
  });

  const children = [];
  if (content.children.length) children.push(content);
  if (media.children.length) children.push(media);
  block.replaceChildren(...children);
  if (!media.children.length) block.classList.add('hero-split-no-image');
}
