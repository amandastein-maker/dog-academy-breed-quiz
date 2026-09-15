import { hydrateRoot } from "react-dom/client";
import { BreedQuiz } from "./Quiz";

const root = document.getElementById("da-breed-quiz-root");
if (root && !root.dataset.mounted) {
  root.dataset.mounted = "true";
  hydrateRoot(root, <BreedQuiz />);
}
