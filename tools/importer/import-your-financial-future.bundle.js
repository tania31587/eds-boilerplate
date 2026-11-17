/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-your-financial-future.js
  var import_your_financial_future_exports = {};
  __export(import_your_financial_future_exports, {
    default: () => import_your_financial_future_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document }) {
    const cells = [];
    const img = element.querySelector(".image img, img");
    if (img) {
      if (!img.getAttribute("src") && img.getAttribute("data-src")) {
        img.setAttribute("src", img.getAttribute("data-src"));
      }
      cells.push([img]);
    }
    const content = [];
    const textRoot = element.querySelector(".card-content") || element;
    const sourceTitle = textRoot.querySelector("h1, .title");
    if (sourceTitle && sourceTitle.textContent.trim()) {
      if (sourceTitle.tagName === "H1") {
        content.push(sourceTitle);
      } else {
        const h1 = document.createElement("h1");
        h1.textContent = sourceTitle.textContent.trim();
        content.push(h1);
      }
    }
    const description = textRoot.querySelector(".description");
    if (description && description.textContent.trim()) {
      const blocks = [...description.children].filter((el) => el.textContent.trim());
      if (blocks.length) {
        content.push(...blocks);
      } else {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        content.push(p);
      }
    }
    [...textRoot.querySelectorAll("a[href]")].filter((a) => !(description && description.contains(a)) && a.textContent.trim()).forEach((a) => {
      const p = document.createElement("p");
      p.append(a);
      content.push(p);
    });
    if (content.length) cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quote.js
  function parse2(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".cta-icon-card");
    cards.forEach((card) => {
      const img = card.querySelector(".icon-image img, img");
      if (img && !img.getAttribute("src") && img.getAttribute("data-src")) {
        img.setAttribute("src", img.getAttribute("data-src"));
      }
      const imageCell = img ? [img] : [""];
      const textCell = [];
      const title = card.querySelector(".card-content .title, .title");
      if (title && title.textContent.trim()) {
        const quote = document.createElement("p");
        quote.textContent = title.textContent.trim();
        textCell.push(quote);
      }
      const description = card.querySelector(".card-content .description, .description");
      if (description && description.textContent.trim()) {
        const paras = [...description.children].filter((el) => el.textContent.trim());
        if (paras.length) {
          textCell.push(...paras);
        } else {
          const p = document.createElement("p");
          p.innerHTML = description.innerHTML.trim();
          textCell.push(p);
        }
      }
      const link = card.querySelector(".cta-arrow-button-wrapper a[href], a.cta-arrow-button[href]");
      if (link) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      if (!img && !textCell.length) return;
      cells.push([imageCell, textCell.length ? textCell : [""]]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".promo-card");
    cards.forEach((card) => {
      const img = card.querySelector(".promo-image img, img");
      if (img && !img.getAttribute("src") && img.getAttribute("data-src")) {
        img.setAttribute("src", img.getAttribute("data-src"));
      }
      const imageCell = img ? [img] : [""];
      const textCell = [];
      const title = card.querySelector(".card-content .title, .title");
      if (title && title.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      const description = card.querySelector(".card-content .description, .description");
      if (description && description.textContent.trim()) {
        const paras = [...description.children].filter((el) => el.textContent.trim());
        if (paras.length) {
          textCell.push(...paras);
        } else {
          const p = document.createElement("p");
          p.innerHTML = description.innerHTML.trim();
          textCell.push(p);
        }
      }
      const link = card.querySelector(".action a[href], a.primary-cta-button[href]");
      if (link) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      if (!img && !textCell.length) return;
      cells.push([imageCell, textCell.length ? textCell : [""]]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/jackson-cleanup.js
  var remove = (root, selectors) => {
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    });
  };
  function transform(hookName, element, payload) {
    const doc = element.ownerDocument || element;
    if (hookName === "beforeTransform") {
      doc.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
        const content = meta.getAttribute("content") || "";
        const fixed = content.replace(/^(https?:\/\/www\.jackson\.com)?\/graphics\//, "$1/content/dam/jacksoncom/graphics/");
        if (fixed !== content) meta.setAttribute("content", fixed);
      });
      element.querySelectorAll(".masthead").forEach((m) => {
        (m.closest(".experiencefragment") || m).remove();
      });
      element.querySelectorAll(".global-footer, footer.global-footer-wrapper").forEach((f) => {
        if (!f.isConnected) return;
        (f.closest(".experiencefragment") || f.closest(".global-footer") || f).remove();
      });
      element.querySelectorAll(".experiencefragment").forEach((xf) => {
        if (xf.isConnected && !xf.closest(".body-content")) xf.remove();
      });
      element.querySelectorAll(".full-width-container").forEach((c) => {
        if (!c.querySelector(".body-content") && !c.textContent.trim()) c.remove();
      });
      remove(element, [
        // Profile bar and session timeout dialog.
        ".toggle-container",
        ".session-timeout-panel",
        "#background-mask",
        // Stray nav/breadcrumb outside the masthead, just in case.
        ".masthead",
        "nav.cmp-breadcrumb",
        ".breadcrumb",
        // OneTrust cookie UI.
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter",
        ".otFlat",
        ".otPcTab",
        "#ot-sdk-btn-floating",
        // Qualtrics "Give Feedback" widget and intercept containers.
        ".QSIFeedbackButton",
        "#QSIFeedbackButton-target-container",
        '[id^="ZN_"]',
        '[id^="QSI"]',
        // Tracking pixels / beacons / sync iframes.
        '[id^="batBeacon"]',
        'img[src*="bat.bing.com"]',
        'img[src*="demdex.net"]',
        'img[src*="doubleclick.net"]',
        'img[src*="facebook.com/tr"]',
        'img[width="1"][height="1"]',
        "iframe",
        // Non-content elements.
        "script",
        "style",
        "noscript",
        "link",
        "template"
      ]);
    }
    if (hookName === "afterTransform") {
      remove(element, [
        ".masthead",
        ".global-footer",
        "footer.global-footer-wrapper",
        ".toggle-container",
        ".session-timeout-panel",
        "#onetrust-consent-sdk",
        ".QSIFeedbackButton",
        "iframe",
        "script",
        "style",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach(({ name }) => {
          if (name.startsWith("on") || name.startsWith("data-analytics") || name.startsWith("data-track") || name.startsWith("data-cmp") || name.startsWith("data-gtm") || name === "data-link-tracking") {
            el.removeAttribute(name);
          }
        });
      });
      element.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        let parsed;
        try {
          parsed = new URL(href, "https://www.jackson.com/");
        } catch (e) {
          return;
        }
        const internal = href.startsWith("/") || /^https?:\/\/(www\.)?jackson\.com\//.test(href);
        if (!internal || !/\.html$/.test(parsed.pathname)) return;
        let path = parsed.pathname.replace(/^\/content\/jackson-aem\/us/, "").replace(/\.html$/, "");
        if (path === "/index" || path === "") path = "/";
        a.setAttribute("href", `${path}${parsed.search}${parsed.hash}`);
      });
    }
  }

  // tools/importer/transformers/jackson-sections.js
  var BREAK_ATTR = "data-excat-section-break";
  var ID_ATTR = "data-excat-section-id";
  var FIRST_ATTR = "data-excat-section-first";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function breakAnchor(el) {
    const childItems = el.closest(".child-items");
    if (childItems && childItems.previousElementSibling && childItems.previousElementSibling.classList.contains("subpage-header-block")) {
      return childItems;
    }
    return el;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument || element;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(element, section);
        if (!el) continue;
        if (i === 0 && !section.style) continue;
        const hr = document.createElement("hr");
        hr.setAttribute(BREAK_ATTR, section.id);
        if (section.style) hr.setAttribute(ID_ATTR, section.id);
        if (i === 0) hr.setAttribute(FIRST_ATTR, "true");
        const anchor = breakAnchor(el);
        anchor.parentNode.insertBefore(hr, anchor);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${ID_ATTR}="${section.id}"]`);
        if (!marker) continue;
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        const breaks = [...element.querySelectorAll(`hr[${BREAK_ATTR}]`)];
        const next = breaks[breaks.indexOf(marker) + 1];
        if (next) {
          next.parentNode.insertBefore(meta, next);
        } else {
          const container = marker.parentNode;
          container.appendChild(meta);
        }
      }
      element.querySelectorAll(`hr[${FIRST_ATTR}]`).forEach((hr) => hr.remove());
      element.querySelectorAll(`hr[${BREAK_ATTR}]`).forEach((hr) => {
        hr.removeAttribute(BREAK_ATTR);
        hr.removeAttribute(ID_ATTR);
      });
    }
  }

  // tools/importer/import-your-financial-future.js
  var PAGE_TEMPLATE = {
    "name": "your-financial-future",
    "urls": [
      "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html"
    ],
    "representativeUrl": "https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html",
    "description": "Your Financial Future article pages: split hero, intro text, quote cards on a beige panel, annuity copy, promo cards and disclosures",
    "blocks": [
      {
        "name": "hero-split",
        "instances": [
          ".subpage-herospace-block"
        ]
      },
      {
        "name": "cards-quote",
        "instances": [
          ".cta-icon-card-wrapper"
        ]
      },
      {
        "name": "cards-promo",
        "instances": [
          ".promo-card-wrapper"
        ]
      }
    ],
    "urlPattern": "/your-financial-future/*",
    "sections": [
      {
        "id": "section-1",
        "name": "Hero",
        "selector": [
          ".body-content .herospace",
          ".content-wrapper > .herospace"
        ],
        "style": null,
        "blocks": [
          "hero-split"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Retirement planning intro",
        "selector": [
          ".content-wrapper > .herospace + .header > .content-area > .subpage-header-block"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".content-wrapper > .herospace + .header > .content-area > .subpage-header-block .title",
          ".content-wrapper > .herospace + .header > .content-area > .subpage-header-block .description"
        ]
      },
      {
        "id": "section-3",
        "name": "Retirement concern cards",
        "selector": [
          ".content-wrapper > .herospace + .header .child-items .background-container",
          ".child-items .background-container"
        ],
        "style": "light-beige",
        "blocks": [
          "cards-quote"
        ],
        "defaultContent": []
      },
      {
        "id": "section-4",
        "name": "How annuities help + talk to a professional",
        "selector": [
          ".content-wrapper > .herospace + .header + .header"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".content-wrapper > .herospace + .header + .header .subpage-header-block",
          ".content-wrapper > .herospace + .header + .header + .header .subpage-header-block"
        ]
      },
      {
        "id": "section-4b",
        "name": "Annuity risk disclosure",
        "selector": [
          ".content-wrapper > .header + .disclosure"
        ],
        "style": "risk-disclosure",
        "blocks": [],
        "defaultContent": [
          ".content-wrapper > .header + .disclosure"
        ]
      },
      {
        "id": "section-5",
        "name": "Resources",
        "selector": [
          ".content-wrapper > .disclosure + .layout-container"
        ],
        "style": "centered",
        "blocks": [
          "cards-promo"
        ],
        "defaultContent": [
          ".content-wrapper > .disclosure + .layout-container > .content-area > h3"
        ]
      },
      {
        "id": "section-6",
        "name": "Footnotes",
        "selector": [
          ".content-wrapper > .layout-container + .disclosure"
        ],
        "style": "disclosure",
        "blocks": [],
        "defaultContent": [
          ".content-wrapper > .layout-container + .disclosure"
        ]
      },
      {
        "id": "section-7",
        "name": "Legal disclosures",
        "selector": [
          ".content-wrapper > .layout-container + .disclosure + .disclosure"
        ],
        "style": "disclosure, separator",
        "blocks": [],
        "defaultContent": [
          ".content-wrapper > .layout-container + .disclosure + .disclosure"
        ]
      }
    ]
  };
  var parsers = {
    "hero-split": parse,
    "cards-quote": parse2,
    "cards-promo": parse3
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_your_financial_future_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_your_financial_future_exports);
})();
