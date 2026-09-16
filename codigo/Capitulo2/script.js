/**
 * ===================================================================
 * FACUNDO: CIVILIZACIÓN O BARBARIE
 * Capítulo 2: El Caudillo y el Dominio de La Rioja
 * Archivo: script.js
 * ===================================================================
 */

"use strict";

/* ===================================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN
   =================================================================== */

const gameState = {
  // Puntuación heredada o por defecto
  civilizacion: 50,
  barbarie: 50,
  investigacion: 0,

  // Estado narrativo
  currentSceneId: "escena_1_llegada_larioja",
  dialogueIndex: 0,
  isTimerActive: false,
  timerSecondsRemaining: 0,
  timerIntervalId: null,

  // Historial de la partida
  history: [],

  // Configuración de texto e interfaz
  settings: {
    fontFamily: "font-serif",
    fontSize: "text-md",
    textSpeed: 30
  },

  // Control del efecto tipográfico
  isTyping: false,
  typingTimeoutId: null,
  currentFullText: ""
};

/* ===================================================================
   2. MAPA DE RECURSOS Y ASSETS GRÁFICOS
   =================================================================== */

const ASSETS = {
  backgrounds: {
    lariojaEntrada: "Recursos Graficos/pueblo.png",
    pampaCamino: "Recursos Graficos/pueblo.png",
    pulperiaInterior: "Recursos Graficos/campamento.png",
    campamentoGaucho: "Recursos Graficos/campamento.png",
    despachoOficial: "Recursos Graficos/pueblo.png",
    barrancaYaco: "Recursos Graficos/campamento.png"
  },
  portraits: {
    facundoJoven: "Recursos Graficos/caudillo.png",
    caudillo: "Recursos Graficos/caudillo.png",
    comerciante: "Recursos Graficos/comerciante.png",
    rastreador: "Recursos Graficos/comerciante.png",
    profesora: "Recursos Graficos/sarmiento.png"
  }
};

/* ===================================================================
   3. ESTRUCTURA NARRATIVA (GUION OFICIAL CAPÍTULO 2)
   =================================================================== */

const storyData = {
  // ESCENA 1: LLEGADA A LA RIOJA
  "escena_1_llegada_larioja": {
    id: "escena_1_llegada_larioja",
    background: ASSETS.backgrounds.lariojaEntrada,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Entrada a La Rioja",
        text: "Dejas atrás los caminos de San Juan. El polvo del llano anuncia la llegada a La Rioja, territorio donde el nombre de Facundo se susurra con temor y devoción.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "La sombra del caudillo",
        text: "Aquel joven rebelde del colegio ya no es una simple leyenda local: es el hombre que domina las voluntades y la política de los llanos.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Comerciante",
        prompt: "En la entrada del pueblo",
        text: "«Si buscas justicia, dependerás de su humor. Si buscas orden, prepárate para someterte a su ley», murmura un comerciante alarmado.",
        portraitLeft: ASSETS.portraits.comerciante,
        portraitRight: null
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Entrar al campamento militar y buscar audiencia con Facundo.",
        alignment: { civilizacion: -5, barbarie: 10 },
        nextScene: "escena_2_ruta_caudillo",
        logText: "Decidiste confrontar directamente el poder del caudillo en su campamento."
      },
      {
        text: "Buscar registros y hablar con las autoridades eclesiásticas y civiles.",
        alignment: { civilizacion: 10, barbarie: -5 },
        nextScene: "escena_2_ruta_civilizacion",
        logText: "Preferiste indagar la estructura institucional frente al poder de los caudillos."
      },
      {
        text: "Recorrer las tabernas e indagar sobre los métodos de Quiroga.",
        alignment: { civilizacion: 5, barbarie: 5, investigacion: 10 },
        nextScene: "escena_2_ruta_investigacion",
        logText: "Optaste por mantener la neutralidad y recopilar evidencia objetiva."
      }
    ]
  },

  // RUTA A: BARBARIE / EL CAUDILLO
  "escena_2_ruta_caudillo": {
    id: "escena_2_ruta_caudillo",
    background: ASSETS.backgrounds.campamentoGaucho,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Campamento de Los Llanos",
        text: "Fuegos de campamento iluminan los rostros curtidos de las montoneras. Facundo Quiroga está de pie, imponente, observando a su tropa.",
        portraitLeft: ASSETS.portraits.caudillo,
        portraitRight: null
      },
      {
        speaker: "Facundo Quiroga",
        prompt: "Frente a la tropa",
        text: "«En esta tierra no mandan las leyes escritas en papel importado. Manda la fuerza, la lealtad y el coraje de los hombres libres.»",
        portraitLeft: ASSETS.portraits.caudillo,
        portraitRight: null
      },
      {
        speaker: "Rastreador",
        prompt: "Testimonio del campo",
        text: "«Él conoce cada huella del desierto. Nadie puede escapar de su vista ni desobedecer sus órdenes sin pagar el precio.»",
        portraitLeft: ASSETS.portraits.caudillo,
        portraitRight: ASSETS.portraits.rastreador
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Jurar lealtad al caudillo para comprender su liderazgo.",
        alignment: { civilizacion: -10, barbarie: 15 },
        nextScene: "escena_3_convergencia_barranca",
        logText: "Abrazaste la figura de Quiroga como máxima autoridad del territorio."
      },
      {
        text: "Cuestionar su desprecio por las instituciones constitucionales.",
        alignment: { civilizacion: 10, barbarie: -5 },
        nextScene: "escena_3_convergencia_barranca",
        logText: "Confrontaste al caudillo exigiendo respeto por las leyes."
      }
    ]
  },

  // RUTA B: CIVILIZACIÓN
  "escena_2_ruta_civilizacion": {
    id: "escena_2_ruta_civilizacion",
    background: ASSETS.backgrounds.despachoOficial,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Despacho Gubernamental",
        text: "Documentos abandonados y sellos oficiales rotos reflejan la fragilidad de las instituciones frente al avance de los poderes provinciales.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Sarmiento",
        prompt: "Análisis institucional",
        text: "«Sarmiento lo advirtió: donde la escuela y el libro retroceden, triunfa el personalismo del caudillismo.»",
        portraitLeft: null,
        portraitRight: ASSETS.portraits.profesora
      },
      {
        speaker: "Comerciante",
        prompt: "Perspectiva económica",
        text: "«El comercio y el progreso requieren garantías jurídicas, no el arbitrio de un solo hombre, por más fuerte que sea.»",
        portraitLeft: ASSETS.portraits.comerciante,
        portraitRight: ASSETS.portraits.profesora
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Defender la necesidad de una Constitución para organizar el país.",
        alignment: { civilizacion: 15, barbarie: -10 },
        nextScene: "escena_3_convergencia_barranca",
        logText: "Reivindicaste el modelo republicano y la primacía de la ley."
      },
      {
        text: "Reconocer que las leyes letradas ignoraban la realidad de la pampa.",
        alignment: { civilizacion: -5, barbarie: 10 },
        nextScene: "escena_3_convergencia_barranca",
        logText: "Admitiste los límites del proyecto civilizador en el interior profundo."
      }
    ]
  },

  // RUTA C: INVESTIGACIÓN / NEUTRAL
  "escena_2_ruta_investigacion": {
    id: "escena_2_ruta_investigacion",
    background: ASSETS.backgrounds.pulperiaInterior,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Entre dos fuegos",
        text: "En la penumbra de la pulpería se cruzan los discursos: unos ven en Facundo al salvador del federalismo; otros, al tirano del interior.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Rastreador",
        prompt: "Lectura del contexto",
        text: "«Ni tan diablo ni tan santo. Facundo es el resultado de una patria que todavía no sabe lo que quiere ser.»",
        portraitLeft: ASSETS.portraits.rastreador,
        portraitRight: null
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Documentar la contradicción entre el orden del caudillo y el vacío de poder.",
        alignment: { civilizacion: 5, barbarie: 5, investigacion: 15 },
        nextScene: "escena_3_convergencia_barranca",
        logText: "Decidiste registrar el dilema histórico sin tomar partido explícito."
      }
    ]
  },

  // ESCENA 3: CAMINO A BARRANCA YACÓ
  "escena_3_convergencia_barranca": {
    id: "escena_3_convergencia_barranca",
    background: ASSETS.backgrounds.pampaCamino,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "El llamado del norte",
        text: "Año 1835. Un conflicto sacude las provincias del norte y Facundo Quiroga es enviado en una misión pacificadora por orden de Rosas.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Facundo Quiroga",
        prompt: "Desafío al destino",
        text: "«Me advierten que me esperan para matarme en el camino. ¡Pero no ha nacido todavía el hombre que se atreva a matar a Facundo!»",
        portraitLeft: ASSETS.portraits.caudillo,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "El punto de no retorno",
        text: "La galera de Quiroga avanza velozmente por los caminos secos de Córdoba, directo hacia el paraje de Barranca Yacó...",
        portraitLeft: null,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Acompañar la galera hacia el fatal desenlace en Barranca Yacó.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_4_cierre_capitulo2"
      }
    ]
  },

  // ESCENA 4: DESENLACE
  "escena_4_cierre_capitulo2": {
    id: "escena_4_cierre_capitulo2",
    background: ASSETS.backgrounds.barrancaYaco,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Fin del Capítulo 2",
        text: "Las armas disparan y la tragedia se consuma. El hombre cae, pero nace el mito que Sarmiento retratará en las páginas del 'Facundo'.",
        portraitLeft: null,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Finalizar Capítulo 2",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "PANTALLA_FINAL"
      }
    ]
  }
};

/* ===================================================================
   4. CONTROLADORES Y REFERENCIAS DOM
   =================================================================== */

let DOM = {};

function initDOMReferences() {
  DOM = {
    stage: document.getElementById("stage"),
    bgLayer: document.getElementById("bg-layer"),

    hud: document.getElementById("hud"),
    compassCivil: document.getElementById("compass-civil"),
    compassBarbarie: document.getElementById("compass-barbarie"),

    btnHistory: document.getElementById("btn-history"),
    btnSettings: document.getElementById("btn-settings"),

    portraitLeft: document.getElementById("portrait-left"),
    portraitRight: document.getElementById("portrait-right"),

    dialogueBox: document.getElementById("dialogue-box"),
    speakerName: document.getElementById("speaker-name"),
    promptText: document.getElementById("prompt-text"),
    dialogueText: document.getElementById("dialogue-text"),
    choicesContainer: document.getElementById("choices-container"),
    btnContinue: document.getElementById("btn-continue"),

    timerWrap: document.getElementById("timer-wrap"),
    fuseFill: document.getElementById("fuse-fill"),
    timerNum: document.getElementById("timer-num"),

    startScreen: document.getElementById("start-screen"),
    btnStart: document.getElementById("btn-start"),
    endingScreen: document.getElementById("ending-screen"),
    endingTitle: document.getElementById("ending-title"),
    endingDesc: document.getElementById("ending-desc"),
    endingScore: document.getElementById("ending-score"),
    btnRestart: document.getElementById("btn-restart"),

    settingsModal: document.getElementById("settings-modal"),
    closeSettings: document.getElementById("close-settings"),
    textSpeedInput: document.getElementById("text-speed-input"),
    fontFamilySelect: document.getElementById("font-family-select"),
    fontSizeSelect: document.getElementById("font-size-select"),
    btnFullscreen: document.getElementById("btn-fullscreen"),

    historyModal: document.getElementById("history-modal"),
    closeHistory: document.getElementById("close-history"),
    historyLog: document.getElementById("history-log")
  };
}

/* ===================================================================
   5. PERSISTENCIA Y CARGA DE DATOS
   =================================================================== */

function loadProgressFromCap1() {
  try {
    const savedData = localStorage.getItem("facundo-cap1-stats");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (typeof parsed.civilizacion === "number") gameState.civilizacion = parsed.civilizacion;
      if (typeof parsed.barbarie === "number") gameState.barbarie = parsed.barbarie;
    }
  } catch (err) {
    console.warn("No se pudo leer la información del Capítulo 1, iniciando con puntuación base.", err);
  }
}

function saveProgressCap2() {
  try {
    const dataToSave = {
      civilizacion: gameState.civilizacion,
      barbarie: gameState.barbarie,
      investigacion: gameState.investigacion,
      date: new Date().toISOString()
    };
    localStorage.setItem("facundo-cap2-stats", JSON.stringify(dataToSave));
  } catch (err) {
    console.error("Error al guardar progreso del Capítulo 2:", err);
  }
}

/* ===================================================================
   6. LÓGICA DE TEXTO Y TYPEWRITER
   =================================================================== */

function typeWriter(text, onComplete) {
  stopTypeWriter();

  gameState.isTyping = true;
  gameState.currentFullText = text;
  if (DOM.dialogueText) DOM.dialogueText.textContent = "";

  let index = 0;
  const speed = gameState.settings.textSpeed;

  if (speed <= 0) {
    if (DOM.dialogueText) DOM.dialogueText.textContent = text;
    gameState.isTyping = false;
    if (onComplete) onComplete();
    return;
  }

  function step() {
    if (!gameState.isTyping) return;

    if (index < text.length) {
      if (DOM.dialogueText) DOM.dialogueText.textContent += text.charAt(index);
      index++;
      gameState.typingTimeoutId = setTimeout(step, speed);
    } else {
      gameState.isTyping = false;
      if (onComplete) onComplete();
    }
  }

  step();
}

function stopTypeWriter() {
  if (gameState.typingTimeoutId) {
    clearTimeout(gameState.typingTimeoutId);
    gameState.typingTimeoutId = null;
  }
  if (gameState.isTyping) {
    if (DOM.dialogueText) DOM.dialogueText.textContent = gameState.currentFullText;
    gameState.isTyping = false;
  }
}

/* ===================================================================
   7. CONTROL DE ESCENAS Y NARRATIVA
   =================================================================== */

function loadScene(sceneId) {
  const scene = storyData[sceneId];
  if (!scene) {
    console.error(`La escena "${sceneId}" no existe en storyData.`);
    return;
  }

  gameState.currentSceneId = sceneId;
  gameState.dialogueIndex = 0;

  if (scene.background && DOM.bgLayer) {
    DOM.bgLayer.style.backgroundImage = `url('${scene.background}')`;
    DOM.bgLayer.classList.add("active");
  }

  stopTimer();
  renderCurrentDialogue();
}

function renderCurrentDialogue() {
  const scene = storyData[gameState.currentSceneId];
  const dialogue = scene.dialogues[gameState.dialogueIndex];

  if (DOM.choicesContainer) DOM.choicesContainer.innerHTML = "";
  stopTimer();

  if (!dialogue) {
    renderChoices(scene);
    return;
  }

  if (DOM.speakerName) DOM.speakerName.textContent = dialogue.speaker || "";
  if (DOM.promptText) DOM.promptText.textContent = dialogue.prompt || "";

  updatePortrait(DOM.portraitLeft, dialogue.portraitLeft);
  updatePortrait(DOM.portraitRight, dialogue.portraitRight);

  if (DOM.btnContinue) DOM.btnContinue.style.display = "flex";

  addHistoryLog(dialogue.speaker || "Narrador", dialogue.text);
  typeWriter(dialogue.text, null);
}

function updatePortrait(element, imageSrc) {
  if (!element) return;
  if (imageSrc) {
    element.src = imageSrc;
    element.classList.add("show");
  } else {
    element.classList.remove("show");
    element.src = "";
  }
}

/* ===================================================================
   8. DECISIONES Y CONTADOR
   =================================================================== */

function renderChoices(scene) {
  if (DOM.btnContinue) DOM.btnContinue.style.display = "none";
  if (DOM.choicesContainer) DOM.choicesContainer.innerHTML = "";

  if (!scene.choices || scene.choices.length === 0) return;

  if (DOM.speakerName) DOM.speakerName.textContent = "Toma una decisión";
  if (DOM.promptText) DOM.promptText.textContent = "Elige tu postura:";
  if (DOM.dialogueText) DOM.dialogueText.textContent = "";

  scene.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.innerHTML = `<span>${index + 1}. ${choice.text}</span>`;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      makeChoice(choice);
    });

    DOM.choicesContainer.appendChild(btn);
  });

  const timerDuration = scene.timerSeconds || 10;
  startTimer(timerDuration, () => {
    if (scene.choices.length > 0) {
      makeChoice(scene.choices[0]);
    }
  });
}

function makeChoice(choice) {
  stopTimer();

  if (choice.alignment) {
    if (choice.alignment.civilizacion) gameState.civilizacion += choice.alignment.civilizacion;
    if (choice.alignment.barbarie) gameState.barbarie += choice.alignment.barbarie;
    if (choice.alignment.investigacion) gameState.investigacion += choice.alignment.investigacion;

    gameState.civilizacion = Math.max(0, Math.min(100, gameState.civilizacion));
    gameState.barbarie = Math.max(0, Math.min(100, gameState.barbarie));

    updateCompassHUD();
  }

  addHistoryLog("Tu Decisión", choice.logText || choice.text);

  if (choice.nextScene === "PANTALLA_FINAL") {
    saveProgressCap2();
    showEndingScreen();
  } else {
    loadScene(choice.nextScene);
  }
}

function advanceDialogue() {
  if (gameState.isTyping) {
    stopTypeWriter();
    return;
  }

  const scene = storyData[gameState.currentSceneId];
  if (!scene) return;

  if (gameState.dialogueIndex < scene.dialogues.length - 1) {
    gameState.dialogueIndex++;
    renderCurrentDialogue();
  } else {
    gameState.dialogueIndex++;
    renderChoices(scene);
  }
}

/* ===================================================================
   9. TEMPORIZADOR Y HUD
   =================================================================== */

function startTimer(seconds, onTimeout) {
  stopTimer();

  gameState.isTimerActive = true;
  gameState.timerSecondsRemaining = seconds;

  if (DOM.timerWrap) DOM.timerWrap.classList.add("show");
  if (DOM.fuseFill) {
    DOM.fuseFill.style.width = "100%";
    DOM.fuseFill.className = "fuse-fill";
  }
  if (DOM.timerNum) DOM.timerNum.textContent = `${seconds}s`;

  const totalTime = seconds;

  gameState.timerIntervalId = setInterval(() => {
    gameState.timerSecondsRemaining -= 0.1;

    const pct = Math.max(0, (gameState.timerSecondsRemaining / totalTime) * 100);
    if (DOM.fuseFill) DOM.fuseFill.style.width = `${pct}%`;
    if (DOM.timerNum) DOM.timerNum.textContent = `${Math.ceil(gameState.timerSecondsRemaining)}s`;

    if (pct < 50 && pct > 20 && DOM.fuseFill) {
      DOM.fuseFill.className = "fuse-fill warn";
    } else if (pct <= 20 && DOM.fuseFill) {
      DOM.fuseFill.className = "fuse-fill danger";
    }

    if (gameState.timerSecondsRemaining <= 0) {
      stopTimer();
      if (onTimeout) onTimeout();
    }
  }, 100);
}

function stopTimer() {
  if (gameState.timerIntervalId) {
    clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
  gameState.isTimerActive = false;
  if (DOM.timerWrap) DOM.timerWrap.classList.remove("show");
}

function updateCompassHUD() {
  const total = gameState.civilizacion + gameState.barbarie;
  let civilPct = 50;

  if (total > 0) {
    civilPct = Math.round((gameState.civilizacion / total) * 100);
  }
  const barbariePct = 100 - civilPct;

  if (DOM.compassCivil) DOM.compassCivil.style.width = `${civilPct}%`;
  if (DOM.compassBarbarie) DOM.compassBarbarie.style.width = `${barbariePct}%`;
}

function addHistoryLog(speaker, text) {
  if (!DOM.historyLog) return;
  gameState.history.push({ speaker, text });

  const entry = document.createElement("div");
  entry.className = "history-entry";
  entry.style.marginBottom = "8px";
  entry.style.paddingBottom = "6px";
  entry.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

  const speakerTag = speaker ? `<strong style="color: #ffca28;">${speaker}:</strong> ` : "";
  entry.innerHTML = `${speakerTag}${text}`;

  DOM.historyLog.appendChild(entry);
  DOM.historyLog.scrollTop = DOM.historyLog.scrollHeight;
}

/* ===================================================================
   10. PANTALLA FINAL
   =================================================================== */

function showEndingScreen() {
  const civil = gameState.civilizacion;
  const barbarie = gameState.barbarie;
  const investigacion = gameState.investigacion;

  let title = "Capítulo 2 Concluido";
  let desc = "Has presenciado la consolidación del caudillismo en La Rioja y los acontecimientos que conducen a Barranca Yacó.";

  if (investigacion > 10) {
    desc += " Mantuviste una postura neutral e investigativa, analizando el contexto histórico sin juicios absolutos.";
  } else if (civil > barbarie + 10) {
    desc += " Tu enfoque priorizó la visión institucional y la primacía de la ley formal.";
  } else if (barbarie > civil + 10) {
    desc += " Tu enfoque comprendió el liderazgo del caudillo y la realidad de los llanos.";
  }

  if (DOM.endingTitle) DOM.endingTitle.textContent = title;
  if (DOM.endingDesc) DOM.endingDesc.textContent = desc;
  if (DOM.endingScore) DOM.endingScore.textContent = `Alineación final — Civilización: ${civil}% | Barbarie: ${barbarie}% | Análisis: ${investigacion} pts`;

  if (DOM.endingScreen) DOM.endingScreen.classList.add("active");
}

/* ===================================================================
   11. ASIGNACIÓN DE EVENTOS E INICIALIZACIÓN
   =================================================================== */

function openModal(modal) { if (modal) modal.classList.remove("hidden"); }
function closeModal(modal) { if (modal) modal.classList.add("hidden"); }

function applyTypographySettings() {
  document.body.className = `${gameState.settings.fontFamily}`;
  if (DOM.dialogueText) DOM.dialogueText.className = `dialogue-text ${gameState.settings.fontSize}`;
}

function startGameplay() {
  if (DOM.startScreen) {
    DOM.startScreen.classList.remove("active");
    DOM.startScreen.style.display = "none";
  }
  if (DOM.hud) DOM.hud.classList.add("show");
  loadScene("escena_1_llegada_larioja");
}

function bindEvents() {
  if (DOM.btnStart) {
    DOM.btnStart.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      startGameplay();
    });
  }

  if (DOM.btnContinue) {
    DOM.btnContinue.addEventListener("click", (e) => {
      e.stopPropagation();
      advanceDialogue();
    });
  }

  if (DOM.dialogueBox) {
    DOM.dialogueBox.addEventListener("click", () => {
      if (DOM.choicesContainer && DOM.choicesContainer.children.length === 0) {
        advanceDialogue();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      if (e.target.tagName !== "SELECT" && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        const isStartActive = DOM.startScreen && (DOM.startScreen.classList.contains("active") || DOM.startScreen.style.display !== "none");
        const isSettingsHidden = !DOM.settingsModal || DOM.settingsModal.classList.contains("hidden");
        const isHistoryHidden = !DOM.historyModal || DOM.historyModal.classList.contains("hidden");

        if (!isStartActive && isSettingsHidden && isHistoryHidden) {
          advanceDialogue();
        }
      }
    }
  });

  if (DOM.btnRestart) {
    DOM.btnRestart.addEventListener("click", () => {
      loadProgressFromCap1();
      gameState.history = [];
      if (DOM.historyLog) DOM.historyLog.innerHTML = "";
      updateCompassHUD();

      if (DOM.endingScreen) DOM.endingScreen.classList.remove("active");
      loadScene("escena_1_llegada_larioja");
    });
  }

  if (DOM.btnSettings) DOM.btnSettings.addEventListener("click", () => openModal(DOM.settingsModal));
  if (DOM.closeSettings) DOM.closeSettings.addEventListener("click", () => closeModal(DOM.settingsModal));

  if (DOM.btnHistory) DOM.btnHistory.addEventListener("click", () => openModal(DOM.historyModal));
  if (DOM.closeHistory) DOM.closeHistory.addEventListener("click", () => closeModal(DOM.historyModal));

  if (DOM.textSpeedInput) {
    DOM.textSpeedInput.addEventListener("input", (e) => {
      gameState.settings.textSpeed = 85 - parseInt(e.target.value, 10);
    });
  }

  if (DOM.fontFamilySelect) {
    DOM.fontFamilySelect.addEventListener("change", (e) => {
      gameState.settings.fontFamily = e.target.value;
      applyTypographySettings();
    });
  }

  if (DOM.fontSizeSelect) {
    DOM.fontSizeSelect.addEventListener("change", (e) => {
      gameState.settings.fontSize = e.target.value;
      applyTypographySettings();
    });
  }

  if (DOM.btnFullscreen) {
    DOM.btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error de pantalla completa: ${err.message}`);
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
  }
}

function init() {
  console.log("Inicializando script.js - Capítulo 2...");
  initDOMReferences();
  loadProgressFromCap1();
  bindEvents();
  updateCompassHUD();
  applyTypographySettings();
}

// Ejecutar al cargar la estructura del DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}