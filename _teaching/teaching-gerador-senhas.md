---
layout: page
title: "Gerador de Senhas em JavaScript"
description: "Projeto introdutório para trabalhar lógica de programação e segurança de senhas."
importance: 2
category: "Teaching"
date: 2025-03-01
tags:
  - Teaching
  - JavaScript
  - Web
  - Segurança Digital
github: "https://github.com/pFransozi/teaching-gerador-senhas"
selected: false
---

 
Neste projeto, o foco é duplo:

- desenvolver competências de lógica de programação aplicadas a um caso concreto;
- discutir **boas práticas de criação de senhas** e sua relação com **segurança digital e cidadania digital**.

A ideia é que, ao final, o(a) estudante consiga implementar seu próprio gerador de senhas na web e compreender por que determinadas escolhas tornam uma senha mais ou menos segura.

---

## Conceitos de programação trabalhados

Ao longo do projeto, os estudantes entram em contato com conceitos fundamentais de desenvolvimento web e programação:

- **HTML + CSS básicos**
  - Estrutura de página simples (formulários, botões, campos de texto).
  - Uso de estilos básicos para tornar a interface minimamente agradável e compreensível.

- **JavaScript**
  - Declaração de variáveis e constantes.
  - Manipulação de strings e arrays (conjuntos de caracteres permitidos).
  - Uso de funções para organizar a lógica do gerador de senhas.
  - Estruturas de repetição para montar a senha caractere a caractere.
  - Condicionais para ativar/desativar tipos de caracteres (maiúsculas, minúsculas, números, símbolos).
  - Manipulação do DOM (capturar valores de inputs, exibir a senha gerada na tela, copiar para a área de transferência).

- **Pensamento algorítmico**
  - Transformar requisitos do “mundo real” (queremos uma senha forte) em um **algoritmo claro**:
    1. Ler as opções marcadas pelo usuário.
    2. Montar o alfabeto permitido.
    3. Gerar uma sequência pseudoaleatória de caracteres.
    4. Exibir o resultado.

---

## Estrutura do repositório

O repositório foi organizado para ser facilmente reutilizado em sala de aula:

- `index.html`  
  Estrutura principal da página web (inputs de tamanho da senha, checkboxes de tipos de caracteres, botão de gerar, campo de exibição).

- `style.css`  
  Estilos básicos para tornar a interface limpa e fácil de usar pelos estudantes.

- `script.js`  
  Implementação da lógica do gerador:
  - configuração dos conjuntos de caracteres;
  - função principal de geração de senha;
  - ligação entre eventos de clique/alteração de inputs e a lógica de geração.

Opcionalmente, o professor pode pedir que os estudantes **reestruturem** o código (por exemplo, extraindo funções menores ou melhorando nomes de variáveis) para reforçar boas práticas de legibilidade.

---

## Sequência didática sugerida

Uma possível sequência de aulas:

1. **Exploração do problema (senhas no dia a dia)**
   - Perguntar: “Como vocês escolhem senhas hoje?”  
   - Levantar exemplos ruins (datas, nomes, 123456…) e discutir riscos.

2. **Primeiro contato com a interface**
   - Mostrar a página funcionando (demo).
   - Analisar o HTML e o CSS de forma superficial, focando na ideia de “camadas”: estrutura, estilo e lógica.

3. **Analisando a lógica em JavaScript**
   - Ler e comentar o `script.js`:
     - Onde são definidas as listas de caracteres?
     - Como a função de geração de senha usa `Math.random()`?
     - Como os valores do formulário chegam até o JS?

4. **Primeiras modificações pelos estudantes**
   - Ajustar tamanho mínimo/máximo da senha.
   - Alterar quais tipos de caracteres são obrigatórios.
   - Mostrar mensagens de erro quando nenhuma opção é selecionada.

5. **Extensões**
   - Botão “copiar senha”.
   - Medidor visual de “força” da senha.
   - Modo “fraca / média / forte” alterando a lógica de geração.

---

## Conexão com segurança digital

Embora o projeto seja simples, ele abre espaço para uma discussão mais ampla sobre **segurança digital** e **cidadania digital**:

- **Senhas fortes como primeira linha de defesa**  
  Ao verem como o gerador funciona, os estudantes entendem que uma senha segura tende a:
  - ser mais longa;
  - misturar tipos de caracteres;
  - evitar informações óbvias (nome, data de nascimento, time de futebol, etc.).

- **Ataques de força bruta e dicionário (de forma conceitual)**  
  É possível explicar de forma acessível que existem ataques que testam senhas automaticamente.  
  Daí a importância de:
  - não reutilizar a mesma senha em tudo;
  - evitar senhas muito simples (fáceis de “chutar”).

- **Cidadania digital**  
  A partir do exemplo do gerador, dá para ampliar a conversa:
  - Por que não devemos compartilhar senhas com colegas, mesmo “de confiança”?
  - Qual a responsabilidade de cada um na proteção das contas da escola/plataforma?
  - Como o uso de senhas fortes se relaciona com respeito à privacidade própria e dos outros?

- **Boas práticas complementares**
  - Introduzir, em nível introdutório, a ideia de **gerenciadores de senhas**.
  - Falar sobre **autenticação em dois fatores (2FA)** como uma camada adicional de segurança.
  - Discutir atitudes responsáveis ao receber links, e-mails ou pedidos de senha (phishing, engenharia social).

A proposta é que o gerador de senhas não seja apenas um exercício técnico, mas um **ponto de partida** para conversar sobre como os estudantes se protegem (ou não) online e qual o impacto disso para a vida escolar, familiar e social.

---

## Possíveis extensões para turmas mais avançadas

Para turmas com maior domínio de programação, o mesmo projeto pode ser expandido para:

- Implementar uma **estimativa simples de entropia** da senha gerada.
- Comparar a força de senhas criadas manualmente pelos alunos com a força das senhas geradas pelo script.
- Refatorar o código usando módulos ES6 ou padrões mais avançados de organização.
- Integrar o gerador em outra aplicação web maior (por exemplo, uma tela de cadastro fictícia).

Essas extensões permitem aprofundar tanto a parte técnica quanto a reflexão sobre segurança da informação.
