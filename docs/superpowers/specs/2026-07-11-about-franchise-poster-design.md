# About Franchise Poster Design

## Objective

Add the supplied OMJ franchise poster to the live About page as a dedicated, enlargeable feature without replacing or modifying the page's existing franchise photograph, copy, popup inquiry button, or broader Elementor layout.

## Source Asset

- Source: `~/Downloads/photo_2026-07-10_23-45-26.jpg`
- Repository destination: `build/assets/photos/omj-franchise-poster-2026-07.jpg`
- Source dimensions: 853 × 1280 pixels
- Format: JPEG
- The poster's public-facing claims and wording are approved as supplied.

The committed repository asset remains the original full-resolution JPEG. WordPress may generate its normal responsive derivatives during Media Library import.

## Placement and Presentation

Insert a new native Elementor section immediately before the existing root container named `Interested to Franchise` (currently Elementor ID `fc5f6a7`) on About page ID 25.

The new section has:

- A cream background consistent with the current About page and OMJ design system.
- The centered orange heading `Franchise at a glance`.
- The complete poster centered at `min(100%, 560px)`.
- No cropping and no brightness, contrast, saturation, or other photo filter.
- A media-file link that opens the full-resolution poster in Elementor's lightbox.
- The alt text `Oh My Juiceness franchise opportunity poster`.
- A single-column responsive layout so the poster remains centered and uncropped on mobile.
- The namespaced section class `omj-about-franchise-poster` and namespaced descendant classes for custom hooks.

Add the small, section-scoped responsive rules to `build/mu-plugins/omj-assets/omj-brand.css`, including vertical padding of `clamp(48px, 7vw, 88px)`. No existing About or franchise selector is broadened or overridden.

The existing dark-green franchise section remains unchanged, including its machine photograph, `Interested to franchise?` copy, and `Inquire now` popup button.

## Elementor Update Strategy

Do not deploy `build/pages/about.html`. The live About page is an Elementor-native document, while that repository file is an older replacement that does not match the currently approved layout.

Add a targeted deployment script under `build/scripts/` that transforms page 25's `_elementor_data`. The script will:

1. Load and decode the current Elementor document.
2. Locate the existing root franchise container by its stable title and current ID.
3. Abort without writing if the anchor is missing, ambiguous, or malformed.
4. Detect the new poster section by its stable custom title or class and exit successfully without duplication if it already exists.
5. Insert one native Elementor container immediately before the existing franchise container.
6. Preserve every pre-existing Elementor element and setting byte-for-byte at the decoded data-structure level, except for the required root-array insertion.
7. Update Elementor metadata through WordPress APIs and clear the page's generated Elementor CSS metadata if required.

The WordPress attachment ID and URL are supplied to the script after Media Library import rather than hard-coded before upload.

## Local Verification

Production is not the first execution target. Before changing WordPress:

1. Export the current page 25 Elementor JSON to a temporary local fixture.
2. Run the transform in dry-run mode against that fixture.
3. Confirm exactly one new root container is inserted immediately before `fc5f6a7`.
4. Confirm the existing image widget `bca9665`, button widget `945b613`, and their settings are unchanged.
5. Confirm a second dry run is idempotent and does not add another section.
6. Render or inspect desktop and mobile local previews to verify the cream section, full poster, spacing, and lightbox affordance.

Any failed assertion stops the deployment workflow.

## Production Deployment

After local verification passes:

1. Copy the poster and deployment script to the Hostinger account.
2. From the WordPress root, create a timestamped database backup before any media or page mutation.
3. Import the poster into WordPress Media and record its attachment ID and canonical URL.
4. Deploy the section-scoped design-system CSS.
5. Run the tested Elementor patch against page 25 with that attachment information.
6. Flush Elementor CSS and purge LiteSpeed Cache.
7. Remove temporary upload files from the account home directory.

## Production Verification

Verify all of the following after deployment:

- `/about/` returns successfully.
- `Franchise at a glance` appears exactly once and immediately before the existing franchise section.
- The poster uses the imported WordPress Media URL and displays uncropped.
- Clicking the poster opens the full image in a lightbox.
- The existing machine photograph, franchise copy, and popup inquiry button remain present and functional.
- Desktop and mobile layouts have no overflow, overlap, or unreadably small poster presentation.
- Elementor and LiteSpeed caches were flushed successfully.

## Documentation

- Correct `wiki/architecture.md` so page 25 is documented as an Elementor-native page maintained through targeted scripts, rather than through the stale `build/pages/about.html` replacement.
- Append a structured `## [2026-07-11] ...` deployment entry to `wiki/log.md` without altering earlier history.

## Acceptance Criteria

The task is complete when the original poster is tracked in the repository, the local dry-run and preview checks pass, production is backed up, the new dedicated poster section is visible and enlargeable on the live About page, the existing franchise content remains unchanged, caches are flushed, and the repository documentation records the new maintenance path and deployment.
