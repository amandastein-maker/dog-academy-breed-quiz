# Dog Academy quiz — developer handoff

Prepared for Amanda, Luka and the Dog Academy development team, 15 September 2026.

## What to use

Use **native/dist/** to install the quiz directly within Dog Academy. These are prebuilt HTML, CSS and JavaScript files; no React server, Sites account, iframe or build service is required at runtime. The JavaScript includes React.

Use **native/src/** to edit it and **native/build.mjs** to rebuild. The quiz questions, nine breed profiles, score calculation, personality copy and DA colour scheme are preserved from the existing published quiz. New page content explains the tool, its limitations and next steps.

Use **original-source/** as the complete original tracked source snapshot, for reference or continued work with the original application. It is a Sites/Vinext project, not the recommended CMS installation package. It excludes Git history, credentials, installed dependencies and temporary build files. Its hosting manifest belongs to the existing live quiz: do not publish it to that project unintentionally.

The source snapshot is commit `54bef39fb4fc5a4c254ebdd0703d9795d26433c9`, previously published as version 4. The original live quiz has not been modified or redeployed by this handoff.

## Included

- Native, pre-rendered page with H1, introduction, tool opening screen, useful explanatory sections, breed links, FAQs and no-JavaScript guidance.
- Same interactive quiz and DA palette, with scoped CSS to reduce conflicts with the host site.
- Three breed results, personality result card, adoption/puppy routes and 50-state choices.
- Facebook, X, Pinterest, email, native sharing and copy-link controls. Result links use the host page's path instead of the host site's homepage.
- Readable source, production assets, pinned dependency lockfile, build command, automated tests and optional GitHub Actions workflow.
- Installation, GitHub and launch-checklist documents.

## Status and remaining decisions

The native build and automated tests pass. No installation on Dog Academy, GitHub push, live browser QA, link-inventory audit, Search Console inspection or social-platform preview test has been performed. The developer should stage and verify those before launch. The new copy is a draft for editorial approval.

GitHub-ready is not GitHub-connected. A team-approved repository and authenticated write access are still needed. The original project is stored in an internal Sites Git repository, not the team's GitHub repository. See GITHUB.md.

This handoff does not change scoring or expand the nine-breed pool. It does not connect live inventory. Existing breed/image URLs and the existing wording about vetted puppy sources should be verified by DA before launch. Results are guidance, not suitability or availability guarantees.

## Open these next

1. INSTALLATION.md — install the native assets and HTML in DA's existing page.
2. GITHUB.md — put the source under team ownership and enable optional CI.
3. QA-AND-SEO.md — test the integration and indexing setup before launch.

The package deliberately does not include a fabricated WordPress plugin or deployment pipeline: DA's CMS/theme and release process have not been supplied.
