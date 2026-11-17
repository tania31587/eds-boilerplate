/* eslint-disable */
/* global WebImporter */

/**
 * Jackson (www.jackson.com) cleanup transformer.
 *
 * Removes non-authorable chrome so only the page body
 * (div.body-content > section > div.content-wrapper) is left for the parsers.
 * Header/nav is migrated separately via the nav fragment; footer is a later phase.
 */

const remove = (root, selectors) => {
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  });
};

export default function transform(hookName, element, payload) {
  const doc = element.ownerDocument || element;

  if (hookName === 'beforeTransform') {
    // The source's social-share image meta drops the DAM prefix (https://www.jackson.com/graphics/...
    // returns 404); the asset lives under /content/dam/jacksoncom/graphics/...
    doc.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
      const content = meta.getAttribute('content') || '';
      const fixed = content.replace(/^(https?:\/\/www\.jackson\.com)?\/graphics\//, '$1/content/dam/jacksoncom/graphics/');
      if (fixed !== content) meta.setAttribute('content', fixed);
    });

    // Header experience fragment (site selector bar, nav, contact/share row, breadcrumb).
    element.querySelectorAll('.masthead').forEach((m) => {
      (m.closest('.experiencefragment') || m).remove();
    });

    // Global footer experience fragment.
    element.querySelectorAll('.global-footer, footer.global-footer-wrapper').forEach((f) => {
      if (!f.isConnected) return;
      (f.closest('.experiencefragment') || f.closest('.global-footer') || f).remove();
    });

    // Any remaining experience fragments outside the page body (empty alert XF, personalization XFs).
    element.querySelectorAll('.experiencefragment').forEach((xf) => {
      if (xf.isConnected && !xf.closest('.body-content')) xf.remove();
    });

    // Empty top full-width container that only held an experience fragment.
    element.querySelectorAll('.full-width-container').forEach((c) => {
      if (!c.querySelector('.body-content') && !c.textContent.trim()) c.remove();
    });

    remove(element, [
      // Profile bar and session timeout dialog.
      '.toggle-container',
      '.session-timeout-panel',
      '#background-mask',
      // Stray nav/breadcrumb outside the masthead, just in case.
      '.masthead',
      'nav.cmp-breadcrumb',
      '.breadcrumb',
      // OneTrust cookie UI.
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
      '.otFlat',
      '.otPcTab',
      '#ot-sdk-btn-floating',
      // Qualtrics "Give Feedback" widget and intercept containers.
      '.QSIFeedbackButton',
      '#QSIFeedbackButton-target-container',
      '[id^="ZN_"]',
      '[id^="QSI"]',
      // Tracking pixels / beacons / sync iframes.
      '[id^="batBeacon"]',
      'img[src*="bat.bing.com"]',
      'img[src*="demdex.net"]',
      'img[src*="doubleclick.net"]',
      'img[src*="facebook.com/tr"]',
      'img[width="1"][height="1"]',
      'iframe',
      // Non-content elements.
      'script',
      'style',
      'noscript',
      'link',
      'template',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Final sweep for anything re-introduced or missed (do NOT touch HTML comments).
    remove(element, [
      '.masthead',
      '.global-footer',
      'footer.global-footer-wrapper',
      '.toggle-container',
      '.session-timeout-panel',
      '#onetrust-consent-sdk',
      '.QSIFeedbackButton',
      'iframe',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // Strip tracking / inline-handler attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach(({ name }) => {
        if (
          name.startsWith('on')
          || name.startsWith('data-analytics')
          || name.startsWith('data-track')
          || name.startsWith('data-cmp')
          || name.startsWith('data-gtm')
          || name === 'data-link-tracking'
        ) {
          el.removeAttribute(name);
        }
      });
    });

    // Internal page links use clean site-relative paths (as in the nav): drop the
    // source's ".html" extension and any AEM author prefix. Files, anchors-only and
    // external links are left alone.
    element.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      let parsed;
      try {
        parsed = new URL(href, 'https://www.jackson.com/');
      } catch (e) {
        return;
      }
      const internal = href.startsWith('/') || /^https?:\/\/(www\.)?jackson\.com\//.test(href);
      if (!internal || !/\.html$/.test(parsed.pathname)) return;
      let path = parsed.pathname.replace(/^\/content\/jackson-aem\/us/, '').replace(/\.html$/, '');
      if (path === '/index' || path === '') path = '/';
      a.setAttribute('href', `${path}${parsed.search}${parsed.hash}`);
    });
  }
}
