/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split.
 * Source: .subpage-herospace-block (jackson.com subpage hero).
 * Block table (blocks/hero-split/README.md):
 *   | Hero Split |
 *   | picture |
 *   | H1 title, optional subheading paragraph(s), optional CTA link |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: image (optional)
  const img = element.querySelector('.image img, img');
  if (img) {
    if (!img.getAttribute('src') && img.getAttribute('data-src')) {
      img.setAttribute('src', img.getAttribute('data-src'));
    }
    cells.push([img]);
  }

  // Row 2: text panel
  const content = [];
  const textRoot = element.querySelector('.card-content') || element;

  const sourceTitle = textRoot.querySelector('h1, .title');
  if (sourceTitle && sourceTitle.textContent.trim()) {
    if (sourceTitle.tagName === 'H1') {
      content.push(sourceTitle);
    } else {
      const h1 = document.createElement('h1');
      h1.textContent = sourceTitle.textContent.trim();
      content.push(h1);
    }
  }

  // Optional subheading/description
  const description = textRoot.querySelector('.description');
  if (description && description.textContent.trim()) {
    const blocks = [...description.children].filter((el) => el.textContent.trim());
    if (blocks.length) {
      content.push(...blocks);
    } else {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      content.push(p);
    }
  }

  // Optional CTA links not already inside the description
  [...textRoot.querySelectorAll('a[href]')]
    .filter((a) => !(description && description.contains(a)) && a.textContent.trim())
    .forEach((a) => {
      const p = document.createElement('p');
      p.append(a);
      content.push(p);
    });

  if (content.length) cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
