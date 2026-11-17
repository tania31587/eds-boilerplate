# Jackson "How to Plan for Retirement" Page Migration Plan

## Goal
Move the live page **https://www.jackson.com/your-financial-future/how-to-plan-for-retirement.html** to Edge Delivery Services. The header, main content and footer should match the original in look, structure and behaviour. Each part should be built from authorable blocks, so editors can manage it the same way they manage the original.

**Order of work (as requested):** 1) Header → 2) Page content → 3) Footer → 4) Final check of the whole page against the original.

## Current Status
- ✅ The plan is approved and the **header migration** comes next.
- ▶️ **Ready to run:** Phase 0 (setup), then Phase 1 (header). After the header is done and checked, work pauses so you can review it before the page content starts.

> ⚠️ **Nothing can run while plan mode is active.** Switch to **Execute mode** and the header migration starts immediately with Phase 0 → Phase 1.

## Project Context
- **Project type:** Document Authoring (DA). Content lives in the `tania31587/eds-boilerplate` DA space.
- **Starting point:** standard boilerplate code, with no migrated content or importer yet.
- **Scope:** all changes stay in the local workspace and preview. Nothing is uploaded to DA, previewed on EDS or published unless you ask for it.
- **Add-on:** you asked to switch on the optional Edge Delivery helper add-on. It's the first step in Execute mode and is available from the next message onward. The header work can begin right away, because it uses the built-in migration tools.

## Phase 0 – Setup (runs first)
- Switch on the Edge Delivery helper add-on in the project settings. The settings file doesn't exist yet and will be created.
- Confirm the project type and block library, and record them in the migration settings.
- Capture the original page at desktop and mobile widths. These captures are the reference for every later comparison.

## Phase 1 – Header (navigation) ▶️ NEXT
Build the header from what the original page actually shows and does, not from guesses. Each step uses real captures of the live site.

1. **Row detection:** capture the original header and find each row. Expect something like a utility or top bar (e.g. login, "Contact us", other audience links), the main bar with the Jackson logo, primary nav, search and a CTA. The captures decide the final list.
2. **Row mapping:** map each row to a section of the authorable nav document (`nav`): brand/logo, primary navigation, tools (search, login, CTA), and the utility row if there is one.
3. **Megamenu analysis:** hover or click every top-level nav item on the live site and record each dropdown panel exactly: columns, headings, link labels and URLs, descriptions, and any featured or promo content.
4. **Mobile behaviour:** at mobile width, record the hamburger icon, what opens (drawer or full screen), the expand/collapse behaviour of each level, and the order and styling of items.
5. **Build:** create the nav content with all links and labels copied exactly. Adapt the header block code and styling to match: layout, fonts, colours, spacing, hover and active states, dropdown panels, search, CTA button and sticky behaviour if present.
6. **Validate (desktop):** compare the preview with the original at rest, on hover and with each dropdown open. Fix every difference.
7. **Validate (mobile):** compare the closed header, the open menu and each expanded submenu. Fix every difference.
8. **Review stop:** summarise what was built and pause for your review before Phase 2.

**Header is done when:**
- the logo, every nav label and link URL, the dropdown contents, search and CTA match the original;
- hover and open states look and behave the same;
- the mobile menu opens, expands and collapses the same way;
- the header looks the same at desktop and mobile widths.

## Phase 2 – Page content (after header review)
1. **Page analysis:** break the main content into sections and decide how each is authored: default content or a block, and which block variant. On a page like this, expect things such as a hero or banner, article text with headings, image or text pairs, callouts or quotes, related-article cards and CTA banners. The analysis decides the final list.
2. **Block variants:** name each block variant and reuse similar ones where possible, so the blocks can serve other Jackson pages later.
3. **Block mapping:** record which parts of the original page map to which block and section in the import template.
4. **Import infrastructure:** generate the cleanup and section transformers, plus one parser per block variant.
5. **Import script:** bundle a page-specific import script.
6. **Content import:** run the import to produce the page content, including page metadata such as title, description and social image.
7. **Block code:** build or adapt the JS and CSS for every block used, scoped to each block and robust to missing or extra cells.
8. **Design migration:** take the fonts, colours, spacing and button styles from the original site and apply them site-wide and to each block.
9. **Import validation:** score the imported page against the original and fix any differences in parsers or transformers, then re-import.

**Content is done when:** every section of the original is on the page in the same order with the same text, images, links and CTAs, and each block matches the original visually.

## Phase 3 – Footer
1. **Section detection:** list every footer area, such as link columns, social icons, legal and disclosure text, the copyright line and the logo.
2. **Section mapping:** map each area to sections of the authorable footer document (`footer`), recording hover and click behaviour for each element.
3. **Build:** create the footer content and the footer block code and styling.
4. **Desktop validation:** compare with the original and fix until it matches.
5. **Mobile analysis and validation:** check collapsing or accordion behaviour and how the footer stacks on small screens.
6. **Final checks:** every link, disclosure text and icon is present and correct.

**Footer is done when:** all columns, links, legal text and icons match the original on desktop and mobile.

## Phase 4 – Whole-page check
- Compare the full page with the original on desktop and mobile, covering the header, content and footer together.
- Fix any remaining differences in layout, spacing, typography or behaviour.
- Report back what changed. All changes are local. Nothing is uploaded to DA, previewed on EDS or published unless you ask for it.

## Known limits
- Interactive or third-party features on the original, such as tracking, chat widgets, cookie banners and calculators, are rebuilt only where they are part of the visible page design. They aren't copied as live integrations.
- Search in the header is rebuilt with the same look and placement. Live search results depend on the original site's search service and won't be connected unless you ask for it.
- Images point to the original site's files during migration.
- Legal and disclosure text is copied exactly as it appears on the source page.
- The header and footer are local changes until you ask for them to be uploaded to DA.

## Checklist

### Phase 0 – Setup
- [ ] Switch on the Edge Delivery helper add-on (approved by you)
- [ ] Confirm the project type and block library
- [ ] Capture the original page at desktop and mobile widths as the reference

### Phase 1 – Header ▶️ next
- [ ] Capture the original header and detect every row
- [ ] Map rows to sections of the authorable nav document (brand, primary nav, tools, utility row)
- [ ] Hover or click every top-level item and record each dropdown or megamenu panel exactly
- [ ] Record the mobile header and hamburger menu behaviour, including every expandable level
- [ ] Create the nav content with all labels and link URLs copied exactly
- [ ] Adapt the header block code and styling (layout, fonts, colours, hover and active states, dropdowns, search, CTA)
- [ ] Check the header on desktop (at rest, hover, each dropdown open) against the original and fix differences
- [ ] Check the header on mobile (closed, open, each submenu expanded) against the original and fix differences
- [ ] Summarise the header results and pause for your review

### Phase 2 – Page content
- [ ] Analyse the page's sections and decide how each is authored
- [ ] Name block variants and reuse similar ones where possible
- [ ] Record the block and section mappings in the import template
- [ ] Generate the transformers and per-block parsers
- [ ] Bundle the page import script
- [ ] Run the import to create the page content and metadata
- [ ] Build or adapt the JS and CSS for every block used
- [ ] Apply the original site's design (fonts, colours, spacing, buttons) site-wide and per block
- [ ] Validate the imported page against the original and fix differences

### Phase 3 – Footer
- [ ] Detect every footer section
- [ ] Map sections to the authorable footer document, including link behaviour
- [ ] Create the footer content and the footer block code and styling
- [ ] Check the footer on desktop against the original and fix differences
- [ ] Analyse and check the footer on mobile, and fix differences
- [ ] Final check of all footer links, legal text and icons

### Phase 4 – Whole-page check
- [ ] Compare the full page with the original on desktop and mobile
- [ ] Fix any remaining differences
- [ ] Summarise the results and confirm all changes are local only
