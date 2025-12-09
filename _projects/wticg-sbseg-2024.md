---
layout: page
title: "Seleção de Características Multiobjetivo para Detecção de Malwares Android"
description: "NSGA-II aplicado a múltiplas visões estáticas de APKs"
importance: 2
category: "Android Malware & AI"
date: 2024-09-01
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

Este projeto implementa o pipeline experimental do artigo:

**Fransozi, Philipe; Geremias, Jhonatan; Viegas, Eduardo K.; Santin, Altair O.**  
*Seleção de Características Multiobjetivo para Detecção de Malwares Android.*  
Anais Estendidos do Simpósio Brasileiro de Segurança da Informação e de Sistemas Computacionais (SBSEG 2024), SBC, 2024.  
DOI: [10.5753/sbseg_estendido.2024.241836](https://doi.org/10.5753/sbseg_estendido.2024.241836)

---

## Contexto: artigo, código e dataset

O artigo investiga **seleção de características multiobjetivo** para detecção de malwares Android a partir de **visões estáticas multi-view** de APKs.  
Este repositório é o artefato de pesquisa que materializa o pipeline completo:

- da **representação estática** de aplicações Android (API calls, opcodes, permissões),  
- passando pelo **pré-processamento e seleção de características com NSGA-II**,  
- até a **avaliação de classificadores de malware** em cenários de alta dimensionalidade e restrição de custo.

O código foi organizado para que cada etapa do pipeline de dados e IA possa ser executada, inspecionada e reutilizada em outros estudos de Android malware analysis.

---

## Pipeline de dados e engenharia de características

O fluxo de dados segue a abordagem clássica de **static analysis** para Android, estruturado em múltiplas “views”:

1. **Coleta e rotulagem**  
   - APKs rotulados como benignos ou maliciosos a partir de motores antivírus.  
   - Os rótulos são consolidados para reduzir ruído entre engines (label noise).

2. **Extração de features estáticas**  
   Cada APK é transformado em três matrizes de alta dimensionalidade:
   - **API calls**: invocações de métodos da API Android/Java extraídas do bytecode.
   - **Opcodes**: sequência de instruções de máquina Dalvik/ART agregadas em contagens.
   - **Permissões**: permissões declaradas no `AndroidManifest.xml` (binárias).

3. **Representação e pré-processamento**
   - Construção de vetores **esparsos** (bag-of-APIs, bag-of-opcodes, vetor binário de permissões).
   - Filtragem inicial de ruído e **redução para TOP-k features** por view (via medidas como Information Gain).
   - Normalização e preparação das matrizes para uso em modelos supervisionados.

4. **Divisão de dados**
   - **Stratified train/test split**, preservando a proporção malware/benigno.
   - Sementes fixas para tornar os resultados reproduzíveis.

---

## Seleção de características multiobjetivo com NSGA-II

O núcleo do trabalho é a aplicação do **NSGA-II** como mecanismo de **feature selection multiobjetivo** em cada uma das views e em combinações de views.

- **Codificação dos indivíduos**  
  - Cada indivíduo no algoritmo genético é um **vetor binário** indicando quais features de uma view (ou combinação de views) estão ativas.  
  - O espaço de busca corresponde ao subconjunto de features da ordem de milhares de dimensões.

- **Funções objetivo**  
  Para cada indivíduo, treinamos e avaliamos um classificador em um subconjunto de treino/validação e calculamos:
  1. **Qualidade de detecção**  
     - Métricas como **AUC** e **F1-score**, capturando capacidade de distinguir malware de benignos em cenário desbalanceado.
  2. **Custo de representação/modelo**  
     - **Número de características selecionadas**, usado como proxy para custo computacional de inferência (memória, tempo e tamanho do modelo).

- **Resultado: fronteira de Pareto**  
  - O NSGA-II aproxima a **fronteira de Pareto** entre “detecção mais robusta” e “menor custo de feature set”.  
  - Cada ponto da fronteira representa uma configuração de features que realiza um trade-off explícito entre qualidade de classificação e custo.

---

## Modelos de detecção e avaliação

As soluções geradas pelo NSGA-II são utilizadas como conjuntos de features para treinar e avaliar diferentes modelos de detecção de malware:

- **Modelos supervisionados avaliados**
  - **Random Forest**
  - **K-Nearest Neighbors (KNN)**
  - **Decision Tree**

- **Cenários avaliados**
  - **Single-view**: uso isolado de API calls, opcodes ou permissões.
  - **Combinações de views**: fusão de matrizes (early fusion) para explorar complementaridade entre fontes de informação.

- **Métricas analisadas**
  - **F1-score** e **AUC-ROC**, para avaliar capacidade de detecção em classes desbalanceadas.
  - **Taxas de falso positivo/negativo**, importantes para cenários operacionais de segurança.
  - **Curvas de trade-off** entre desempenho preditivo e tamanho do subconjunto de features, derivadas diretamente da fronteira de Pareto.

Esse desenho experimental permite comparar:
- modelos **sem seleção** (usando todos os TOP-k features),  
- modelos com **feature selection multiobjetivo**,  
quantificando o impacto da redução de dimensionalidade na detecção de malwares Android.

---

## Repositório e reprodução

- Código e scripts de experimento:  
  👉 [GitHub – pFransozi/wticg_sbseg_24](https://github.com/pFransozi/wticg_sbseg_24)

O repositório contém:

- organização modular em `data/`, `src/` e scripts de experimento,
- artefatos com resultados do NSGA-II (fronteiras de Pareto pré-computadas),
- código para treinar e avaliar modelos a partir dos conjuntos de features selecionados,
- arquivo `requirements.txt` com o ambiente mínimo para executar o pipeline.

Em conjunto com o artigo, este projeto oferece um **caso completo de estudo** em seleção de características multiobjetivo aplicada à detecção de malwares Android em cenários de alta dimensionalidade.