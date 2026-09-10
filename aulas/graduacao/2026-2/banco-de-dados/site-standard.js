(() => {
  const body = document.body;
  const main = document.querySelector('main#conteudo');
  if (!body || !main) return;

  const syncRootTheme = () => {
    const isDark = body.classList.contains('theme-dark');
    document.documentElement.classList.toggle('theme-dark', isDark);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  };

  if (document.documentElement.classList.contains('theme-dark')) {
    body.classList.add('theme-dark');
  }
  syncRootTheme();
  new MutationObserver(syncRootTheme).observe(body, { attributes: true, attributeFilter: ['class'] });

  if (body.classList.contains('portal-page')) return;

  const hashLinks = [...document.querySelectorAll('.main-nav a[href^="#"], .study-toc a[href^="#"]')];
  const uniqueLinks = [];
  const seen = new Set();
  hashLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || seen.has(href) || !document.querySelector(href)) return;
    seen.add(href);
    uniqueLinks.push({ href, label: link.textContent.trim() });
  });

  if (uniqueLinks.length < 3) {
    [...main.querySelectorAll(':scope > section')].forEach((section, index) => {
      const heading = section.querySelector('h2');
      if (!heading) return;
      if (!section.id) section.id = heading.id?.replace(/-title$/, '') || `secao-${index + 1}`;
      const href = `#${section.id}`;
      if (!seen.has(href)) {
        seen.add(href);
        uniqueLinks.push({ href, label: heading.textContent.trim() });
      }
    });
  }

  if (!uniqueLinks.length) return;

  let grid = main.parentElement?.classList.contains('standard-page-grid') ? main.parentElement : null;
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'standard-shell standard-page-grid';
    main.parentNode.insertBefore(grid, main);
    grid.appendChild(main);
  }

  let aside = grid.querySelector('.standard-toc');
  if (!aside) {
    aside = document.createElement('aside');
    aside.className = 'standard-toc';
    grid.appendChild(aside);
  }
  aside.setAttribute('aria-label', 'Índice desta página');
  aside.innerHTML = `
    <div class="standard-toc-head">
      <span class="standard-toc-label">Nesta página</span>
      <button class="standard-toc-toggle" type="button" aria-expanded="true" aria-label="Recolher índice" title="Recolher índice">›</button>
    </div>
    <nav>${uniqueLinks.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('')}</nav>
    <span class="standard-toc-current" aria-hidden="true"></span>`;
  const toggle = aside.querySelector('.standard-toc-toggle');
  toggle.addEventListener('click', () => {
    const collapsed = body.classList.toggle('toc-collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expandir índice' : 'Recolher índice');
    toggle.setAttribute('title', collapsed ? 'Expandir índice' : 'Recolher índice');
  });

  const links = [...aside.querySelectorAll('nav a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setActive = (id) => links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-20% 0px -68% 0px', threshold: [0, .1, .5] });
    sections.forEach((section) => observer.observe(section));
  } else if (sections[0]) {
    setActive(sections[0].id);
  }

  const hero = main.querySelector('.hero-grid, .lesson-hero-grid, .study-hero-grid');
  if (hero) {
    const mobile = document.createElement('details');
    mobile.className = 'standard-mobile-toc';
    mobile.innerHTML = `<summary>Nesta página</summary><nav>${uniqueLinks.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('')}</nav>`;
    hero.appendChild(mobile);
  }
})();
