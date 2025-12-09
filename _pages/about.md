---
layout: about
title: about
permalink: /

profile:
  align: right
  #image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  #more_info: >
  #  <p>555 your office number</p>
  #  <p>123 your address street</p>
  #  <p>Your City, State 12345</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

Sou formado em Cibersegurança pela PUCPR e trabalho com análise de malware Android usando IA/Machine Learning. Meu foco é projetar e implementar **pipelines multi-view/multimodais** para detecção de malware a partir de diferentes atributos estáticos de APKs (permissões, chamadas de API, opcodes, entre outros), com ênfase em escalabilidade, reprodutibilidade e custo de inferência.

No mestrado, minha linha de pesquisa explora **modelos multimodais/multi-view com Knowledge Distillation**, usando arquiteturas teacher–student para reduzir custo computacional preservando capacidade de detecção. Isso inclui o desenho das views, definição de tarefas de distilação entre modelos especializados e avaliação do trade-off entre performance, complexidade do modelo e viabilidade de implantação.

Durante a graduação, trabalhei uma linha de pesquisa em **seleção de características multiobjetivo** para detecção de malware Android, aplicando algoritmos evolutivos como **NSGA-II** sobre múltiplas visões estáticas. Nesse contexto, desenvolvi:

- **Datasets multi-view** balanceados de malware/goodware, com curadoria e documentação para replicação;
- Pipelines de **pré-processamento, vetorização e normalização** de grandes volumes de dados (NumPy, pandas, scikit-learn);
- Experimentos com **modelos clássicos e ensembles** (Random Forest, KNN, Decision Tree, AdaBoost, Bagging) para classificação de malware;
- Rotinas de **otimização multiobjetivo** para selecionar subconjuntos de features e reduzir o custo de inferência;
- Avaliação sistemática com métricas como **F1-score, AUC, acurácia e balanced accuracy**, além de análise de ROC e matrizes de confusão.

Essa pesquisa rendeu o prêmio de **Melhor Trabalho na área de Exatas (PIBIC/PUCPR)** e distinções no **SBSEG** (Menção Honrosa em Trabalho Completo e **Artefato Destaque – 3 selos**), além de publicações em conferências e em periódico na área de análise de malware com IA/ML.

Além da pesquisa, tenho experiência prévia em **desenvolvimento e análise de software e suporte a equipes técnicas**, o que me dá visão prática de sistemas em produção e de seus requisitos de segurança. Também atuo com **ensino de programação Web e Python** para estudantes do Ensino Fundamental II e Médio, orientando projetos práticos e introduzindo fundamentos de pensamento computacional, segurança e uso responsável da tecnologia.