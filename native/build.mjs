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

const embedQuiz = `<div id="da-breed-quiz-root">${renderToString(createElement(BreedQuiz, { embedded: true }))}</div><noscript><p>Turn on JavaScript to take the interactive quiz.</p></noscript>`;
await writeFile("dist/embed.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dog Breed Quiz</title><meta name="robots" content="noindex"><link rel="stylesheet" href="./assets/quiz.css"><script>window.__DA_QUIZ_EMBEDDED__ = true;</script><script defer src="./assets/quiz.js"></script></head><body><div id="da-breed-tool">${embedQuiz}</div></body></html>`);

await writeFile("dist/embed.js", `(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var quizOrigin = new URL(script.src).origin;
  var targets = document.querySelectorAll("[data-dog-academy-breed-quiz]");

  targets.forEach(function (target, index) {
    if (target.querySelector("iframe")) return;

    var frame = document.createElement("iframe");
    frame.src = quizOrigin + "/embed.html";
    frame.title = "Dog Academy dog breed quiz";
    frame.loading = index === 0 ? "eager" : "lazy";
    frame.allow = "clipboard-write; web-share";
    frame.style.width = "100%";
    frame.style.minHeight = "760px";
    frame.style.border = "0";
    frame.style.display = "block";
    frame.style.overflow = "hidden";
    target.appendChild(frame);

    window.addEventListener("message", function (event) {
      if (event.origin !== quizOrigin || event.source !== frame.contentWindow) return;
      if (!event.data || event.data.type !== "dog-academy-quiz:resize") return;
      var height = Number(event.data.height);
      if (Number.isFinite(height) && height > 300 && height < 20000) {
        frame.style.height = Math.ceil(height) + "px";
      }
    });
  });
})();
`);

console.log("Built direct-page HTML, scoped CSS, bundled JavaScript, and a standalone embed.html + embed.js for hosting off-WordPress (e.g. Cloudflare Pages) with an iframe embed.");
