
/* =========================================================
   FACUNDO: CAMINO DE LA BARBARIE
   CAPÍTULO 3 - EL ÚLTIMO VIAJE
   Versión revisada:
   último viaje, rumores, advertencias,
   Barranca Yacó, consecuencias,
   Sarmiento, Civilización y Barbarie y legado.
   ========================================================= */

const bgA = document.getElementById("bgA");
const bgB = document.getElementById("bgB");
const character = document.getElementById("character");
const characterName = document.getElementById("characterName");
const dialogueText = document.getElementById("dialogueText");
const choices = document.getElementById("choices");
const continueButton = document.getElementById("continueButton");
const continueIndicator = document.getElementById("continueIndicator");
const startOverlay = document.getElementById("startOverlay");
const startButton = document.getElementById("startButton");
const endingOverlay = document.getElementById("endingOverlay");
const endingTitle = document.getElementById("endingTitle");
const endingText = document.getElementById("endingText");
const reflectionText = document.getElementById("reflectionText");
const menuButton = document.getElementById("menuButton");
const sceneTitle = document.getElementById("sceneTitle");
const progressBar = document.getElementById("progressBar");

/* =========================================================
   CLAVES DE LOCAL STORAGE
   ========================================================= */

const keys = {
    perfil: "facundo-perfil",
    cap1: "facundo-cap1-stats",
    cap3: "facundo-cap3-stats"
};

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */

let stats = {
    civilizacion: 0,
    quiroga: 0,
    investigacion: 0
};

/* =========================================================
   VARIABLES DE CONTROL
   ========================================================= */

let sceneIndex = 0;
let typing = false;
let timer = null;
let currentScene = null;

/* =========================================================
   HISTORIA
   ========================================================= */

const scenes = [

    /* =====================================================
       EL LLAMADO
       ===================================================== */

    {
        title: "El llamado",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "Después de los conflictos que habían marcado los capítulos anteriores, Facundo recibió una nueva misión. El camino lo llevaría hacia Córdoba.",
        char: ""
    },

    {
        title: "El llamado",
        bg: "img/pampa-camino.png",
        name: "Facundo",
        text: "—Si esperan que intervenga, cumpliré con mi deber. Partiremos cuanto antes.",
        char: "img/caudillo.png"
    },

    {
        title: "El llamado",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "El viaje no era solamente un traslado. Cada decisión tomada durante el camino podía revelar la forma en que Facundo enfrentaba un conflicto que parecía cada vez más difícil de controlar.",
        char: ""
    },

    /* =====================================================
       EL PRESAGIO
       ===================================================== */

    {
        title: "El presagio",
        bg: "img/eclipse.png",
        name: "Narrador",
        text: "Antes de continuar, el cielo tomó un aspecto extraño. La luz se volvió tenue y el paisaje quedó envuelto en una oscuridad poco habitual.",
        char: ""
    },

    {
        title: "El presagio",
        bg: "img/eclipse.png",
        name: "Compañero de viaje",
        text: "—Facundo, quizá sea mejor esperar. El viaje no parece comenzar bajo buenos augurios.",
        char: "img/comerciante.png"
    },

    {
        title: "El presagio",
        bg: "img/eclipse.png",
        name: "Facundo",
        text: "—Es extraño... Pero no podemos detener el viaje por una señal del cielo.",
        char: "img/caudillo.png"
    },

    /* DECISIÓN 1 */

    {
        decision: true,
        title: "Una advertencia",
        prompt: "¿Cómo responde Facundo ante la advertencia?",
        options: [
            {
                text: "No podemos detenernos ahora.",
                fx: {
                    quiroga: 1
                }
            },
            {
                text: "Quizás debamos tener más cuidado.",
                fx: {
                    investigacion: 1
                }
            },
            {
                text: "Los presagios no decidirán nuestro camino.",
                fx: {
                    civilizacion: 1
                }
            }
        ]
    },

    /* =====================================================
       EL VIAJE
       ===================================================== */

    {
        title: "El viaje",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "A pesar de las dudas, Facundo continuó su viaje. Durante varias jornadas atravesó caminos de tierra, postas y extensas llanuras.",
        char: ""
    },

    {
        title: "El viaje",
        bg: "img/pampa-camino.png",
        name: "Facundo",
        text: "—El conflicto debe resolverse mediante acuerdos. No podemos permitir que la violencia sea la única respuesta.",
        char: "img/caudillo.png"
    },

    /* =====================================================
       LOS RUMORES
       ===================================================== */

    {
        title: "Los rumores",
        bg: "img/pampa-camino.png",
        name: "Compañero de viaje",
        text: "—Cada vez son más los rumores. Dicen que hay hombres siguiéndonos.",
        char: "img/comerciante.png"
    },

    {
        title: "Los rumores",
        bg: "img/pampa-camino.png",
        name: "Facundo",
        text: "—Los rumores no cambiarán nuestro destino. Pero mantengan los ojos abiertos.",
        char: "img/caudillo.png"
    },

    {
        title: "Los rumores",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "La amenaza todavía no podía verse. Sin embargo, el viaje comenzaba a sentirse diferente: menos como una misión y más como un camino del que quizá no habría regreso.",
        char: ""
    },

    /* =====================================================
       LA POSTA
       ===================================================== */

    {
        title: "La posta",
        bg: "img/posta.png",
        name: "Narrador",
        text: "Al caer la tarde, el grupo llegó a una posta. Allí descansaron antes de continuar el camino.",
        char: ""
    },

    {
        title: "La posta",
        bg: "img/posta.png",
        name: "Comerciante",
        text: "—Dicen que los caminos no están seguros. Hay hombres armados moviéndose por la zona.",
        char: "img/comerciante.png"
    },

    {
        title: "La posta",
        bg: "img/posta.png",
        name: "Comerciante",
        text: "—Si van hacia Barranca Yacó, deberían pensarlo dos veces. Hay quienes aseguran que Santos Pérez espera por allí.",
        char: "img/comerciante.png"
    },

    /* DECISIÓN 2 */

    {
        decision: true,
        title: "La advertencia",
        prompt: "¿Qué decide hacer Facundo después de la advertencia?",
        options: [
            {
                text: "Continuar inmediatamente.",
                fx: {
                    quiroga: 1
                }
            },
            {
                text: "Investigar quién controla el camino.",
                fx: {
                    investigacion: 2
                }
            },
            {
                text: "Continuar, pero aumentar la vigilancia.",
                fx: {
                    civilizacion: 1,
                    investigacion: 1
                }
            }
        ]
    },

    /* =====================================================
       ÚLTIMO TRAMO
       ===================================================== */

    {
        title: "Último tramo",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "El grupo retomó el camino. Las advertencias quedaron atrás, pero el ambiente era cada vez más silencioso.",
        char: ""
    },

    {
        title: "Último tramo",
        bg: "img/pampa-camino.png",
        name: "Compañero de viaje",
        text: "—No escucho nada. Ni siquiera los animales parecen acercarse.",
        char: "img/comerciante.png"
    },

    {
        title: "Último tramo",
        bg: "img/pampa-camino.png",
        name: "Facundo",
        text: "—Entonces avancemos con cautela. Si hay alguien esperando, lo descubriremos pronto.",
        char: "img/caudillo.png"
    },

    {
        title: "Último tramo",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "A lo lejos aparecía Barranca Yacó. El destino de aquel viaje estaba cada vez más cerca.",
        char: ""
    },

    /* =====================================================
       BARRANCA YACÓ
       ===================================================== */

    {
        title: "Barranca Yacó",
        bg: "img/barranca-yaco.png",
        name: "Narrador",
        text: "El 16 de febrero de 1835, la caravana llegó a Barranca Yacó. El lugar parecía tranquilo, pero una partida armada aguardaba en el camino.",
        char: ""
    },

    /* =====================================================
       LA EMBOSCADA
       ===================================================== */

    {
        title: "La emboscada",
        bg: "img/barranca-yaco.png",
        name: "Narrador",
        text: "Por un instante, todo quedó en silencio.",
        char: ""
    },

    {
        title: "La emboscada",
        bg: "img/barranca-yaco.png",
        name: "Narrador",
        text: "Entonces comenzó el ataque. La partida dirigida por José Santos Pérez emboscó la caravana.",
        char: ""
    },

    {
        title: "La emboscada",
        bg: "img/barranca-yaco.png",
        name: "Narrador",
        text: "Facundo Quiroga fue asesinado junto con los hombres que lo acompañaban. El viaje había llegado a su final.",
        char: ""
    },

    /* =====================================================
       DESPUÉS DE BARRANCA YACÓ
       ===================================================== */

    {
        title: "Después de Barranca Yacó",
        bg: "img/amanecer-barranca-yaco.png",
        name: "Narrador",
        text: "La muerte de Quiroga provocó una profunda conmoción y tuvo consecuencias políticas en las provincias argentinas. Pero la muerte del hombre no significó el final de su figura.",
        char: ""
    },

    {
        title: "Después de Barranca Yacó",
        bg: "img/amanecer-barranca-yaco.png",
        name: "Narrador",
        text: "Con el paso del tiempo, Facundo dejó de ser solamente una persona de la historia: su figura comenzó a ser interpretada como símbolo de los conflictos de una época.",
        char: ""
    },

    /* =====================================================
       SARMIENTO
       ===================================================== */

    {
        title: "La mirada de Sarmiento",
        bg: "img/amanecer-barranca-yaco.png",
        name: "Sarmiento",
        text: "—¿Quién fue realmente Facundo? ¿Un hombre? ¿Un caudillo? ¿O el reflejo de una sociedad dividida?",
        char: "img/sarmiento.png"
    },

    {
        title: "La mirada de Sarmiento",
        bg: "img/amanecer-barranca-yaco.png",
        name: "Sarmiento",
        text: "—La figura de Facundo puede servir para pensar el conflicto entre distintas formas de entender la Argentina.",
        char: "img/sarmiento.png"
    },

    /* =====================================================
       CIVILIZACIÓN Y BARBARIE
       ===================================================== */

    {
        title: "Civilización y Barbarie",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "En la obra de Sarmiento, Facundo se convierte en una figura central para representar la tensión entre civilización y barbarie.",
        char: ""
    },

    {
        title: "Civilización y Barbarie",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "El concepto no aparece solamente como una descripción de una persona. También funciona como una interpretación de los conflictos políticos, sociales y culturales de aquella Argentina.",
        char: ""
    },

    /* =====================================================
       EL LEGADO
       ===================================================== */

    {
        title: "El legado",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "Años después, Sarmiento convertiría la figura de Facundo Quiroga en el centro de una de las obras más conocidas de la literatura argentina: Facundo, o Civilización y Barbarie.",
        char: ""
    },

    {
        title: "El legado",
        bg: "img/pampa-camino.png",
        name: "Narrador",
        text: "Así termina el recorrido del personaje, pero comienza otra historia: la de cómo una persona puede convertirse en símbolo y ser reinterpretada por quienes escriben sobre ella.",
        char: ""
    }
];

/* =========================================================
   ACTUALIZAR ESTADÍSTICAS
   ========================================================= */

function updateHUD() {
    const civilizacion = document.getElementById("statCivilizacion");
    const quiroga = document.getElementById("statQuiroga");
    const investigacion = document.getElementById("statInvestigacion");

    if (civilizacion) {
        civilizacion.textContent = stats.civilizacion;
    }

    if (quiroga) {
        quiroga.textContent = stats.quiroga;
    }

    if (investigacion) {
        investigacion.textContent = stats.investigacion;
    }
}

/* =========================================================
   BARRA DE PROGRESO
   ========================================================= */

function updateProgress() {
    if (!progressBar) return;

    const percent = ((sceneIndex + 1) / scenes.length) * 100;

    progressBar.style.width = `${Math.min(percent, 100)}%`;
}

/* =========================================================
   CARGAR ESTADÍSTICAS
   ========================================================= */

function loadStats() {
    try {
        const savedStats = JSON.parse(
            localStorage.getItem(keys.cap3)
        );

        if (savedStats) {
            stats = {
                ...stats,
                ...savedStats
            };
        }
    } catch (error) {
        console.log("No se pudieron cargar las estadísticas.");
    }

    updateHUD();
}

/* =========================================================
   GUARDAR ESTADÍSTICAS
   ========================================================= */

function saveStats() {
    localStorage.setItem(
        keys.cap3,
        JSON.stringify(stats)
    );
}

/* =========================================================
   CAMBIO DE FONDO
   ========================================================= */

function setBackground(src) {

    if (!src || !bgA || !bgB) return;

    const current =
        bgA.style.opacity !== "0"
            ? bgA
            : bgB;

    const next =
        current === bgA
            ? bgB
            : bgA;

    next.style.backgroundImage = `url("${src}")`;
    next.style.opacity = "1";

    current.style.opacity = "0";
}

/* =========================================================
   CAMBIO DE PERSONAJE
   ========================================================= */

function setPortrait(src, name) {

    if (!character) return;

    if (src) {

        character.src = src;
        character.alt = name || "Personaje";
        character.style.display = "block";

    } else {

        character.removeAttribute("src");
        character.style.display = "none";
    }

    if (characterName) {
        characterName.textContent =
            name || "Narrador";
    }
}

/* =========================================================
   EFECTO DE ESCRITURA
   ========================================================= */

function typeText(text) {

    clearInterval(timer);

    typing = true;
    dialogueText.textContent = "";

    let i = 0;

    timer = setInterval(() => {

        dialogueText.textContent += text[i];

        i++;

        if (i >= text.length) {

            clearInterval(timer);

            typing = false;

            if (continueIndicator) {
                continueIndicator.classList.add("visible");
            }
        }

    }, 16);

    if (continueIndicator) {
        continueIndicator.classList.remove("visible");
    }
}

/* =========================================================
   FINALIZAR TEXTO INSTANTÁNEAMENTE
   ========================================================= */

function finishTyping() {

    if (!typing) {
        return false;
    }

    clearInterval(timer);

    dialogueText.textContent =
        currentScene.text;

    typing = false;

    if (continueIndicator) {
        continueIndicator.classList.add("visible");
    }

    return true;
}

/* =========================================================
   APLICAR EFECTOS DE LAS DECISIONES
   ========================================================= */

function applyFx(fx) {

    Object.keys(fx).forEach(key => {

        stats[key] =
            (stats[key] || 0) + fx[key];

    });

    updateHUD();
    saveStats();
}

/* =========================================================
   MOSTRAR UNA ESCENA
   ========================================================= */

function renderScene() {

    currentScene =
        scenes[sceneIndex];

    choices.innerHTML = "";
    choices.style.display = "none";

    continueButton.style.display = "block";

    sceneTitle.textContent =
        currentScene.title || "";

    setBackground(
        currentScene.bg
    );

    setPortrait(
        currentScene.char,
        currentScene.name
    );

    updateProgress();

    typeText(
        currentScene.text
    );
}

/* =========================================================
   MOSTRAR UNA DECISIÓN
   ========================================================= */

function renderDecision() {

    currentScene =
        scenes[sceneIndex];

    choices.innerHTML = "";

    choices.style.display = "flex";

    continueButton.style.display = "none";

    character.style.display = "none";

    characterName.textContent =
        "DECISIÓN";

    sceneTitle.textContent =
        currentScene.title || "Decisión";

    dialogueText.textContent =
        currentScene.prompt;

    continueIndicator.classList.remove(
        "visible"
    );

    updateProgress();

    currentScene.options.forEach(option => {

        const button =
            document.createElement("button");

        button.className =
            "choice-button";

        button.type =
            "button";

        button.textContent =
            option.text;

        button.addEventListener(
            "click",
            () => {

                applyFx(option.fx);

                sceneIndex++;

                if (
                    sceneIndex >=
                    scenes.length
                ) {

                    showEnding();

                } else {

                    scenes[sceneIndex].decision
                        ? renderDecision()
                        : renderScene();
                }
            }
        );

        choices.appendChild(button);
    });
}

/* =========================================================
   SIGUIENTE ESCENA
   ========================================================= */

function next() {

    if (finishTyping()) {
        return;
    }

    sceneIndex++;

    if (
        sceneIndex >=
        scenes.length
    ) {

        showEnding();
        return;
    }

    if (
        scenes[sceneIndex].decision
    ) {

        renderDecision();

    } else {

        renderScene();
    }
}

/* =========================================================
   REFLEXIÓN FINAL
   ========================================================= */

function getReflection() {

    if (
        stats.investigacion >= 3
    ) {

        return "Prestaste especial atención a las advertencias y al contexto. El final invita a mirar a Facundo no solamente como personaje, sino también como una figura interpretada desde distintas perspectivas históricas.";
    }

    if (
        stats.quiroga >
        stats.civilizacion
    ) {

        return "Tus decisiones destacaron la determinación con la que Facundo enfrentó el camino. El final recuerda que una figura histórica puede ser convertida en símbolo mucho después de su muerte.";
    }

    if (
        stats.civilizacion >
        stats.quiroga
    ) {

        return "Tus decisiones pusieron el foco en el orden, los acuerdos y la reflexión. El cierre conecta ese recorrido con la oposición entre civilización y barbarie presente en la interpretación de Sarmiento.";
    }

    return "Tus decisiones quedaron entre distintas miradas. El cierre propone pensar cómo una persona, sus acciones y el contexto de su época pueden dar lugar a interpretaciones diferentes.";
}

/* =========================================================
   MOSTRAR FINAL
   ========================================================= */

function showEnding() {

    saveStats();

    endingTitle.textContent =
        "EL LEGADO";

    endingText.textContent =
        "Facundo ha muerto, pero su figura continúa. El viaje termina en Barranca Yacó; la interpretación de su figura recién comienza.";

    reflectionText.textContent =
        getReflection();

    const finalCivilizacion =
        document.getElementById(
            "finalCivilizacion"
        );

    const finalQuiroga =
        document.getElementById(
            "finalQuiroga"
        );

    const finalInvestigacion =
        document.getElementById(
            "finalInvestigacion"
        );

    if (finalCivilizacion) {
        finalCivilizacion.textContent =
            stats.civilizacion;
    }

    if (finalQuiroga) {
        finalQuiroga.textContent =
            stats.quiroga;
    }

    if (finalInvestigacion) {
        finalInvestigacion.textContent =
            stats.investigacion;
    }

    endingOverlay.classList.remove(
        "hidden"
    );

    endingOverlay.setAttribute(
        "aria-hidden",
        "false"
    );
}

/* =========================================================
   INICIAR CAPÍTULO
   ========================================================= */

function iniciarCapitulo() {

    startOverlay.classList.add(
        "hidden"
    );

    sceneIndex = 0;

    loadStats();

    renderScene();
}

/* =========================================================
   VOLVER AL MENÚ
   ========================================================= */

function volverAlMenu() {

    window.location.href =
        "../Men%23U00faPrincipal.html";
}

/* =========================================================
   EVENTOS
   ========================================================= */

startButton.addEventListener(
    "click",
    iniciarCapitulo
);

continueButton.addEventListener(
    "click",
    next
);

menuButton.addEventListener(
    "click",
    volverAlMenu
);

/* =========================================================
   CONTROLES DE TECLADO
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === "ArrowRight" ||
            event.key === " "
        ) {

            if (
                !startOverlay.classList.contains(
                    "hidden"
                )
            ) {
                return;
            }

            if (
                !endingOverlay.classList.contains(
                    "hidden"
                )
            ) {
                return;
            }

            if (
                continueButton.style.display !==
                "none"
            ) {

                next();
            }
        }
    }
);

/* =========================================================
   CARGAR ESTADÍSTICAS AL ABRIR
   ========================================================= */

loadStats();
