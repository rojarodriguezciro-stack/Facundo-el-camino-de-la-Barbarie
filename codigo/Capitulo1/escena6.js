/* ================================================================
   ESCENA 6 — LA PASIÓN DEL JUEGO
   ================================================================ */


/* ================================================================
   FONDO Y RETRATO
   ================================================================ */

const BG_ESCENA6 = {
    fondo: 'RecursosGraficos/escenario de viveros.png'
};

const PORTRAIT_ESCENA6 = {
    facundo: 'RecursosGraficos/facundo joven.png'
};


/* ================================================================
   6.1 — NARRADOR
   ================================================================ */

function escena6Inicio() {

    renderScene({
        bg: BG_ESCENA6.fondo,
        portrait: '',
        portraitPos: 'left',
        speaker: 'Narrador',

        lines: [
            'Durante su juventud, Facundo desarrolla una fuerte pasión por el juego.',
            'Para Sarmiento, esa pasión no era solamente una diversión: representaba una parte de su carácter impulsivo y de su necesidad de asumir riesgos.'
        ],

        showHud: true,

        onComplete: escena6Facundo
    });

}


/* ================================================================
   6.2 — APARECE FACUNDO
   ================================================================ */

function escena6Facundo() {

    renderScene({
        bg: BG_ESCENA6.fondo,
        portrait: PORTRAIT_ESCENA6.facundo,
        portraitPos: 'left',
        speaker: 'Facundo',

        lines: [
            'Cuando uno tiene que elegir entre quedarse quieto o arriesgarse...',
            'Yo ya sé qué camino tomaría.'
        ],

        showHud: true,

        onComplete: escena6Pregunta
    });

}


/* ================================================================
   6.3 — DECISIÓN 5
   ================================================================ */

function escena6Pregunta() {

    renderDecision({
        bg: BG_ESCENA6.fondo,
        portrait: PORTRAIT_ESCENA6.facundo,
        portraitPos: 'left',
        speaker: 'Facundo',

        prompt: '¿Qué le respondés?',

        showHud: true,

        options: [

            {
                label: 'Arriesgarse puede abrir nuevos caminos.',
                qui: 10,
                flavor:
                    'Facundo sonríe. Parece reconocer algo de sí mismo en tus palabras.'
            },

            {
                label: 'No todo riesgo vale la pena.',
                civ: 10,
                flavor:
                    'Facundo se queda pensativo. No está acostumbrado a que alguien cuestione sus impulsos.'
            },

            {
                label: 'Primero hay que pensar en las consecuencias.',
                flavor:
                    'La respuesta no parece convencerlo. Pero tampoco la rechaza.'
            }

        ],

        onComplete: function () {
            escena7Inicio();
        }
    });

}