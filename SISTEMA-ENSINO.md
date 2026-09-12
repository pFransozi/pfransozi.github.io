# Sistema visual dos materiais de ensino

O portal e as disciplinas usam a mesma identidade visual sem reunir todo o conteúdo em um único repositório.

## Fonte de verdade

- `assets/css/ensino.css`: identidade, layouts editoriais, componentes comuns e responsividade.
- `assets/js/ensino.js`: tema compartilhado, progresso de leitura, navegação, índice lateral e diálogos.

Os arquivos são publicados em:

- `https://pfransozi.github.io/assets/css/ensino.css`
- `https://pfransozi.github.io/assets/js/ensino.js`

## Como usar em uma página

Inclua no final do `head`:

```html
<script src="https://pfransozi.github.io/assets/js/ensino.js?v=5"></script>
<link rel="stylesheet" href="https://pfransozi.github.io/assets/css/ensino.css?v=5" />
```

Marque o `body` com uma das variações:

- Portal: `teaching-page teaching-portal`
- Visão geral: `teaching-page teaching-course`
- Aula ou aprofundamento: `teaching-page teaching-lesson`

## Responsabilidades

O sistema compartilhado controla:

- cores, tipografia, espaçamentos e larguras;
- tema claro e escuro, usando a chave global `theme`;
- cabeçalho, rodapé e navegação;
- índice lateral compacto, expansível por hover, foco ou fixação;
- páginas de entrada, visão geral, aulas e aprofundamentos;
- cards, avisos, tabelas, código, botões e índices;
- comportamento para desktop, tablet e celular.

Os repositórios das disciplinas mantêm somente:

- conteúdo das aulas;
- diagramas e componentes didáticos específicos;
- interações próprias de simuladores e atividades.

## Manutenção

1. Altere primeiro os arquivos compartilhados neste repositório.
2. Teste uma página de cada tipo e cada disciplina nos temas claro e escuro.
3. Publique o portal antes de atualizar referências nas disciplinas.
4. Quando houver uma mudança incompatível, incremente o parâmetro `v` nos HTMLs.

Não crie uma nova folha de estilo para corrigir o layout geral de uma única aula. Se a regra for reutilizável, ela deve entrar no sistema compartilhado; se for
exclusiva do conteúdo, deve ficar na folha específica da aula.
