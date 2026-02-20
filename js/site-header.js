(function () {
  var prefetchedPages = {};

  function currentSectionFromPath(pathname) {
    var page = (pathname.split("/").pop() || "index.html").toLowerCase();

    if (page === "index.html" || page === "") return "home";
    if (page === "join.html" || page === "join_old.html") return "join";
    if (page === "learn.html" || page.indexOf("learn_math_") === 0) return "learn";
    if (page === "team.html") return "team";
    if (page === "event.html" || page.indexOf("news-") === 0) return "events";
    if (page === "projects.html") return "projects";
    if (page === "contact_us.html") return "contact";

    return "";
  }

  function buildHeader(activeSection) {
    var links = [
      { key: "home", href: "index.html", label: "Home" },
      { key: "join", href: "join.html", label: "Join" },
      { key: "learn", href: "learn.html", label: "Learn" },
      { key: "team", href: "team.html", label: "Team" },
      { key: "events", href: "event.html", label: "Events" },
      { key: "projects", href: "projects.html", label: "Projects" },
      { key: "contact", href: "contact_us.html", label: "Contact" }
    ];

    var navHtml = links
      .map(function (link) {
        var isActive = link.key === activeSection;
        var activeClass = isActive ? " is-active" : "";
        var ariaCurrent = isActive ? ' aria-current="page"' : "";

        return (
          '<li><a class="qc-site-header__link' +
          activeClass +
          '" href="' +
          link.href +
          '"' +
          ariaCurrent +
          ">" +
          link.label +
          "</a></li>"
        );
      })
      .join("");

    var header = document.createElement("div");
    header.className = "qc-site-header";
    header.setAttribute("role", "banner");
    header.innerHTML =
      '<div class="qc-site-header__inner">' +
      '<a class="qc-site-header__brand" href="index.html" aria-label="QC at UCI home">' +
      '<img class="qc-site-header__logo" src="image/Anteater_Bloch_White.png" alt="QC at UCI logo">' +
      "</a>" +
      '<nav aria-label="Primary navigation">' +
      '<ul class="qc-site-header__nav">' +
      navHtml +
      "</ul>" +
      "</nav>" +
      "</div>";

    return header;
  }

  function canPrefetchUrl(url) {
    var page = (url.pathname.split("/").pop() || "").toLowerCase();
    return (
      url.origin === window.location.origin &&
      page.endsWith(".html") &&
      !url.hash &&
      url.pathname !== window.location.pathname
    );
  }

  function prefetchPage(href) {
    if (!href) return;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (_err) {
      return;
    }

    if (!canPrefetchUrl(url)) return;

    var key = url.pathname;
    if (prefetchedPages[key]) return;
    prefetchedPages[key] = true;

    var link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url.pathname;
    document.head.appendChild(link);
  }

  function setupHeaderPrefetch(headerRoot) {
    var pageLinks = headerRoot.querySelectorAll(".qc-site-header__link");

    pageLinks.forEach(function (anchor) {
      var href = anchor.getAttribute("href");

      anchor.addEventListener(
        "mouseenter",
        function () {
          prefetchPage(href);
        },
        { passive: true }
      );

      anchor.addEventListener(
        "touchstart",
        function () {
          prefetchPage(href);
        },
        { passive: true }
      );
    });

    var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 700); };
    idle(function () {
      pageLinks.forEach(function (anchor) {
        prefetchPage(anchor.getAttribute("href"));
      });
    });
  }

  function mountGlobalHeader() {
    if (!document.body) return;

    var activeSection = currentSectionFromPath(window.location.pathname);
    var newHeader = buildHeader(activeSection);
    var oldHeaders = document.querySelectorAll("header.header, header.site-header, .qc-site-header");
    var firstElementChild = document.body.firstElementChild;

    oldHeaders.forEach(function (node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });

    if (
      firstElementChild &&
      firstElementChild.classList &&
      firstElementChild.classList.contains("skip-link")
    ) {
      if (firstElementChild.nextSibling) {
        document.body.insertBefore(newHeader, firstElementChild.nextSibling);
      } else {
        document.body.appendChild(newHeader);
      }
    } else {
      document.body.insertBefore(newHeader, document.body.firstChild);
    }

    document.body.classList.add("qc-has-global-header");
    setupHeaderPrefetch(newHeader);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGlobalHeader);
  } else {
    mountGlobalHeader();
  }
})();
