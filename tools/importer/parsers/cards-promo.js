/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo.
 * Source: .promo-card-wrapper containing repeated .promo-card items.
 * Block table (blocks/cards-promo/README.md), one row per card:
 *   | picture | H3 title, description paragraph(s), button link paragraph |
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.promo-card');
  cards.forEach((card) => {
    // Image cell
    const img = card.querySelector('.promo-image img, img');
    if (img && !img.getAttribute('src') && img.getAttribute('data-src')) {
      img.setAttribute('src', img.getAttribute('data-src'));
    }
    const imageCell = img ? [img] : [''];

    // Text cell
    const textCell = [];
    const title = card.querySelector('.card-content .title, .title');
    if (title && title.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }

    const description = card.querySelector('.card-content .description, .description');
    if (description && description.textContent.trim()) {
      const paras = [...description.children].filter((el) => el.textContent.trim());
      if (paras.length) {
        textCell.push(...paras);
      } else {
        const p = document.createElement('p');
        p.innerHTML = description.innerHTML.trim();
        textCell.push(p);
      }
    }

    const link = card.querySelector('.action a[href], a.primary-cta-button[href]');
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    if (!img && !textCell.length) return;
    cells.push([imageCell, textCell.length ? textCell : ['']]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
