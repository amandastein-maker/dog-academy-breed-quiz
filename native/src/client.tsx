import { createRoot } from "react-dom/client";
import { BreedQuiz } from "./Quiz";

// Host pages (WordPress filters, page builders, optimizers) rewrite the
// pre-rendered markup and may move this script, so don't hydrate it:
// wait for the DOM, then render fresh into the container. The pre-rendered
// markup still serves crawlers and no-JS visitors.
function mount() {
  const root = document.getElementById("da-breed-quiz-root");
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = "true";
  root.replaceChildren();
  createRoot(root).render(<BreedQuiz />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
