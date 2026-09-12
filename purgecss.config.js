module.exports = {
  content: ["_site/**/*.html", "_site/**/*.js"],
  css: ["_site/assets/css/*.css"],
  output: "_site/assets/css/",
  skippedContentGlobs: ["_site/assets/**/*.html"],
  // As classes abaixo vivem nos repositorios das disciplinas, nao no HTML
  // deste projeto. Sem a protecao, o deploy remove o sistema visual comum.
  safelist: {
    greedy: [/teaching-page/],
  },
};
