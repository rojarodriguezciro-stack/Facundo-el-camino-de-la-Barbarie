/* ===================================================================
   FACUNDO — CIVILIZACIÓN O BARBARIE
   Lógica del Juego & Control de Interfaz de Usuario
   =================================================================== */

/* --- 1. CONTENIDO Y CONFIGURACIÓN DE ESCENAS --- */

const BG = {
  pampa: 'imagenes/pampa-camino.jpg',
  pulperiaExt: 'imagenes/pulperia-exterior.jpg',
  mostrador: 'imagenes/pulperia-mostrador.jpg',
  interior: 'imagenes/pulperia-interior.jpg'
};

const PORTRAIT = {
  cantinero: 'imagenes/cantinero.png',
  rastreador: 'imagenes/rastreador.png',
  comerciante: 'imagenes/comerciante.png',
  caudillo: 'imagenes/caudillo.png'
};

const PROLOGO_LINES = [
  'Hace tiempo atrás una historia fue contada, una historia contada por la civilización, una historia nacida en la barbarie.',
  'Desde siempre la gente de la ciudad vivía en la luz del progreso, armada de razón y ley.',
  'Desde siempre la gente del campo vivía en la oscuridad de la fortaleza, armada solo de violencia y voluntad.',
  'Ambos mundos chocaban inevitablemente. Guerra, fortuna, odio. El abismo crecía.',
  'Esta es la historia de Facundo.'
];

const INTRO_LINES = [
  'Argentina, 1820.',
  'La pampa infinita se extiende sin límites, sin ley, sin orden.',
  'Sos un gaucho que abandonó su pueblo, buscando fortuna o escape.',
  'Pero en estos tiempos de guerra civil, la neutralidad no existe.',
  'Todos deben elegir: ¿civilización o barbarie?'
];

const LLEGADA_LINES = [
  'Al caer la noche, las luces de una pulpería asoman en el camino.'
];

const CANTINERO_LINES = [
  '¿Nuevo por aquí? La vida en la pampa es dura, gaucho.',
  'Aquí, en la pulpería, los hombres vienen a olvidar sus penas... a jugar, a beber, a escapar de lo que son.',
  '¿Qué te trae a estos parajes? ¿Qué buscás realmente?'
];

const CANTINERO_CIVIL_NEUTRAL_LINES = [
  'Trabajo hay, claro. Las estancias siempre buscan peones.',
  'Es labor dura, pero es labor. Al menos dormís sabiendo quién sos.',
  'Aquí, en la pulpería, los hombres pierden eso cada noche.'
];

const CANTINERO_BARBARIE_LINES = [
  'Ah, la ambición. He visto esa mirada muchas veces en estos ojos.',
  'La ambición tiene un costo muy alto, gaucho. ¿Sabés cuál es?',
  'Que cada hombre que pisoteás para subir, te va a buscar cuando caigas. Y todos caen.'
];

const ROUTE_CONFIG = {
  civil: {
    speaker: 'Juan — El Rastreador',
    portrait: PORTRAIT.rastreador,
    lines: [
      'Te vengo siguiendo hace días, gaucho.',
      'Vos sos el que eligió trabajo en la estancia, ¿no? Eso es raro en estos tiempos. La mayoría elige lo fácil.',
      'Mi nombre es Juan. Lideramos una partida que trae justicia a estos parajes.',
      'La ley oficial es débil. Alguien tiene que hacerlo. ¿Te gustaría ser ese alguien?'
    ],
    decisionOptions: [
      { label: 'Acepto. Voy con ustedes.', civil: 20, flavor: 'Le tendés la mano a Juan. El pacto está hecho: la ley cabalga con vos, ahora.' },
      { label: 'Prefiero mi propio destino. Voy solo.', flavor: 'Juan se encoge de humbros. «Como quieras. El camino solitario también es un camino.»' },
      { label: 'Déjame pensarlo.', flavor: 'Juan asiente despacio. «Pensalo. Pero no tardes demasiado: en esta tierra, la duda también elige por vos.»' }
    ]
  },
  neutral: {
    speaker: 'El Comerciante',
    portrait: PORTRAIT.comerciante,
    lines: [
      'Mirá qué suerte encontrarte por acá.',
      'Escuché que andás buscando fortuna, no trabajo de peón. Yo también busco dinero. Mucho dinero.',
      'Tengo un negocio: transportar mercancía desde Córdoba hasta Buenos Aires. Las ganancias son enormes. Pero también lo son los riesgos.',
      'Bandidos, jueces corruptos, el camino mismo quiere matarte. ¿Querés ser mi socio? Cincuenta y cincuenta.'
    ],
    decisionOptions: [
      { label: 'Acepto. Voy con ustedes.', barbarie: 20, flavor: 'Cerrás el trato con el comerciante. Cincuenta y cincuenta. El camino a Buenos Aires te espera, con todo lo que trae.' },
      { label: 'Prefiero mi propio destino. Voy solo.', flavor: 'El comerciante suspira. «Tu pérdida. La fortuna no toca dos veces la misma puerta.»' },
      { label: 'Déjame pensarlo.', flavor: 'El comerciante sonríe apretado. «Tomate tu tiempo... pero las buenas ofertas no esperan, amigo.»' }
    ]
  },
  barbarie: {
    speaker: 'Facundo',
    portrait: PORTRAIT.caudillo,
    lines: [
      'Así que buscás poder, ¿eh? Te lo veo en los ojos.',
      'Los que buscan poder son los únicos que entienden esta tierra.',
      'Soy Facundo. Junto hombres como vos para construir algo más grande que nosotros. Una fuerza que las ciudades no puedan ignorar.',
      'Pero te digo claro: la sangre corre. ¿Tenés el coraje para lo que viene?'
    ],
    decisionOptions: [
      { label: 'Acepto. Voy con ustedes.', barbarie: 20, flavor: 'Le tendés la mano a Facundo. El pacto está hecho: ahora cabalgás con él, hacia lo que sea que los espere.' },
      { label: 'Prefiero mi propio destino. Voy solo.', flavor: 'Facundo ríe, seco. «Solo, en esta tierra, no llegás lejos. Pero allá vos.»' },
      { label: 'Déjame pensarlo.', flavor: 'Facundo te mira fijo, sin parpadear. «Pensalo. Pero recordá: en esta tierra, el que duda, ya perdió.»' }
    ]
  }
};

const ENDINGS = {
  civil: {
    title: 'El héroe perdido',
    cls: 'civil',
    body: [
      'Años después, tu nombre aparece en viejos registros de la época.',
      'Fuiste honrado. Fuiste justo. Cumpliste tu palabra.',
      'Pero cuando Facundo y Rosas escribieron su historia de sangre, vos ya habías desaparecido en los pliegos de la barbarie.',
      'Sin gloria. Sin marca en la gran historia.',
      'Tu legado es el silencio.'
    ]
  },
  barbarie: {
    title: 'El caudillo implacable',
    cls: 'barbarie',
    body: [
      'Alcanzaste el poder que buscabas.',
      'Hombres te seguían. Ciudades temblaban ante tu nombre.',
      'Pero cada victoria costó vidas. Cada gloria, sangre derramada.',
      'Diez años después, caíste asesinado en un camino solitario.',
      'Como tantos otros caudillos que creyeron que la fuerza era suficiente.',
      'Tu legado es la barbarie que dejaste atrás.'
    ]
  },
  gris: {
    title: 'El camino gris',
    cls: 'gris',
    body: [
      'Viviste entre mundos.',
      'Ni completamente civilizado, ni verdaderamente salvaje.',
      'Tomaste lo que necesitabas de cada lado.',
      'Quizás ese fue el verdadero camino.',
      'Sobreviviste. No conquistaste imperios, pero tampoco moriste en batalla.',
      'En un país de extremos, los grises rara vez son recordados. Pero sobreviven.'
    ]
  }
};

/* --- 2. ESTADO GENERAL Y ELEMENTOS DEL DOM --- */

const state = {
  civil: 0,
  barbarie: 0,
  path: null,
  history: [],
  settings: {
    textSpeedVal: 25,
    textSize: 'text-md',
    fontFamily: 'serif'
  }
};

const dom = {
  bgA: document.getElementById('bgA'),
  bgB: document.getElementById('bgB'),
  portrait: document.getElementById('portrait'),
  hud: document.getElementById('hud'),
  compassCivil: document.getElementById('compassCivil'),
  compassBarbarie: document.getElementById('compassBarbarie'),
  timerWrap: document.getElementById('timerWrap'),
  fuseFill: document.getElementById('fuseFill'),
  timerNum: document.getElementById('timerNum'),
  nameplate: document.getElementById('nameplate'),
  promptText: document.getElementById('promptText'),
  dialogueText: document.getElementById('dialogueText'),
  choices: document.getElementById('choices'),
  continueRow: document.getElementById('continueRow'),
  continueBtn: document.getElementById('continueBtn'),
  dialogueBox: document.getElementById('dialogueBox'),
  startScreen: document.getElementById('startScreen'),
  startBtn: document.getElementById('startBtn'),
  stage: document.getElementById('stage'),

  btnSettings: document.getElementById('btnSettings'),
  btnHistory: document.getElementById('btnHistory'),
  modalSettings: document.getElementById('modalSettings'),
  modalHistory: document.getElementById('modalHistory'),
  closeSettings: document.getElementById('closeSettings'),
  closeHistory: document.getElementById('closeHistory'),
  historyLog: document.getElementById('historyLog'),
  sliderSpeed: document.getElementById('sliderSpeed'),
  selectTextSize: document.getElementById('selectTextSize'),
  selectFontFamily: document.getElementById('selectFontFamily'),
  btnToggleFullscreen: document.getElementById('btnToggleFullscreen')
};

let typingTimer = null;
let isTyping = false;
let currentFullText = '';
let onTypeDone = null;
let countdownTimer = null;
let isWaitingForChoice = false;

let currentPortraitUrl = null;

/* --- 3. PERSISTENCIA EN LOCALSTORAGE Y AJUSTES --- */

function saveSettings() {
  try {
    localStorage.setItem('facundo_settings', JSON.stringify(state.settings));
  } catch (e) {
    console.warn('No se pudo guardar la configuración:', e);
  }
}

function loadSettings() {
  const saved = localStorage.getItem('facundo_settings');
  if (saved) {
    try {
      state.settings = { ...state.settings, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Error al cargar la configuración:', e);
    }
  }

  if (dom.sliderSpeed) dom.sliderSpeed.value = state.settings.textSpeedVal;
  if (dom.selectTextSize) dom.selectTextSize.value = state.settings.textSize;
  if (dom.selectFontFamily) dom.selectFontFamily.value = state.settings.fontFamily;

  applySettingsToUI();
}

function applySettingsToUI() {
  if (dom.dialogueText) {
    dom.dialogueText.classList.remove('text-sm', 'text-md', 'text-lg');
    dom.dialogueText.classList.add(state.settings.textSize);
  }

  document.body.classList.remove('font-serif', 'font-sans', 'font-dyslexic');
  document.body.classList.add(`font-${state.settings.fontFamily}`);
}

function getDelayFromSlider() {
  const minVal = dom.sliderSpeed ? parseInt(dom.sliderSpeed.min, 10) : 5;
  const maxVal = dom.sliderSpeed ? parseInt(dom.sliderSpeed.max, 10) : 60;
  const val = state.settings.textSpeedVal;

  return maxVal + minVal - val;
}

/* --- 4. MOTOR VISUAL Y TIPEO DE TEXTO --- */

function setBackground(url) {
  if (!dom.bgA || !dom.bgB || !url) return;
  const showingA = dom.bgA.classList.contains('active');
  const next = showingA ? dom.bgB : dom.bgA;
  const prev = showingA ? dom.bgA : dom.bgB;
  
  next.style.backgroundImage = `url('${url}')`;
  next.classList.add('active');
  prev.classList.remove('active');
}

function setPortrait(url, side = 'left') {
  if (!dom.portrait) return;

  if (url === null || url === 'none') {
    dom.portrait.classList.remove('active', 'show');
    dom.portrait.style.opacity = '0';
    dom.portrait.style.display = 'none';
    currentPortraitUrl = null;
    return;
  }

  if (url === undefined) {
    if (currentPortraitUrl) {
      dom.portrait.style.display = 'block';
      dom.portrait.style.opacity = '1';
      dom.portrait.classList.add('active', 'show');
    }
    return;
  }

  currentPortraitUrl = url;
  dom.portrait.src = url;
  dom.portrait.className = `portrait portrait-${side} active show`;
  dom.portrait.style.display = 'block';
  dom.portrait.style.opacity = '1';
}

function setHud(show) {
  if (!dom.hud) return;
  dom.hud.classList.toggle('show', Boolean(show));
  if (show) updateCompass();
}

function updateCompass() {
  if (!dom.compassCivil || !dom.compassBarbarie) return;
  const civilPct = Math.min(100, (state.civil / 40) * 100);
  const barbariePct = Math.min(100, (state.barbarie / 40) * 100);
  
  dom.compassCivil.style.width = `${civilPct}%`;
  dom.compassBarbarie.style.width = `${barbariePct}%`;
}

function clearTypingTimer() {
  if (typingTimer !== null) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  isTyping = false;
}

function clearCountdown() {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  if (dom.timerWrap) dom.timerWrap.classList.remove('show');
}

function recordHistory(speaker, text) {
  if (!text) return;
  state.history.push({ speaker: speaker || 'Narrador', text });
}

function typeText(text, done) {
  clearTypingTimer();
  currentFullText = text;
  onTypeDone = done;
  if (dom.dialogueText) dom.dialogueText.textContent = '';
  isTyping = true;
  
  let i = 0;
  const delay = getDelayFromSlider();

  typingTimer = setInterval(() => {
    if (dom.dialogueText) dom.dialogueText.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearTypingTimer();
      if (onTypeDone) onTypeDone();
    }
  }, delay);
}

function finishTypingNow() {
  clearTypingTimer();
  if (dom.dialogueText) dom.dialogueText.textContent = currentFullText;
  if (onTypeDone) onTypeDone();
}

/* --- 5. RENDERIZADO DE ESCENAS Y DECISIONES --- */

function resetDialogueBoxEvents() {
  if (dom.continueBtn) dom.continueBtn.onclick = null;
  if (dom.dialogueBox) dom.dialogueBox.onclick = null;
}

function renderScene(cfg) {
  clearCountdown();
  resetDialogueBoxEvents();
  isWaitingForChoice = false;

  if (cfg.bg) setBackground(cfg.bg);
  
  if (cfg.clearPortraits) {
    setPortrait(null);
  } else if (cfg.portrait !== undefined) {
    setPortrait(cfg.portrait, cfg.side || 'left');
  }
  
  if (dom.nameplate) {
    dom.nameplate.textContent = cfg.speaker || '';
    dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  }
  if (dom.promptText) dom.promptText.style.display = 'none';
  if (dom.choices) {
    dom.choices.style.display = 'none';
    dom.choices.replaceChildren();
  }
  if (dom.continueRow) dom.continueRow.style.display = 'flex';
  setHud(cfg.showHud);

  let idx = 0;
  const lines = cfg.lines;

  function advanceOrFinish() {
    if (isTyping) {
      finishTypingNow();
      return;
    }
    idx++;
    if (idx < lines.length) {
      showCurrent();
    } else {
      cfg.onComplete();
    }
  }

  function showCurrent() {
    if (dom.continueBtn) dom.continueBtn.style.visibility = 'hidden';
    recordHistory(cfg.speaker, lines[idx]);
    typeText(lines[idx], () => {
      if (dom.continueBtn) dom.continueBtn.style.visibility = 'visible';
    });
  }

  if (dom.continueBtn) {
    dom.continueBtn.onclick = (e) => {
      e.stopPropagation();
      advanceOrFinish();
    };
  }

  if (dom.dialogueBox) {
    dom.dialogueBox.onclick = () => {
      if (isWaitingForChoice) return;
      advanceOrFinish();
    };
  }

  showCurrent();
}

function renderDecision(cfg) {
  clearCountdown();
  resetDialogueBoxEvents();
  isWaitingForChoice = true;

  if (cfg.bg) setBackground(cfg.bg);

  if (cfg.portrait !== undefined) {
    setPortrait(cfg.portrait, cfg.side || 'left');
  }
  
  if (dom.nameplate) {
    dom.nameplate.textContent = cfg.speaker || '';
    dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  }
  setHud(cfg.showHud);
  if (dom.continueRow) dom.continueRow.style.display = 'none';
  if (dom.promptText) {
    dom.promptText.style.display = 'block';
    dom.promptText.textContent = cfg.prompt;
  }
  if (dom.choices) {
    dom.choices.replaceChildren();
    dom.choices.style.display = 'none';
  }
  
  clearTypingTimer();
  if (dom.dialogueText) dom.dialogueText.textContent = '';

  function reveal() {
    if (dom.choices) dom.choices.style.display = 'flex';
    const buttons = [];
    
    cfg.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = opt.label;
      btn.onclick = (e) => {
        e.stopPropagation();
        resolve(opt, buttons);
      };
      if (dom.choices) dom.choices.appendChild(btn);
      buttons.push(btn);
    });

    startCountdown(cfg.seconds, () => {
      resolve({ flavor: cfg.timeoutFlavor, civil: 0, barbarie: 0, isTimeout: true }, buttons);
    });
  }

  function resolve(opt, buttons) {
    clearCountdown();
    isWaitingForChoice = false;
    buttons.forEach(b => b.disabled = true);
    if (dom.choices) dom.choices.style.display = 'none';
    if (dom.promptText) dom.promptText.style.display = 'none';
    
    state.civil += opt.civil || 0;
    state.barbarie += opt.barbarie || 0;
    if (opt.path) state.path = opt.path;
    if (cfg.showHud) updateCompass();

    recordHistory('Decisión', opt.label ? `[Elegido: ${opt.label}]` : '[Tiempo agotado]');
    recordHistory(cfg.speaker, opt.flavor);

    if (dom.continueRow) dom.continueRow.style.display = 'flex';
    if (dom.continueBtn) dom.continueBtn.style.visibility = 'hidden';

    let hasAdvanced = false;

    const advanceAfterChoice = () => {
      if (isTyping) {
        finishTypingNow();
        return;
      }
      if (!hasAdvanced) {
        hasAdvanced = true;
        cfg.onComplete();
      }
    };

    typeText(opt.flavor, () => {
      if (dom.continueBtn) dom.continueBtn.style.visibility = 'visible';
    });

    if (dom.continueBtn) {
      dom.continueBtn.onclick = (e) => {
        e.stopPropagation();
        advanceAfterChoice();
      };
    }

    if (dom.dialogueBox) {
      dom.dialogueBox.onclick = () => {
        advanceAfterChoice();
      };
    }
  }

  reveal();
}

function startCountdown(seconds, onTimeout) {
  if (!dom.timerWrap || !dom.timerNum || !dom.fuseFill) return;
  let remaining = seconds;
  dom.timerWrap.classList.add('show');
  dom.timerNum.textContent = `${remaining}s`;
  dom.fuseFill.style.width = '100%';
  dom.fuseFill.className = 'fuse-fill';

  countdownTimer = setInterval(() => {
    remaining--;
    const pct = Math.max(0, (remaining / seconds) * 100);
    dom.fuseFill.style.width = `${pct}%`;
    dom.timerNum.textContent = `${Math.max(0, remaining)}s`;

    if (pct <= 20) {
      dom.fuseFill.className = 'fuse-fill danger';
    } else if (pct <= 50) {
      dom.fuseFill.className = 'fuse-fill warn';
    }

    if (remaining <= 0) {
      clearCountdown();
      onTimeout();
    }
  }, 1000);
}

/* --- 6. SECUENCIA DE HISTORIA --- */

function scenePrologo() {
  renderScene({ bg: BG.pampa, lines: PROLOGO_LINES, clearPortraits: true, showHud: false, onComplete: sceneIntro });
}

function sceneIntro() {
  renderScene({ bg: BG.pampa, lines: INTRO_LINES, clearPortraits: true, showHud: false, onComplete: sceneLlegada });
}

function sceneLlegada() {
  renderScene({ bg: BG.pulperiaExt, lines: LLEGADA_LINES, clearPortraits: true, showHud: false, onComplete: sceneEscena1 });
}

function sceneEscena1() {
  renderScene({
    bg: BG.mostrador,
    speaker: 'El Cantinero',
    portrait: PORTRAIT.cantinero,
    side: 'right',
    lines: CANTINERO_LINES,
    showHud: true,
    onComplete: sceneDecision1
  });
}

function sceneDecision1() {
  renderDecision({
    bg: BG.mostrador,
    speaker: 'El Cantinero',
    portrait: PORTRAIT.cantinero,
    side: 'right',
    prompt: '¿Qué le respondés?',
    seconds: 20,
    showHud: true,
    options: [
      { label: 'Busco trabajo honrado. Construir algo.', civil: 20, path: 'civil', flavor: 'Asentís, serio. El cantinero te mira con algo parecido al respeto.' },
      { label: 'Busco dinero. Fortuna rápida.', path: 'neutral', flavor: 'El cantinero asiente, sin sorpresa. Esa respuesta la escuchó mil veces.' },
      { label: 'Busco poder. Seré más fuerte que todos.', barbarie: 20, path: 'barbarie', flavor: 'El cantinero entrecierra los ojos, calculando algo que no decís.' }
    ],
    timeoutFlavor: 'Te quedás en silencio. El cantinero asiente, como quien ya conoce esa mirada.',
    onComplete: () => {
      if (!state.path) state.path = 'neutral';
      sceneContinuacionCantinero();
    }
  });
}

function sceneContinuacionCantinero() {
  const lines = state.path === 'barbarie' ? CANTINERO_BARBARIE_LINES : CANTINERO_CIVIL_NEUTRAL_LINES;
  renderScene({
    bg: BG.mostrador,
    speaker: 'El Cantinero',
    portrait: PORTRAIT.cantinero,
    side: 'right',
    lines: lines,
    showHud: true,
    onComplete: sceneTransicionCamino
  });
}

function sceneTransicionCamino() {
  renderScene({
    bg: BG.pampa,
    lines: ['Días después, en el camino...'],
    clearPortraits: true,
    showHud: true,
    onComplete: sceneEncuentro
  });
}

function sceneEncuentro() {
  const cfg = ROUTE_CONFIG[state.path] || ROUTE_CONFIG.neutral;
  renderScene({
    bg: BG.pampa,
    speaker: cfg.speaker,
    portrait: cfg.portrait,
    side: 'left',
    lines: cfg.lines,
    showHud: true,
    onComplete: sceneDecision2
  });
}

function sceneDecision2() {
  const cfg = ROUTE_CONFIG[state.path] || ROUTE_CONFIG.neutral;
  renderDecision({
    bg: BG.pampa,
    speaker: cfg.speaker,
    portrait: cfg.portrait,
    side: 'left',
    prompt: '¿Qué decidís?',
    seconds: 18,
    showHud: true,
    options: cfg.decisionOptions,
    timeoutFlavor: 'El tiempo se agota. Tu silencio también es una respuesta.',
    onComplete: sceneFinal
  });
}

function sceneFinal() {
  const total = state.civil + state.barbarie;
  const civilPct = total === 0 ? 50 : Math.round((state.civil / total) * 100);
  const barbariePct = 100 - civilPct;

  let ending;
  if (civilPct >= 70) ending = ENDINGS.civil;
  else if (barbariePct >= 70) ending = ENDINGS.barbarie;
  else ending = ENDINGS.gris;

  renderEnding(ending, civilPct, barbariePct);
}

function renderEnding(ending, civilPct, barbariePct) {
  clearCountdown();
  clearTypingTimer();
  resetDialogueBoxEvents();
  setBackground(BG.pampa);
  setPortrait(null);
  setHud(false);
  
  if (dom.nameplate) dom.nameplate.style.display = 'none';
  if (dom.dialogueBox) dom.dialogueBox.style.display = 'none';

  const overlay = document.createElement('div');
  overlay.className = 'overlay-screen active';

  const card = document.createElement('div');
  card.className = 'start-card';

  const title = document.createElement('h2');
  title.className = `ending-title ${ending.cls}`;
  title.textContent = ending.title;
  card.appendChild(title);

  const body = document.createElement('div');
  body.className = 'ending-body';
  ending.body.forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    body.appendChild(para);
  });
  card.appendChild(body);

  const score = document.createElement('p');
  score.className = 'ending-score';
  score.textContent = `Civilización ${civilPct}% | Barbarie ${barbariePct}%`;
  card.appendChild(score);

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'big-btn';
  retryBtn.style.marginTop = '1rem';
  retryBtn.textContent = 'Reintentar';
  retryBtn.onclick = () => {
    state.civil = 0;
    state.barbarie = 0;
    state.path = null;
    state.history = [];
    
    if (dom.dialogueBox) dom.dialogueBox.style.display = 'flex';
    overlay.remove();
    scenePrologo();
  };
  card.appendChild(retryBtn);

  overlay.appendChild(card);
  if (dom.stage) dom.stage.appendChild(overlay);
}

/* --- 7. GESTIÓN DE MODALES Y EVENTOS UI --- */

function updateHistoryModal() {
  if (!dom.historyLog) return;
  dom.historyLog.replaceChildren();

  if (state.history.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'history-entry';
    emptyMsg.textContent = 'No hay entradas aún en la bitácora.';
    dom.historyLog.appendChild(emptyMsg);
    return;
  }

  state.history.forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'history-entry';

    const speaker = document.createElement('span');
    speaker.className = 'history-speaker';
    speaker.textContent = item.speaker;

    entry.appendChild(speaker);
    entry.appendChild(document.createTextNode(item.text));
    
    dom.historyLog.appendChild(entry);
  });

  dom.historyLog.scrollTop = dom.historyLog.scrollHeight;
}

function initUIEvents() {
  if (dom.btnSettings && dom.modalSettings) {
    dom.btnSettings.addEventListener('click', () => dom.modalSettings.classList.remove('hidden'));
  }
  if (dom.closeSettings && dom.modalSettings) {
    dom.closeSettings.addEventListener('click', () => dom.modalSettings.classList.add('hidden'));
  }

  if (dom.btnHistory && dom.modalHistory) {
    dom.btnHistory.addEventListener('click', () => {
      updateHistoryModal();
      dom.modalHistory.classList.remove('hidden');
    });
  }
  if (dom.closeHistory && dom.modalHistory) {
    dom.closeHistory.addEventListener('click', () => dom.modalHistory.classList.add('hidden'));
  }

  if (dom.sliderSpeed) {
    dom.sliderSpeed.addEventListener('input', (e) => {
      state.settings.textSpeedVal = parseInt(e.target.value, 10);
      saveSettings();
    });
  }

  if (dom.selectTextSize) {
    dom.selectTextSize.addEventListener('change', (e) => {
      state.settings.textSize = e.target.value;
      applySettingsToUI();
      saveSettings();
    });
  }

  if (dom.selectFontFamily) {
    dom.selectFontFamily.addEventListener('change', (e) => {
      state.settings.fontFamily = e.target.value;
      applySettingsToUI();
      saveSettings();
    });
  }

  if (dom.btnToggleFullscreen) {
    dom.btnToggleFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen().catch(err => console.log(err));
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.modalSettings) dom.modalSettings.classList.add('hidden');
      if (dom.modalHistory) dom.modalHistory.classList.add('hidden');
      return;
    }

    if ((e.key === ' ' || e.key === 'Enter') && document.activeElement.tagName !== 'BUTTON') {
      const isSettingsOpen = dom.modalSettings && !dom.modalSettings.classList.contains('hidden');
      const isHistoryOpen = dom.modalHistory && !dom.modalHistory.classList.contains('hidden');

      if (isSettingsOpen || isHistoryOpen || isWaitingForChoice) return;

      if (dom.continueRow && dom.continueRow.style.display !== 'none' && dom.continueBtn) {
        e.preventDefault();
        dom.continueBtn.click();
      }
    }
  });
}

/* --- 8. INICIALIZACIÓN --- */

loadSettings();
initUIEvents();

if (dom.startBtn && dom.startScreen) {
  dom.startBtn.addEventListener('click', () => {
    dom.startScreen.remove();
    scenePrologo();
  });
}