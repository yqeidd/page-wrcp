/* Project Alpha — page behaviour */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* 1. Placeholder links.
         Cards that point to href="" would reload the page when tapped.
         Disable them until real content exists. */
    document
      .querySelectorAll('a[href=""], a:not([href])')
      .forEach(function (link) {
        link.classList.add("is-disabled");
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("tabindex", "-1");
        link.addEventListener("click", function (e) {
          e.preventDefault();
        });
      });

    /* 2. Images: lazy-load everything except the first row,
         and decode off the main thread. Saves data on phones. */
    document.querySelectorAll(".content-image img").forEach(function (img, i) {
      img.decoding = "async";
      if (i > 1) img.loading = "lazy";
    });
  });
})();
