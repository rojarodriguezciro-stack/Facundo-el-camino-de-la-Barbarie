/**
 * ===================================================================
 * FACUNDO: CIVILIZACIÓN O BARBARIE
 * Capítulo 1: Biografía e Infancia de Facundo Quiroga
 * Motor Narrativo Interactivo, Historial Unificado y UI de Decisiones
 * Archivo: script.js
 * ===================================================================
 */

"use strict";

/* ===================================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN (STATE MANAGEMENT)
   =================================================================== */

const gameState = {
  // Puntuación de alineación
  civilizacion: 50,
  barbarie: 50,

  // Estado narrativo
  currentSceneId: "escena_1_camino_sanjuan",
  dialogueIndex: 0,
  isTimerActive: false,
  timerSecondsRemaining: 0,
  timerIntervalId: null,

  // Registros
  history: [], // Guarda diálogos y decisiones para el modal de Historial

  // Ajustes de la interfaz
  settings: {
    fontFamily: "font-serif",
    fontSize: "text-md",
    textSpeed: 30 // ms por carácter
  },

  // Control de animación mecanografiada
  isTyping: false,
  typingTimeoutId: null,
  currentFullText: ""
};

/* ===================================================================
   2. RECURSOS GRÁFICOS (ASSETS MAP CON RUTA EXACTA Y ENCODING)
   =================================================================== */

const ASSETS = {
  backgrounds: {
    pampaCamino: "RecursosGraficos/pampa%20camino.png",
    pampaCaminoJpg: "RecursosGraficos/pampa%20camino.jpg",
    pulperiaExterior: "RecursosGraficos/pulperia%20exterior.jpg",
    pulperiaInterior: "RecursosGraficos/pulperia%20interior.jpg",
    pulperiaMostrador: "RecursosGraficos/pulperia%20mostrador.jpg",
    escuela: "RecursosGraficos/escuela.png",
    escenarioViveros: "RecursosGraficos/escenario%20de%20viveros.png"
  },
  portraits: {
    profesora: "RecursosGraficos/profesora.png",
    facundoNino: "RecursosGraficos/facundo%20ni%C3%B1o.png",
    facundoJoven: "RecursosGraficos/facundo%20joven.png",
    cantinero: "RecursosGraficos/cantinero.png",
    cantineroJoven: "RecursosGraficos/cantinero%20joven.png",
    caudillo: "RecursosGraficos/caudillo.png",
    comerciante: "RecursosGraficos/comerciante.png",
    rastreador: "RecursosGraficos/rastreador.png"
  }
};

/* ===================================================================
   3. ESTRUCTURA NARRATIVA (GUION OFICIAL DEL CAPÍTULO 1)
   =================================================================== */

const storyData = {
  // --- ESCENA 1: EL CAMINO DE SAN JUAN ---
  "escena_1_camino_sanjuan": {
    id: "escena_1_camino_sanjuan",
    background: ASSETS.backgrounds.pampaCamino,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Camino a San Juan",
        text: "El viento de la llanura trae rumores inquietantes mientras recorres los polvorientos caminos de San Juan.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Rumores de la Pampa",
        text: "Dicen que el 'Tigre de los Llanos' avanza sin detenerse. La gente murmura, algunos con terror, otros con reverencia.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Buscando respuestas",
        text: "Has llegado a una vieja pulpería buscando respuestas sobre el pasado de Facundo.",
        portraitLeft: null,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Avanzar hacia las inmediaciones de la pulpería.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_2_pulperia_exterior"
      }
    ]
  },

  // --- ESCENA 2: EXTERIOR DE LA PULPERÍA ---
  "escena_2_pulperia_exterior": {
    id: "escena_2_pulperia_exterior",
    background: ASSETS.backgrounds.pulperiaExterior,
    dialogues: [
      {
        speaker: "",
        prompt: "Llegada al refugio",
        text: "Con el paso de los años, los caminos y las pulperías se convierten en lugares habituales de encuentro.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "",
        prompt: "El centro social de la pampa",
        text: "Allí circulan noticias, rumores y oportunidades.",
        portraitLeft: null,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Entrar a la pulpería para hablar con los lugareños.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_3_interior_pulperia"
      },
      {
        text: "Recordar lo que contaba la vieja maestra sobre la infancia de Facundo.",
        alignment: { civilizacion: 5, barbarie: 0 },
        nextScene: "escena_4_recuerdo_escuela"
      }
    ]
  },

  // --- ESCENA 3: INTERIOR DE LA PULPERÍA Y EL CANTINERO ---
  "escena_3_interior_pulperia": {
    id: "escena_3_interior_pulperia",
    background: ASSETS.backgrounds.pulperiaInterior,
    dialogues: [
      {
        speaker: "",
        prompt: "Dentro de la pulpería",
        text: "Dentro de la pulpería, el ambiente es distinto.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "",
        prompt: "Ambiente criollo",
        text: "Hombres conversan alrededor de las mesas mientras el ruido de las cartas y las voces llena el lugar.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Cantinero",
        prompt: "En el mostrador",
        text: "El cantinero se acerca al mostrador y te observa durante unos segundos.",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      },
      {
        speaker: "Cantinero",
        prompt: "Mostrador",
        text: "Acá todos parecen conocer a Facundo. ¿Facundo? Sí. Ese muchacho no pasa desapercibido.",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      },
      {
        speaker: "Cantinero",
        prompt: "Mostrador",
        text: "¿Por qué? Porque tiene algo que los demás no tienen. Cuando entra a un lugar, todos lo miran.",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "¿Qué tiene de diferente?",
        alignment: { civilizacion: 10, barbarie: 0 },
        nextScene: "escena_3_respuesta_diferente",
        logText: "Preguntaste al cantinero qué hacía diferente a Facundo."
      },
      {
        text: "No parece alguien en quien confiar.",
        alignment: { civilizacion: -5, barbarie: 10 },
        nextScene: "escena_3_respuesta_confiar",
        logText: "Expresaste desconfianza hacia la figura de Facundo."
      },
      {
        text: "Quizás simplemente sabe hacerse notar.",
        alignment: { civilizacion: 5, barbarie: 5 },
        nextScene: "escena_3_respuesta_notar",
        logText: "Sugeriste que Facundo simplemente posee un carisma natural."
      }
    ]
  },

  "escena_3_respuesta_diferente": {
    id: "escena_3_respuesta_diferente",
    background: ASSETS.backgrounds.pulperiaInterior,
    dialogues: [
      {
        speaker: "Cantinero",
        prompt: "Confidencia",
        text: "El cantinero baja la voz antes de responder. Parece pensar cuidadosamente lo que va a decir...",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Echar la vista atrás y recordar sus primeros años escolares.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_4_recuerdo_escuela"
      }
    ]
  },

  "escena_3_respuesta_confiar": {
    id: "escena_3_respuesta_confiar",
    background: ASSETS.backgrounds.pulperiaInterior,
    dialogues: [
      {
        speaker: "Cantinero",
        prompt: "Silencio tenso",
        text: "El cantinero te observa en silencio. Después asiente lentamente, como si hubiera escuchado esa opinión antes.",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Echar la vista atrás y recordar sus primeros años escolares.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_4_recuerdo_escuela"
      }
    ]
  },

  "escena_3_respuesta_notar": {
    id: "escena_3_respuesta_notar",
    background: ASSETS.backgrounds.pulperiaInterior,
    dialogues: [
      {
        speaker: "Cantinero",
        prompt: "Gesto sutil",
        text: "El cantinero sonríe apenas. Quizás no sea tan sencillo entender a un hombre como Facundo.",
        portraitLeft: ASSETS.portraits.cantinero,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Echar la vista atrás y recordar sus primeros años escolares.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_4_recuerdo_escuela"
      }
    ]
  },

  // --- ESCENA 4: RECUERDO DE LA ESCUELA Y LA MAESTRA ---
  "escena_4_recuerdo_escuela": {
    id: "escena_4_recuerdo_escuela",
    background: ASSETS.backgrounds.escuela,
    dialogues: [
      {
        speaker: "Maestra (Recuerdo)",
        prompt: "Escuela de San Juan",
        text: "«¿Facundo? Ah... ese niño era un torbellino indomable», te cuenta la vieja maestra de San Juan.",
        portraitLeft: null,
        portraitRight: ASSETS.portraits.profesora
      },
      {
        speaker: "Maestra (Recuerdo)",
        prompt: "Escuela de San Juan",
        text: "«No había disciplina que lo contuviera. Su espíritu era el de la pampa misma: salvaje, reacio a las normas de la civilización.»",
        portraitLeft: null,
        portraitRight: ASSETS.portraits.profesora
      },
      {
        speaker: "Narrador",
        prompt: "Infancia indómita",
        text: "Incluso de pequeño, su mirada tenía la fiereza de una fiera acorralada.",
        portraitLeft: ASSETS.portraits.facundoNino,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Rebeldía",
        text: "Se rebelaba contra los castigos, prefería el rigor de la intemperie a las paredes cerradas del aula.",
        portraitLeft: ASSETS.portraits.facundoNino,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Seguir el rastro de su juventud hacia los viñedos.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_5_juventud_viveros"
      }
    ]
  },

  // --- ESCENA 5: JUVENTUD ENTRE VIÑEDOS ---
  "escena_5_juventud_viveros": {
    id: "escena_5_juventud_viveros",
    background: ASSETS.backgrounds.escenarioViveros,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Los años en el campo",
        text: "Con el tiempo, el niño se hizo joven entre los viñedos y los campos de la provincia.",
        portraitLeft: ASSETS.portraits.facundoJoven,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Líder natural",
        text: "El campo le enseñó lo que la escuela no pudo. Forjó su carácter al sol, rodeado de gauchos y peones que pronto verían en él a un líder natural.",
        portraitLeft: ASSETS.portraits.facundoJoven,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Indagar sobre su relación con el juego y las apuestas.",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "escena_6_pasion_juego"
      }
    ]
  },

  // --- ESCENA 6: LA PASIÓN POR EL JUEGO Y EL RIESGO ---
  "escena_6_pasion_juego": {
    id: "escena_6_pasion_juego",
    background: ASSETS.backgrounds.pulperiaMostrador,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Análisis de Sarmiento",
        text: "Durante su juventud, Facundo desarrolla una fuerte pasión por el juego.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Análisis de Sarmiento",
        text: "Para Sarmiento, esa pasión no era solamente una diversión: representaba una parte de su carácter impulsivo y de su necesidad de asumir riesgos.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Facundo",
        prompt: "Enfrentando la decisión",
        text: "Cuando uno tiene que elegir entre quedarse quieto o arriesgarse... Yo ya sé qué camino tomaría.",
        portraitLeft: ASSETS.portraits.facundoJoven,
        portraitRight: null
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Arriesgarse puede abrir nuevos caminos.",
        alignment: { civilizacion: -5, barbarie: 10 },
        nextScene: "escena_7_reflexion_destino",
        logText: "Dijiste a Facundo que arriesgarse abre nuevos caminos."
      },
      {
        text: "No todo riesgo vale la pena.",
        alignment: { civilizacion: 10, barbarie: -5 },
        nextScene: "escena_7_reflexion_destino",
        logText: "Aconsejaste cautela frente a los riesgos innecesarios."
      },
      {
        text: "Primero hay que pensar en las consecuencias.",
        alignment: { civilizacion: 5, barbarie: 0 },
        nextScene: "escena_7_reflexion_destino",
        logText: "Señalaste la necesidad de sopesar las consecuencias."
      }
    ]
  },

  // --- ESCENA 7: REFLEXIÓN FINAL Y RUMBO A LA RIOJA ---
  "escena_7_reflexion_destino": {
    id: "escena_7_reflexion_destino",
    background: ASSETS.backgrounds.pampaCamino,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Paso del tiempo",
        text: "Los años de juventud van quedando atrás. El niño que se enfrentaba a su maestro ya no existe.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Rasgos permanentes",
        text: "Pero algunas características permanecen: Su orgullo. Su independencia. Su voluntad. Su dificultad para aceptar límites.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Protagonista",
        prompt: "Interrogante histórico",
        text: "Entonces... ¿ya estaba destinado a convertirse en caudillo?",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "La encrucijada de Sarmiento",
        text: "Esa es precisamente la pregunta. Sarmiento intenta encontrar en la juventud de Facundo las raíces del hombre que aparecerá después en la historia.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "La encrucijada de Sarmiento",
        text: "Pero conocer sus primeros años no significa que podamos reducir toda su vida a ellos.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Facundo",
        prompt: "El futuro inmediato",
        text: "El camino recién empieza.",
        portraitLeft: ASSETS.portraits.facundoJoven,
        portraitRight: null
      }
    ],
    timerSeconds: 10,
    choices: [
      {
        text: "Voy a acompañarlo.",
        alignment: { civilizacion: -5, barbarie: 10 },
        nextScene: "escena_8_cierre_capitulo",
        logText: "Decidiste acercarte a Facundo y conocer de cerca su mundo."
      },
      {
        text: "Voy a observarlo desde lejos.",
        alignment: { civilizacion: 5, barbarie: 0 },
        nextScene: "escena_8_cierre_capitulo",
        logText: "Preferiste mantener cierta distancia de observación."
      },
      {
        text: "Quiero entender qué hay detrás de él.",
        alignment: { civilizacion: 10, barbarie: 0 },
        nextScene: "escena_8_cierre_capitulo",
        logText: "Buscaste investigar las circunstancias que forman al caudillo."
      }
    ]
  },

  // --- ESCENA 8: CIERRE DEL CAPÍTULO 1 ---
  "escena_8_cierre_capitulo": {
    id: "escena_8_cierre_capitulo",
    background: ASSETS.backgrounds.pampaCamino,
    dialogues: [
      {
        speaker: "Narrador",
        prompt: "Avanzando en la historia",
        text: "Facundo todavía no es el caudillo que la historia recordará.",
        portraitLeft: null,
        portraitRight: null
      },
      {
        speaker: "Narrador",
        prompt: "Destino final del capítulo",
        text: "Pero el camino hacia ese hombre ya comenzó. Y el próximo destino será La Rioja.",
        portraitLeft: null,
        portraitRight: null
      }
    ],
    choices: [
      {
        text: "Finalizar Capítulo 1",
        alignment: { civilizacion: 0, barbarie: 0 },
        nextScene: "PANTALLA_FINAL"
      }
    ]
  }
};

/* ===================================================================
   4. ELEMENTOS DEL DOM (REFERENCIAS DIRECTAS)
   =================================================================== */

const DOM = {
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

/* ===================================================================
   5. EFECTO MECANOGRAFIADO (TYPEWRITER)
   =================================================================== */

function typeWriter(text, onComplete) {
  stopTypeWriter();

  gameState.isTyping = true;
  gameState.currentFullText = text;
  DOM.dialogueText.textContent = "";

  let index = 0;
  const speed = gameState.settings.textSpeed;

  if (speed <= 0) {
    DOM.dialogueText.textContent = text;
    gameState.isTyping = false;
    if (onComplete) onComplete();
    return;
  }

  function step() {
    if (!gameState.isTyping) return;

    if (index < text.length) {
      DOM.dialogueText.textContent += text.charAt(index);
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
    DOM.dialogueText.textContent = gameState.currentFullText;
    gameState.isTyping = false;
  }
}

/* ===================================================================
   6. CONTROL Y RENDERIZADO DE ESCENAS Y DIÁLOGOS
   =================================================================== */

function loadScene(sceneId) {
  const scene = storyData[sceneId];

  if (!scene) {
    console.error(`Escena no encontrada: ${sceneId}`);
    return;
  }

  gameState.currentSceneId = sceneId;
  gameState.dialogueIndex = 0;

  if (scene.background) {
    DOM.bgLayer.style.backgroundImage = `url('${scene.background}')`;
    DOM.bgLayer.classList.add("active");
  }

  stopTimer();
  renderCurrentDialogue();
}

function renderCurrentDialogue() {
  const scene = storyData[gameState.currentSceneId];
  const dialogue = scene.dialogues[gameState.dialogueIndex];

  DOM.choicesContainer.innerHTML = "";
  stopTimer();

  if (!dialogue) {
    renderChoices(scene);
    return;
  }

  DOM.speakerName.textContent = dialogue.speaker || "";
  DOM.promptText.textContent = dialogue.prompt || "";

  updatePortrait(DOM.portraitLeft, dialogue.portraitLeft);
  updatePortrait(DOM.portraitRight, dialogue.portraitRight);

  DOM.btnContinue.style.display = "flex";

  // REGISTRO AUTOMÁTICO DE TODOS LOS DIÁLOGOS EN EL HISTORIAL
  addHistoryLog(dialogue.speaker || "Narrador", dialogue.text);

  typeWriter(dialogue.text, null);
}

function updatePortrait(element, imageSrc) {
  if (imageSrc) {
    element.src = imageSrc;
    element.classList.add("show");
  } else {
    element.classList.remove("show");
    element.src = "";
  }
}

/* ===================================================================
   7. MANEJO DE OPCIONES Y CONTADOR PROLOGADO
   =================================================================== */

function renderChoices(scene) {
  DOM.btnContinue.style.display = "none";
  DOM.choicesContainer.innerHTML = "";

  if (!scene.choices || scene.choices.length === 0) return;

  DOM.speakerName.textContent = "Toma una decisión";
  DOM.promptText.textContent = "Elige tu respuesta:";
  DOM.dialogueText.textContent = "";

  scene.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.innerHTML = `<span>${index + 1}. ${choice.text}</span> <span></span>`;

    btn.addEventListener("click", () => {
      makeChoice(choice);
    });

    DOM.choicesContainer.appendChild(btn);
  });

  // SIEMPRE QUE HAYA DECISIONES SE ACTIVA EL CONTADOR COMO EN EL PRÓLOGO
  const timerDuration = scene.timerSeconds || 10;
  startTimer(timerDuration, () => {
    // Al vencer el contador, selecciona la primera opción automáticamente
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

    gameState.civilizacion = Math.max(0, Math.min(100, gameState.civilizacion));
    gameState.barbarie = Math.max(0, Math.min(100, gameState.barbarie));

    updateCompassHUD();
  }

  // REGISTRO DE LA DECISIÓN TOMADA EN EL HISTORIAL
  addHistoryLog("Tu Decisión", choice.logText || choice.text);

  if (choice.nextScene === "PANTALLA_FINAL") {
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
   8. SISTEMA DE TEMPORIZADOR
   =================================================================== */

function startTimer(seconds, onTimeout) {
  stopTimer();

  gameState.isTimerActive = true;
  gameState.timerSecondsRemaining = seconds;

  DOM.timerWrap.classList.add("show");
  DOM.fuseFill.style.width = "100%";
  DOM.fuseFill.className = "fuse-fill";
  DOM.timerNum.textContent = `${seconds}s`;

  const totalTime = seconds;

  gameState.timerIntervalId = setInterval(() => {
    gameState.timerSecondsRemaining -= 0.1;

    const pct = Math.max(0, (gameState.timerSecondsRemaining / totalTime) * 100);
    DOM.fuseFill.style.width = `${pct}%`;
    DOM.timerNum.textContent = `${Math.ceil(gameState.timerSecondsRemaining)}s`;

    if (pct < 50 && pct > 20) {
      DOM.fuseFill.className = "fuse-fill warn";
    } else if (pct <= 20) {
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
  DOM.timerWrap.classList.remove("show");
}

/* ===================================================================
   9. HUD E HISTORIAL COMPLETO DE LA HISTORIA
   =================================================================== */

function updateCompassHUD() {
  const total = gameState.civilizacion + gameState.barbarie;
  let civilPct = 50;

  if (total > 0) {
    civilPct = Math.round((gameState.civilizacion / total) * 100);
  }

  const barbariePct = 100 - civilPct;

  DOM.compassCivil.style.width = `${civilPct}%`;
  DOM.compassBarbarie.style.width = `${barbariePct}%`;
}

/**
 * Agrega cada línea de diálogo e interacción al Modal de Historial
 */
function addHistoryLog(speaker, text) {
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
   10. PANTALLA FINAL Y EVALUACIÓN
   =================================================================== */

function showEndingScreen() {
  const civil = gameState.civilizacion;
  const barbarie = gameState.barbarie;

  let title = "Capítulo 1 Concluido";
  let desc = "Has explorado la infancia y juventud de Facundo Quiroga, comprendiendo las raíces del futuro caudillo.";

  if (civil > barbarie + 10) {
    desc += " Tu enfoque priorizó el análisis crítico de la educación y el orden civilizador.";
  } else if (barbarie > civil + 10) {
    desc += " Tu enfoque sintonizó con la fuerza de la tierra, la pasión y el espíritu del gaucho.";
  }

  DOM.endingTitle.textContent = title;
  DOM.endingDesc.textContent = desc;
  DOM.endingScore.textContent = `Alineación final — Civilización: ${civil}% | Barbarie: ${barbarie}%`;

  DOM.endingScreen.classList.add("active");
}

/* ===================================================================
   11. MODALES Y EVENTOS
   =================================================================== */

function openModal(modal) { modal.classList.remove("hidden"); }
function closeModal(modal) { modal.classList.add("hidden"); }

function applyTypographySettings() {
  document.body.className = `${gameState.settings.fontFamily}`;
  DOM.dialogueText.className = `dialogue-text ${gameState.settings.fontSize}`;
}

function bindEvents() {
  DOM.btnContinue.addEventListener("click", (e) => {
    e.stopPropagation();
    advanceDialogue();
  });

  DOM.dialogueBox.addEventListener("click", () => {
    if (DOM.choicesContainer.children.length === 0) {
      advanceDialogue();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      if (e.target.tagName !== "SELECT" && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        if (!DOM.startScreen.classList.contains("active") &&
            DOM.settingsModal.classList.contains("hidden") &&
            DOM.historyModal.classList.contains("hidden")) {
          advanceDialogue();
        }
      }
    }
  });

  DOM.btnStart.addEventListener("click", () => {
    DOM.startScreen.classList.remove("active");
    DOM.hud.classList.add("show");
    loadScene("escena_1_camino_sanjuan");
  });

  DOM.btnRestart.addEventListener("click", () => {
    gameState.civilizacion = 50;
    gameState.barbarie = 50;
    gameState.history = [];
    DOM.historyLog.innerHTML = "";
    updateCompassHUD();

    DOM.endingScreen.classList.remove("active");
    loadScene("escena_1_camino_sanjuan");
  });

  // Ajustes de Configuración
  DOM.btnSettings.addEventListener("click", () => openModal(DOM.settingsModal));
  DOM.closeSettings.addEventListener("click", () => closeModal(DOM.settingsModal));

  DOM.btnHistory.addEventListener("click", () => openModal(DOM.historyModal));
  DOM.closeHistory.addEventListener("click", () => closeModal(DOM.historyModal));

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
          console.error(`Error al activar pantalla completa: ${err.message}`);
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
  }
}

function init() {
  console.log("Cargando Capítulo 1: Biografía e Infancia...");
  bindEvents();
  updateCompassHUD();
  applyTypographySettings();
}

document.addEventListener("DOMContentLoaded", init);