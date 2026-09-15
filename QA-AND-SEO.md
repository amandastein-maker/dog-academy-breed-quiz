# Validation and launch checklist

## Completed locally

- Production browser bundle and pre-rendered HTML built successfully.
- Automated checks: 12 questions, 50 states, nine profiles and three distinct breed matches across 300 answer sets.
- Static HTML contains one H1, the opening screen, supporting content, links and no-JavaScript guidance. No iframe or ChatGPT site URL is present in the native page.
- Generated CSS selectors are scoped to the tool.
- Original source data/scoring/personality definitions compared against the native copy; preserved unchanged.

These checks are not equivalent to a full browser or production-integration test. A clean `npm ci` from the provided lockfile, followed by build and tests, also passed in a separate directory using locally cached packages. A lockfile is provided using the original resolved dependency versions and integrity values.

## Before publishing

- Review new copy and all existing claims with DA, including the puppy option's existing reference to vetted sources.
- Check all breed and state destination URLs and image URLs against the current DA site; this handoff has not validated their live availability.
- Stage the native page in DA's actual CMS/theme. Test desktop and mobile widths, long breed names, focus visibility, keyboard-only completion, zoom, screen reader labels and page scrolling.
- Complete all 12 questions on adoption and puppy paths, including multiple states. Test Back, Adjust answers and Retake.
- Open a shared result URL in a fresh browser session. Verify invalid/partial answer URLs return to the intro and complete valid URLs restore results.
- Test copy-link success/failure, native share cancellation, Facebook, X, Pinterest and email. Platform availability and previews are outside this package's control. The shared preview uses the host page's metadata, not a dynamically generated persona image.
- Disable JavaScript: confirm headings, explanation, FAQs, breed links and the no-JavaScript note remain visible.
- Inspect console for hydration errors, blocked scripts/images and stylesheet conflicts. Do not edit the hydrated fragment separately from source.
- Check loading performance in the host page. Local automated checks did not measure Core Web Vitals.

## Search setup owned by the DA site

- Suggested page path: `/dog-breed-quiz/`.
- Suggested title: `Dog Breed Quiz: Find the Best Dog for You | Dog Academy`.
- Suggested description: `Take Dog Academy's dog breed quiz to explore three matches for your lifestyle, plus adoption or puppy pages for your state.`
- Set a self-referencing canonical to the final clean DA page URL in the host template. Result parameter variants should point to the same canonical. The demo deliberately omits a canonical because the final host URL is unconfirmed.
- Add Open Graph/social metadata with the final DA URL and an approved share image. Do not retain the original ChatGPT-hosted canonical/OG URLs from original-source when integrating.
- Confirm a 200 response, crawlable assets, indexable page settings, internal navigation links and sitemap inclusion. Avoid blocking result query URLs in robots.txt if relying on their canonical tags.
- Use Search Console URL Inspection to confirm rendered HTML and request indexing after release.
- The FAQ is visible editorial content; no unsupported FAQ rich-result promise or unverified structured data is included.

The improvement is direct, useful, accessible page content, not simply more lines of code. This package makes the content available in initial HTML; it does not guarantee crawling, indexing or rankings.

Google references for the developer:
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## Deliberate integration-only differences

- A stable page H1 remains outside the interactive component; quiz screen headings become H2.
- The component uses a section rather than nesting a main landmark in DA's main content.
- CSS is scoped, animation names are prefixed and redundant quiz navigation is hidden.
- Share URLs use the current page path; restored answers are validated against known options.
- Retake removes quiz parameters while retaining unrelated parameters; copy fallback puts the share URL in the address bar.
- Scrolling targets the tool and respects reduced-motion preference.

Questions, option copy, breed data, scoring, personality summaries, state-specific link patterns and colour values were otherwise preserved.
