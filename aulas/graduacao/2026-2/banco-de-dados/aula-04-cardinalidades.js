document.addEventListener('DOMContentLoaded', () => {
  const exemplos = [
    {
      seletor: '.cardinality-card.one-one',
      texto: 'FUNCIONÁRIO ocupa ARMÁRIO — quando a regra estabelece um único armário por funcionário e um único funcionário por armário.'
    },
    {
      seletor: '.cardinality-card.one-many',
      texto: 'DEPARTAMENTO possui FUNCIONÁRIO — um departamento pode reunir vários funcionários; cada funcionário pertence a um departamento.'
    },
    {
      seletor: '.cardinality-card.many-many',
      texto: 'ALUNO cursa DISCIPLINA — um aluno pode cursar várias disciplinas e uma disciplina pode ter vários alunos.'
    }
  ];

  exemplos.forEach(({ seletor, texto }) => {
    const card = document.querySelector(seletor);
    if (!card || card.querySelector('.cardinality-case')) return;

    const exemplo = document.createElement('div');
    exemplo.className = 'cardinality-case';
    exemplo.style.cssText = 'margin-top:14px;padding:12px 14px;border:1px solid rgba(127,127,127,.18);border-radius:12px;background:rgba(127,127,127,.07);font-size:.9rem;line-height:1.5;';
    exemplo.innerHTML = `<span style="font-weight:850">Exemplo:</span> ${texto}`;
    card.appendChild(exemplo);
  });
});
