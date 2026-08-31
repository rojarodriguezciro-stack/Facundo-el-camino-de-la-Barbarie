/* ===================================================================
   MOTOR DEL JUEGO - CAPÍTULO DOS
   La apertura cambia según el final obtenido en la instancia jugable
   (civilización / barbarie / gris). Las tres rutas convergen hacia
   el gancho final: el viaje de Facundo a Córdoba (Barranca Yacó).
   =================================================================== */

// Guarda el estado de la partida para que las decisiones puedan influir en escenas posteriores.
const state = { civilizacion: 0, quiroga: 0, investigacion: 0, decisionCivil: null, decisionBarbarie: null };

// Centraliza las referencias del HTML para evitar buscar los mismos elementos repetidamente.
const dom = {
  bgA: document.getElementById('bgA'),
  bgB: document.getElementById('bgB'),
  portrait: document.getElementById('portrait'),
  hud: document.getElementById('hud'),
  valCiv: document.getElementById('valCiv'),
  valQui: document.getElementById('valQui'),
  valInv: document.getElementById('valInv'),
  nameplate: document.getElementById('nameplate'),
  promptText: document.getElementById('promptText'),
  dialogueText: document.getElementById('dialogueText'),
  choices: document.getElementById('choices'),
  continueRow: document.getElementById('continueRow'),
  continueBtn: document.getElementById('continueBtn'),
  dialogueBox: document.getElementById('dialogueBox'),
  startScreen: document.getElementById('startScreen'),
  startBtn: document.getElementById('startBtn'),
  stage: document.getElementById('stage')
};

// Variables del efecto de escritura: permiten avanzar el texto o completarlo de inmediato.
let typingTimer = null;
let isTyping = false;
let currentFullText = '';
let onTypeDone = null;
const TYPE_SPEED_MS = 16;
let activeBg = 'A';

/* ===================================================================
   1. UTILIDADES DE MOTOR
   =================================================================== */

// Actualiza el HUD cada vez que una elección modifica los valores de la partida.
function updateHUD() {
  dom.valCiv.textContent = state.civilizacion;
  dom.valQui.textContent = state.quiroga;
  dom.valInv.textContent = state.investigacion;
}

// Alterna entre dos capas para conseguir una transición suave entre fondos.
function setBackground(imgUrl) {
  if (!imgUrl) return;
  const current = activeBg === 'A' ? dom.bgA : dom.bgB;
  const next = activeBg === 'A' ? dom.bgB : dom.bgA;
  next.style.backgroundImage = `url('${imgUrl}')`;
  next.classList.add('active');
  current.classList.remove('active');
  activeBg = activeBg === 'A' ? 'B' : 'A';
}

// Cambia el personaje visible y su posición según quién participe en la escena.
function setPortrait(imgUrl, position = 'left') {
  if (!imgUrl) {
    dom.portrait.style.opacity = '0';
    setTimeout(() => { dom.portrait.style.display = 'none'; }, 350);
    return;
  }
  dom.portrait.src = imgUrl;
  dom.portrait.className = `portrait portrait-${position}`;
  dom.portrait.style.display = 'block';

  void dom.portrait.offsetWidth;
  dom.portrait.style.opacity = '1';
}

// Muestra los diálogos progresivamente para conservar la sensación de novela visual.
function typeText(text, onDone) {
  clearInterval(typingTimer);
  currentFullText = text;
  isTyping = true;
  onTypeDone = onDone;
  dom.dialogueText.textContent = '';
  let i = 0;
  typingTimer = setInterval(() => {
    dom.dialogueText.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typingTimer);
      isTyping = false;
      if (onTypeDone) onTypeDone();
    }
  }, TYPE_SPEED_MS);
}

// Permite saltar el efecto de escritura si el jugador vuelve a pulsar Continuar.
function finishTypingNow() {
  clearInterval(typingTimer);
  isTyping = false;
  dom.dialogueText.textContent = currentFullText;
  if (onTypeDone) onTypeDone();
}

// Renderiza una escena común y reutilizable para no repetir la misma lógica en cada diálogo.
function renderScene(cfg) {
  if (cfg.bg) setBackground(cfg.bg);
  if (cfg.portrait !== undefined) setPortrait(cfg.portrait, cfg.portraitPos || 'left');

  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  dom.promptText.style.display = 'none';
  dom.choices.style.display = 'none';
  dom.choices.innerHTML = '';
  dom.continueRow.style.display = 'flex';

  if (cfg.showHud) dom.hud.classList.add('show');
  else dom.hud.classList.remove('show');

  let idx = 0;
  const lines = cfg.lines;

  function showCurrent() {
    dom.continueBtn.style.visibility = 'hidden';
    typeText(lines[idx], () => { dom.continueBtn.style.visibility = 'visible'; });
  }

  dom.continueBtn.onclick = () => {
    if (isTyping) { finishTypingNow(); return; }
    idx++;
    if (idx < lines.length) showCurrent();
    else cfg.onComplete();
  };

  showCurrent();
}

// Construye las opciones de decisión y aplica sus efectos al estado de la partida.
function renderDecision(cfg) {
  if (cfg.bg) setBackground(cfg.bg);
  if (cfg.portrait !== undefined) setPortrait(cfg.portrait, cfg.portraitPos || 'left');

  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  dom.continueRow.style.display = 'none';
  dom.promptText.style.display = 'block';
  dom.promptText.textContent = cfg.prompt;
  dom.choices.innerHTML = '';
  dom.choices.style.display = 'flex';
  dom.dialogueText.textContent = '';

  cfg.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt.label;
    btn.onclick = () => {
      dom.choices.style.display = 'none';
      dom.promptText.style.display = 'none';

      state.civilizacion += opt.civ || 0;
      state.quiroga += opt.qui || 0;
      state.investigacion += opt.inv || 0;
      updateHUD();

      dom.continueRow.style.display = 'flex';
      dom.continueBtn.style.visibility = 'hidden';
      typeText(opt.flavor, () => { dom.continueBtn.style.visibility = 'visible'; });
      dom.continueBtn.onclick = () => {
        if (isTyping) finishTypingNow();
        else (opt.onComplete || cfg.onComplete)();
      };
    };
    dom.choices.appendChild(btn);
  });
}

/* ===================================================================
   2. PUENTE CON LA INSTANCIA JUGABLE
   =================================================================== */

// Estas claves permiten compartir el resultado de una instancia anterior mediante localStorage.
const CLAVE_PERFIL = 'facundo-perfil';

// Determina qué ruta debe continuar: parámetro de prueba, partida guardada o ruta neutral por defecto.
function obtenerFinalInstancia() {
  const params = new URLSearchParams(window.location.search);
  const forzado = params.get('final');
  if (['civil', 'barbarie', 'gris'].includes(forzado)) return forzado;

  const guardado = localStorage.getItem(CLAVE_PERFIL);
  if (guardado) {
    try {
      const perfil = JSON.parse(guardado);
      if (perfil.finalInstancia) return perfil.finalInstancia;
    } catch (e) { /* perfil corrupto o vacío, usamos el default */ }
  }

  return 'gris';
}

/* ===================================================================
   2b. PROGRESO ACUMULADO DESDE EL CAPÍTULO 1
   =================================================================== */

// Clave independiente para recuperar los puntos acumulados en el capítulo anterior.
const CLAVE_STATS_CAP1 = 'facundo-cap1-stats';

// Recupera el progreso anterior sin impedir que el capítulo actual pueda iniciarse desde cero.
function cargarProgresoCapitulo1() {
  const guardado = localStorage.getItem(CLAVE_STATS_CAP1);
  if (!guardado) return;
  try {
    const datos = JSON.parse(guardado);
    state.civilizacion += datos.civilizacion || 0;
    state.quiroga += datos.quiroga || 0;
    state.investigacion += datos.investigacion || 0;
  } catch (e) { /* dato corrupto, seguimos con lo que ya había */ }
}

/* ===================================================================
   3. RECURSOS (imágenes)
   =================================================================== */

// Rutas centralizadas de recursos para poder cambiar archivos sin modificar las escenas.
const BG = {
  campamento: '../img/campamento.png',
  pueblo: '../img/pueblo.png'
};

// Los nombres descriptivos facilitan identificar rápidamente qué personaje representa cada imagen.
const PORTRAIT = {
  facundo: '../img/caudillo.png',
  sarmiento: '../img/Sarmiento.png',
  anciano: '../img/comerciante.png'
};

// La ruta siguiente se mantiene en una constante para evitar repetirla en distintos lugares.
const RUTA_CAPITULO_3 = '../Capitulo3/index.html';

// Textos de las cartas separados de la lógica para facilitar futuras modificaciones narrativas.
const LETTERS = {
  sarmiento: {
    remitente: 'Domingo F. Sarmiento',
    texto: [
      'He sabido de tu paso por estos parajes, y de la templanza con que has actuado.',
      'Te escribo para pedirte que te sumes a la causa de la razón y la ley, antes de que sea tarde para todos nosotros.',
      'Te espero en el campamento, si tu conciencia así te lo permite.'
    ]
  },
  facundo: {
    remitente: 'Facundo Quiroga',
    texto: [
      'Ya me cansé de esperar a que decidas de qué lado estás.',
      'Los hombres como vos, o cabalgan conmigo, o terminan bajo mis botas.',
      'Vení al campamento. No te lo voy a volver a pedir.'
    ]
  }
};

/* ===================================================================
   4. ESCENAS
   =================================================================== */

// Selecciona automáticamente la apertura correspondiente al resultado anterior del jugador.
function sceneInicio() {
  const final = obtenerFinalInstancia();
  if (final === 'civil') sceneAperturaCivil();
  else if (final === 'barbarie') sceneAperturaBarbarie();
  else sceneAperturaGris();
}

/* --------------------- RUTA CIVILIZACIÓN ---------------------
   Las funciones de esta ruta se mantienen separadas para que cada camino tenga su propia progresión narrativa. */

function sceneAperturaCivil() {
  renderScene({
    bg: BG.campamento,
    portrait: PORTRAIT.sarmiento,
    portraitPos: 'right',
    speaker: 'Domingo F. Sarmiento',
    lines: [
      'Tu nombre ya circula entre los hombres de la ley, gaucho.',
      '"Dicen que elegiste el trabajo honrado sobre la ambición. Eso, en esta tierra, ya es un acto de valentía."',
      '"Necesito hombres como vos. Facundo avanza, y cada día que dudamos, la barbarie gana terreno."'
    ],
    showHud: true,
    onComplete: sceneMisionCivil
  });
}

function sceneMisionCivil() {
  renderScene({
    bg: BG.pueblo,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      'Sarmiento te encarga una tarea: viajar hasta un pueblo cercano y convencer a su gente de no sumarse a las fuerzas de Facundo.',
      'Cuando llegás, encontrás a un anciano del pueblo sentado junto al pozo, con la mirada cansada de quien ya vio demasiadas guerras.'
    ],
    showHud: true,
    onComplete: sceneAncianoCivil
  });
}

function sceneAncianoCivil() {
  renderScene({
    bg: BG.pueblo,
    portrait: PORTRAIT.anciano,
    portraitPos: 'right',
    speaker: 'El anciano del pueblo',
    lines: [
      '"¿Y quién sos vos para pedirnos que elijamos bando? Ya elegimos: sobrevivir, nomás."',
      '"Facundo promete protección. Sarmiento promete un futuro que capaz ninguno de nosotros llegue a ver."'
    ],
    showHud: true,
    onComplete: sceneDecisionCivil
  });
}

function sceneDecisionCivil() {
  renderDecision({
    bg: BG.pueblo,
    portrait: PORTRAIT.anciano,
    portraitPos: 'right',
    speaker: 'Narrador',
    prompt: '¿Cómo respondés?',
    options: [
      { label: 'Prometerles protección real, no solo palabras', civ: 15,
        flavor: 'El anciano entrecierra los ojos, midiendo si tu promesa vale algo más que las de Facundo.',
        onComplete: () => { state.decisionCivil = 'protector'; sceneCierreCivil(); } },
      { label: 'Advertirles de lo que les espera si Facundo gana', civ: 5, inv: 5,
        flavor: 'Tu advertencia sincera incomoda al anciano, pero no lo convence del todo.',
        onComplete: () => { state.decisionCivil = 'advertencia'; sceneCierreCivil(); } }
    ]
  });
}

function sceneCierreCivil() {
  const textoExtra = state.decisionCivil === 'protector'
    ? 'Tu promesa de protección corre de boca en boca — algunos la ven como esperanza, otros como una carga que quizás no puedas cumplir.'
    : 'Tu advertencia sincera no convenció a todos, pero sembró una duda que antes no existía.';
  renderScene({
    bg: BG.pueblo,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      textoExtra,
      'El pueblo, dividido, decide no tomar las armas por ahora — pero tu nombre ya quedó ligado al de Sarmiento.',
      'Mientras volvés hacia el campamento, un jinete te alcanza con noticias urgentes: algo grande se está por decidir en los llanos.'
    ],
    showHud: true,
    onComplete: sceneReaccionSarmiento
  });
}

function sceneReaccionSarmiento() {
  const linea = state.decisionCivil === 'protector'
    ? '"Prometiste protección. Espero que estés dispuesto a sostener esa palabra cuando llegue la hora."'
    : '"Una advertencia sincera vale más que una promesa vacía. Empezás a entender de qué se trata esto."';
  renderScene({
    bg: BG.campamento,
    portrait: PORTRAIT.sarmiento,
    portraitPos: 'right',
    speaker: 'Domingo F. Sarmiento',
    lines: [linea],
    showHud: true,
    onComplete: sceneCierreCapitulo2
  });
}

/* --------------------- RUTA BARBARIE --------------------- */

function sceneAperturaBarbarie() {
  renderScene({
    bg: BG.campamento,
    portrait: PORTRAIT.facundo,
    portraitPos: 'left',
    speaker: 'Facundo',
    lines: [
      'Cabalgaste con nosotros desde la pulpería. Ya no sos un extraño.',
      '"Pero acá, la lealtad se prueba, no se jura. Vienen tiempos en que vas a tener que elegir entre mi palabra y la tuya."',
      '"¿Seguís firme?"'
    ],
    showHud: true,
    onComplete: sceneAccionBarbarie
  });
}

function sceneAccionBarbarie() {
  renderScene({
    bg: BG.pueblo,
    portrait: PORTRAIT.facundo,
    portraitPos: 'left',
    speaker: 'Facundo',
    lines: [
      '"Este pueblo le dio refugio a los hombres de Sarmiento. Vas a ayudarme a que no lo vuelvan a hacer."',
      'Los hombres de Facundo rodean las casas. El aire se llena de gritos y humo.'
    ],
    showHud: true,
    onComplete: sceneVictimaBarbarie
  });
}

function sceneVictimaBarbarie() {
  renderScene({
    bg: BG.pueblo,
    portrait: PORTRAIT.anciano,
    portraitPos: 'right',
    speaker: 'Un habitante del pueblo',
    lines: [
      '"¡No tenemos nada que ver con los unitarios! ¡Se lo suplico!"',
      'El hombre cae de rodillas frente a vos, esperando una orden que puede salvarlo o condenarlo.'
    ],
    showHud: true,
    onComplete: sceneDecisionBarbarie
  });
}

function sceneDecisionBarbarie() {
  renderDecision({
    bg: BG.pueblo,
    portrait: PORTRAIT.anciano,
    portraitPos: 'right',
    speaker: 'Narrador',
    prompt: '¿Qué hacés?',
    options: [
      { label: 'Cumplir la orden de Facundo sin dudar', qui: 15,
        flavor: 'Facundo te observa desde lejos. Acabás de ganarte su confianza — al precio de algo que no vas a poder deshacer.',
        onComplete: () => { state.decisionBarbarie = 'cumplio'; sceneCierreBarbarie(); } },
      { label: 'Dejarlo escapar, a espaldas de Facundo', qui: 5, civ: 5,
        flavor: 'Nadie más lo nota. Pero vos sabés lo que hiciste, y lo que no.',
        onComplete: () => { state.decisionBarbarie = 'dejoEscapar'; sceneCierreBarbarie(); } }
    ]
  });
}

function sceneCierreBarbarie() {
  const textoExtra = state.decisionBarbarie === 'cumplio'
    ? 'La orden se cumplió sin titubeos. Los hombres de Facundo empiezan a verte como uno más de ellos.'
    : 'Nadie sospecha lo que hiciste. Pero cada vez te cuesta más reconocer al hombre en el que te estás convirtiendo.';
  renderScene({
    bg: BG.pueblo,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      textoExtra,
      'El pueblo queda sometido. Facundo ya es, para muchos, mucho más que un caudillo: es el miedo mismo hecho hombre.',
      'Esa misma noche, un mensajero llega con noticias que van a cambiar todo lo que viene.'
    ],
    showHud: true,
    onComplete: sceneReaccionFacundo
  });
}

function sceneReaccionFacundo() {
  const linea = state.decisionBarbarie === 'cumplio'
    ? '"Hiciste lo que tenías que hacer. Los que dudan no duran mucho a mi lado."'
    : '"Sé que dejaste escapar a ese hombre. Que sea la última vez que tu compasión se cruza en mi camino."';
  renderScene({
    bg: BG.campamento,
    portrait: PORTRAIT.facundo,
    portraitPos: 'left',
    speaker: 'Facundo',
    lines: [linea],
    showHud: true,
    onComplete: sceneCierreCapitulo2
  });
}

/* --------------------- RUTA GRIS ---------------------
   Esta ruta representa al jugador que no se inclinó claramente por ninguno de los dos lados. */

function sceneAperturaGris() {
  renderScene({
    bg: BG.campamento,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      'Nunca elegiste un bando. Seguiste tu propio camino, entre la civilización y la barbarie.',
      'Pero la guerra ya no deja lugar para los indecisos.',
      'En el camino, dos mensajes te alcanzan casi al mismo tiempo: uno de Sarmiento, otro de Facundo.'
    ],
    showHud: true,
    onComplete: sceneDecisionGris
  });
}

function sceneDecisionGris() {
  renderDecision({
    bg: BG.campamento,
    portrait: null,
    speaker: 'Narrador',
    prompt: '¿A cuál de los dos mensajes respondés?',
    options: [
      { label: 'El mensaje de Sarmiento',
        flavor: 'Rompés el sello del mensaje de Sarmiento.',
        onComplete: () => sceneLeerCarta('sarmiento') },
      { label: 'El mensaje de Facundo',
        flavor: 'Rompés el sello del mensaje de Facundo.',
        onComplete: () => sceneLeerCarta('facundo') }
    ]
  });
}

function sceneLeerCarta(remitente) {
  dom.hud.classList.remove('show');
  dom.nameplate.style.display = 'none';
  dom.dialogueBox.style.display = 'none';

  const carta = LETTERS[remitente];

  const overlay = document.createElement('div');
  overlay.className = 'overlay-screen';

  const card = document.createElement('div');
  card.className = 'letter-card';

  const title = document.createElement('h2');
  title.className = 'letter-title';
  title.textContent = `Carta de ${carta.remitente}`;
  card.appendChild(title);

  const body = document.createElement('div');
  body.className = 'letter-body';
  carta.texto.forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    body.appendChild(para);
  });
  card.appendChild(body);

  const firma = document.createElement('p');
  firma.className = 'letter-signature';
  firma.textContent = carta.remitente;
  card.appendChild(firma);

  const acciones = document.createElement('div');
  acciones.className = 'ending-actions';
  const seguirBtn = document.createElement('button');
  seguirBtn.type = 'button';
  seguirBtn.className = 'big-btn';
  seguirBtn.textContent = 'Continuar ▸';
  seguirBtn.onclick = () => {
    overlay.remove();
    dom.dialogueBox.style.display = 'flex';
    sceneDecisionIr(remitente);
  };
  acciones.appendChild(seguirBtn);
  card.appendChild(acciones);

  overlay.appendChild(card);
  dom.stage.appendChild(overlay);
}

function sceneDecisionIr(remitente) {
  const esSarmiento = remitente === 'sarmiento';
  renderDecision({
    bg: BG.campamento,
    portrait: esSarmiento ? PORTRAIT.sarmiento : PORTRAIT.facundo,
    portraitPos: esSarmiento ? 'right' : 'left',
    speaker: 'Narrador',
    prompt: '¿Vas a responder al llamado?',
    options: [
      { label: 'Sí, voy a ir', civ: esSarmiento ? 10 : 0, qui: esSarmiento ? 0 : 10,
        flavor: esSarmiento
          ? 'Guardás la carta y ensillás rumbo al campamento de Sarmiento.'
          : 'Guardás la carta y ensillás rumbo al campamento de Facundo.',
        onComplete: () => sceneDesarrolloGris(esSarmiento ? 'civil' : 'barbarie', true) },
      { label: 'No, me quedo', inv: 10,
        flavor: 'Decidís no responder. Tal vez la guerra te deje en paz un tiempo más — o tal vez no.',
        onComplete: () => sceneQuedarseGris(remitente) }
    ]
  });
}

function sceneQuedarseGris(remitente) {
  renderScene({
    bg: BG.campamento,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      'Pasan los días. Ninguno de los dos bandos te vuelve a buscar... hasta que un jinete armado te alcanza en el camino.',
      '"No hay lugar para los indecisos en esta guerra", te dice, antes de escoltarte de todos modos hacia el campamento más cercano.'
    ],
    showHud: true,
    onComplete: () => sceneDesarrolloGris(remitente === 'sarmiento' ? 'civil' : 'barbarie', false)
  });
}

function sceneDesarrolloGris(lado, fueVoluntario) {
  if (lado === 'civil') {
    renderScene({
      bg: BG.pueblo,
      portrait: PORTRAIT.sarmiento,
      portraitPos: 'right',
      speaker: 'Domingo F. Sarmiento',
      lines: fueVoluntario
        ? ['"Sabía que ibas a elegir la razón. Pero no te confundas: elegir un bando no te vuelve inocente de lo que ya viviste en el camino."']
        : ['"Llegaste por la fuerza de las circunstancias, no por convicción. Espero que eso cambie con el tiempo."'],
      showHud: true,
      onComplete: sceneCierreCapitulo2
    });
  } else {
    renderScene({
      bg: BG.pueblo,
      portrait: PORTRAIT.facundo,
      portraitPos: 'left',
      speaker: 'Facundo',
      lines: fueVoluntario
        ? ['"Al fin te decidiste. Ahora vas a conocer lo que de verdad significa estar de mi lado."']
        : ['"No viniste por lealtad, sino porque no tuviste otra salida. Lo tendré en cuenta."'],
      showHud: true,
      onComplete: sceneCierreCapitulo2
    });
  }
}

/* --------------------- CIERRE COMÚN ---------------------
   Las tres rutas terminan conectándose para preparar el siguiente capítulo. */

function sceneCierreCapitulo2() {
  renderScene({
    bg: BG.campamento,
    portrait: null,
    speaker: 'Narrador',
    lines: [
      'Se dice que Facundo Quiroga viaja hacia Córdoba, llamado a una reunión que muchos creen una trampa.',
      'El camino hacia Barranca Yacó ya está trazado — y con él, el final de una historia que la civilización y la barbarie se van a disputar para siempre.'
    ],
    showHud: true,
    onComplete: sceneFinalCapitulo2
  });
}

function sceneFinalCapitulo2() {
  dom.hud.classList.remove('show');
  dom.nameplate.style.display = 'none';
  dom.dialogueBox.style.display = 'none';

  const overlay = document.createElement('div');
  overlay.className = 'overlay-screen';

  const card = document.createElement('div');
  card.className = 'ending-card';

  const title = document.createElement('h2');
  title.className = 'ending-title';
  title.textContent = 'Fin del Capítulo Dos';
  card.appendChild(title);

  const body = document.createElement('div');
  body.className = 'ending-body';
  [
    'Elegiste tu bando, y ya no hay vuelta atrás.',
    'Lo que pase en Barranca Yacó va a definir cómo se recuerda a Facundo Quiroga — y qué parte de esa historia cargás vos también.'
  ].forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    body.appendChild(para);
  });
  card.appendChild(body);

  const score = document.createElement('p');
  score.className = 'ending-score';
  score.textContent = `Civilización ${state.civilizacion} | Quiroga ${state.quiroga} | Investigación ${state.investigacion}`;
  card.appendChild(score);

  const acciones = document.createElement('div');
  acciones.className = 'ending-actions';

  const continuarBtn = document.createElement('a');
  continuarBtn.href = RUTA_CAPITULO_3;
  continuarBtn.className = 'big-btn';
  continuarBtn.textContent = 'Comenzar Capítulo 3 ▸';
  acciones.appendChild(continuarBtn);

  const menuBtn = document.createElement('a');
  menuBtn.href = '../menu-principal/index.html';
  menuBtn.className = 'big-btn secondary';
  menuBtn.textContent = 'Volver al menú';
  acciones.appendChild(menuBtn);

  card.appendChild(acciones);
  overlay.appendChild(card);
  dom.stage.appendChild(overlay);
}

/* --- INICIO DEL JUEGO ---
   El evento se registra una sola vez y prepara el estado antes de mostrar la primera escena. */

dom.startBtn.addEventListener('click', () => {
  dom.startScreen.remove();
  cargarProgresoCapitulo1();
  updateHUD();
  sceneInicio();
});