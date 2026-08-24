/* ===================================================================
   1. CONTENIDO — texto del guion, organizado por escena/ruta
   =================================================================== */

const BG = {
  pampa:      'imagenes/pampa-camino.jpg',
  pulperiaExt:'imagenes/pulperia-exterior.jpg',
  mostrador:  'imagenes/pulperia-mostrador.jpg',
  interior:   'imagenes/pulperia-interior.jpg'
};

const PORTRAIT = {
  cantinero:  'imagenes/cantinero.png',
  rastreador: 'imagenes/rastreador.png',
  comerciante:'imagenes/comerciante.png',
  caudillo:   'imagenes/caudillo.png'
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

/* Configuración por ruta: quién aparece en el Acto 3, sus líneas
   y las tres opciones de la Decisión 2 con su reacción inmediata. */
const ROUTE_CONFIG = {
  civil:{
    speaker:'Juan — El Rastreador',
    portrait:PORTRAIT.rastreador,
    lines:[
      'Te vengo siguiendo hace días, gaucho.',
      'Vos sos el que eligió trabajo en la estancia, ¿no? Eso es raro en estos tiempos. La mayoría elige lo fácil.',
      'Mi nombre es Juan. Lideramos una partida que trae justicia a estos parajes.',
      'La ley oficial es débil. Alguien tiene que hacerlo. ¿Te gustaría ser ese alguien?'
    ],
    decisionOptions:[
      {label:'Acepto. Voy con ustedes.', civil:20, flavor:'Le tendés la mano a Juan. El pacto está hecho: la ley cabalga con vos, ahora.'},
      {label:'Prefiero mi propio destino. Voy solo.', flavor:'Juan se encoge de hombros. «Como quieras. El camino solitario también es un camino.»'},
      {label:'Déjame pensarlo.', flavor:'Juan asiente despacio. «Pensalo. Pero no tardes demasiado: en esta tierra, la duda también elige por vos.»'}
    ]
  },
  neutral:{
    speaker:'El Comerciante',
    portrait:PORTRAIT.comerciante,
    lines:[
      'Mirá qué suerte encontrarte por acá.',
      'Escuché que andás buscando fortuna, no trabajo de peón. Yo también busco dinero. Mucho dinero.',
      'Tengo un negocio: transportar mercancía desde Córdoba hasta Buenos Aires. Las ganancias son enormes. Pero también lo son los riesgos.',
      'Bandidos, jueces corruptos, el camino mismo quiere matarte. ¿Querés ser mi socio? Cincuenta y cincuenta.'
    ],
    decisionOptions:[
      {label:'Acepto. Voy con ustedes.', barbarie:20, flavor:'Cerrás el trato con el comerciante. Cincuenta y cincuenta. El camino a Buenos Aires te espera, con todo lo que trae.'},
      {label:'Prefiero mi propio destino. Voy solo.', flavor:'El comerciante suspira. «Tu pérdida. La fortuna no toca dos veces la misma puerta.»'},
      {label:'Déjame pensarlo.', flavor:'El comerciante sonríe apretado. «Tomate tu tiempo... pero las buenas ofertas no esperan, amigo.»'}
    ]
  },
  barbarie:{
    speaker:'Facundo',
    portrait:PORTRAIT.caudillo,
    lines:[
      'Así que buscás poder, ¿eh? Te lo veo en los ojos.',
      'Los que buscan poder son los únicos que entienden esta tierra.',
      'Soy Facundo. Junto hombres como vos para construir algo más grande que nosotros. Una fuerza que las ciudades no puedan ignorar.',
      'Pero te digo claro: la sangre corre. ¿Tenés el coraje para lo que viene?'
    ],
    decisionOptions:[
      {label:'Acepto. Voy con ustedes.', barbarie:20, flavor:'Le tendés la mano a Facundo. El pacto está hecho: ahora cabalgás con él, hacia lo que sea que los espere.'},
      {label:'Prefiero mi propio destino. Voy solo.', flavor:'Facundo ríe, seco. «Solo, en esta tierra, no llegás lejos. Pero allá vos.»'},
      {label:'Déjame pensarlo.', flavor:'Facundo te mira fijo, sin parpadear. «Pensalo. Pero recordá: en esta tierra, el que duda, ya perdió.»'}
    ]
  }
};

const ENDINGS = {
  civil:{
    title:'El héroe perdido',
    cls:'civil',
    body:[
      'Años después, tu nombre aparece en viejos registros de la época.',
      'Fuiste honrado. Fuiste justo. Cumpliste tu palabra.',
      'Pero cuando Facundo y Rosas escribieron su historia de sangre, vos ya habías desaparecido en los pliegos de la barbarie.',
      'Sin gloria. Sin marca en la gran historia.',
      'Tu legado es el silencio.'
    ]
  },
  barbarie:{
    title:'El caudillo implacable',
    cls:'barbarie',
    body:[
      'Alcanzaste el poder que buscabas.',
      'Hombres te seguían. Ciudades temblaban ante tu nombre.',
      'Pero cada victoria costó vidas. Cada gloria, sangre derramada.',
      'Diez años después, caíste asesinado en un camino solitario.',
      'Como tantos otros caudillos que creyeron que la fuerza era suficiente.',
      'Tu legado es la barbarie que dejaste atrás.'
    ]
  },
  gris:{
    title:'El camino gris',
    cls:'gris',
    body:[
      'Viviste entre mundos.',
      'Ni completamente civilizado, ni verdaderamente salvaje.',
      'Tomaste lo que necesitabas de cada lado.',
      'Quizás ese fue el verdadero camino.',
      'Sobreviviste. No conquistaste imperios, pero tampoco moriste en batalla.',
      'En un país de extremos, los grises rara vez son recordados. Pero sobreviven.'
    ]
  }
};

/* ===================================================================
   2. ESTADO Y REFERENCIAS AL DOM
   =================================================================== */

const state = { civil:0, barbarie:0, path:null };

const dom = {
  bgA:document.getElementById('bgA'),
  bgB:document.getElementById('bgB'),
  portrait:document.getElementById('portrait'),
  hud:document.getElementById('hud'),
  compassCivil:document.getElementById('compassCivil'),
  compassBarbarie:document.getElementById('compassBarbarie'),
  timerWrap:document.getElementById('timerWrap'),
  fuseFill:document.getElementById('fuseFill'),
  timerNum:document.getElementById('timerNum'),
  nameplate:document.getElementById('nameplate'),
  promptText:document.getElementById('promptText'),
  dialogueText:document.getElementById('dialogueText'),
  choices:document.getElementById('choices'),
  continueRow:document.getElementById('continueRow'),
  continueBtn:document.getElementById('continueBtn'),
  dialogueBox:document.getElementById('dialogueBox'),
  startScreen:document.getElementById('startScreen'),
  startBtn:document.getElementById('startBtn'),
  stage:document.getElementById('stage')
};

let bgToggle = false;
let typingTimer = null;
let isTyping = false;
let currentFullText = '';
let onTypeDone = null;
let countdownTimer = null;

/* ===================================================================
   3. MOTOR DE ESCENAS — funciones genéricas reutilizadas por
      todas las escenas (narración, diálogo y decisión)
   =================================================================== */

function setBackground(url){
  const showingA = dom.bgA.classList.contains('active');
  const next = showingA ? dom.bgB : dom.bgA;
  const prev = showingA ? dom.bgA : dom.bgB;
  next.style.backgroundImage = `url('${url}')`;
  next.classList.add('active');
  prev.classList.remove('active');
}

function setPortrait(url, side){
  if(!url){ dom.portrait.style.display='none'; return; }
  dom.portrait.src = url;
  dom.portrait.className = 'portrait portrait-' + (side || 'left');
  dom.portrait.style.display = 'block';
}

function setHud(show){
  dom.hud.classList.toggle('show', !!show);
  if(show) updateCompass();
}

/* La barra usa 40 puntos como máximo teórico de cada lado (ver
   DOCUMENTACION.md para el porqué de ese número) para ubicar el
   relleno de cada color dentro de su mitad de la barra. */
function updateCompass(){
  const civilPct = Math.min(100, (state.civil/40)*100);
  const barbariePct = Math.min(100, (state.barbarie/40)*100);
  dom.compassCivil.style.width = civilPct + '%';
  dom.compassBarbarie.style.width = barbariePct + '%';
}

function clearTypingTimer(){
  clearInterval(typingTimer);
  typingTimer = null;
  isTyping = false;
}

function clearCountdown(){
  clearInterval(countdownTimer);
  countdownTimer = null;
  dom.timerWrap.classList.remove('show');
}

const TYPE_SPEED_MS = 16;

function typeText(text, done){
  clearTypingTimer();
  currentFullText = text;
  onTypeDone = done;
  dom.dialogueText.textContent = '';
  isTyping = true;
  let i = 0;
  typingTimer = setInterval(()=>{
    dom.dialogueText.textContent += text.charAt(i);
    i++;
    if(i >= text.length){
      clearTypingTimer();
      if(onTypeDone) onTypeDone();
    }
  }, TYPE_SPEED_MS);
}

function finishTypingNow(){
  clearTypingTimer();
  dom.dialogueText.textContent = currentFullText;
  if(onTypeDone) onTypeDone();
}

/* renderScene: escena de narración o diálogo. Muestra líneas de a
   una con efecto de máquina de escribir; "Continuar" avanza o, si
   todavía está tipeando, completa la línea al instante. */
function renderScene(cfg){
  clearCountdown();
  setBackground(cfg.bg);
  setPortrait(cfg.portrait, cfg.side);
  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  dom.promptText.style.display = 'none';
  dom.choices.style.display = 'none';
  dom.choices.innerHTML = '';
  dom.continueRow.style.display = 'flex';
  setHud(cfg.showHud);

  let idx = 0;
  const lines = cfg.lines;

  function showCurrent(){
    dom.continueBtn.style.visibility = 'hidden';
    typeText(lines[idx], ()=>{ dom.continueBtn.style.visibility = 'visible'; });
  }

  dom.continueBtn.onclick = ()=>{
    if(isTyping){ finishTypingNow(); return; }
    idx++;
    if(idx < lines.length){ showCurrent(); }
    else { cfg.onComplete(); }
  };

  showCurrent();
}

/* renderDecision: primero tipea la pregunta y, al terminar, revela
   las opciones y arranca la cuenta regresiva. Si el tiempo se agota
   se resuelve con una opción neutral de "vacilación" en vez de
   dejar al jugador sin respuesta del sistema. */
function renderDecision(cfg){
  clearCountdown();
  setBackground(cfg.bg);
  setPortrait(cfg.portrait, cfg.side);
  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker ? 'inline-block' : 'none';
  setHud(cfg.showHud);
  dom.continueRow.style.display = 'none';
  dom.promptText.style.display = 'block';
  dom.promptText.textContent = cfg.prompt;
  dom.choices.innerHTML = '';
  dom.choices.style.display = 'none';
  clearTypingTimer();
  dom.dialogueText.textContent = '';

  function reveal(){
    dom.choices.style.display = 'flex';
    const buttons = [];
    cfg.options.forEach((opt)=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = opt.label;
      btn.onclick = ()=> resolve(opt, buttons);
      dom.choices.appendChild(btn);
      buttons.push(btn);
    });
    startCountdown(cfg.seconds, ()=>{
      resolve({flavor:cfg.timeoutFlavor, civil:0, barbarie:0, isTimeout:true}, buttons);
    });
  }

  function resolve(opt, buttons){
    clearCountdown();
    buttons.forEach(b=> b.disabled = true);
    dom.choices.style.display = 'none';
    dom.promptText.style.display = 'none';
    state.civil += opt.civil || 0;
    state.barbarie += opt.barbarie || 0;
    if(opt.path) state.path = opt.path;
    if(cfg.showHud) updateCompass();
    dom.continueRow.style.display = 'flex';
    dom.continueBtn.style.visibility = 'hidden';
    typeText(opt.flavor, ()=>{ dom.continueBtn.style.visibility = 'visible'; });
    dom.continueBtn.onclick = ()=>{
      if(isTyping){ finishTypingNow(); return; }
      cfg.onComplete();
    };
  }

  reveal();
}

function startCountdown(seconds, onTimeout){
  let remaining = seconds;
  dom.timerWrap.classList.add('show');
  dom.timerNum.textContent = remaining + 's';
  dom.fuseFill.style.width = '100%';
  dom.fuseFill.className = 'fuse-fill';
  countdownTimer = setInterval(()=>{
    remaining--;
    const pct = Math.max(0, (remaining/seconds)*100);
    dom.fuseFill.style.width = pct + '%';
    dom.timerNum.textContent = Math.max(0,remaining) + 's';
    if(pct <= 20) dom.fuseFill.className = 'fuse-fill danger';
    else if(pct <= 50) dom.fuseFill.className = 'fuse-fill warn';
    if(remaining <= 0){
      clearCountdown();
      onTimeout();
    }
  }, 1000);
}

/* ===================================================================
   4. SECUENCIA DE ESCENAS (Prólogo → Acto 1 → Acto 2 → Acto 3 → Acto 4)
   =================================================================== */

function scenePrologo(){
  renderScene({ bg:BG.pampa, lines:PROLOGO_LINES, showHud:false, onComplete:sceneIntro });
}

function sceneIntro(){
  renderScene({ bg:BG.pampa, lines:INTRO_LINES, showHud:false, onComplete:sceneLlegada });
}

function sceneLlegada(){
  renderScene({ bg:BG.pulperiaExt, lines:LLEGADA_LINES, showHud:false, onComplete:sceneEscena1 });
}

function sceneEscena1(){
  renderScene({
    bg:BG.mostrador, speaker:'El Cantinero', portrait:PORTRAIT.cantinero, side:'right',
    lines:CANTINERO_LINES, showHud:true, onComplete:sceneDecision1
  });
}

function sceneDecision1(){
  renderDecision({
    bg:BG.mostrador, speaker:'El Cantinero', portrait:PORTRAIT.cantinero, side:'right',
    prompt:'¿Qué le respondés?', seconds:20, showHud:true,
    options:[
      {label:'Busco trabajo honrado. Construir algo.', civil:20, path:'civil',
       flavor:'Asentís, serio. El cantinero te mira con algo parecido al respeto.'},
      {label:'Busco dinero. Fortuna rápida.', path:'neutral',
       flavor:'El cantinero asiente, sin sorpresa. Esa respuesta la escuchó mil veces.'},
      {label:'Busco poder. Seré más fuerte que todos.', barbarie:20, path:'barbarie',
       flavor:'El cantinero entrecierra los ojos, calculando algo que no decís.'}
    ],
    timeoutFlavor:'Te quedás en silencio. El cantinero asiente, como quien ya conoce esa mirada.',
    onComplete:()=>{
      if(!state.path) state.path = 'neutral';
      sceneContinuacionCantinero();
    }
  });
}

function sceneContinuacionCantinero(){
  const lines = state.path === 'barbarie' ? CANTINERO_BARBARIE_LINES : CANTINERO_CIVIL_NEUTRAL_LINES;
  renderScene({
    bg:BG.mostrador, speaker:'El Cantinero', portrait:PORTRAIT.cantinero, side:'right',
    lines:lines, showHud:true, onComplete:sceneTransicionCamino
  });
}

function sceneTransicionCamino(){
  renderScene({
    bg:BG.pampa, lines:['Días después, en el camino...'], showHud:true, onComplete:sceneEncuentro
  });
}

function sceneEncuentro(){
  const cfg = ROUTE_CONFIG[state.path];
  renderScene({
    bg:BG.pampa, speaker:cfg.speaker, portrait:cfg.portrait, side:'left',
    lines:cfg.lines, showHud:true, onComplete:sceneDecision2
  });
}

function sceneDecision2(){
  const cfg = ROUTE_CONFIG[state.path];
  renderDecision({
    bg:BG.pampa, speaker:cfg.speaker, portrait:cfg.portrait, side:'left',
    prompt:'¿Qué decidís?', seconds:18, showHud:true,
    options:cfg.decisionOptions,
    timeoutFlavor:'El tiempo se agota. Tu silencio también es una respuesta.',
    onComplete:sceneFinal
  });
}

function sceneFinal(){
  const total = state.civil + state.barbarie;
  const civilPct = total === 0 ? 50 : Math.round((state.civil/total)*100);
  const barbariePct = 100 - civilPct;

  let ending;
  if(civilPct >= 70) ending = ENDINGS.civil;
  else if(barbariePct >= 70) ending = ENDINGS.barbarie;
  else ending = ENDINGS.gris;

  renderEnding(ending, civilPct, barbariePct);
}

function renderEnding(ending, civilPct, barbariePct){
  clearCountdown();
  setBackground(BG.pampa);
  setPortrait(null);
  setHud(false);
  dom.nameplate.style.display = 'none';
  dom.dialogueBox.style.display = 'none';

  const overlay = document.createElement('div');
  overlay.className = 'overlay-screen';

  const card = document.createElement('div');
  card.className = 'ending-card';

  const title = document.createElement('h2');
  title.className = 'ending-title ' + ending.cls;
  title.textContent = ending.title;
  card.appendChild(title);

  const body = document.createElement('div');
  body.className = 'ending-body';
  ending.body.forEach(p=>{
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
  retryBtn.onclick = ()=>{
    state.civil = 0; state.barbarie = 0; state.path = null;
    dom.dialogueBox.style.display = 'flex';
    overlay.remove();
    sceneIntro();
  };
  card.appendChild(retryBtn);

  overlay.appendChild(card);
  dom.stage.appendChild(overlay);
}

/* ===================================================================
   5. INICIO
   =================================================================== */

dom.startBtn.addEventListener('click', ()=>{
  dom.startScreen.remove();
  scenePrologo();
});
