/* ================================================================
   ESCENA 7 — ¿QUIÉN ES FACUNDO?
   Cierre del capítulo uno
   ================================================================ */


/* ================================================================
   FONDO Y RETRATO
   ================================================================ */

const BG_ESCENA7 = {
    pampa: 'RecursosGraficos/pampa-camino.jpg'
};

const PORTRAIT_ESCENA7 = {
    facundo: 'RecursosGraficos/facundo joven.png'
};


/* ================================================================
   7.1 — NARRADOR
   ================================================================ */

function escena7Inicio() {

    renderScene({
        bg: BG_ESCENA7.pampa,
        portrait: '',
        portraitPos: 'left',
        speaker: 'Narrador',

        lines: [
            'Los años de juventud van quedando atrás.',
            'El niño que se enfrentaba a su maestro ya no existe.',
            'Pero algunas características permanecen.',
            'Su orgullo.',
            'Su independencia.',
            'Su voluntad.',
            'Su dificultad para aceptar límites.'
        ],

        showHud: true,

        onComplete: escena7PreguntaProtagonista
    });

}


/* ================================================================
   7.2 — PREGUNTA DEL PROTAGONISTA
   ================================================================ */

function escena7PreguntaProtagonista() {

    renderScene({
        bg: BG_ESCENA7.pampa,
        portrait: '',
        portraitPos: 'left',
        speaker: 'Protagonista',

        lines: [
            'Entonces... ¿ya estaba destinado a convertirse en caudillo?'
        ],

        showHud: true,

        onComplete: escena7RespuestaNarrador
    });

}


/* ================================================================
   7.3 — RESPUESTA DEL NARRADOR
   ================================================================ */

function escena7RespuestaNarrador() {

    renderScene({
        bg: BG_ESCENA7.pampa,
        portrait: '',
        portraitPos: 'left',
        speaker: 'Narrador',

        lines: [
            'Esa es precisamente la pregunta.',
            'Sarmiento intenta encontrar en la juventud de Facundo las raíces del hombre que aparecerá después en la historia.',
            'Pero conocer sus primeros años no significa que podamos reducir toda su vida a ellos.'
        ],

        showHud: true,

        onComplete: escena7Facundo
    });

}


/* ================================================================
   7.4 — FACUNDO
   ================================================================ */

function escena7Facundo() {

    renderScene({
        bg: BG_ESCENA7.pampa,
        portrait: PORTRAIT_ESCENA7.facundo,
        portraitPos: 'left',
        speaker: 'Facundo',

        lines: [
            'El camino recién empieza.'
        ],

        showHud: true,

        onComplete: escena7DecisionFinal
    });

}


/* ================================================================
   7.5 — DECISIÓN FINAL DEL CAPÍTULO
   ================================================================ */

function escena7DecisionFinal() {

    renderDecision({
        bg: BG_ESCENA7.pampa,
        portrait: PORTRAIT_ESCENA7.facundo,
        portraitPos: 'left',
        speaker: 'Protagonista',

        prompt: '¿Qué decidís hacer?',

        showHud: true,

        options: [

            {
                label: 'Voy a acompañarlo.',
                qui: 2,
                flavor:
                    'Decidís acercarte a Facundo y conocer de cerca el mundo que lo rodea.'
            },

            {
                label: 'Voy a observarlo desde lejos.',
                flavor:
                    'Preferís mantener cierta distancia.'
            },

            {
                label: 'Quiero entender qué hay detrás de él.',
                inv: 1,
                flavor:
                    'No querés simplemente seguir a Facundo. Querés descubrir qué circunstancias están formando al futuro caudillo.'
            }

        ],

        onComplete: escena7Cierre
    });

}


/* ================================================================
   7.6 — CIERRE DEL CAPÍTULO
   ================================================================ */

function escena7Cierre() {

    setBackground(BG_ESCENA7.pampa);
    setPortrait('');

    renderScene({
        bg: BG_ESCENA7.pampa,
        portrait: '',
        portraitPos: 'left',
        speaker: 'Narrador',

        lines: [
            'Facundo todavía no es el caudillo que la historia recordará.',
            'Pero el camino hacia ese hombre ya comenzó.',
            'Y el próximo destino será La Rioja.'
        ],

        showHud: false,

        onComplete: escena7PantallaFinal
    });

}


/* ================================================================
   7.7 — PANTALLA FINAL
   ================================================================ */

function escena7PantallaFinal() {

    dom.continueRow.style.display = 'none';
    dom.dialogueBox.style.display = 'none';
    setPortrait('');

    const overlay = document.createElement('div');
    overlay.className = 'overlay-screen';

    const card = document.createElement('div');
    card.className = 'ending-card';

    const title = document.createElement('h2');
    title.className = 'ending-title';
    title.textContent = 'FIN DEL CAPÍTULO 1';

    card.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'ending-score';
    subtitle.textContent = 'EL JOVEN QUIROGA';

    card.appendChild(subtitle);

    const summary = document.createElement('div');
    summary.className = 'ending-body';

    const decisiones = document.createElement('p');
    decisiones.textContent = 'Decisiones tomadas: 6';

    const relacion = document.createElement('p');
    relacion.textContent =
        `Relación con Quiroga: ${state.quiroga}`;

    const investigacion = document.createElement('p');
    investigacion.textContent =
        `Investigación: ${state.investigacion}`;

    summary.appendChild(decisiones);
    summary.appendChild(relacion);
    summary.appendChild(investigacion);

    card.appendChild(summary);

    const camino = document.createElement('p');
    camino.className = 'ending-score';

    if (state.quiroga > state.civilizacion &&
        state.quiroga >= state.investigacion) {

        camino.textContent = 'Camino elegido: Cercano';

    } else if (state.investigacion > state.quiroga &&
               state.investigacion > state.civilizacion) {

        camino.textContent = 'Camino elegido: Crítico';

    } else {

        camino.textContent = 'Camino elegido: Observador';

    }

    card.appendChild(camino);

    overlay.appendChild(card);
    dom.stage.appendChild(overlay);

}