/* eslint-disable */
/* global WebImporter */

/**
 * Jackson (www.jackson.com) sections transformer.
 *
 * beforeTransform: inserts an <hr> section break before every non-first section
 * (while parser target elements still exist). Breaks for styled sections carry
 * a temporary data-excat-section-id marker; a styled first section gets a
 * temporary marked <hr> that is removed again in afterTransform.
 *
 * afterTransform: adds a Section Metadata block (style) at the end of each styled
 * section, i.e. right before the next section break (or at the end of the
 * container for the last section), then removes markers.
 *
 * Note: sections 2 and 3 share one div.header element
 * (.subpage-header-block = section 2, .child-items = section 3), so the break for
 * section 3 is placed before its .child-items ancestor, between the two children.
 */

const BREAK_ATTR = 'data-excat-section-break';
const ID_ATTR = 'data-excat-section-id';
const FIRST_ATTR = 'data-excat-section-first';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector, try next
    }
  }
  return null;
}

// Element before which the section break should be inserted.
function breakAnchor(el) {
  // Section content nested inside .child-items (shared div.header with the previous
  // section): break between .subpage-header-block and .child-items.
  const childItems = el.closest('.child-items');
  if (childItems && childItems.previousElementSibling
    && childItems.previousElementSibling.classList.contains('subpage-header-block')) {
    return childItems;
  }
  return el;
}

export default function transform(hookName, element, payload) {
  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;
  const document = element.ownerDocument || element;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el) continue;
      if (i === 0 && !section.style) continue;

      const hr = document.createElement('hr');
      hr.setAttribute(BREAK_ATTR, section.id);
      if (section.style) hr.setAttribute(ID_ATTR, section.id);
      if (i === 0) hr.setAttribute(FIRST_ATTR, 'true');

      const anchor = breakAnchor(el);
      anchor.parentNode.insertBefore(hr, anchor);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`hr[${ID_ATTR}="${section.id}"]`);
      if (!marker) continue;

      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Place metadata at the end of the section: right before the next section break.
      const breaks = [...element.querySelectorAll(`hr[${BREAK_ATTR}]`)];
      const next = breaks[breaks.indexOf(marker) + 1];
      if (next) {
        next.parentNode.insertBefore(meta, next);
      } else {
        // Last section: append after the surviving section element, or at the end
        // of the container holding the break.
        const container = marker.parentNode;
        container.appendChild(meta);
      }
    }

    // Remove the first section's temporary break; strip markers from the others.
    element.querySelectorAll(`hr[${FIRST_ATTR}]`).forEach((hr) => hr.remove());
    element.querySelectorAll(`hr[${BREAK_ATTR}]`).forEach((hr) => {
      hr.removeAttribute(BREAK_ATTR);
      hr.removeAttribute(ID_ATTR);
    });
  }
}
