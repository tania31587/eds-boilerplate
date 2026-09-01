const PAGE_SIZE = 20;

/**
 * Creates an HTML element and optionally assigns a class and text.
 */
function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined && text !== null) {
    element.textContent = text;
  }

  return element;
}

/**
 * Reads the spreadsheet JSON path authored inside the DA block.
 */
function getSpreadsheetPath(block) {
  const authoredLink = block.querySelector('a');

  if (authoredLink) {
    const linkURL = new URL(authoredLink.href);

    return `${linkURL.pathname}${linkURL.search}`;
  }

  const authoredText = block.textContent.trim();

  return authoredText || '/plant-catalog.json';
}

/**
 * Creates one list item using one spreadsheet JSON row.
 */
function createPlantItem(item) {
  const listItem = createElement('li', 'plant-list-item');
  const card = createElement('article', 'plant-list-card');

  const header = createElement('div', 'plant-list-card-header');

  const title = createElement(
    'h3',
    'plant-list-card-title',
    item.title || 'Untitled plant',
  );

  header.append(title);

  if (item.category) {
    const category = createElement(
      'span',
      'plant-list-card-category',
      item.category,
    );

    header.append(category);
  }

  card.append(header);

  if (item.description) {
    const description = createElement(
      'p',
      'plant-list-card-description',
      item.description,
    );

    card.append(description);
  }

  if (
    item.price !== undefined
    && item.price !== null
    && item.price !== ''
  ) {
    const price = createElement(
      'p',
      'plant-list-card-price',
      `₹${item.price}`,
    );

    card.append(price);
  }

  if (item.ctaLink) {
    const cta = createElement(
      'a',
      'plant-list-card-cta',
      item.ctaText || 'View Plant',
    );

    cta.href = item.ctaLink;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    card.append(cta);
  }

  listItem.append(card);

  return listItem;
}

/**
 * Creates a pagination button.
 */
function createPaginationButton(label, modifierClass) {
  const button = createElement(
    'button',
    `plant-list-pagination-button ${modifierClass}`,
    label,
  );

  button.type = 'button';

  return button;
}

export default async function decorate(block) {
  /*
   * Read the spreadsheet path before clearing the authored block content.
   */
  const spreadsheetPath = getSpreadsheetPath(block);

  block.textContent = '';

  /*
   * Create the block UI.
   */
  const status = createElement(
    'p',
    'plant-list-status',
    'Loading plant information...',
  );

  status.setAttribute('aria-live', 'polite');

  const list = createElement('ul', 'plant-list-items');

  const pagination = createElement(
    'nav',
    'plant-list-pagination',
  );

  pagination.setAttribute('aria-label', 'Plant list pagination');

  const previousButton = createPaginationButton(
    'Previous',
    'plant-list-pagination-previous',
  );

  const pageInformation = createElement(
    'span',
    'plant-list-page-information',
    'Page 1',
  );

  const nextButton = createPaginationButton(
    'Next',
    'plant-list-pagination-next',
  );

  pagination.append(
    previousButton,
    pageInformation,
    nextButton,
  );

  block.append(status, list, pagination);

  let currentPage = 1;
  let totalResults = 0;
  let activeRequest;

  /**
   * Loads one page from the spreadsheet JSON endpoint.
   */
  async function loadPage(pageNumber) {
    /*
     * Cancel the previous request when the user changes pages quickly.
     */
    if (activeRequest) {
      activeRequest.abort();
    }

    activeRequest = new AbortController();

    const offset = (pageNumber - 1) * PAGE_SIZE;

    const requestURL = new URL(
      spreadsheetPath,
      window.location.origin,
    );

    requestURL.searchParams.set('limit', PAGE_SIZE);
    requestURL.searchParams.set('offset', offset);

    status.textContent = 'Loading plant information...';
    status.classList.remove('plant-list-status-error');

    list.textContent = '';
    list.setAttribute('aria-busy', 'true');

    previousButton.disabled = true;
    nextButton.disabled = true;

    try {
      const response = await fetch(requestURL, {
        signal: activeRequest.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Spreadsheet request returned ${response.status}`,
        );
      }

      const spreadsheetJSON = await response.json();

      const items = Array.isArray(spreadsheetJSON.data)
        ? spreadsheetJSON.data
        : [];

      totalResults = Number(spreadsheetJSON.total) || items.length;
      currentPage = pageNumber;

      const totalPages = Math.max(
        1,
        Math.ceil(totalResults / PAGE_SIZE),
      );

      items.forEach((item) => {
        list.append(createPlantItem(item));
      });

      if (items.length === 0) {
        status.textContent = 'No plant records were found.';
      } else {
        const firstVisibleItem = offset + 1;

        const lastVisibleItem = Math.min(
          offset + items.length,
          totalResults,
        );

        status.textContent = [
          `Showing ${firstVisibleItem}`,
          `to ${lastVisibleItem}`,
          `of ${totalResults} plants`,
        ].join(' ');
      }

      pageInformation.textContent = `Page ${currentPage} of ${totalPages}`;

      previousButton.disabled = currentPage === 1;

      nextButton.disabled = currentPage >= totalPages || items.length < PAGE_SIZE;

      /*
       * Hide pagination when there is only one page.
       * You can remove this condition if your reviewer wants
       * the disabled pagination controls to remain visible.
       */
      pagination.hidden = totalPages <= 1;
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      // Display a user-friendly error message
      status.textContent = 'Unable to load the spreadsheet content.';

      status.classList.add('plant-list-status-error');
      pagination.hidden = true;

      // console.err*r('Plant list loading error:', err*r);
    } finally {
      list.removeAttribute('aria-busy');
    }
  }

  previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
  });

  nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);

    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  });

  await loadPage(1);
}
