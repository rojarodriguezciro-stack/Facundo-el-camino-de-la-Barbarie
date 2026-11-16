"use strict";

/* ===================================================================
   MÓDULOS INTEGRADOS: progreso (navegación al menú) y pantalla completa
   =================================================================== */

const RUTA_MENU_PRINCIPAL = "../VersiónFinal.html";

(function () {
    if (!window.FacundoProgress) {
        const KEY_STEP = "facundoCurrentStep";
        const KEY_FONT = "gameFont";
        const KEY_SIZE = "gameFontSize";
        const KEY_SPEED = "gameTextSpeed";

        const FONTS = [
            "font-serif",
            "font-sans",
            "font-pixel",
            "font-dyslexic"
        ];

        const SIZES = [
            "size-small",
            "size-medium",
            "size-large"
        ];

        const STEPS = {
            prologo: "../Prologo/instancia-jugable (Prologo)/instancia-jugable/index.html",
            capitulo1: "../Capitulo1/Capitulo1/index.html",
            capitulo2: "../Capitulo2/index.html",
            capitulo3: "index.html"
        };

        const leer = (k) => {
            try {
                return localStorage.getItem(k);
            } catch (e) {
                return null;
            }
        };

        const guardar = (k, v) => {
            try {
                localStorage.setItem(k, String(v));
            } catch (e) {
                // Sin almacenamiento
            }
        };

        const irA = (ruta) => {
            window.location.href = encodeURI(ruta);
            return true;
        };

        const existe = (paso) =>
            Object.prototype.hasOwnProperty.call(STEPS, paso);

        const openMenu = () => irA(RUTA_MENU_PRINCIPAL);

        const markCompleted = () =>
            guardar(KEY_STEP, "completed");

        window.FacundoProgress = {
            openMenu,
            markCompleted,

            navigateTo: (paso) =>
                paso === "menu"
                    ? openMenu()
                    : existe(paso)
                        ? irA(STEPS[paso])
                        : false,

            setCurrentStep: (paso) => {
                if (existe(paso)) {
                    guardar(KEY_STEP, paso);
                }
            },

            getCurrentStep: () => {
                const paso = leer(KEY_STEP);

                return paso === "completed" || existe(paso)
                    ? paso
                    : null;
            },

            getSharedSettings: () => {
                const font = leer(KEY_FONT);
                const size = leer(KEY_SIZE);
                const speed = Number(leer(KEY_SPEED));

                return {
                    font: FONTS.includes(font)
                        ? font
                        : "font-serif",

                    size: SIZES.includes(size)
                        ? size
                        : "size-medium",

                    speedPercent:
                        isFinite(speed) && speed > 0
                            ? Math.min(100, Math.max(1, speed))
                            : 70
                };
            },

            saveSharedSettings: (ajustes) => {
                if (!ajustes) return;

                if (FONTS.includes(ajustes.font)) {
                    guardar(KEY_FONT, ajustes.font);
                }

                if (SIZES.includes(ajustes.size)) {
                    guardar(KEY_SIZE, ajustes.size);
                }

                const v = Number(ajustes.speedPercent);

                if (isFinite(v)) {
                    guardar(
                        KEY_SPEED,
                        Math.min(100, Math.max(1, Math.round(v)))
                    );
                }
            }
        };
    }

    if (!window.FacundoFullscreen) {
        const actual = () =>
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            null;

        const entrar = () => {
            const el = document.documentElement;

            if (el.requestFullscreen) {
                return el.requestFullscreen();
            }

            if (el.webkitRequestFullscreen) {
                return Promise.resolve(el.webkitRequestFullscreen());
            }

            return Promise.reject(
                new Error("Este navegador no permite pantalla completa.")
            );
        };

        const salir = () => {
            if (document.exitFullscreen) {
                return document.exitFullscreen();
            }

            if (document.webkitExitFullscreen) {
                return Promise.resolve(document.webkitExitFullscreen());
            }

            return Promise.resolve();
        };

        window.FacundoFullscreen = {
            isActive: () => !!actual(),
            enter: entrar,
            exit: salir,
            toggle: () => actual() ? salir() : entrar()
        };
    }
})();

/* =================== FIN DE LOS MÓDULOS INTEGRADOS =================== */


/* ===================================================================
   1. ELEMENTOS DEL DOM
   =================================================================== */

const bgA = document.getElementById("bgA");
const bgB = document.getElementById("bgB");

const character = document.getElementById("character");
const characterName = document.getElementById("characterName");
const dialogueText = document.getElementById("dialogueText");

const choices = document.getElementById("choices");
const continueButton = document.getElementById("continueButton");

const startOverlay = document.getElementById("startOverlay");
const startButton = document.getElementById("startButton");
const menuStartButton = document.getElementById("menuStartButton");

const endingOverlay = document.getElementById("endingOverlay");
const endingTitle = document.getElementById("endingTitle");
const reflectionText = document.getElementById("reflectionText");

const menuButton = document.getElementById("menuButton");
const backToMenuButton = document.getElementById("backToMenuButton");

const progressBar = document.getElementById("progressBar");


/* ===================================================================
   2. VARIABLES DEL JUEGO
   =================================================================== */

const keys = {
    cap3: "facundo-cap3-stats"
};

let stats = {
    civilizacion: 50,
    barbarie: 50,
    quiroga: 0,
    investigacion: 0
};

let sceneIndex = 0;
let typing = false;
let timer = null;
let currentScene = null;

const historyLog = [];


/* ===================================================================
   3. ESCENAS Y DIÁLOGOS DEL CAPÍTULO 3
   =================================================================== */

const scenes = [
    {
        title: "El llamado",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "Después de los conflictos que habían marcado los capítulos anteriores, Facundo recibió una nueva misión. El camino lo llevaría hacia Córdoba.",
        char: null
    },
    {
        title: "El llamado",
        bg: "img/pampa camino.png",
        name: "Facundo",
        text: "—Si esperan que intervenga, cumpliré con mi deber. Partiremos cuanto antes.",
        char: "img/caudillo.png"
    },
    {
        title: "El llamado",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "El viaje no era solamente un traslado. Cada decisión tomada durante el camino podía revelar la forma en que Facundo enfrentaba un conflicto que parecía cada vez más difícil de controlar.",
        char: null
    },
    {
        title: "El presagio",
        bg: "img/eclipse.png",
        name: "Narrador",
        text: "Antes de continuar, el cielo tomó un aspecto extraño. La luz se volvió tenue y el paisaje quedó envuelto en una oscuridad poco habitual.",
        char: null
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
    {
        decision: true,
        title: "Una advertencia",
        prompt: "¿Cómo responde Facundo ante la advertencia?",
        options: [
            {
                text: "No podemos detenernos ahora.",
                fx: { quiroga: 1, barbarie: 5 },
                logText: "Decidiste seguir sin importar los presagios."
            },
            {
                text: "Quizás debamos tener más cuidado.",
                fx: { investigacion: 1, civilizacion: 5 },
                logText: "Optaste por avanzar con precaución ante las señales."
            },
            {
                text: "Los presagios no decidirán nuestro camino.",
                fx: { civilizacion: 10 },
                logText: "Descartaste las supersticiones con firmeza racional."
            }
        ]
    },
    {
        title: "El viaje",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "A pesar de las dudas, Facundo continuó su viaje. Durante varias jornadas atravesó caminos de tierra, postas y extensas llanuras.",
        char: null
    },
    {
        title: "El viaje",
        bg: "img/pampa camino.png",
        name: "Facundo",
        text: "—El conflicto debe resolverse mediante acuerdos. No podemos permitir que la violencia sea la única respuesta.",
        char: "img/caudillo.png"
    },
    {
        title: "Los rumores",
        bg: "img/pampa camino.png",
        name: "Compañero de viaje",
        text: "—Cada vez son más los rumores. Dicen que hay hombres siguiéndonos.",
        char: "img/comerciante.png"
    },
    {
        title: "Los rumores",
        bg: "img/pampa camino.png",
        name: "Facundo",
        text: "—Los rumores no cambiarán nuestro destino. Pero mantengan los ojos abiertos.",
        char: "img/caudillo.png"
    },
    {
        title: "Los rumores",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "La amenaza todavía no podía verse. Sin embargo, el viaje comenzaba a sentirse diferente: menos como una misión y más como un camino del que quizá no habría regreso.",
        char: null
    },
    {
        title: "La posta",
        bg: "img/posta.png",
        name: "Narrador",
        text: "Al caer la tarde, el grupo llegó a una posta. Allí descansaron antes de continuar el camino.",
        char: null
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
    {
        decision: true,
        title: "La advertencia",
        prompt: "¿Qué decide hacer Facundo después de la advertencia?",
        options: [
            {
                text: "Continuar inmediatamente.",
                fx: { quiroga: 1, barbarie: 5 },
                logText: "Decidiste continuar de inmediato sin demoras."
            },
            {
                text: "Investigar quién controla el camino.",
                fx: { investigacion: 2, civilizacion: 5 },
                logText: "Buscaste indagar sobre el control de la zona."
            },
            {
                text: "Continuar, pero aumentar la vigilancia.",
                fx: { civilizacion: 5 },
                logText: "Tomaste precauciones adicionales en el trayecto."
            }
        ]
    },
    {
        title: "Último tramo",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "El grupo retomó el camino. Las advertencias quedaron atrás, pero el ambiente era cada vez más silencioso.",
        char: null
    },
    {
        title: "Último tramo",
        bg: "img/pampa camino.png",
        name: "Compañero de viaje",
        text: "—No escucho nada. Ni siquiera los animales parecen acercarse.",
        char: "img/comerciante.png"
    },
    {
        title: "Último tramo",
        bg: "img/pampa camino.png",
        name: "Facundo",
        text: "—Entonces avancemos con cautela. Si hay alguien esperando, lo descubriremos pronto.",
        char: "img/caudillo.png"
    },
    {
        title: "Último tramo",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "A lo lejos aparecía Barranca Yacó. El destino de aquel viaje estaba cada vez más cerca.",
        char: null
    },
    {
        title: "Barranca Yacó",
        bg: "img/barranca yaco.png",
        name: "Narrador",
        text: "El 16 de febrero de 1835, la caravana llegó a Barranca Yacó. El lugar parecía tranquilo, pero una partida armada aguardaba en el camino.",
        char: null
    },
    {
        title: "La emboscada",
        bg: "img/barranca yaco.png",
        name: "Narrador",
        text: "Por un instante, todo quedó en silencio.",
        char: null
    },
    {
        title: "La emboscada",
        bg: "img/barranca yaco.png",
        name: "Narrador",
        text: "Entonces comenzó el ataque. La partida dirigida por José Santos Pérez emboscó la caravana.",
        char: null
    },
    {
        title: "La emboscada",
        bg: "img/barranca yaco.png",
        name: "Narrador",
        text: "Facundo Quiroga fue asesinado junto con los hombres que lo acompañaban. El viaje había llegado a su final.",
        char: null
    },
    {
        title: "Después de Barranca Yacó",
        bg: "img/amanecer barranca yaco.png",
        name: "Narrador",
        text: "La muerte de Quiroga provocó una profunda conmoción y tuvo consecuencias políticas en las provincias argentinas. Pero la muerte del hombre no significó el final de su figura.",
        char: null
    },
    {
        title: "Después de Barranca Yacó",
        bg: "img/amanecer barranca yaco.png",
        name: "Narrador",
        text: "Con el paso del tiempo, Facundo dejó de ser solamente una persona de la historia: su figura comenzó a ser interpretada como símbolo de los conflictos de una época.",
        char: null
    },
    {
        title: "La mirada de Sarmiento",
        bg: "img/amanecer barranca yaco.png",
        name: "Sarmiento",
        text: "—¿Quién fue realmente Facundo? ¿Un hombre? ¿Un caudillo? ¿El reflejo de una sociedad dividida?",
        char: "img/sarmiento.png"
    },
    {
        title: "La mirada de Sarmiento",
        bg: "img/amanecer barranca yaco.png",
        name: "Sarmiento",
        text: "—La figura de Facundo puede servir para pensar el conflicto entre distintas formas de entender la Argentina.",
        char: "img/sarmiento.png"
    },
    {
        title: "Civilización y Barbarie",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "En la obra de Sarmiento, Facundo se convierte en una figura central para representar la tensión entre civilización y barbarie.",
        char: null
    },
    {
        title: "Civilización y Barbarie",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "El concepto no aparece solamente como una descripción de una persona. También funciona como una interpretación de los conflictos políticos, sociales y culturales de aquella Argentina.",
        char: null
    },
    {
        title: "El legado",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "Años después, Sarmiento convertiría la figura de Facundo Quiroga en el centro de una de las obras más conocidas de la literatura argentina: Facundo, o Civilización y Barbarie.",
        char: null
    },
    {
        title: "El legado",
        bg: "img/pampa camino.png",
        name: "Narrador",
        text: "Así termina el recorrido del personaje, pero comienza otra historia: la de cómo una persona puede convertirse en símbolo y ser reinterpretada por quienes escriben sobre ella.",
        char: null
    }
];


/* ===================================================================
   4. MÓDULO DE INTERFAZ: HUD Y PROGRESO
   =================================================================== */

function updateHUD() {
    const total = stats.civilizacion + stats.barbarie;

    const civPct = total > 0
        ? Math.round((stats.civilizacion / total) * 100)
        : 50;

    const barbPct = 100 - civPct;

    const civBar = document.getElementById("compass-civil");
    const barbBar = document.getElementById("compass-barbarie");

    if (civBar) {
        civBar.style.width = `${civPct}%`;
    }

    if (barbBar) {
        barbBar.style.width = `${barbPct}%`;
    }
}

function updateProgress() {
    if (!progressBar) return;

    const percent = ((sceneIndex + 1) / scenes.length) * 100;

    progressBar.style.width = `${Math.min(percent, 100)}%`;
}


/* ===================================================================
   5. MÓDULO DE ALMACENAMIENTO
   =================================================================== */

function loadStats() {
    try {
        const saved = JSON.parse(localStorage.getItem(keys.cap3));

        if (saved) {
            stats = { ...stats, ...saved };
        }
    } catch (error) {}

    updateHUD();
}

function saveStats() {
    try {
        localStorage.setItem(
            keys.cap3,
            JSON.stringify(stats)
        );
    } catch (e) {}
}


/* ===================================================================
   6. MÓDULO VISUAL: FONDOS Y PERSONAJES
   =================================================================== */

function setBackground(src) {
    if (!bgA || !bgB) return;

    const current = bgA.style.opacity !== "0" ? bgA : bgB;
    const next = current === bgA ? bgB : bgA;

    if (src) {
        next.style.backgroundImage = `url("${src}")`;
    }

    next.style.opacity = "1";
    current.style.opacity = "0";
}

function setPortrait(src, name) {
    if (!character) return;

    if (src) {
        character.src = src;
        character.alt = name || "Personaje";
        character.classList.add("show");
    } else {
        character.removeAttribute("src");
        character.classList.remove("show");
    }

    if (characterName) {
        characterName.textContent = name || "Narrador";
    }
}


/* ===================================================================
   7. MÓDULO DE HISTORIAL
   =================================================================== */

function addHistoryLog(speaker, text) {
    historyLog.push({ speaker, text });

    const historyLogContainer =
        document.getElementById("history-log");

    if (!historyLogContainer) return;

    const entry = document.createElement("div");

    entry.className = "history-entry";

    entry.innerHTML =
        `<strong style="color: #e5a93c;">${speaker || "Narrador"}:</strong> ${text}`;

    historyLogContainer.appendChild(entry);
}


/* ===================================================================
   8. MÓDULO DE DIÁLOGOS: EFECTO DE ESCRITURA
   =================================================================== */

function typeText(text) {
    clearInterval(timer);

    typing = true;
    dialogueText.textContent = "";

    let i = 0;

    timer = setInterval(() => {
        if (text && i < text.length) {
            dialogueText.textContent += text[i];
            i++;
        } else {
            clearInterval(timer);
            typing = false;
        }
    }, 25);
}

function finishTyping() {
    if (!typing) return false;

    clearInterval(timer);

    dialogueText.textContent = currentScene.text || "";

    typing = false;

    return true;
}


/* ===================================================================
   9. MÓDULO DE DECISIONES Y ESTADÍSTICAS
   =================================================================== */

function applyFx(fx) {
    if (!fx) return;

    Object.keys(fx).forEach(key => {
        stats[key] = (stats[key] || 0) + fx[key];
    });

    updateHUD();
    saveStats();
}


/* ===================================================================
   10. MÓDULO DE RENDERIZADO DE ESCENAS
   =================================================================== */

function renderScene() {
    currentScene = scenes[sceneIndex];

    if (!currentScene) {
        showEnding();
        return;
    }

    choices.innerHTML = "";
    choices.style.display = "none";

    continueButton.style.display = "block";

    setBackground(currentScene.bg);

    setPortrait(
        currentScene.char,
        currentScene.name
    );

    updateProgress();

    addHistoryLog(
        currentScene.name,
        currentScene.text
    );

    typeText(currentScene.text || "");
}

function renderDecision() {
    currentScene = scenes[sceneIndex];

    choices.innerHTML = "";
    choices.style.display = "flex";

    continueButton.style.display = "none";

    if (character) {
        character.classList.remove("show");
    }

    if (characterName) {
        characterName.textContent = "DECISIÓN";
    }

    dialogueText.textContent = currentScene.prompt || "";

    updateProgress();

    if (currentScene.options) {
        currentScene.options.forEach(option => {

            const button = document.createElement("button");

            button.className = "choice-button";
            button.type = "button";
            button.textContent = option.text;

            button.addEventListener("click", () => {

                if (option.fx) {
                    applyFx(option.fx);
                }

                addHistoryLog(
                    "Tu Decisión",
                    option.logText || option.text
                );

                sceneIndex++;

                if (sceneIndex >= scenes.length) {
                    showEnding();
                } else {
                    scenes[sceneIndex].decision
                        ? renderDecision()
                        : renderScene();
                }
            });

            choices.appendChild(button);
        });
    }
}


/* ===================================================================
   11. MÓDULO DE NAVEGACIÓN
   =================================================================== */

function next() {
    if (finishTyping()) return;

    sceneIndex++;

    if (sceneIndex >= scenes.length) {
        showEnding();
        return;
    }

    scenes[sceneIndex].decision
        ? renderDecision()
        : renderScene();
}


/* ===================================================================
   12. MÓDULO DE REFLEXIÓN FINAL
   =================================================================== */

function getReflection() {

    if (stats.investigacion >= 3) {
        return "Prestaste especial atención a las advertencias y al contexto. El final invita a mirar a Facundo no solamente como personaje, sino también como una figura interpretada desde distintas perspectivas históricas.";
    }

    if (stats.quiroga > stats.civilizacion) {
        return "Tus decisiones destacaron la determinación con la que Facundo enfrentó el camino. El final recuerda que una figura histórica puede ser convertida en símbolo mucho después de su muerte.";
    }

    if (stats.civilizacion > stats.quiroga) {
        return "Tus decisiones pusieron el foco en el orden, los acuerdos y la reflexión. El cierre conecta ese recorrido con la oposición entre civilización y barbarie presente en la interpretación de Sarmiento.";
    }

    return "Tus decisiones quedaron entre distintas miradas. El cierre propone pensar cómo una persona, sus acciones y el contexto de su época pueden dar lugar a interpretaciones diferentes.";
}


/* ===================================================================
   13. MÓDULO DE FINALIZACIÓN DEL CAPÍTULO
   =================================================================== */

function showEnding() {
    saveStats();

    if (
        window.FacundoProgress &&
        window.FacundoProgress.markCompleted
    ) {
        window.FacundoProgress.markCompleted();
    }

    if (reflectionText) {
        reflectionText.textContent = getReflection();
    }

    const finalCiv =
        document.getElementById("finalCivilizacion");

    const finalQui =
        document.getElementById("finalQuiroga");

    const finalInv =
        document.getElementById("finalInvestigacion");

    if (finalCiv) {
        finalCiv.textContent = stats.civilizacion;
    }

    if (finalQui) {
        finalQui.textContent = stats.quiroga;
    }

    if (finalInv) {
        finalInv.textContent = stats.investigacion;
    }

    if (endingOverlay) {
        endingOverlay.classList.remove("hidden");

        endingOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


/* ===================================================================
   14. MÓDULO DE INICIO DEL CAPÍTULO
   =================================================================== */

function iniciarCapitulo() {

    if (
        window.FacundoProgress &&
        window.FacundoProgress.setCurrentStep
    ) {
        window.FacundoProgress.setCurrentStep("capitulo3");
    }

    if (startOverlay) {
        startOverlay.classList.add("hidden");
    }

    const hud = document.getElementById("hud");

    if (hud) {
        hud.classList.add("show");
    }

    sceneIndex = 0;

    loadStats();
    renderScene();
}


/* ===================================================================
   15. MÓDULO DE REGRESO AL MENÚ
   =================================================================== */

let modalConfirmarMenu = null;

/* --- Navegación --- */

function volverAlMenu() {

    if (
        window.FacundoProgress &&
        window.FacundoProgress.openMenu
    ) {
        window.FacundoProgress.openMenu();
    } else {
        window.location.href =
            encodeURI(RUTA_MENU_PRINCIPAL);
    }
}

/* --- Construcción del cuadro (reutiliza las clases .modal y .big-btn del CSS) --- */

function crearModalConfirmarMenu() {

    const modal = document.createElement("div");
    modal.id = "confirm-menu-modal";
    modal.className = "modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "confirm-menu-title");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 420px; text-align: center;">
            <h3 id="confirm-menu-title">¿Seguro que querés volver al menú?</h3>
            <p style="margin: 0.75rem 0 1.25rem;">Vas a salir de la partida actual.</p>
            <div style="display: flex; gap: 0.75rem;">
                <button id="confirm-menu-yes" type="button" class="big-btn" style="flex: 1;">Sí</button>
                <button id="confirm-menu-no" type="button" class="big-btn" style="flex: 1;">No</button>
            </div>
        </div>
    `;

    modal
        .querySelector("#confirm-menu-yes")
        .addEventListener("click", volverAlMenu);

    modal
        .querySelector("#confirm-menu-no")
        .addEventListener("click", cerrarConfirmacionMenu);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            cerrarConfirmacionMenu();
        }
    });

    const referencia =
        document.getElementById("settings-modal");

    const contenedor =
        (referencia && referencia.parentNode) || document.body;

    contenedor.appendChild(modal);

    return modal;
}

/* --- Abrir / cerrar / consultar estado --- */

function abrirConfirmacionMenu() {

    if (!modalConfirmarMenu) {
        modalConfirmarMenu = crearModalConfirmarMenu();
    }

    modalConfirmarMenu.classList.remove("hidden");
    modalConfirmarMenu.setAttribute("aria-hidden", "false");
    modalConfirmarMenu.querySelector("#confirm-menu-no").focus();
}

function cerrarConfirmacionMenu() {

    if (!modalConfirmarMenu) {
        return;
    }

    modalConfirmarMenu.classList.add("hidden");
    modalConfirmarMenu.setAttribute("aria-hidden", "true");
}

function confirmacionMenuAbierta() {

    return (
        Boolean(modalConfirmarMenu) &&
        !modalConfirmarMenu.classList.contains("hidden")
    );
}

/* --- Conexión con el botón "Menú" de la barra superior --- */

function initConfirmacionMenu() {

    const topMenuButton =
        document.getElementById("btn-menu");

    if (topMenuButton) {
        topMenuButton.addEventListener(
            "click",
            abrirConfirmacionMenu
        );
    }

    // Esc = "No"
    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            confirmacionMenuAbierta()
        ) {
            cerrarConfirmacionMenu();
        }
    });
}


/* ===================================================================
   16. MÓDULO DE EVENTOS E INTERACCIONES
   =================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadStats();

    // Inicio del capítulo
    if (startButton) {
        startButton.addEventListener(
            "click",
            iniciarCapitulo
        );
    }

    // Regresar al menú desde la pantalla inicial
    if (menuStartButton) {
        menuStartButton.addEventListener(
            "click",
            volverAlMenu
        );
    }

    // Botón continuar
    if (continueButton) {
        continueButton.addEventListener(
            "click",
            next
        );
    }

    // Botones de menú
    if (menuButton) {
        menuButton.addEventListener(
            "click",
            volverAlMenu
        );
    }

    if (backToMenuButton) {
        backToMenuButton.addEventListener(
            "click",
            volverAlMenu
        );
    }

    // Botón Menú de la barra superior (pide confirmación)
    initConfirmacionMenu();

    // Ajustes
    const settingsBtn =
        document.getElementById("btn-settings");

    const settingsModal =
        document.getElementById("settings-modal");

    const closeSettings =
        document.getElementById("close-settings");

    // Pantalla completa
    const fullscreenButton =
        document.getElementById("btn-fullscreen");

    if (fullscreenButton) {
        fullscreenButton.addEventListener("click", () => {

            window.FacundoFullscreen.toggle().catch((err) => {
                console.error(
                    `Error al cambiar pantalla completa: ${err.message}`
                );
            });

        });
    }

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("hidden");
        });
    }

    if (closeSettings && settingsModal) {
        closeSettings.addEventListener("click", () => {
            settingsModal.classList.add("hidden");
        });
    }

    // Historial
    const historyBtn =
        document.getElementById("btn-history");

    const historyModal =
        document.getElementById("history-modal");

    const closeHistory =
        document.getElementById("close-history");

    if (historyBtn && historyModal) {
        historyBtn.addEventListener("click", () => {
            historyModal.classList.remove("hidden");
        });
    }

    if (closeHistory && historyModal) {
        closeHistory.addEventListener("click", () => {
            historyModal.classList.add("hidden");
        });
    }

    // Navegación mediante teclado
    document.addEventListener("keydown", event => {

        if (confirmacionMenuAbierta()) {
            return;
        }

        if (
            event.key === "Enter" ||
            event.key === "ArrowRight" ||
            event.key === " "
        ) {

            if (
                startOverlay &&
                !startOverlay.classList.contains("hidden")
            ) {
                return;
            }

            if (
                endingOverlay &&
                !endingOverlay.classList.contains("hidden")
            ) {
                return;
            }

            if (
                continueButton &&
                continueButton.style.display !== "none"
            ) {
                next();
            }
        }
    });

});