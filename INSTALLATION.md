# Direct integration into Dog Academy

## Fastest: single paste into a WordPress Custom HTML block

`native/dist/wordpress-embed.html` is a self-contained copy of the same tool: the scoped CSS in a `<style>` tag, the page fragment (H1, quiz mount point and all page content/FAQs), and the bundled JavaScript in a `<script>` tag, all in one file. No separate asset upload is required.

1. In the WordPress block editor, add a **Custom HTML** block (or a Code block in a page builder that renders raw HTML/CSS/JS unmodified — not a "Classic" text block, which can strip `<script>`/`<style>`).
2. Open `native/dist/wordpress-embed.html`, copy its entire contents, and paste them into the block.
3. Publish and view the live page. Confirm the quiz interacts correctly and the FAQ/heading content below it renders.

This is the same build as the rest of this package: rebuild with `npm run build` after any source change and re-paste. See "Preferred" below if you'd rather host `quiz.css`/`quiz.js` as separate cached files instead of inlining them.

## Preferred: existing CMS or server-rendered page

1. Create or choose the intended DA page, for example `/dog-breed-quiz/`. This URL is a suggestion, not an existing route established by this handoff.
2. Upload `native/dist/assets/quiz.css` and `native/dist/assets/quiz.js` to a stable same-origin asset folder, for example `/assets/dog-breed-quiz/`.
3. Insert the **complete contents** of `native/dist/page-fragment.html` into the server-rendered page body/template. It is the actual rendered tool opening screen and page content, not a loader placeholder. Do not fetch/inject this HTML only after JavaScript runs.
4. Include the stylesheet in the page head, and the script once with `defer`:

```html
<link rel="stylesheet" href="/assets/dog-breed-quiz/quiz.css">
<script defer src="/assets/dog-breed-quiz/quiz.js"></script>
```

Adjust asset URLs to your actual hosting paths. Do not use the old `embed.js` alongside this installation.

The fragment supplies one H1 and an outer `#da-breed-tool` wrapper. If your CMS already outputs the page H1, remove the duplicated heading from `src/content.html` and rebuild, or disable the CMS title for this page. Insert the tool once per page; IDs assume a single quiz. Do not nest another main landmark around a page that already has one.

Do not alter the rendered markup inside `#da-breed-quiz-root` independently of the React source: hydration expects them to match. Make quiz edits in `src/Quiz.tsx`, then rebuild HTML and JS together. Edit supporting text in `src/content.html` and regenerate.

## Alternative: full standalone page on DA

Serve `native/dist/index.html` at the desired path, with the `assets/` folder next to it, retaining relative paths. This file includes the full document, title, description, H1 and assets. It does not include DA's global site navigation; integrate with the DA template if that is required. Test via HTTP/HTTPS rather than opening a local file for sharing tests.

## Cloudflare preview/demo deployment

A root-level `wrangler.jsonc` deploys `native/dist` as static Workers assets (no server, no D1/R2 bindings — just the prebuilt HTML/CSS/JS from this folder). This is what makes `npx wrangler deploy` at the repository root succeed; it is a preview/demo host, not the DA production site. To deploy manually:

```sh
npx wrangler deploy
```

Requires a Cloudflare account connected via `wrangler login` (or a `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` env pair) in whatever environment runs the command. Rebuild `native/dist` first if source changed (`cd native && npm run build`) since the deploy publishes whatever is already on disk in `native/dist`.

## Build and edit

Node 22 or newer:

```sh
cd native
npm ci
npm run build
npm test
```

No build is needed just to use the supplied production files. Install dependencies when changing the source. Source is React/TypeScript; the build bundles React and pre-renders the opening screen. The supplied standalone browser script does not depend on the host site loading React.

`src/quiz.css` preserves original styles. The build scopes selectors to `#da-breed-tool`, namespaces the animation and adds host-page adjustments. Host theme `!important` rules can still override styles; inspect in staging. The original quiz header/footer are hidden to avoid duplicating DA navigation.

## Hosting considerations

- Use HTTPS for sharing and clipboard features.
- Ensure the chosen page loads for query strings: shared results store quiz answers in URL parameters. Allow the script to read those parameters. No server lookup is required.
- Parameter names used are `src`, `st`, `sp`, `hh`, `ex`, `ac`, `co`, `tr`, `gr`, `pe`, `no`, `cl`. Check for collisions with CMS/router/plugin parameters on the selected page. This version expects a clean, path-based page URL, not a query-string-only CMS route.
- Results contain preferences and state, not names/emails. Shared URLs can appear in browser history, server logs and analytics. Avoid collecting them unnecessarily.
- Update any content-security policy to allow the local script/styles and the existing image sources in the source code. Test before changing policy; do not broadly disable CSP.
- No database or API credentials are required. Breed result links and images remain DA-hosted; image availability is not bundled or guaranteed.
- Serve HTML as text/html, CSS as text/css and JavaScript with an appropriate JavaScript content type. Purge/version caches when releasing a new build, keeping HTML and JS in sync.
- For a WordPress installation, a developer should enqueue assets for this page and render the fragment through the approved theme/plugin template. A visual editor may sanitize the hydration HTML. This package is not an installable WordPress-plugin ZIP.
