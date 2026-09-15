(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var quizOrigin = new URL(script.src).origin;
  var targets = document.querySelectorAll("[data-dog-academy-breed-quiz]");

  targets.forEach(function (target, index) {
    if (target.querySelector("iframe")) return;

    var frame = document.createElement("iframe");
    frame.src = quizOrigin + "/embed";
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
