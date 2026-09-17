import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { questions, states, breeds, rankBreeds } from "./.build/quiz.mjs";
test("preserves twelve questions, all states, nine breeds and three matches", () => {
  assert.equal(questions.length, 12); assert.equal(states.length, 50); assert.equal(breeds.length, 9);
  for (let i = 0; i < 300; i++) {
    const answers = Object.fromEntries(questions.map((q, n) => [q.key, q.key === "state" ? states[i % 50][1] : q.options[(i + n) % q.options.length].value]));
    const result = rankBreeds(answers);
    assert.equal(result.length, 3); assert.equal(new Set(result.map((r) => r.breed.name)).size, 3);
  }
});
test("visible semantic content exists before JavaScript; no iframe", async () => {
  const html = await readFile("dist/index.html", "utf8");
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes("How does the dog breed quiz work?"));
  assert.ok(html.includes('id="da-breed-quiz-root"'));
  assert.ok(html.includes("Find my perfect breed"));
  assert.ok(html.includes("<noscript>"));
  assert.ok(!html.includes("<iframe"));
  assert.ok(!html.includes("chatgpt.site"));
});
test("self-contained WordPress embed inlines styles/script with no premature closing tags", async () => {
  const html = await readFile("dist/wordpress-embed.html", "utf8");
  assert.ok(html.startsWith("<style>"));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes('id="da-breed-quiz-root"'));
  assert.ok(html.includes("How does the dog breed quiz work?"));
  assert.ok(html.trim().endsWith("</script>"));
  const styleBody = html.slice(html.indexOf("<style>") + 7, html.indexOf("</style>"));
  assert.ok(!styleBody.includes("</style"));
  const scriptBody = html.slice(html.lastIndexOf("<script>") + 8, html.lastIndexOf("</script>"));
  assert.ok(!scriptBody.includes("</script"));
});
test("CSS selectors stay inside the tool", async () => {
  const css = postcss.parse(await readFile("dist/assets/quiz.css", "utf8"));
  css.walkRules((r) => {
    if (r.parent.type === "atrule" && /keyframes$/.test(r.parent.name)) return;
    r.selectors.forEach((s) => assert.ok(s.startsWith("#da-breed-tool"), s));
  });
});
