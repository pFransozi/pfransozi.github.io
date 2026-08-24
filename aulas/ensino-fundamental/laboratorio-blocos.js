(() => {
  const LIMITS = { minX: -7, maxX: 7, minY: -5, maxY: 5 };
  const VIEW = { width: 640, height: 480, unit: 40, originX: 320, originY: 240 };
  const MAX_ACTIONS = 320;
  const STEP_DELAY = 420;
  const COMPLETION_KEY = "laboratorio-blocos-progress-v4";

  const $ = (selector) => document.querySelector(selector);
  const svgNS = "http://www.w3.org/2000/svg";
  const { MODULES, EXERCISES } = window.LAB_BLOCKS_DATA;

  const EXERCISE_BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));
  const MODULE_BY_ID = new Map(MODULES.map((module) => [module.id, module]));
  const MAIN_EXERCISES = EXERCISES.filter((exercise) => !exercise.bonus);
  const MAIN_IDS = MAIN_EXERCISES.map((exercise) => exercise.id);
  const BLOCK_LABELS = {
    mover_frente: "mover",
    girar_esquerda: "girar à esquerda",
    girar_direita: "girar à direita",
    ir_para: "ir para (x, y)",
    repetir: "repetir",
  };

  const gridLayer = $("#gridLayer");
  const axisLayer = $("#axisLayer");
  const targetLayer = $("#targetLayer");
  const robot = $("#robot");
  const robotPath = $("#robotPath");
  const startMarker = $("#startMarker");
  const statusText = $("#statusText");
  const playButton = $("#playButton");
  const stepButton = $("#stepButton");
  const previousButton = $("#previousExercise");
  const nextButton = $("#nextExercise");
  const hintButton = $("#hintButton");
  const completionCard = $("#completionCard");
  const completionNext = $("#completionNext");

  const state = { x: 0, y: 0, angle: 0 };
  let route = [];
  let program = [];
  let pc = 0;
  let playing = false;
  let executionToken = 0;
  let compiledWorkspaceVersion = -1;
  let workspaceVersion = 0;
  let currentExerciseId = readExerciseFromHash();
  const workspaceSnapshots = new Map();
  const hintProgress = new Map();
  const predictionAnswers = new Map();
  const completedExercises = loadCompletedExercises();

  function createSvg(name, attrs = {}) {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function sx(x) {
    return VIEW.originX + x * VIEW.unit;
  }

  function sy(y) {
    return VIEW.originY - y * VIEW.unit;
  }

  function normalizeAngle(angle) {
    const normalized = ((angle % 360) + 360) % 360;
    return Math.abs(normalized) < 1e-9 ? 0 : normalized;
  }

  function cleanNumber(value) {
    const rounded = Math.round(value * 100) / 100;
    return Math.abs(rounded) < 1e-9 ? 0 : rounded;
  }

  function formatNumber(value) {
    return String(cleanNumber(value)).replace("-", "−");
  }

  function formatPoint([x, y]) {
    return `(${formatNumber(x)}, ${formatNumber(y)})`;
  }

  function currentExercise() {
    return EXERCISE_BY_ID.get(currentExerciseId);
  }

  function currentModule() {
    return MODULE_BY_ID.get(currentExercise().module);
  }

  function readExerciseFromHash() {
    const hash = window.location.hash.replace(/^#/, "");
    if (EXERCISE_BY_ID.has(hash)) return hash;
    const oldMatch = hash.match(/^exercicio-(\d+)$/);
    if (oldMatch) {
      const index = Math.max(0, Math.min(MAIN_IDS.length - 1, Number(oldMatch[1]) - 1));
      return MAIN_IDS[index];
    }
    return "coord-ponto";
  }

  function loadCompletedExercises() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(COMPLETION_KEY) || "[]");
      return new Set(parsed.filter((id) => typeof id === "string"));
    } catch {
      return new Set();
    }
  }

  function saveCompletedExercises() {
    try {
      window.localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completedExercises]));
    } catch {
      // O laboratório continua funcionando mesmo se o navegador bloquear armazenamento local.
    }
  }

  function drawGrid() {
    gridLayer.replaceChildren();
    axisLayer.replaceChildren();

    for (let x = LIMITS.minX; x <= LIMITS.maxX; x += 1) {
      const xPos = sx(x);
      gridLayer.appendChild(
        createSvg("line", {
          x1: xPos,
          y1: sy(LIMITS.maxY),
          x2: xPos,
          y2: sy(LIMITS.minY),
          stroke: "var(--grid)",
          "stroke-width": x === 0 ? 0 : 1,
        })
      );
      if (x !== 0) {
        const text = createSvg("text", {
          x: xPos,
          y: sy(0) + 20,
          fill: "var(--muted)",
          "font-size": 11,
          "text-anchor": "middle",
        });
        text.textContent = String(x).replace("-", "−");
        axisLayer.appendChild(text);
      }
    }

    for (let y = LIMITS.minY; y <= LIMITS.maxY; y += 1) {
      const yPos = sy(y);
      gridLayer.appendChild(
        createSvg("line", {
          x1: sx(LIMITS.minX),
          y1: yPos,
          x2: sx(LIMITS.maxX),
          y2: yPos,
          stroke: "var(--grid)",
          "stroke-width": y === 0 ? 0 : 1,
        })
      );
      if (y !== 0) {
        const text = createSvg("text", {
          x: sx(0) - 12,
          y: yPos + 4,
          fill: "var(--muted)",
          "font-size": 11,
          "text-anchor": "end",
        });
        text.textContent = String(y).replace("-", "−");
        axisLayer.appendChild(text);
      }
    }

    axisLayer.appendChild(
      createSvg("line", {
        x1: sx(LIMITS.minX),
        y1: sy(0),
        x2: sx(LIMITS.maxX) + 12,
        y2: sy(0),
        stroke: "var(--axis)",
        "stroke-width": 2,
      })
    );
    axisLayer.appendChild(
      createSvg("path", {
        d: `M ${sx(LIMITS.maxX) + 12} ${sy(0)} l -10 -6 v 12 z`,
        fill: "var(--axis)",
      })
    );
    axisLayer.appendChild(
      createSvg("line", {
        x1: sx(0),
        y1: sy(LIMITS.minY),
        x2: sx(0),
        y2: sy(LIMITS.maxY) - 12,
        stroke: "var(--axis)",
        "stroke-width": 2,
      })
    );
    axisLayer.appendChild(
      createSvg("path", {
        d: `M ${sx(0)} ${sy(LIMITS.maxY) - 12} l -6 10 h 12 z`,
        fill: "var(--axis)",
      })
    );

    const xLabel = createSvg("text", {
      x: sx(LIMITS.maxX) + 20,
      y: sy(0) - 9,
      fill: "var(--axis)",
      "font-size": 14,
      "font-weight": 800,
    });
    xLabel.textContent = "x";
    axisLayer.appendChild(xLabel);

    const yLabel = createSvg("text", {
      x: sx(0) + 10,
      y: sy(LIMITS.maxY) - 18,
      fill: "var(--axis)",
      "font-size": 14,
      "font-weight": 800,
    });
    yLabel.textContent = "y";
    axisLayer.appendChild(yLabel);
  }

  function drawPoint(point, label) {
    const [x, y] = point;
    targetLayer.appendChild(
      createSvg("circle", {
        cx: sx(x),
        cy: sy(y),
        r: 12,
        fill: "var(--target)",
        opacity: 0.14,
      })
    );
    targetLayer.appendChild(
      createSvg("circle", {
        cx: sx(x),
        cy: sy(y),
        r: 5,
        fill: "var(--target)",
      })
    );
    if (label) {
      const text = createSvg("text", {
        x: sx(x) + 11,
        y: sy(y) - 11,
        class: "target-label",
      });
      text.textContent = label;
      targetLayer.appendChild(text);
    }
  }

  function drawObstacles(obstacles = []) {
    obstacles.forEach((obstacle) => {
      const x = sx(obstacle.xMin);
      const y = sy(obstacle.yMax);
      const width = (obstacle.xMax - obstacle.xMin) * VIEW.unit;
      const height = (obstacle.yMax - obstacle.yMin) * VIEW.unit;
      targetLayer.appendChild(
        createSvg("rect", {
          x,
          y,
          width,
          height,
          rx: 8,
          fill: "var(--danger-soft)",
          stroke: "var(--danger)",
          "stroke-width": 2,
          "stroke-dasharray": "7 5",
        })
      );
      if (obstacle.label) {
        const label = createSvg("text", {
          x: x + width / 2,
          y: y + height / 2 + 4,
          class: "obstacle-label",
        });
        label.textContent = obstacle.label;
        targetLayer.appendChild(label);
      }
    });
  }

  function drawTarget(exercise) {
    targetLayer.replaceChildren();
    startMarker.replaceChildren();

    const target = exercise.target;
    drawObstacles(target.obstacles || []);

    if (target.type === "path") {
      targetLayer.appendChild(
        createSvg("polyline", {
          points: target.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" "),
          fill: "none",
          stroke: "var(--target)",
          "stroke-width": 3,
          "stroke-dasharray": "8 8",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          opacity: 0.82,
        })
      );
    } else if (target.type === "point") {
      drawPoint(target.point, target.label || "objetivo");
    } else if (target.type === "waypoints") {
      target.points.forEach(({ point, label }) => drawPoint(point, label));
    }

    const start = exercise.start;
    startMarker.appendChild(
      createSvg("circle", {
        cx: sx(start.x),
        cy: sy(start.y),
        r: 6,
        fill: "var(--surface)",
        stroke: "var(--target)",
        "stroke-width": 3,
      })
    );

    if (exercise.startLabel) {
      const label = createSvg("text", {
        x: sx(start.x) + 10,
        y: sy(start.y) - 10,
        class: "target-label",
      });
      label.textContent = exercise.startLabel;
      targetLayer.appendChild(label);
    }
  }

  function updateStage() {
    robot.setAttribute("transform", `translate(${sx(state.x)} ${sy(state.y)}) rotate(${-state.angle})`);
    robotPath.setAttribute("points", route.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" "));
    $("#stateX").textContent = formatNumber(state.x);
    $("#stateY").textContent = formatNumber(state.y);
    $("#stateAngle").textContent = `${formatNumber(normalizeAngle(state.angle))}°`;
  }

  function setStatus(message, kind = "") {
    statusText.textContent = message;
    statusText.className = `status${kind ? ` ${kind}` : ""}`;
  }

  function moduleMainCompleted(module) {
    return module.mainIds.filter((id) => completedExercises.has(id)).length;
  }

  function renderModuleNav() {
    const container = $("#moduleNav");
    container.replaceChildren();
    const activeModuleId = currentExercise().module;

    MODULES.forEach((module) => {
      const completed = moduleMainCompleted(module);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "module-card";
      if (module.id === activeModuleId) button.classList.add("active");
      if (completed === module.mainIds.length) button.classList.add("completed");
      button.innerHTML = `
        <span class="module-number">${completed === module.mainIds.length ? "✓" : module.number}</span>
        <span class="module-name"><strong>${module.title}</strong><span>${module.subtitle}</span></span>
        <span class="module-count">${completed}/4</span>
      `;
      button.addEventListener("click", () => {
        const nextId = module.mainIds.find((id) => !completedExercises.has(id)) || module.mainIds[0];
        switchExercise(nextId);
      });
      container.appendChild(button);
    });
  }

  function renderOverallProgress() {
    const mainCompleted = MAIN_IDS.filter((id) => completedExercises.has(id)).length;
    const bonusCompleted = EXERCISES.filter((exercise) => exercise.bonus && completedExercises.has(exercise.id)).length;
    $("#overallProgressText").textContent =
      `${mainCompleted} de ${MAIN_IDS.length} exercícios principais` + (bonusCompleted ? ` · ${bonusCompleted} bônus` : "");
    $("#overallProgressBar").style.width = `${(mainCompleted / MAIN_IDS.length) * 100}%`;
  }

  function renderActivityDots() {
    const module = currentModule();
    const ids = [...module.mainIds, module.bonusId];
    const container = $("#activityDots");
    container.replaceChildren();

    ids.forEach((id, index) => {
      const exercise = EXERCISE_BY_ID.get(id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "activity-dot";
      if (exercise.bonus) button.classList.add("bonus");
      if (id === currentExerciseId) button.classList.add("active");
      if (completedExercises.has(id)) button.classList.add("completed");
      button.textContent = exercise.bonus ? "B" : String(index + 1);
      button.title = `${exercise.bonus ? "Bônus" : `Exercício ${index + 1}`}: ${exercise.title}`;
      button.setAttribute("aria-label", button.title);
      button.addEventListener("click", () => switchExercise(id));
      container.appendChild(button);
    });

    $("#moduleProgressLabel").textContent = `${moduleMainCompleted(module)} de 4 concluídos · B = bônus`;
  }

  function renderSkills(exercise) {
    const container = $("#skillsList");
    container.replaceChildren();
    exercise.skills.forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = skill;
      container.appendChild(chip);
    });
  }

  function renderHints(exercise) {
    const used = hintProgress.get(exercise.id) || 0;
    const list = $("#hintList");
    list.replaceChildren();

    exercise.hints.slice(0, used).forEach((hint) => {
      const item = document.createElement("li");
      item.textContent = hint;
      list.appendChild(item);
    });

    $("#hintPanel").hidden = used === 0;
    $("#hintCounter").textContent = used ? `${used} de ${exercise.hints.length}` : "";
    hintButton.disabled = used >= exercise.hints.length;
    hintButton.textContent = used >= exercise.hints.length ? "Todas as pistas exibidas" : `Ver pista ${used + 1}`;
  }

  function revealNextHint() {
    const exercise = currentExercise();
    const used = hintProgress.get(exercise.id) || 0;
    if (used >= exercise.hints.length) return;
    hintProgress.set(exercise.id, used + 1);
    renderHints(exercise);
  }

  function renderPrediction(exercise) {
    const card = $("#predictionCard");
    const options = $("#predictionOptions");
    const feedback = $("#predictionFeedback");
    options.replaceChildren();
    feedback.hidden = true;
    feedback.textContent = "";

    if (!exercise.prediction) {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    $("#predictionQuestion").textContent = exercise.prediction.question;
    const answer = predictionAnswers.get(exercise.id);

    exercise.prediction.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prediction-option";
      button.textContent = option.text;

      if (answer !== undefined) {
        button.disabled = true;
        if (index === answer) button.classList.add(option.correct ? "correct" : "incorrect");
        if (option.correct) button.classList.add("correct");
      }

      button.addEventListener("click", () => {
        predictionAnswers.set(exercise.id, index);
        renderPrediction(exercise);
      });
      options.appendChild(button);
    });

    if (answer !== undefined) {
      const selected = exercise.prediction.options[answer];
      feedback.hidden = false;
      feedback.textContent = `${selected.correct ? "Boa previsão. " : "Vale revisar a previsão. "}${exercise.prediction.feedback}`;
    }
  }

  function adjacentMainExercise(direction) {
    const exercise = currentExercise();
    if (exercise.bonus) {
      const moduleIndex = MODULES.findIndex((module) => module.id === exercise.module);
      if (direction < 0) return currentModule().mainIds[currentModule().mainIds.length - 1];
      if (moduleIndex < MODULES.length - 1) return MODULES[moduleIndex + 1].mainIds[0];
      return null;
    }

    const index = MAIN_IDS.indexOf(exercise.id);
    const nextIndex = index + direction;
    return nextIndex >= 0 && nextIndex < MAIN_IDS.length ? MAIN_IDS[nextIndex] : null;
  }

  function renderExerciseHeader() {
    const exercise = currentExercise();
    const module = currentModule();
    const position = module.mainIds.indexOf(exercise.id);

    $("#moduleEyebrow").textContent = `Trilha ${MODULES.indexOf(module) + 1} · ${module.title}`;
    $("#exerciseCounter").textContent = exercise.bonus ? "Desafio bônus" : `Exercício ${position + 1} de 4`;
    $("#conceptLabel").textContent = exercise.concept;
    $("#bonusBadge").hidden = !exercise.bonus;
    $("#completedBadge").hidden = !completedExercises.has(exercise.id);
    $("#challenge-title").textContent = exercise.title;
    $("#challengeDescription").textContent = exercise.description;
    $("#difficultyLabel").textContent = `Dificuldade ${"●".repeat(exercise.difficulty)}${"○".repeat(3 - exercise.difficulty)}`;
    $("#timeLabel").textContent = `~${exercise.minutes} min`;

    renderSkills(exercise);
    renderHints(exercise);
    renderPrediction(exercise);
    renderModuleNav();
    renderOverallProgress();
    renderActivityDots();

    const blockNames = exercise.blocks.map((type) => BLOCK_LABELS[type]);
    $("#blocksHelp").textContent =
      blockNames.length === 1 ? `Ferramenta disponível: ${blockNames[0]}.` : `Ferramentas disponíveis: ${blockNames.join(" · ")}.`;

    const previous = adjacentMainExercise(-1);
    const next = adjacentMainExercise(1);
    previousButton.disabled = !previous;
    nextButton.disabled = !next;
    nextButton.textContent = next ? "Próximo →" : "Trilha concluída";
    nextButton.classList.toggle("ready", completedExercises.has(exercise.id) && Boolean(next));

    completionCard.hidden = true;
  }

  Blockly.Blocks["mover_frente"] = {
    init() {
      this.appendDummyInput()
        .appendField("mover")
        .appendField(new Blockly.FieldNumber(4, -20, 20, 1), "UNIDADES")
        .appendField("unidades");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Move o robô na direção em que ele está apontando.");
    },
  };

  Blockly.Blocks["girar_esquerda"] = {
    init() {
      this.appendDummyInput()
        .appendField("girar à esquerda")
        .appendField(new Blockly.FieldNumber(90, -360, 360, 1), "GRAUS")
        .appendField("graus");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(265);
      this.setTooltip("Altera a orientação no sentido anti-horário.");
    },
  };

  Blockly.Blocks["girar_direita"] = {
    init() {
      this.appendDummyInput()
        .appendField("girar à direita")
        .appendField(new Blockly.FieldNumber(90, -360, 360, 1), "GRAUS")
        .appendField("graus");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(265);
      this.setTooltip("Altera a orientação no sentido horário.");
    },
  };

  Blockly.Blocks["ir_para"] = {
    init() {
      this.appendDummyInput()
        .appendField("ir para x:")
        .appendField(new Blockly.FieldNumber(0, -20, 20, 1), "X")
        .appendField("y:")
        .appendField(new Blockly.FieldNumber(0, -20, 20, 1), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(178);
      this.setTooltip("Leva o robô diretamente para uma coordenada do plano.");
    },
  };

  Blockly.Blocks["repetir"] = {
    init() {
      this.appendDummyInput()
        .appendField("repetir")
        .appendField(new Blockly.FieldNumber(4, 1, 30, 1), "VEZES")
        .appendField("vezes");
      this.appendStatementInput("ACOES").appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(35);
      this.setTooltip("Repete os blocos encaixados dentro dele.");
    },
  };

  const darkTheme = Blockly.Theme.defineTheme("labDark8", {
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: "#151c2b",
      toolboxBackgroundColour: "#101725",
      toolboxForegroundColour: "#eef2f8",
      flyoutBackgroundColour: "#101725",
      flyoutForegroundColour: "#eef2f8",
      flyoutOpacity: 1,
      scrollbarColour: "#667085",
      scrollbarOpacity: 0.65,
      insertionMarkerColour: "#ffffff",
      insertionMarkerOpacity: 0.3,
      cursorColour: "#8098ff",
    },
  });

  function toolboxForExercise(exercise) {
    return {
      kind: "flyoutToolbox",
      contents: exercise.blocks.map((type) => ({ kind: "block", type })),
    };
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const workspace = Blockly.inject("blocklyDiv", {
    toolbox: toolboxForExercise(currentExercise()),
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: true },
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.25, minScale: 0.65, scaleSpeed: 1.08 },
    grid: { spacing: 20, length: 2, colour: prefersDark ? "#364056" : "#dce2ef", snap: false },
    maxBlocks: 40,
    sounds: false,
    theme: prefersDark ? darkTheme : Blockly.Themes.Classic,
  });

  function createBlockFromSpec(spec) {
    const block = workspace.newBlock(spec.type);
    Object.entries(spec.fields || {}).forEach(([name, value]) => block.setFieldValue(String(value), name));
    block.initSvg();
    block.render();

    if (spec.children?.length && spec.type === "repetir") {
      const childFirst = createChainFromSpecs(spec.children);
      if (childFirst?.previousConnection) {
        block.getInput("ACOES").connection.connect(childFirst.previousConnection);
      }
    }
    return block;
  }

  function createChainFromSpecs(specs) {
    let first = null;
    let previous = null;
    specs.forEach((spec) => {
      const block = createBlockFromSpec(spec);
      if (!first) first = block;
      if (previous?.nextConnection && block.previousConnection) {
        previous.nextConnection.connect(block.previousConnection);
      }
      previous = block;
    });
    return first;
  }

  function loadStarterProgram(exercise) {
    if (!exercise.starterProgram?.length) return;
    const first = createChainFromSpecs(exercise.starterProgram);
    if (first) first.moveBy(42, 42);
  }

  function saveWorkspaceSnapshot() {
    workspaceSnapshots.set(currentExerciseId, Blockly.serialization.workspaces.save(workspace));
  }

  function stopExecution() {
    playing = false;
    executionToken += 1;
    playButton.disabled = false;
    stepButton.disabled = false;
    workspace.highlightBlock(null);
  }

  function switchExercise(id, { saveCurrent = true, updateHash = true } = {}) {
    if (!EXERCISE_BY_ID.has(id)) return;
    if (saveCurrent) saveWorkspaceSnapshot();
    stopExecution();
    currentExerciseId = id;
    const exercise = currentExercise();

    Blockly.Events.disable();
    try {
      workspace.updateToolbox(toolboxForExercise(exercise));
      workspace.clear();
      const snapshot = workspaceSnapshots.get(id);
      if (snapshot) {
        Blockly.serialization.workspaces.load(snapshot, workspace);
      } else {
        loadStarterProgram(exercise);
      }
    } finally {
      Blockly.Events.enable();
    }

    workspaceVersion += 1;
    compiledWorkspaceVersion = -1;
    program = [];
    pc = 0;
    drawTarget(exercise);
    resetRobot({ keepStatus: true });
    renderExerciseHeader();
    setStatus(exercise.initialStatus);

    if (updateHash) {
      window.history.replaceState(null, "", `${window.location.pathname}#${exercise.id}`);
    }
    Blockly.svgResize(workspace);
  }

  workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;
    workspaceVersion += 1;
    pc = 0;
    compiledWorkspaceVersion = -1;
    completionCard.hidden = true;
    if (!playing) {
      workspace.highlightBlock(null);
      setStatus("Algoritmo alterado. Use Passo ou Executar para testar a nova versão.");
    }
  });

  function pushAction(actions, action) {
    if (actions.length >= MAX_ACTIONS) {
      throw new Error(`O programa ultrapassou o limite de ${MAX_ACTIONS} passos.`);
    }
    actions.push(action);
  }

  function compileChain(firstBlock, actions, depth = 0) {
    if (depth > 24) throw new Error("Há blocos repetidos em profundidade demais.");
    let block = firstBlock;

    while (block) {
      if (block.type === "mover_frente") {
        pushAction(actions, { kind: "move", value: Number(block.getFieldValue("UNIDADES")), blockId: block.id });
      } else if (block.type === "girar_esquerda") {
        pushAction(actions, { kind: "turn", value: Number(block.getFieldValue("GRAUS")), blockId: block.id });
      } else if (block.type === "girar_direita") {
        pushAction(actions, { kind: "turn", value: -Number(block.getFieldValue("GRAUS")), blockId: block.id });
      } else if (block.type === "ir_para") {
        pushAction(actions, {
          kind: "goto",
          x: Number(block.getFieldValue("X")),
          y: Number(block.getFieldValue("Y")),
          blockId: block.id,
        });
      } else if (block.type === "repetir") {
        const times = Math.max(1, Math.min(30, Number(block.getFieldValue("VEZES")) || 1));
        const child = block.getInputTargetBlock("ACOES");
        for (let i = 0; i < times; i += 1) {
          if (child) compileChain(child, actions, depth + 1);
        }
      }
      block = block.getNextBlock();
    }
  }

  function compileProgram() {
    const actions = [];
    const topBlocks = workspace
      .getTopBlocks(true)
      .filter((block) => !block.getPreviousBlock())
      .sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);

    topBlocks.forEach((block) => compileChain(block, actions));
    program = actions;
    pc = 0;
    compiledWorkspaceVersion = workspaceVersion;
    return actions;
  }

  function resetRobot({ keepStatus = false } = {}) {
    const start = currentExercise().start;
    state.x = start.x;
    state.y = start.y;
    state.angle = normalizeAngle(start.angle);
    route = [[start.x, start.y]];
    pc = 0;
    stopExecution();
    updateStage();
    if (!keepStatus) setStatus("Robô reiniciado. Seus blocos foram mantidos.");
  }

  function ensureCompiled() {
    try {
      if (compiledWorkspaceVersion !== workspaceVersion) {
        compileProgram();
        resetRobot({ keepStatus: true });
      }
    } catch (error) {
      setStatus(error.message || "Não foi possível preparar o algoritmo.", "warning");
      return false;
    }

    if (!program.length) {
      setStatus("Adicione pelo menos um bloco antes de executar.", "warning");
      return false;
    }
    return true;
  }

  function pointInBounds(x, y) {
    return x >= LIMITS.minX && x <= LIMITS.maxX && y >= LIMITS.minY && y <= LIMITS.maxY;
  }

  function executeAction(action) {
    workspace.highlightBlock(action.blockId);

    if (action.kind === "move") {
      const radians = (normalizeAngle(state.angle) * Math.PI) / 180;
      state.x = cleanNumber(state.x + action.value * Math.cos(radians));
      state.y = cleanNumber(state.y + action.value * Math.sin(radians));
      route.push([state.x, state.y]);
    } else if (action.kind === "turn") {
      state.angle = normalizeAngle(state.angle + action.value);
    } else if (action.kind === "goto") {
      state.x = cleanNumber(action.x);
      state.y = cleanNumber(action.y);
      route.push([state.x, state.y]);
    }

    updateStage();

    if (!pointInBounds(state.x, state.y)) {
      setStatus("O robô saiu da área visível do plano. Reinicie e ajuste os blocos.", "warning");
    } else {
      setStatus(
        `Passo ${pc + 1} de ${program.length}. Estado: ${formatPoint([state.x, state.y])}, orientação ${formatNumber(normalizeAngle(state.angle))}°.`
      );
    }
  }

  function near(a, b, tolerance = 0.08) {
    return Math.abs(a - b) <= tolerance;
  }

  function pointsNear(a, b, tolerance = 0.08) {
    return near(a[0], b[0], tolerance) && near(a[1], b[1], tolerance);
  }

  function pointOnSegment(point, a, b, tolerance = 0.08) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const px = point[0] - a[0];
    const py = point[1] - a[1];
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared < 1e-10) return pointsNear(point, a, tolerance);

    const crossDistance = Math.abs(dx * py - dy * px) / Math.sqrt(lengthSquared);
    if (crossDistance > tolerance) return false;

    const dot = px * dx + py * dy;
    return dot >= -tolerance && dot <= lengthSquared + tolerance;
  }

  function routeMatchesPath(actualRoute, targetPath, tolerance = 0.08) {
    if (actualRoute.length < 2 || targetPath.length < 2 || !pointsNear(actualRoute[0], targetPath[0], tolerance)) return false;

    let targetIndex = 0;

    for (let i = 1; i < actualRoute.length; i += 1) {
      const a = actualRoute[i - 1];
      const b = actualRoute[i];

      while (targetIndex < targetPath.length - 2 && pointsNear(a, targetPath[targetIndex + 1], tolerance)) {
        targetIndex += 1;
      }

      if (targetIndex >= targetPath.length - 1) return false;

      const targetA = targetPath[targetIndex];
      const targetB = targetPath[targetIndex + 1];

      if (!pointOnSegment(a, targetA, targetB, tolerance) || !pointOnSegment(b, targetA, targetB, tolerance)) {
        return false;
      }

      if (pointsNear(b, targetB, tolerance)) targetIndex += 1;
    }

    return targetIndex === targetPath.length - 1 && pointsNear(actualRoute[actualRoute.length - 1], targetPath[targetPath.length - 1], tolerance);
  }

  function routePassesWaypoints(actualRoute, waypoints, tolerance = 0.1) {
    if (actualRoute.length < 2) return false;
    let segmentStart = 0;

    for (const waypoint of waypoints) {
      let found = false;
      for (let i = segmentStart; i < actualRoute.length - 1; i += 1) {
        if (pointOnSegment(waypoint, actualRoute[i], actualRoute[i + 1], tolerance)) {
          found = true;
          segmentStart = i;
          break;
        }
      }
      if (!found) return false;
    }

    return true;
  }

  function orientation(a, b, c) {
    const value = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  }

  function onSegment(a, b, c) {
    return (
      b[0] <= Math.max(a[0], c[0]) + 1e-9 &&
      b[0] >= Math.min(a[0], c[0]) - 1e-9 &&
      b[1] <= Math.max(a[1], c[1]) + 1e-9 &&
      b[1] >= Math.min(a[1], c[1]) - 1e-9
    );
  }

  function segmentsIntersect(p1, q1, p2, q2) {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;
    return false;
  }

  function pointInsideObstacle(point, obstacle) {
    return point[0] >= obstacle.xMin && point[0] <= obstacle.xMax && point[1] >= obstacle.yMin && point[1] <= obstacle.yMax;
  }

  function segmentCrossesObstacle(a, b, obstacle) {
    if (pointInsideObstacle(a, obstacle) || pointInsideObstacle(b, obstacle)) return true;

    const bottomLeft = [obstacle.xMin, obstacle.yMin];
    const bottomRight = [obstacle.xMax, obstacle.yMin];
    const topRight = [obstacle.xMax, obstacle.yMax];
    const topLeft = [obstacle.xMin, obstacle.yMax];

    return (
      segmentsIntersect(a, b, bottomLeft, bottomRight) ||
      segmentsIntersect(a, b, bottomRight, topRight) ||
      segmentsIntersect(a, b, topRight, topLeft) ||
      segmentsIntersect(a, b, topLeft, bottomLeft)
    );
  }

  function routeAvoidsObstacles(actualRoute, obstacles = []) {
    for (let i = 1; i < actualRoute.length; i += 1) {
      for (const obstacle of obstacles) {
        if (segmentCrossesObstacle(actualRoute[i - 1], actualRoute[i], obstacle)) return false;
      }
    }
    return true;
  }

  function blockConstraintsSatisfied(validation) {
    const blocks = workspace.getAllBlocks(false);
    const types = blocks.map((block) => block.type);

    if (validation.requiresBlock) {
      const required = Array.isArray(validation.requiresBlock) ? validation.requiresBlock : [validation.requiresBlock];
      if (!required.every((type) => types.includes(type))) return false;
    }

    if (validation.forbidBlock) {
      const forbidden = Array.isArray(validation.forbidBlock) ? validation.forbidBlock : [validation.forbidBlock];
      if (forbidden.some((type) => types.includes(type))) return false;
    }

    if (validation.maxBlocks && blocks.length > validation.maxBlocks) return false;
    return true;
  }

  function validateCurrentExercise() {
    const exercise = currentExercise();
    const validation = exercise.validation;
    const finalPoint = [state.x, state.y];
    let valid = false;

    if (validation.type === "point") {
      valid = pointsNear(finalPoint, validation.point, validation.tolerance);
    } else if (validation.type === "path") {
      valid = routeMatchesPath(route, exercise.target.points, validation.tolerance);
    } else if (validation.type === "waypoints") {
      const waypoints = exercise.target.points.map(({ point }) => point);
      valid =
        routePassesWaypoints(route, waypoints, validation.tolerance) &&
        pointsNear(finalPoint, waypoints[waypoints.length - 1], validation.tolerance);
    } else if (validation.type === "obstacle-goal") {
      valid =
        pointsNear(finalPoint, validation.point, validation.tolerance) &&
        routeAvoidsObstacles(route, exercise.target.obstacles || []);
    } else if (validation.type === "waypoints-obstacles") {
      const waypoints = exercise.target.points.map(({ point }) => point);
      valid =
        routePassesWaypoints(route, waypoints, validation.tolerance) &&
        pointsNear(finalPoint, waypoints[waypoints.length - 1], validation.tolerance) &&
        routeAvoidsObstacles(route, exercise.target.obstacles || []);
    }

    return valid && blockConstraintsSatisfied(validation);
  }

  function showCompletion(exercise) {
    $("#completionTitle").textContent = exercise.success;
    $("#completionTakeaway").textContent = exercise.takeaway;
    $("#completionReflection").textContent = exercise.reflection;

    const next = adjacentMainExercise(1);
    completionNext.hidden = !next;
    if (next) completionNext.textContent = "Próximo exercício →";
    completionCard.hidden = false;
  }

  function checkExercise() {
    const exercise = currentExercise();
    const valid = validateCurrentExercise();

    if (valid) {
      completedExercises.add(exercise.id);
      saveCompletedExercises();
      setStatus(exercise.success, "success");
      renderExerciseHeader();
      showCompletion(exercise);
      return true;
    }

    completionCard.hidden = true;
    setStatus(exercise.failure, "warning");
    return false;
  }

  function runOneStep() {
    if (!ensureCompiled()) return false;
    if (pc >= program.length) {
      checkExercise();
      return false;
    }

    executeAction(program[pc]);
    pc += 1;

    if (pc >= program.length) {
      window.setTimeout(() => {
        workspace.highlightBlock(null);
        checkExercise();
      }, 180);
    }
    return true;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function playProgram() {
    if (playing || !ensureCompiled()) return;

    if (pc >= program.length) {
      resetRobot({ keepStatus: true });
      pc = 0;
    }

    const token = ++executionToken;
    playing = true;
    playButton.disabled = true;
    stepButton.disabled = true;
    completionCard.hidden = true;

    while (playing && token === executionToken && pc < program.length) {
      executeAction(program[pc]);
      pc += 1;
      await sleep(STEP_DELAY);
    }

    if (token !== executionToken) return;

    playing = false;
    playButton.disabled = false;
    stepButton.disabled = false;
    workspace.highlightBlock(null);

    if (pc >= program.length) checkExercise();
  }

  function goToAdjacent(direction) {
    const id = adjacentMainExercise(direction);
    if (id) switchExercise(id);
  }

  hintButton.addEventListener("click", revealNextHint);
  playButton.addEventListener("click", playProgram);
  stepButton.addEventListener("click", () => {
    if (!playing) runOneStep();
  });
  $("#resetButton").addEventListener("click", () => resetRobot());
  $("#clearBlocks").addEventListener("click", () => {
    stopExecution();
    Blockly.Events.disable();
    try {
      workspace.clear();
    } finally {
      Blockly.Events.enable();
    }
    workspaceVersion += 1;
    compiledWorkspaceVersion = -1;
    resetRobot({ keepStatus: true });
    completionCard.hidden = true;
    setStatus("Área de blocos limpa. Arraste novos blocos da barra lateral.");
  });

  previousButton.addEventListener("click", () => goToAdjacent(-1));
  nextButton.addEventListener("click", () => goToAdjacent(1));
  completionNext.addEventListener("click", () => goToAdjacent(1));

  window.addEventListener("resize", () => Blockly.svgResize(workspace));
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (EXERCISE_BY_ID.has(hash) && hash !== currentExerciseId) {
      switchExercise(hash, { updateHash: false });
    }
  });

  drawGrid();
  switchExercise(currentExerciseId, { saveCurrent: false });
})();
