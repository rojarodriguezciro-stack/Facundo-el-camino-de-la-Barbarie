/* ================================================================
   ESCENA 5 — LA PULPERÍA
   ================================================================ */

const BG_PULPERIA_DIA = {
    exterior: 'RecursosGraficos/pulperiaexteriordia.jpg',
    interior: 'RecursosGraficos/pulperiainteriordia.jpg'
};

const PORTRAIT_PULPERIA = {
    cantinero: 'RecursosGraficos/cantinero (3).png'
};


/* ================================================================
   INICIO DE LA ESCENA 5
   ================================================================ */

function escena5Pulperia() {

    renderScene({
        bg: BG_PULPERIA_DIA.interior,
        portrait: '',
        portraitPos: 'left',
        speaker: '',
        lines: [
            'Dentro de la pulpería, el ambiente es distinto.',
            'Hombres conversan alrededor de las mesas mientras el ruido de las cartas y las voces llena el lugar.'
        ],
        showHud: true,
        onComplete: escena5ApareceCantinero
    });

}


/* ================================================================
   APARECE EL CANTINERO
   ================================================================ */

function escena5ApareceCantinero() {

    renderScene({
        bg: BG_PULPERIA_DIA.interior,
        portrait: PORTRAIT_PULPERIA.cantinero,
        portraitPos: 'left',
        speaker: 'Cantinero',

        lines: [
            'El cantinero se acerca al mostrador y te observa durante unos segundos.',
            'Acá todos parecen conocer a Facundo.',
            '¿Facundo?',
            'Sí. Ese muchacho no pasa desapercibido.',
            '¿Por qué?',
            'Porque tiene algo que los demás no tienen.',
            'Cuando entra a un lugar, todos lo miran.'
        ],

        showHud: true,

        onComplete: function () {
            escena5Pregunta();
        }
    });

}


/* ================================================================
   DECISIÓN
   ================================================================ */

function escena5Pregunta() {

    renderDecision({

        bg: BG_PULPERIA_DIA.interior,

        portrait: PORTRAIT_PULPERIA.cantinero,

        portraitPos: 'left',

        speaker: 'Cantinero',

        prompt: '¿Qué le respondés?',

        showHud: true,

        options: [

            {
                label: '¿Qué tiene de diferente?',
                civ: 10,
                flavor:
                    'El cantinero baja la voz antes de responder. Parece pensar cuidadosamente lo que va a decir.'
            },

            {
                label: 'No parece alguien en quien confiar.',
                qui: 10,
                flavor:
                    'El cantinero te observa en silencio. Después asiente lentamente, como si hubiera escuchado esa opinión antes.'
            },

            {
                label: 'Quizás simplemente sabe hacerse notar.',
                flavor:
                    'El cantinero sonríe apenas. Quizás no sea tan sencillo entender a un hombre como Facundo.'
            }

        ],

       onComplete: function () {
    sceneRecuerdoEscuela();
}

    });

}