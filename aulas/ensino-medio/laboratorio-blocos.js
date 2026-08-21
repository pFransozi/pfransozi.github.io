(() => {
  const START = { x: -2, y: -2, angle: 0 };
  const LIMITS = { minX: -7, maxX: 7, minY: -5, maxY: 5 };
  const VIEW = { width: 640, height: 480, unit: 40, originX: 320, originY: 240 };
  const MAX_ACTIONS = 240;
  const STEP_DELAY = 420;

  const state = { ...START };
  let route = [[START.x, START.y]];
  let program = [];
  let pc = 0;
  let playing = false;
  let compiledWorkspaceVersion = -1;
  let workspaceVersion = 0;

  const $ = (selector) => document.querySelector(selector);
  const svgNS = "http://www.w3.org/2000/svg";
  const gridLayer = $("#gridLayer");
  const axisLayer = $("#axisLayer");
  const robot = $("#robot");
  const robotPath = $("#robotPath");
  const targetPath = $("#targetPath");
  const startMarker = $("#startMarker");
  const statusText = $("#statusText");
  const playButton = $("#playButton");
  const stepButton = $("#stepButton");

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

  function drawGrid() {
    gridLayer.replaceChildren();
    axisLayer.replaceChildren();

    for (let x = LIMITS.minX; x <= LIMITS.maxX; x += 1) {
      const xPos = sx(x);
      const line = createSvg("line", {
        x1: xPos,
        y1: sy(LIMITS.maxY),
        x2: xPos,
        y2: sy(LIMITS.minY),
        stroke: "var(--grid)",
        "stroke-width": x === 0 ? 0 : 1,
      });
      gridLayer.appendChild(line);

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
      const line = createSvg("line", {
        x1: sx(LIMITS.minX),
        y1: yPos,
        x2: sx(LIMITS.maxX),
        y2: yPos,
        stroke: "var(--grid)",
        "stroke-width": y === 0 ? 0 : 1,
      });
      gridLayer.appendChild(line);

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

    const xAxis = createSvg("line", {
      x1: sx(LIMITS.minX),
      y1: sy(0),
      x2: sx(LIMITS.maxX) + 12,
      y2: sy(0),
      stroke: "var(--axis)",
      "stroke-width": 2,
    });
    axisLayer.appendChild(xAxis);

    const xArrow = createSvg("path", {
      d: `M ${sx(LIMITS.maxX) + 12} ${sy(0)} l -10 -6 v 12 z`,
      fill: "var(--axis)",
    });
    axisLayer.appendChild(xArrow);

    const yAxis = createSvg("line", {
      x1: sx(0),
      y1: sy(LIMITS.minY),
      x2: sx(0),
      y2: sy(LIMITS.maxY) - 12,
      stroke: "var(--axis)",
      "stroke-width": 2,
    });
    axisLayer.appendChild(yAxis);

    const yArrow = createSvg("path", {
      d: `M ${sx(0)} ${sy(LIMITS.maxY) - 12} l -6 10 h 12 z`,
      fill: "var(--axis)",
    });
    axisLayer.appendChild(yArrow);

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

  function drawTarget() {
    const target = [
      [-2, -2],
      [2, -2],
      [2, 2],
      [-2, 2],
      [-2, -2],
    ];
    targetPath.setAttribute("points", target.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" "));

    startMarker.replaceChildren();
    const marker = createSvg("circle", {
      cx: sx(START.x),
      cy: sy(START.y),
      r: 6,
      fill: "var(--surface)",
      stroke: "var(--target)",
      "stroke-width": 3,
    });
    startMarker.appendChild(marker);
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
      this.setTooltip("Soma o ângulo no sentido anti-horário.");
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
      this.setTooltip("Diminui o ângulo, girando no sentido horário.");
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
        .appendField(new Blockly.FieldNumber(4, 1, 20, 1), "VEZES")
        .appendField("vezes");
      this.appendStatementInput("ACOES").appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(35);
      this.setTooltip("Repete os blocos encaixados dentro dele.");
    },
  };

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "mover_frente" },
      { kind: "block", type: "girar_esquerda" },
      { kind: "block", type: "girar_direita" },
      { kind: "block", type: "ir_para" },
      { kind: "block", type: "repetir" },
    ],
  };

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
    toolbox,
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: true },
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.25, minScale: 0.65, scaleSpeed: 1.08 },
    grid: { spacing: 20, length: 2, colour: prefersDark ? "#364056" : "#dce2ef", snap: false },
    maxBlocks: 30,
    sounds: false,
    theme: prefersDark ? darkTheme : Blockly.Themes.Classic,
  });

  function addStarterBlock() {
    const block = workspace.newBlock("mover_frente");
    block.setFieldValue(4, "UNIDADES");
    block.initSvg();
    block.render();
    block.moveBy(42, 42);
  }

  addStarterBlock();

  workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;
    workspaceVersion += 1;
    pc = 0;
    compiledWorkspaceVersion = -1;
    if (!playing) {
      workspace.highlightBlock(null);
      setStatus("Algoritmo alterado. Use Passo ou Play para executar.");
    }
  });

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
    state.x = START.x;
    state.y = START.y;
    state.angle = START.angle;
    route = [[START.x, START.y]];
    pc = 0;
    playing = false;
    workspace.highlightBlock(null);
    updateStage();
    playButton.disabled = false;
    stepButton.disabled = false;
    if (!keepStatus) setStatus("Robô reiniciado. Os blocos foram mantidos.");
  }

  function ensureCompiled() {
    if (compiledWorkspaceVersion !== workspaceVersion) {
      compileProgram();
      resetRobot({ keepStatus: true });
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
      setStatus("O robô saiu da área visível do plano. Você pode reiniciar e ajustar os blocos.", "warning");
    } else {
      setStatus(
        `Passo ${pc + 1} de ${program.length}. Estado: (${formatNumber(state.x)}, ${formatNumber(state.y)}), ${formatNumber(
          normalizeAngle(state.angle)
        )}°.`
      );
    }
  }

  function near(a, b, tolerance = 0.02) {
    return Math.abs(a - b) <= tolerance;
  }

  function onTargetPerimeter([x, y]) {
    const onHorizontal = (near(y, -2) || near(y, 2)) && x >= -2.02 && x <= 2.02;
    const onVertical = (near(x, -2) || near(x, 2)) && y >= -2.02 && y <= 2.02;
    return onHorizontal || onVertical;
  }

  function segmentOnTarget(a, b) {
    const horizontal = near(a[1], b[1]) && (near(a[1], -2) || near(a[1], 2));
    const vertical = near(a[0], b[0]) && (near(a[0], -2) || near(a[0], 2));
    return (horizontal || vertical) && onTargetPerimeter(a) && onTargetPerimeter(b);
  }

  function checkChallenge() {
    const corners = [
      [-2, -2],
      [2, -2],
      [2, 2],
      [-2, 2],
    ];
    const visitedAllCorners = corners.every(([cx, cy]) => route.some(([x, y]) => near(x, cx) && near(y, cy)));
    const stayedOnTarget =
      route.length >= 5 && route.every(onTargetPerimeter) && route.slice(1).every((point, index) => segmentOnTarget(route[index], point));
    const backAtStart = near(state.x, START.x) && near(state.y, START.y);

    if (visitedAllCorners && stayedOnTarget && backAtStart) {
      setStatus("Conseguiu! O robô desenhou o quadrado e voltou ao ponto inicial.", "success");
      return true;
    }

    setStatus("Execução concluída. Compare a trajetória contínua com a linha tracejada e ajuste o algoritmo.", "warning");
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
    if (playing) return;
    if (!ensureCompiled()) return;

    if (pc >= program.length) {
      resetRobot({ keepStatus: true });
      pc = 0;
    }

    playing = true;
    playButton.disabled = true;
    stepButton.disabled = true;

    while (playing && pc < program.length) {
      executeAction(program[pc]);
      pc += 1;
      await sleep(STEP_DELAY);
    }

    playing = false;
    playButton.disabled = false;
    stepButton.disabled = false;
    workspace.highlightBlock(null);

    if (pc >= program.length) checkChallenge();
  }

  $("#playButton").addEventListener("click", playProgram);
  $("#stepButton").addEventListener("click", () => {
    if (!playing) runOneStep();
  });
  $("#resetButton").addEventListener("click", () => resetRobot());
  $("#clearBlocks").addEventListener("click", () => {
    playing = false;
    workspace.clear();
    resetRobot({ keepStatus: true });
    compiledWorkspaceVersion = -1;
    setStatus("Área de blocos limpa. Arraste novos blocos da barra lateral.");
  });

  window.addEventListener("resize", () => Blockly.svgResize(workspace));

  drawGrid();
  drawTarget();
  resetRobot({ keepStatus: true });
  setStatus("Comece pelo bloco “mover 4 unidades” e complete o caminho.");
})();
