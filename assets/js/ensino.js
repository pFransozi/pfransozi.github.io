/* Comportamentos compartilhados dos materiais de ensino. */
(() => {
  const root = document.documentElement;
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");

  const readSetting = () => {
    try {
      const saved = localStorage.getItem("theme");
      return ["light", "dark", "system"].includes(saved) ? saved : "system";
    } catch (_) {
      return "system";
    }
  };

  const computedTheme = (setting = readSetting()) => (setting === "system" ? (media?.matches ? "dark" : "light") : setting);

  const applyTheme = (setting = readSetting()) => {
    const theme = computedTheme(setting);
    const dark = theme === "dark";
    root.dataset.theme = theme;
    root.dataset.themeSetting = setting;
    root.classList.toggle("theme-dark", dark);
    root.style.colorScheme = theme;

    if (!document.body) return;
    document.body.classList.toggle("theme-dark", dark);
    document.querySelectorAll(".theme-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
      toggle.title = dark ? "Ativar modo claro" : "Ativar modo escuro";
      const icon = toggle.querySelector(".theme-icon");
      const text = toggle.querySelector(".theme-text");
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (text) text.textContent = dark ? "Modo claro" : "Modo escuro";
      if (!icon && !text) toggle.textContent = dark ? "☀" : "◐";
    });

    document.querySelectorAll("img[data-light-src][data-dark-src], img[data-theme-figure]").forEach((image) => {
      const next = dark ? image.dataset.darkSrc : image.dataset.lightSrc;
      if (next && image.getAttribute("src") !== next) image.setAttribute("src", next);
    });
  };

  /* Executado no head para evitar a troca visivel de tema. */
  applyTheme();

  const ready = () => {
    applyTheme();

    document.querySelectorAll(".theme-toggle").forEach((toggle) => {
      toggle.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          const next = computedTheme() === "dark" ? "light" : "dark";
          try {
            localStorage.setItem("theme", next);
          } catch (_) {
            /* preferencia opcional */
          }
          applyTheme(next);
        },
        true
      );
    });

    media?.addEventListener?.("change", () => {
      if (readSetting() === "system") applyTheme("system");
    });

    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        const open = mainNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      mainNav.querySelectorAll("a").forEach((link) =>
        link.addEventListener("click", () => {
          mainNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    const progress = document.querySelector("#progress, .progress");
    const updateProgress = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = `${value}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const toc = document.querySelector(".standard-toc, .lesson-toc, .aula03-toc, .toc, .study-clean-aside");
    const tocNav = toc?.querySelector("nav");
    if (tocNav && !tocNav.querySelector('a[href^="#"]')) {
      const sections = [...document.querySelectorAll("main#conteudo > section, main#conteudo > div > section")];
      const items = sections.flatMap((section, index) => {
        const heading = section.querySelector("h2");
        if (!heading) return [];
        if (!section.id) section.id = heading.id?.replace(/-title$/, "") || `secao-${index + 1}`;
        return [{ href: `#${section.id}`, label: heading.textContent.trim() }];
      });
      tocNav.innerHTML = items.map(({ href, label }) => `<a href="${href}">${label}</a>`).join("");
    }
    if (toc) {
      toc.classList.add("teaching-toc-rail");
      document.body.classList.add("toc-rail-enabled");
      document.body.classList.remove("toc-collapsed");
    }

    const tocHead = toc?.querySelector(".standard-toc-head, .lesson-toc-head, .aula03-toc-head, .toc-head, .study-clean-toc-head");
    let tocToggle = toc?.querySelector(
      ".standard-toc-toggle, .lesson-toc-toggle, .aula03-toc-toggle, .toc-toggle, .study-clean-toc-toggle, .teaching-toc-toggle"
    );
    if (toc && tocHead && !tocToggle) {
      tocToggle = document.createElement("button");
      tocToggle.type = "button";
      tocToggle.className = "teaching-toc-toggle standard-toc-toggle";
      tocHead.appendChild(tocToggle);
    }
    const tocLinks = [...(toc?.querySelectorAll('nav a[href^="#"]') || [])].filter((link) => document.querySelector(link.getAttribute("href")));

    const syncTocControl = (expanded, pinned = toc?.classList.contains("is-pinned")) => {
      if (!tocToggle) return;
      tocToggle.setAttribute("aria-expanded", String(Boolean(expanded)));
      tocToggle.setAttribute("aria-pressed", String(Boolean(pinned)));
      tocToggle.setAttribute("aria-label", pinned ? "Liberar indice lateral" : "Fixar indice lateral aberto");
      tocToggle.title = pinned ? "Liberar indice lateral" : "Fixar indice lateral aberto";
      tocToggle.textContent = pinned ? "×" : "◉";
    };
    syncTocControl(false, false);

    toc?.addEventListener("mouseenter", () => syncTocControl(true));
    toc?.addEventListener("mouseleave", () => syncTocControl(toc.classList.contains("is-pinned")));
    toc?.addEventListener("focusin", () => syncTocControl(true));
    toc?.addEventListener("focusout", () =>
      window.setTimeout(() => {
        if (!toc.contains(document.activeElement)) syncTocControl(toc.classList.contains("is-pinned"));
      }, 0)
    );

    tocToggle?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const pinned = toc.classList.toggle("is-pinned");
        syncTocControl(pinned, pinned);
      },
      true
    );

    const setActive = (id) =>
      tocLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
          if (toc) toc.dataset.currentSection = link.textContent.trim();
        } else {
          link.removeAttribute("aria-current");
        }
      });
    if (tocLinks.length) setActive(tocLinks[0].getAttribute("href").slice(1));
    if ("IntersectionObserver" in window && tocLinks.length) {
      const sections = tocLinks.map((link) => document.querySelector(link.getAttribute("href")));
      const observer = new IntersectionObserver(
        (entries) => {
          const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (current) setActive(current.target.id);
        },
        { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.1, 0.5] }
      );
      sections.forEach((section) => observer.observe(section));
    }

    const hasMobileToc = document.querySelector(".standard-mobile-toc, .lesson-mobile-toc, .aula03-mobile-toc, .mobile-toc, .study-mobile-toc");
    const heroGrid = document.querySelector(".hero-grid, .lesson-hero-grid, .study-hero-grid");
    if (!hasMobileToc && heroGrid && tocLinks.length) {
      const mobileToc = document.createElement("details");
      mobileToc.className = "standard-mobile-toc";
      mobileToc.innerHTML = `<summary>Nesta pagina</summary><nav>${tocLinks.map((link) => link.outerHTML).join("")}</nav>`;
      heroGrid.appendChild(mobileToc);
    }

    document.querySelectorAll("[data-dialog-target]").forEach((button) => {
      button.addEventListener("click", () => document.getElementById(button.dataset.dialogTarget)?.showModal?.());
    });
    document.querySelector("[data-open-journey]")?.addEventListener("click", () => {
      document.querySelector("#journey-dialog")?.showModal?.();
    });
    document.querySelectorAll("[data-open-figure]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = document.querySelector("#figure-dialog, #image-dialog, dialog");
        dialog?.showModal?.();
      });
    });
    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.querySelector(".dialog-close, [data-close-dialog]")?.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();
