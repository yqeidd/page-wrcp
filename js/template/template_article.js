/* Project Alpha — article page behaviour */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* 1. Make reference URLs clickable.
     The references are plain text, so on a phone they can't be tapped.
     Text is split safely with DOM nodes (no innerHTML). */
  function linkifyReferences() {
    var urlPattern = /https?:\/\/[^\s]+/g;

    document.querySelectorAll(".footer > p").forEach(function (paragraph) {
      Array.from(paragraph.childNodes).forEach(function (node) {
        if (node.nodeType !== Node.TEXT_NODE) return;

        var text = node.nodeValue;
        var fragment = document.createDocumentFragment();
        var lastIndex = 0;
        var match;

        urlPattern.lastIndex = 0;
        while ((match = urlPattern.exec(text)) !== null) {
          var url = match[0];
          var trailing = "";

          // Keep sentence punctuation outside the link
          var punctuation = url.match(/[.,;:)]+$/);
          if (punctuation) {
            trailing = punctuation[0];
            url = url.slice(0, -trailing.length);
          }

          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex, match.index))
          );

          var link = document.createElement("a");
          link.href = url;
          link.textContent = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          fragment.appendChild(link);

          if (trailing) fragment.appendChild(document.createTextNode(trailing));
          lastIndex = match.index + match[0].length;
        }

        if (lastIndex === 0) return; // no URL in this text node

        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        paragraph.replaceChild(fragment, node);
      });
    });
  }

  /* 2. Back-to-top button.
     Long articles are a lot of scrolling on a phone. The button appears
     once the reader is well down the page. */
  function addBackToTop() {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Back to top");
    button.textContent = "\u2191"; // up arrow

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });

    document.body.appendChild(button);

    var ticking = false;

    function update() {
      var show = window.scrollY > window.innerHeight * 1.5;
      button.classList.toggle("is-visible", show);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* 3. Images (for figures added later): lazy-load and decode off-thread. */
  function optimiseImages() {
    document.querySelectorAll(".content img").forEach(function (img) {
      img.loading = "lazy";
      img.decoding = "async";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    linkifyReferences();
    addBackToTop();
    optimiseImages();
  });
})();
