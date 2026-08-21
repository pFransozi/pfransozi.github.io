(() => {
  const LIMITS = { minX: -7, maxX: 7, minY: -5, maxY: 5 };
  const VIEW = { width: 640, height: 480, unit: 40, originX: 320, originY: 240 };
  const MAX_ACTIONS = 260;
  const STEP_DELAY = 420;
  const COMPLETION_KEY = "laboratorio-blocos-completed-v2";

  const $ = (selector) => document.querySelector(selector);
  const svgNS = "http://www.w3.org/2000/svg";

  function makeRegularPolygon(start, side, sides, turnAngle) {
    const points = [[start.x, start.y]];
    let x = start.x;
    let y = start.y;
    let angle = start.angle;

    for (let i = 0; i < sides; i += 1) {
      const radians = (angle * Math.PI) / 180;
      x += side * Math.cos(radians);
      y += side * Math.sin(radians);
      points.push([x, y]);
      angle += turnAngle;
    }

    return points;
  }

  const squarePath = [
    [-2, -2],
    [2, -2],
    [2, 2],
    [-2, 2],
    [-2, -2],
  ];

  const rectanglePath = [
    [-3, -2],
    [3, -2],
    [3, 1],
    [-3, 1],
    [-3, -2],
  ];

  const triangleStart = { x: -2, y: -2, angle: 0 };
  const trianglePath = makeRegularPolygon(triangleStart, 4, 3, 120);
  const hexagonStart = { x: -2, y: -2, angle: 0 };
  const hexagonPath = makeRegularPolygon(hexagonStart, 2, 6, 60);

  const housePath = [
    [-3, -3],
    [3, -3],
    [3, 1],
    [0, 4],
    [-3, 1],
    [-3, -3],
  ];

  const EXERCISES = [
    {
      title: "Encontre o ponto",
      concept: "Plano cartesiano",
      description: "O robô começa em (0, 0). Use o bloco de coordenadas para levá-lo exatamente até (4, 3).",
      start: { x: 0, y: 0, angle: 0 },
      blocks: ["ir_para"],
      starter: { type: "ir_para", fields: { X: 0, Y: 0 } },
      target: { type: "point", point: [4, 3], label: "(4, 3)", legend: "ponto = objetivo" },
      validation: { type: "point", point: [4, 3], tolerance: 0.06 },
      initialStatus: "Altere x e y no bloco e observe onde o robô aparece.",
      success: "Conseguiu! Você posicionou o robô em (4, 3).",
      failure: "Ainda não chegou a (4, 3). Confira os valores de x e y.",
    },
    {
      title: "Siga o caminho em L",
      concept: "Movimento e rotação",
      description: "O robô começa em (−3, −2), apontando para 0°. Percorra a linha tracejada até (2, 2) usando movimento e rotação.",
      start: { x: -3, y: -2, angle: 0 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita"],
      starter: { type: "mover_frente", fields: { UNIDADES: 5 } },
      target: {
        type: "path",
        points: [
          [-3, -2],
          [2, -2],
          [2, 2],
        ],
        legend: "linha tracejada = caminho",
      },
      validation: { type: "path", tolerance: 0.08 },
      initialStatus: "Primeiro avance no eixo x; depois descubra qual giro leva o robô para cima.",
      success: "Conseguiu! Você combinou deslocamento e uma rotação de 90°.",
      failure: "Compare sua trajetória com o L tracejado e ajuste movimento ou rotação.",
    },
    {
      title: "Cruze os quadrantes",
      concept: "Orientação no plano",
      description: "Saia de (3, −2), com o robô apontando para 180°, e chegue a (−3, 3). Não existe um único caminho correto.",
      start: { x: 3, y: -2, angle: 180 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita"],
      starter: { type: "mover_frente", fields: { UNIDADES: 6 } },
      target: { type: "point", point: [-3, 3], label: "objetivo", legend: "ponto = destino" },
      validation: { type: "point", point: [-3, 3], tolerance: 0.08 },
      initialStatus: "Planeje uma rota. Observe como x e y mudam quando o robô troca de direção.",
      success: "Conseguiu! Você atravessou o plano e chegou ao destino.",
      failure: "O destino é (−3, 3). Observe o estado atual e planeje o próximo deslocamento.",
    },
    {
      title: "Desenhe um quadrado",
      concept: "Sequência de instruções",
      description: "Desenhe o quadrado de lado 4 e volte ao ponto inicial. Neste exercício, monte a sequência completa sem usar repetição.",
      start: { x: -2, y: -2, angle: 0 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita"],
      starter: { type: "mover_frente", fields: { UNIDADES: 4 } },
      target: { type: "path", points: squarePath, legend: "linha tracejada = objetivo" },
      validation: { type: "path", tolerance: 0.08 },
      initialStatus: "Complete os quatro lados usando movimentos e giros.",
      success: "Conseguiu! O quadrado foi percorrido e o robô voltou ao início.",
      failure: "Compare a trajetória contínua com o quadrado tracejado e ajuste a sequência.",
    },
    {
      title: "O mesmo quadrado, com menos blocos",
      concept: "Repetição",
      description: "Produza exatamente o mesmo quadrado, agora usando o bloco repetir. Tente resolver com no máximo 3 blocos no total.",
      start: { x: -2, y: -2, angle: 0 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita", "repetir"],
      starter: { type: "mover_frente", fields: { UNIDADES: 4 } },
      target: { type: "path", points: squarePath, legend: "mesmo objetivo do exercício 4" },
      validation: { type: "path", tolerance: 0.08, requiresBlock: "repetir", maxBlocks: 3 },
      initialStatus: "Procure o padrão que se repete quatro vezes. O limite é de 3 blocos.",
      success: "Conseguiu! Você representou o mesmo algoritmo de forma mais compacta com repetição.",
      failure: "O desenho precisa coincidir com o quadrado, usar repetir e ter no máximo 3 blocos.",
    },
    {
      title: "Desenhe um retângulo",
      concept: "Padrões dentro da repetição",
      description: "Desenhe um retângulo com lados 6 e 3. Observe que nem todos os lados têm a mesma medida e encontre o trecho que se repete.",
      start: { x: -3, y: -2, angle: 0 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita", "repetir"],
      starter: { type: "mover_frente", fields: { UNIDADES: 6 } },
      target: { type: "path", points: rectanglePath, legend: "linha tracejada = objetivo" },
      validation: { type: "path", tolerance: 0.08 },
      initialStatus: "Dica conceitual: um par de lados diferentes aparece duas vezes.",
      success: "Conseguiu! Você identificou um padrão maior do que um único movimento.",
      failure: "Confira as medidas: lados horizontais 6 e lados verticais 3.",
    },
    {
      title: "Desenhe um triângulo equilátero",
      concept: "Ângulo externo",
      description:
        "Desenhe um triângulo equilátero de lado 4. O ângulo interno é 60°, mas o robô precisa descobrir quanto deve girar em cada vértice.",
      start: triangleStart,
      blocks: ["mover_frente", "girar_esquerda", "girar_direita", "repetir"],
      starter: { type: "mover_frente", fields: { UNIDADES: 4 } },
      target: { type: "path", points: trianglePath, legend: "linha tracejada = triângulo" },
      validation: { type: "path", tolerance: 0.12 },
      initialStatus: "Se 60° não funcionar, observe o giro necessário para apontar para o próximo lado.",
      success: "Conseguiu! O giro externo do triângulo é 120°: 3 × 120° = 360°.",
      failure: "O lado mede 4. Reavalie principalmente o ângulo de rotação em cada vértice.",
    },
    {
      title: "Desenhe um hexágono",
      concept: "Lados e rotação",
      description: "Desenhe um hexágono regular de lado 2. Use a relação entre número de lados, repetição e uma volta completa de 360°.",
      start: hexagonStart,
      blocks: ["mover_frente", "girar_esquerda", "girar_direita", "repetir"],
      starter: { type: "mover_frente", fields: { UNIDADES: 2 } },
      target: { type: "path", points: hexagonPath, legend: "linha tracejada = hexágono" },
      validation: { type: "path", tolerance: 0.12 },
      initialStatus: "Pense: se seis giros completam 360°, quanto vale cada giro?",
      success: "Conseguiu! No hexágono, 6 × 60° completa uma volta de 360°.",
      failure: "Confira o lado 2 e pense em dividir uma volta completa pelos 6 vértices.",
    },
    {
      title: "Passe pelos pontos na ordem",
      concept: "Objetivos intermediários",
      description: "Comece em A e passe por B, C e D, nessa ordem. Chegar apenas ao ponto final não basta: o percurso deve respeitar as etapas.",
      start: { x: -5, y: -3, angle: 0 },
      startLabel: "A",
      blocks: ["mover_frente", "girar_esquerda", "girar_direita"],
      starter: { type: "mover_frente", fields: { UNIDADES: 4 } },
      target: {
        type: "waypoints",
        points: [
          { point: [-1, -3], label: "B" },
          { point: [-1, 2], label: "C" },
          { point: [4, 2], label: "D" },
        ],
        legend: "B → C → D",
      },
      validation: { type: "waypoints", tolerance: 0.1 },
      initialStatus: "Divida o problema: primeiro B, depois C e, por fim, D.",
      success: "Conseguiu! Você transformou um objetivo maior em objetivos intermediários.",
      failure: "Verifique se sua trajetória passa por B, depois C e só então chega a D.",
    },
    {
      title: "Desafio final: desenhe uma casa",
      concept: "Decomposição e combinação",
      description: "Reproduza o contorno da casa. Você pode combinar todas as ferramentas vistas: coordenadas, movimentos, rotações e repetição.",
      start: { x: -3, y: -3, angle: 0 },
      blocks: ["mover_frente", "girar_esquerda", "girar_direita", "ir_para", "repetir"],
      starter: { type: "mover_frente", fields: { UNIDADES: 6 } },
      target: { type: "path", points: housePath, legend: "linha tracejada = casa" },
      validation: { type: "path", tolerance: 0.14 },
      initialStatus: "Separe mentalmente a figura em base, paredes e telhado. Depois transforme cada parte em movimentos.",
      success: "Conseguiu! Você decompôs uma figura maior e combinou diferentes ideias do laboratório.",
      failure: "Compare sua trajetória com o contorno. Experimente resolver uma parte da casa de cada vez.",
    },
  ];

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

  const state = { x: 0, y: 0, angle: 0 };
  let route = [];
  let program = [];
  let pc = 0;
  let playing = false;
  let executionToken = 0;
  let compiledWorkspaceVersion = -1;
  let workspaceVersion = 0;
  let currentExerciseIndex = readExerciseFromHash();
  const workspaceSnapshots = new Array(EXERCISES.length).fill(null);
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

  function readExerciseFromHash() {
    const match = window.location.hash.match(/^#exercicio-(\d+)$/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return Math.max(0, Math.min(EXERCISES.length - 1, index));
  }

  function loadCompletedExercises() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(COMPLETION_KEY) || "[]");
      return new Set(stored.filter((value) => Number.isInteger(value) && value >= 0 && value < EXERCISES.length));
    } catch (error) {
      return new Set();
    }
  }

  function saveCompletedExercises() {
    try {
      window.localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completedExercises].sort((a, b) => a - b)));
    } catch (error) {
      // O laboratório continua funcionando mesmo se o navegador bloquear o armazenamento local.
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

  function drawTarget(exercise) {
    targetLayer.replaceChildren();
    startMarker.replaceChildren();

    const target = exercise.target;
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
      drawTargetPoint(target.point, target.label || "objetivo");
    } else if (target.type === "waypoints") {
      target.points.forEach(({ point, label }) => drawTargetPoint(point, label));
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
        fill: "var(--target)",
        "font-size": 13,
        "font-weight": 850,
      });
      label.textContent = exercise.startLabel;
      targetLayer.appendChild(label);
    }
  }

  function drawTargetPoint([x, y], label) {
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

    const text = createSvg("text", {
      x: sx(x) + 11,
      y: sy(y) - 11,
    });
    text.textContent = label;
    targetLayer.appendChild(text);
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

  Blockly.Blocks["mover_frente"] = {
    init() {
      this.appendDummyInput()
        .appendField("mover")
        .appendField(new Blockly.FieldNumber(4, -20, 20, 0.1), "UNIDADES")
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
        .appendField(new Blockly.FieldNumber(90, -360, 360, 0.1), "GRAUS")
        .appendField("graus");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(265);
      this.setTooltip("Soma o ângulo no sentido anti-horário.");
    },
  };

  Blockly.Blocks["girar_direita"] = {
    init() {
      this.appendDummyInput()
        .appendField("girar à direita")
        .appendField(new Blockly.FieldNumber(90, -360, 360, 0.1), "GRAUS")
        .appendField("graus");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(265);
      this.setTooltip("Diminui o ângulo, girando no sentido horário.");
    },
  };

  Blockly.Blocks["ir_para"] = {
    init() {
      this.appendDummyInput()
        .appendField("ir para x:")
        .appendField(new Blockly.FieldNumber(0, -20, 20, 0.1), "X")
        .appendField("y:")
        .appendField(new Blockly.FieldNumber(0, -20, 20, 0.1), "Y");
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
        .appendField(new Blockly.FieldNumber(4, 1, 20, 1), "VEZES")
        .appendField("vezes");
      this.appendStatementInput("ACOES").appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(35);
      this.setTooltip("Repete os blocos encaixados dentro dele.");
    },
  };

  function toolboxForExercise(exercise) {
    return {
      kind: "flyoutToolbox",
      contents: exercise.blocks.map((type) => ({ kind: "block", type })),
    };
  }

  const darkTheme = Blockly.Theme.defineTheme("labDark", {
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
      cursorColour: "#7792ff",
    },
  });

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const workspace = Blockly.inject("blocklyDiv", {
    toolbox: toolboxForExercise(EXERCISES[currentExerciseIndex]),
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: true },
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.25, minScale: 0.65, scaleSpeed: 1.08 },
    grid: { spacing: 20, length: 2, colour: prefersDark ? "#364056" : "#dce2ef", snap: false },
    maxBlocks: 40,
    sounds: false,
    theme: prefersDark ? darkTheme : Blockly.Themes.Classic,
  });

  workspace.addChangeListener((event) => {
    if (event.isUiEvent || !Blockly.Events.isEnabled()) return;
    workspaceVersion += 1;
    pc = 0;
    compiledWorkspaceVersion = -1;
    if (!playing) {
      workspace.highlightBlock(null);
      setStatus("Algoritmo alterado. Use Passo ou Play para executar.");
    }
  });

  function addStarterBlock(exercise) {
    if (!exercise.starter) return;
    const block = workspace.newBlock(exercise.starter.type);
    Object.entries(exercise.starter.fields || {}).forEach(([field, value]) => block.setFieldValue(String(value), field));
    block.initSvg();
    block.render();
    block.moveBy(42, 42);
  }

  function saveCurrentWorkspace() {
    workspaceSnapshots[currentExerciseIndex] = Blockly.serialization.workspaces.save(workspace);
  }

  function stopExecution() {
    playing = false;
    executionToken += 1;
    playButton.disabled = false;
    stepButton.disabled = false;
    workspace.highlightBlock(null);
  }

  function loadExercise(index, { saveCurrent = true } = {}) {
    if (index < 0 || index >= EXERCISES.length) return;
    if (saveCurrent) saveCurrentWorkspace();

    stopExecution();
    currentExerciseIndex = index;
    const exercise = EXERCISES[index];

    Blockly.Events.disable();
    try {
      workspace.updateToolbox(toolboxForExercise(exercise));
      workspace.clear();
      if (workspaceSnapshots[index]) {
        Blockly.serialization.workspaces.load(workspaceSnapshots[index], workspace);
      } else {
        addStarterBlock(exercise);
      }
    } finally {
      Blockly.Events.enable();
    }

    workspaceVersion += 1;
    compiledWorkspaceVersion = -1;
    program = [];
    pc = 0;

    renderExerciseHeader();
    drawTarget(exercise);
    resetRobot({ keepStatus: true });
    renderProgress();
    setStatus(exercise.initialStatus);
    window.history.replaceState(null, "", `${window.location.pathname}#exercicio-${index + 1}`);
    Blockly.svgResize(workspace);
  }

  function renderExerciseHeader() {
    const exercise = EXERCISES[currentExerciseIndex];
    $("#exerciseCounter").textContent = `Exercício ${currentExerciseIndex + 1} de ${EXERCISES.length}`;
    $("#conceptLabel").textContent = exercise.concept;
    $("#challenge-title").textContent = exercise.title;
    $("#challengeDescription").textContent = exercise.description;
    $("#targetLegend").textContent = exercise.target.legend;
    $("#blocksHelp").textContent =
      exercise.blocks.length === 1
        ? "Neste exercício, há apenas uma ferramenta disponível."
        : `Blocos disponíveis neste exercício: ${exercise.blocks.length}.`;

    previousButton.disabled = currentExerciseIndex === 0;
    nextButton.disabled = currentExerciseIndex === EXERCISES.length - 1;
    nextButton.textContent = currentExerciseIndex === EXERCISES.length - 1 ? "Último exercício" : "Próximo →";
    nextButton.classList.toggle("ready", completedExercises.has(currentExerciseIndex) && currentExerciseIndex < EXERCISES.length - 1);
  }

  function renderProgress() {
    const progressDots = $("#progressDots");
    progressDots.replaceChildren();

    EXERCISES.forEach((exercise, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "progress-dot";
      if (index === currentExerciseIndex) dot.classList.add("active");
      if (completedExercises.has(index)) dot.classList.add("completed");
      dot.setAttribute("aria-label", `Abrir exercício ${index + 1}: ${exercise.title}${completedExercises.has(index) ? ", concluído" : ""}`);
      dot.title = `${index + 1}. ${exercise.title}`;
      dot.addEventListener("click", () => loadExercise(index));
      progressDots.appendChild(dot);
    });

    $("#progressLabel").textContent = `${completedExercises.size} de ${EXERCISES.length} concluídos`;
    nextButton.classList.toggle("ready", completedExercises.has(currentExerciseIndex) && currentExerciseIndex < EXERCISES.length - 1);
  }

  function pushAction(actions, action) {
    if (actions.length >= MAX_ACTIONS) {
      throw new Error(`O programa ultrapassou o limite de ${MAX_ACTIONS} passos.`);
    }
    actions.push(action);
  }

  function compileChain(firstBlock, actions, depth = 0) {
    if (depth > 20) throw new Error("Há blocos repetidos em profundidade demais.");
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
        const times = Math.max(1, Math.min(20, Number(block.getFieldValue("VEZES")) || 1));
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
    const start = EXERCISES[currentExerciseIndex].start;
    state.x = start.x;
    state.y = start.y;
    state.angle = start.angle;
    route = [[start.x, start.y]];
    pc = 0;
    stopExecution();
    updateStage();
    if (!keepStatus) setStatus("Robô reiniciado. Os blocos foram mantidos.");
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
      setStatus(`Passo ${pc + 1} de ${program.length}. Estado: ${formatPoint([state.x, state.y])}, ${formatNumber(normalizeAngle(state.angle))}°.`);
    }
  }

  function near(a, b, tolerance = 0.08) {
    return Math.abs(a - b) <= tolerance;
  }

  function pointsNear(a, b, tolerance = 0.08) {
    return near(a[0], b[0], tolerance) && near(a[1], b[1], tolerance);
  }

  function pointOnSegment(point, a, b, tolerance = 0.08) {
    const abx = b[0] - a[0];
    const aby = b[1] - a[1];
    const apx = point[0] - a[0];
    const apy = point[1] - a[1];
    const lengthSquared = abx * abx + aby * aby;

    if (lengthSquared < 1e-10) return pointsNear(point, a, tolerance);

    const cross = Math.abs(abx * apy - aby * apx) / Math.sqrt(lengthSquared);
    if (cross > tolerance) return false;

    const dot = apx * abx + apy * aby;
    return dot >= -tolerance && dot <= lengthSquared + tolerance;
  }

  function followsPath(actualRoute, targetPath, tolerance = 0.08) {
    if (actualRoute.length < 2 || targetPath.length < 2 || !pointsNear(actualRoute[0], targetPath[0], tolerance)) return false;

    let targetSegment = 0;
    let previous = actualRoute[0];

    for (let i = 1; i < actualRoute.length; i += 1) {
      const point = actualRoute[i];

      while (targetSegment < targetPath.length - 2 && pointsNear(previous, targetPath[targetSegment + 1], tolerance)) {
        targetSegment += 1;
      }

      if (targetSegment >= targetPath.length - 1) return false;
      const a = targetPath[targetSegment];
      const b = targetPath[targetSegment + 1];

      if (!pointOnSegment(previous, a, b, tolerance) || !pointOnSegment(point, a, b, tolerance)) return false;
      previous = point;
    }

    return targetSegment === targetPath.length - 2 && pointsNear(previous, targetPath[targetPath.length - 1], tolerance);
  }

  function visitsWaypointsInOrder(actualRoute, waypoints, tolerance = 0.1) {
    if (actualRoute.length < 2) return false;
    let routeSegment = 0;

    for (const waypoint of waypoints) {
      let found = false;
      for (let i = routeSegment; i < actualRoute.length - 1; i += 1) {
        if (pointOnSegment(waypoint, actualRoute[i], actualRoute[i + 1], tolerance)) {
          routeSegment = i;
          found = true;
          break;
        }
      }
      if (!found) return false;
    }

    return true;
  }

  function constraintsSatisfied(validation) {
    const blocks = workspace.getAllBlocks(false);
    if (validation.requiresBlock && !blocks.some((block) => block.type === validation.requiresBlock)) return false;
    if (validation.maxBlocks && blocks.length > validation.maxBlocks) return false;
    return true;
  }

  function checkChallenge() {
    const exercise = EXERCISES[currentExerciseIndex];
    const validation = exercise.validation;
    let success = false;

    if (validation.type === "point") {
      success = pointsNear([state.x, state.y], validation.point, validation.tolerance);
    } else if (validation.type === "path") {
      success = followsPath(route, exercise.target.points, validation.tolerance);
    } else if (validation.type === "waypoints") {
      const waypoints = exercise.target.points.map(({ point }) => point);
      const finalPoint = waypoints[waypoints.length - 1];
      success = visitsWaypointsInOrder(route, waypoints, validation.tolerance) && pointsNear([state.x, state.y], finalPoint, validation.tolerance);
    }

    success = success && constraintsSatisfied(validation);

    if (success) {
      completedExercises.add(currentExerciseIndex);
      saveCompletedExercises();
      renderProgress();
      renderExerciseHeader();

      if (currentExerciseIndex === EXERCISES.length - 1 && completedExercises.size === EXERCISES.length) {
        setStatus("Parabéns! Você concluiu os 10 exercícios do laboratório.", "success");
      } else if (currentExerciseIndex < EXERCISES.length - 1) {
        setStatus(`${exercise.success} Você já pode avançar para o próximo exercício.`, "success");
      } else {
        setStatus(exercise.success, "success");
      }
      return true;
    }

    setStatus(exercise.failure, "warning");
    return false;
  }

  function runOneStep() {
    if (!ensureCompiled()) return false;
    if (pc >= program.length) {
      checkChallenge();
      return false;
    }

    executeAction(program[pc]);
    pc += 1;

    if (pc >= program.length) {
      window.setTimeout(() => {
        workspace.highlightBlock(null);
        checkChallenge();
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

    if (pc >= program.length) checkChallenge();
  }

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
    workspaceSnapshots[currentExerciseIndex] = null;
    workspaceVersion += 1;
    compiledWorkspaceVersion = -1;
    resetRobot({ keepStatus: true });
    setStatus("Área de blocos limpa. Arraste novos blocos da barra lateral.");
  });

  previousButton.addEventListener("click", () => loadExercise(currentExerciseIndex - 1));
  nextButton.addEventListener("click", () => loadExercise(currentExerciseIndex + 1));
  window.addEventListener("resize", () => Blockly.svgResize(workspace));

  drawGrid();
  loadExercise(currentExerciseIndex, { saveCurrent: false });
})();
