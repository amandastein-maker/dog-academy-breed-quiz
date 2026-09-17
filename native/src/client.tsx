import { createRoot } from "react-dom/client";
import { BreedQuiz } from "./Quiz";

declare global {
  interface Window { __DA_QUIZ_EMBEDDED__?: boolean }
}

const root = document.getElementById("da-breed-quiz-root");
if (root && !root.dataset.mounted) {
  root.dataset.mounted = "true";
  createRoot(root).render(<BreedQuiz embedded={Boolean(window.__DA_QUIZ_EMBEDDED__)} />);
}
