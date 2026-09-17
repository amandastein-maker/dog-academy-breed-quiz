import { build } from "esbuild";
import postcss from "postcss";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

await mkdir("dist/assets", { recursive: true });
await mkdir(".build", { recursive: true });
await build({ entryPoints: ["src/Quiz.tsx"], outfile: ".build/quiz.mjs", bundle: true, platform: "node", format: "esm", jsx: "automatic", packages: "external" });
const { BreedQuiz, breeds } = await import("./.build/quiz.mjs");
await build({ entryPoints: ["src/client.tsx"], outfile: "dist/assets/quiz.js", bundle: true, platform: "browser", format: "iife", jsx: "automatic", minify: true, legalComments: "eof", define: { "process.env.NODE_ENV": '"production"' } });

const root = postcss.parse(await readFile("src/quiz.css", "utf8"));
root.walkAtRules("import", (rule) => rule.remove());
root.walkAtRules("keyframes", (rule) => { rule.params = "da-" + rule.params; });
root.walkDecls(/^animation/, (decl) => { decl.value = decl.value.replaceAll("panel-in", "da-panel-in"); });
root.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
  rule.selector = rule.selectors.map((selector) => {
    selector = selector.replaceAll(".hero h1", ".hero h2").replaceAll(".results-heading h1", ".results-heading h2");
    return /^(?:\:root|html|body)$/.test(selector) ? "#da-breed-tool" : "#da-breed-tool " + selector;
  }).join(", ");
});
const extra = `
#da-breed-tool { color: #1d2f46; background: white; font: 16px/1.6 Arial, Helvetica, sans-serif; }
#da-breed-tool .site-header, #da-breed-tool .site-footer { display: none; }
#da-breed-tool .site-shell, #da-breed-tool .hero, #da-breed-tool .quiz-stage { min-height: 0; }
#da-breed-tool .site-shell { scroll-margin-top: 100px; }
#da-breed-tool .da-page-heading, #da-breed-tool .da-page-content { max-width: 1000px; margin: auto; padding: 32px 24px; }
#da-breed-tool .da-page-heading h1 { color: #2864ad; font-size: clamp(32px, 5vw, 48px); line-height: 1.15; }
#da-breed-tool .da-page-content h2 { color: #2864ad; font-size: 28px; line-height: 1.25; margin-top: 36px; }
#da-breed-tool .da-page-content h3 { font-size: 21px; line-height: 1.3; }
#da-breed-tool .da-page-content a { color: #2864ad; text-decoration: underline; }
#da-breed-tool .da-page-content li::marker { color: #1bbd7c; }
`;
await writeFile("dist/assets/quiz.css", root.toString() + extra);
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const links = "<ul>" + breeds.map((breed) => `<li>${escape(breed.name)}: <a href="https://dogacademy.org/adoption/${breed.adoptSlug}/">adoption guide</a> · <a href="https://dogacademy.org/puppies-for-sale/${breed.saleSlug}/">puppy guide</a></li>`).join("\n") + "</ul>";
const quiz = `<div id="da-breed-quiz-root">${renderToString(createElement(BreedQuiz))}</div><noscript><p>Turn on JavaScript to take the interactive quiz. The breed information and links below are still available.</p></noscript>`;
const content = (await readFile("src/content.html", "utf8")).replace("<!-- QUIZ -->", quiz).replace("<!-- BREED_LINKS -->", links);
const fragment = `<div id="da-breed-tool">${content}</div>`;
await writeFile("dist/page-fragment.html", fragment);
await writeFile("dist/index.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dog Breed Quiz: Find the Best Dog for You | Dog Academy</title><meta name="description" content="Take Dog Academy's dog breed quiz to explore three matches for your lifestyle, plus adoption or puppy pages for your state."><link rel="stylesheet" href="./assets/quiz.css"><script defer src="./assets/quiz.js"></script></head><body><main>${fragment}</main></body></html>`);

const css = await readFile("dist/assets/quiz.css", "utf8");
const js = await readFile("dist/assets/quiz.js", "utf8");
if (css.includes("</style") || js.includes("</script")) throw new Error("Asset contains a closing tag that would break inline embedding");
const wordpressEmbed = `<style>\n${css}\n</style>\n${fragment}\n<script>\n${js}\n</script>\n`;
await writeFile("dist/wordpress-embed.html", wordpressEmbed);

const escapeForCodeBlock = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const kb = Math.round(Buffer.byteLength(wordpressEmbed, "utf8") / 1024);
await writeFile("dist/code.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>WordPress Embed Code | Dog Academy Breed Quiz</title><meta name="description" content="Copy-paste-ready HTML for the Dog Academy breed quiz WordPress Custom HTML block."><style>
:root { --ink: #1d2f46; --muted: #58708d; --cream: #f7fbff; --teal: #2864ad; --line: #c9ddec; --mint: #1bbd7c; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--cream); color: var(--ink); font: 16px/1.6 Arial, Helvetica, sans-serif; }
.wrap { max-width: 900px; margin: 0 auto; padding: 32px 24px 80px; }
h1 { color: var(--teal); font-size: clamp(28px, 5vw, 40px); line-height: 1.15; margin-bottom: 8px; }
h2 { color: var(--teal); font-size: 22px; margin-top: 32px; }
a { color: var(--teal); }
a.back { display: inline-block; margin-bottom: 16px; }
ol { padding-left: 20px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 16px 0; }
button { font: inherit; background: var(--teal); color: #fff; border: 0; border-radius: 8px; padding: 10px 18px; cursor: pointer; }
button:hover { background: var(--ink); }
button:focus-visible, a:focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }
.status { font-size: 14px; color: var(--muted); }
.meta { font-size: 14px; color: var(--muted); }
pre { background: #0e1b2b; color: #dbe7f3; padding: 20px; border-radius: 12px; overflow: auto; max-height: 70vh; font-size: 12px; line-height: 1.5; border: 1px solid var(--line); }
code { white-space: pre; font-family: ui-monospace, Consolas, Menlo, monospace; }
</style></head><body><div class="wrap">
<a class="back" href="/">&larr; Back to the live quiz</a>
<h1>WordPress embed code</h1>
<p>Copy everything in the box below and paste it into a single <strong>Custom HTML</strong> block (or Code block) in the WordPress editor. It is self-contained: the quiz's scoped styles, the page heading and content (intro, FAQs, breed links) and the quiz script are all inlined into this one file, so no separate file uploads are required.</p>
<h2>How to use it</h2>
<ol>
<li>In the WordPress block editor, add a <strong>Custom HTML</strong> block to the page or post.</li>
<li>Click <strong>Copy code</strong> below (or select all the text in the box and copy it manually).</li>
<li>Paste the entire thing into the block.</li>
<li>Publish and open the page to confirm the quiz loads and works.</li>
</ol>
<div class="toolbar">
<button id="copyBtn" type="button">Copy code</button>
<span class="status" id="status" role="status" aria-live="polite"></span>
</div>
<p class="meta">${kb} KB &middot; generated from <code>native/dist/wordpress-embed.html</code> by this project's build script.</p>
<pre><code id="embedCode">${escapeForCodeBlock(wordpressEmbed)}</code></pre>
</div>
<script>
(() => {
  const btn = document.getElementById("copyBtn");
  const status = document.getElementById("status");
  const code = document.getElementById("embedCode");
  let statusTimer;
  btn.addEventListener("click", async () => {
    const text = code.textContent;
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { copied = document.execCommand("copy"); } catch (e) { copied = false; }
      document.body.removeChild(ta);
    }
    status.textContent = copied ? "Copied!" : "Copy failed — select the text in the box and copy manually.";
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = ""; }, 4000);
  });
})();
</script>
</body></html>`);

console.log("Built direct-page HTML, scoped CSS, bundled JavaScript, a self-contained WordPress embed and a /code copy page. No iframe or Sites runtime required.");
