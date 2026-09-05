(function () {
  var prefetchedPages = {};

  function currentSectionFromPath(pathname) {
    var page = (pathname.split("/").pop() || "index.html").toLowerCase();

    if (page === "index.html" || page === "") return "home";
    if (page === "join.html" || page === "join_old.html") return "join";
    if (page === "learn.html" || page.indexOf("learn_math_") === 0) return "learn";
    if (page === "team.html") return "team";
    if (page === "qiskit_fall_fest_2026.html") return "qiskit-fall-fest";
    if (page === "event.html" || page.indexOf("news-") === 0) return "events";
    if (page === "gallery.html") return "gallery";
    if (page === "gallery-story.html") return "gallery";
    if (page === "projects.html") return "projects";
    if (page === "contact_us.html") return "contact";

    return "";
  }

  function buildHeader(activeSection) {
    var useCompactMenu = true;
    var links = [
      { key: "home", href: "index.html", label: "Home" },
      { key: "qiskit-fall-fest", href: "qiskit_fall_fest_2026.html", label: "Qiskit Fall Fest" },
      { key: "join", href: "join.html", label: "Join" },
      { key: "learn", href: "learn.html", label: "Learn" },
      { key: "team", href: "team.html", label: "Team" },
      { key: "events", href: "event.html", label: "Events" },
      { key: "gallery", href: "gallery.html", label: "Gallery" },
      { key: "projects", href: "projects.html", label: "Projects" },
      { key: "contact", href: "contact_us.html", label: "Contact" }
    ];

    var navHtml = links
      .map(function (link) {
        var isActive = link.key === activeSection;
        var activeClass = isActive ? " is-active" : "";
        var qiskitClass = link.key === "qiskit-fall-fest" ? " qc-site-header__link--qiskit" : "";
        var ariaCurrent = isActive ? ' aria-current="page"' : "";

        return (
          '<li><a class="qc-site-header__link' +
          qiskitClass +
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
    var innerClass = "qc-site-header__inner" + (useCompactMenu ? " qc-site-header__inner--compact" : "");
    var navContent = useCompactMenu
      ? '<nav class="qc-site-header__menu" aria-label="Primary navigation">' +
        '<button class="qc-site-header__menu-button" type="button" aria-expanded="false" aria-controls="qc-site-menu">' +
        '<span aria-hidden="true">≡</span>' +
        '<span class="qc-site-header__sr-only">Open navigation menu</span>' +
        "</button>" +
        '<ul id="qc-site-menu" class="qc-site-header__nav qc-site-header__nav--dropdown">' +
        navHtml +
        "</ul>" +
        "</nav>"
      : '<nav aria-label="Primary navigation">' +
        '<ul class="qc-site-header__nav">' +
        navHtml +
        "</ul>" +
        "</nav>";

    header.className = "qc-site-header";
    header.setAttribute("role", "banner");
    header.innerHTML =
      '<div class="' +
      innerClass +
      '">' +
      '<a class="qc-site-header__brand" href="index.html" aria-label="QC at UCI home">' +
      '<img class="qc-site-header__logo" src="image/Anteater_Bloch_White.png" alt="QC at UCI logo">' +
      "</a>" +
      navContent +
      "</div>";

    return header;
  }

  function setupCompactMenu(headerRoot) {
    var menu = headerRoot.querySelector(".qc-site-header__menu");
    if (!menu) return;

    var button = menu.querySelector(".qc-site-header__menu-button");
    if (!button) return;

    function setOpen(isOpen) {
      menu.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    menu.addEventListener("mouseenter", function () {
      setOpen(true);
    });

    menu.addEventListener("mouseleave", function () {
      setOpen(false);
    });

    menu.addEventListener("focusin", function () {
      setOpen(true);
    });

    menu.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!menu.contains(document.activeElement)) {
          setOpen(false);
        }
      }, 0);
    });

    button.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });

    headerRoot.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        button.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target)) {
        setOpen(false);
      }
    });
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

  function syncHeaderHeight(headerRoot) {
    function setHeight() {
      document.documentElement.style.setProperty("--qc-header-h", headerRoot.offsetHeight + "px");
    }

    setHeight();
    window.addEventListener("resize", setHeight, { passive: true });
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
    setupCompactMenu(newHeader);
    syncHeaderHeight(newHeader);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGlobalHeader);
  } else {
    mountGlobalHeader();
  }
})();
