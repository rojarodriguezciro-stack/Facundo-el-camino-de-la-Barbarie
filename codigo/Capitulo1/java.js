/* ===================================================================
   MOTOR DEL JUEGO - CAPÍTULO UNO (CON IMÁGENES)
   =================================================================== */

// Variables de estado
const state = {
  civilizacion: 0,
  quiroga: 0,
  investigacion: 0
};

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
  startScreen: document.getElementById('startScreen'),
  startBtn: document.getElementById('startBtn')
};

let typingTimer = null;
let isTyping = false;
let currentFullText = '';
let onTypeDone = null;
const TYPE_SPEED_MS = 16;
let activeBg = 'A';


/* --- Funciones de Utilidad Visual --- */

function updateHUD() {
  dom.valCiv.textContent = state.civilizacion;
  dom.valQui.textContent = state.quiroga;
  dom.valInv.textContent = state.investigacion;
}

function setBackground(imgUrl) {
  if (!imgUrl) return;

  const currentBg = activeBg === 'A' ? dom.bgA : dom.bgB;
  const nextBg = activeBg === 'A' ? dom.bgB : dom.bgA;

  const img = new Image();

  img.onload = () => {
    nextBg.style.backgroundImage = `url("${imgUrl}")`;
    nextBg.classList.add('active');
    currentBg.classList.remove('active');

    activeBg = activeBg === 'A' ? 'B' : 'A';
  };

  img.onerror = () => {
    console.error('ERROR AL CARGAR FONDO:', imgUrl);
  };

  img.src = imgUrl;
}

function setPortrait(imgUrl, position = 'left') {
  if (!imgUrl) {
    dom.portrait.style.opacity = '0';

    setTimeout(() => {
      dom.portrait.style.display = 'none';
    }, 350);

    return;
  }

  dom.portrait.src = imgUrl;
  dom.portrait.className = `portrait portrait-${position}`;
  dom.portrait.style.display = 'block';

  // Forzamos el reflow para que la transición de opacidad funcione
  void dom.portrait.offsetWidth;

  dom.portrait.style.opacity = '1';
}


/* --- Funciones de Texto --- */

function typeText(text, done) {
  clearInterval(typingTimer);

  currentFullText = text;
  onTypeDone = done;
  dom.dialogueText.textContent = '';
  isTyping = true;

  let i = 0;

  typingTimer = setInterval(() => {
    dom.dialogueText.textContent += text.charAt(i);
    i++;

    if (i >= text.length) {
      clearInterval(typingTimer);
      isTyping = false;

      if (onTypeDone) {
        onTypeDone();
      }
    }
  }, TYPE_SPEED_MS);
}

function finishTypingNow() {
  clearInterval(typingTimer);
  isTyping = false;
  dom.dialogueText.textContent = currentFullText;

  if (onTypeDone) {
    onTypeDone();
  }
}


/* --- Funciones de Renderizado de Escenas --- */

function renderScene(cfg) {

  if (cfg.bg) {
    setBackground(cfg.bg);
  }

  if (cfg.portrait !== undefined) {
    setPortrait(
      cfg.portrait,
      cfg.portraitPos || 'left'
    );
  }

  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker
    ? 'inline-block'
    : 'none';

  dom.promptText.style.display = 'none';

  dom.choices.style.display = 'none';
  dom.choices.innerHTML = '';

  dom.continueRow.style.display = 'flex';

  if (cfg.showHud) {
    dom.hud.classList.add('show');
  } else {
    dom.hud.classList.remove('show');
  }

  let idx = 0;
  const lines = cfg.lines;

  function showCurrent() {

    dom.continueBtn.style.visibility = 'hidden';

    typeText(
      lines[idx],
      () => {
        dom.continueBtn.style.visibility = 'visible';
      }
    );
  }

  dom.continueBtn.onclick = () => {

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
  };

  showCurrent();
}


function renderDecision(cfg) {

  if (cfg.bg) {
    setBackground(cfg.bg);
  }

  if (cfg.portrait !== undefined) {
    setPortrait(
      cfg.portrait,
      cfg.portraitPos || 'left'
    );
  }

  dom.nameplate.textContent = cfg.speaker || '';
  dom.nameplate.style.display = cfg.speaker
    ? 'inline-block'
    : 'none';

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

      // Actualizamos las variables
      state.civilizacion += opt.civ || 0;
      state.quiroga += opt.qui || 0;
      state.investigacion += opt.inv || 0;

      updateHUD();

      dom.continueRow.style.display = 'flex';
      dom.continueBtn.style.visibility = 'hidden';

      typeText(
        opt.flavor,
        () => {
          dom.continueBtn.style.visibility = 'visible';
        }
      );

      dom.continueBtn.onclick = () => {

        if (isTyping) {
          finishTypingNow();
        } else {
          cfg.onComplete();
        }

      };
    };

    dom.choices.appendChild(btn);
  });
}


/* ===================================================================
   ESCENAS DEL CAPÍTULO UNO
   =================================================================== */

function sceneInicio() {

  renderScene({

    bg: 'RecursosGraficos/pampa camino.png',

    portrait: '',

    speaker: 'Narrador',

    lines: [

      'El viento de la llanura trae rumores inquietantes mientras recorres los polvorientos caminos de San Juan.',

      'Dicen que el "Tigre de los Llanos" avanza sin detenerse. La gente murmura, algunos con terror, otros con reverencia.',

      'Has llegado a una vieja pulpería buscando respuestas sobre el pasado de Facundo.'

    ],

    showHud: true,

    onComplete: sceneCantina

  });
}


function sceneCantina(){
  renderScene({
    bg: 'RecursosGraficos/pulperiaexteriordia.jpg',
    portrait: '',
    portraitPos: 'left',
    speaker: '',
    lines: [
      'Con el paso de los años, los caminos y las pulperías se convierten en lugares habituales de encuentro.',
      'Allí circulan noticias, rumores y oportunidades.'
    ],
    showHud: true,
    onComplete: () => {
      console.log('LLEGUÉ A ESCENA 5');

      if (typeof escena5Pulperia === 'function') {
        escena5Pulperia();
      } else {
        console.error('ERROR: escena5Pulperia no está definida.');
      }
    }
  });
}

/* ===================================================================
   IMPORTANTE:
   La antigua sceneCantineroInterior() fue eliminada.

   Ahora esa parte pertenece a:
   escena5-pulperia.js

   Y desde ese archivo se continuará hacia:
   escena6.js
   =================================================================== */


function sceneRecuerdoEscuela() {

  renderScene({

    bg: 'RecursosGraficos/escuela.png',

    portrait: 'RecursosGraficos/profesora.png',

    portraitPos: 'right',

    speaker: 'Maestra (Recuerdo)',

    lines: [

      '"¿Facundo? Ah... ese niño era un torbellino indomable", te cuenta la vieja maestra de San Juan.',

      '"No había disciplina que lo contuviera. Su espíritu era el de la pampa misma: salvaje, reacio a las normas de la civilización."'

    ],

    showHud: true,

    onComplete: sceneNino

  });
}


function sceneNino() {

  renderScene({

    portrait: 'RecursosGraficos/facundo niño.png',

    portraitPos: 'left',

    speaker: 'Narrador',

    lines: [

      'Incluso de pequeño, su mirada tenía la fiereza de una fiera acorralada.',

      'Se rebelaba contra los castigos, prefería el rigor de la intemperie a las paredes cerradas del aula.'

    ],

    showHud: true,

    onComplete: sceneJuventud

  });
}


function sceneJuventud() {

  renderScene({

    bg: 'RecursosGraficos/escenario de viveros.png',

    portrait: 'RecursosGraficos/facundo joven.png',

    portraitPos: 'left',

    speaker: 'Narrador',

    lines: [

      'Con el tiempo, el niño se hizo joven entre los viñedos y los campos de la provincia.',

      'El campo le enseñó lo que la escuela no pudo. Forjó su carácter al sol, rodeado de gauchos y peones que pronto verían en él a un líder natural.',

      '(Fin de la demostración. Continúa tu aventura).'

    ],

    showHud: true,

    onComplete: escena6Inicio

  });
}


/* --- INICIO DEL JUEGO --- */

dom.startBtn.addEventListener('click', () => {

  dom.startScreen.remove();

  updateHUD();

  sceneInicio();

});