---
layout: page
title: "Seleção de Características Multiobjetivo para Detecção de Malwares Android"
description: "NSGA-II aplicado a múltiplas visões estáticas de APKs"
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
tags:
  - Android Malware
  - Machine Learning
  - NSGA-II
  - Feature Selection
  - Cybersecurity
github: "https://github.com/pFransozi/wticg_sbseg_24"
paper: "https://sol.sbc.org.br/index.php/sbseg_estendido/article/view/30146"
doi: "10.5753/sbseg_estendido.2024.241836"
selected: true   # aparece em destaque (home / grid principal)
---
---
layout: project
title: "Seleção de Características Multiobjetivo para Detecção de Malwares Android"
subtitle: "NSGA-II aplicado a múltiplas visões estáticas de APKs"
date: 2024-09-01   # uma data aproximada do trabalho
tags:
  - Android Malware
  - Machine Learning
  - NSGA-II
  - Feature Selection
  - Cybersecurity
github: "https://github.com/pFransozi/wticg_sbseg_24"
paper: "https://sol.sbc.org.br/index.php/sbseg_estendido/article/view/30146"
doi: "10.5753/sbseg_estendido.2024.241836"
selected: true   # aparece em destaque (home / grid principal)
---

Este projeto implementa o pipeline experimental do artigo:

**Fransozi, Philipe; Geremias, Jhonatan; Viegas, Eduardo K.; Santin, Altair O.**  
*Seleção de Características Multiobjetivo para Detecção de Malwares Android.*  
Anais Estendidos do Simpósio Brasileiro de Segurança da Informação e de Sistemas Computacionais (SBSEG 2024), SBC, 2024.  
DOI: [10.5753/sbseg_estendido.2024.241836](https://doi.org/10.5753/sbseg_estendido.2024.241836)

### Resumo

Exploramos seleção de características multiobjetivo para detecção de malwares Android a partir de
múltiplas visões estáticas (chamadas de API, opcodes, permissões).  
Usamos o algoritmo **NSGA-II** para otimizar simultaneamente:

- desempenho de classificação (AUC, F1-score),
- custo computacional (número de features).

O conjunto de soluções de Pareto é usado para treinar classificadores **Random Forest**, **KNN** e
**Decision Tree**, avaliando o impacto da combinação de visões e da redução de dimensionalidade.

### Repositório e reprodução

- Código e scripts de experimento:  
  👉 [GitHub – pFransozi/wticg_sbseg_24](https://github.com/pFransozi/wticg_sbseg_24)

O repositório inclui:
- organização em `data/`, `src/` e `experiments/`,
- scripts para carregar os dumps dos resultados do NSGA-II,
- código para treinar e avaliar os modelos,
- instruções de ambiente em `requirements.txt`.
