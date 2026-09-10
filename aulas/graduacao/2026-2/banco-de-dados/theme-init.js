(() => {
  try {
    const savedTheme = localStorage.getItem('banco-dados-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    document.documentElement.classList.toggle('theme-dark', useDark);
    document.documentElement.dataset.theme = useDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = useDark ? 'dark' : 'light';
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
  }
})();
