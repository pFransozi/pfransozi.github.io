# Ambiente local das aulas

Este servidor reune as tres disciplinas em um unico endereco e utiliza os recursos compartilhados do portal. Durante o teste, referencias a `https://pfransozi.github.io/assets/` sao substituidas pela pasta `assets` local. Assim, alteracoes em `assets/css/ensino.css` podem ser verificadas antes da publicacao.

## Estrutura esperada

Os quatro repositorios precisam estar na mesma pasta:

```text
repositorios/
├── pfransozi.github.io/
├── ia-aplicada-2026-02/
├── bd-2026-02/
└── arq-comp-so-2026-02/
```

## Iniciar

A partir do repositorio `pfransozi.github.io`:

```bash
python dev/servidor-aulas.py
```

No Windows, caso o comando `python` nao esteja disponivel:

```powershell
py dev/servidor-aulas.py
```

Depois, abra:

```text
http://127.0.0.1:8000/
```

Para usar outra porta:

```bash
python dev/servidor-aulas.py --port 8080
```

Se os repositorios das disciplinas estiverem em outra pasta, informe a pasta que os contem:

```powershell
py dev/servidor-aulas.py --workspace "C:\Users\phili\Documents\aulas\2026-02"
```

Use `Ctrl+F5` no navegador depois de editar HTML, CSS ou JavaScript. O servidor envia cabecalhos que desativam o cache durante o desenvolvimento.

## Enderecos diretos

- IA Aplicada: `http://127.0.0.1:8000/ia-aplicada-2026-02/`
- Banco de Dados: `http://127.0.0.1:8000/bd-2026-02/`
- Arquitetura e SO: `http://127.0.0.1:8000/arq-comp-so-2026-02/`

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Testar responsividade

No Chrome ou Edge:

1. Abra uma aula.
2. Pressione `F12`.
3. Ative a barra de dispositivos com `Ctrl+Shift+M`.
4. Teste, pelo menos, as larguras `1440`, `1180`, `900`, `760`, `430` e `390` pixels.

Verifique se:

- nao aparece rolagem horizontal na pagina;
- o indice lateral desaparece e o indice interno fica disponivel em telas menores;
- o cabecalho da aula passa para uma coluna em telas medias;
- cartoes, diagramas, tabelas e blocos de codigo nao ultrapassam a tela;
- botoes continuam faceis de selecionar no celular;
- os modos claro e escuro preservam contraste e legibilidade.
