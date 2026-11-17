/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-quote.
 * Source: .cta-icon-card-wrapper containing repeated .cta-icon-card items.
 * Block table (blocks/cards-quote/README.md), one row per card:
 *   | portrait picture | quotation paragraph, description paragraph(s), link paragraph |
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.cta-icon-card');
  cards.forEach((card) => {
    // Image cell
    const img = card.querySelector('.icon-image img, img');
    if (img && !img.getAttribute('src') && img.getAttribute('data-src')) {
      img.setAttribute('src', img.getAttribute('data-src'));
    }
    const imageCell = img ? [img] : [''];

    // Text cell
    const textCell = [];
    const title = card.querySelector('.card-content .title, .title');
    if (title && title.textContent.trim()) {
      const quote = document.createElement('p');
      quote.textContent = title.textContent.trim();
      textCell.push(quote);
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

    const link = card.querySelector('.cta-arrow-button-wrapper a[href], a.cta-arrow-button[href]');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quote', cells });
  element.replaceWith(block);
}
