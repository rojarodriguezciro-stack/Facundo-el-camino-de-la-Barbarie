/* ==================================================
   FACUNDO: CAMINO DE LA BARBARIE
================================================== */


/* --------------------------------------------------
   1) MODALES (ajustes, diario, perfil, salir, créditos)
-------------------------------------------------- */

// Botones que abren un modal: cualquier elemento con [data-modal="id-del-modal"]
const botonesQueAbrenModal = document.querySelectorAll("[data-modal]");

// Botones que cierran el modal en el que están: [data-cerrar]
const botonesQueCierranModal = document.querySelectorAll("[data-cerrar]");

// Todos los overlays de modal
const modales = document.querySelectorAll(".modal");


function abrirModal(idModal) {

    const modal = document.getElementById(idModal);

    if (!modal) {
        return;
    }

    modal.classList.add("activo");

}


function cerrarTodosLosModales() {

    modales.forEach(function (modal) {
        modal.classList.remove("activo");
    });

}


botonesQueAbrenModal.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const idModal = boton.dataset.modal;

        abrirModal(idModal);

    });

});


botonesQueCierranModal.forEach(function (boton) {

    boton.addEventListener("click", cerrarTodosLosModales);

});


// Cerrar el modal si se hace click afuera del recuadro
modales.forEach(function (modal) {

    modal.addEventListener("click", function (evento) {

        if (evento.target === modal) {
            cerrarTodosLosModales();
        }

    });

});


// Cerrar el modal con la tecla ESC
document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        cerrarTodosLosModales();
    }

});



/* --------------------------------------------------
   2) AVISO FLOTANTE (toast)
-------------------------------------------------- */

const elementoAviso = document.getElementById("aviso");
let temporizadorAviso = null;


function mostrarAviso(mensaje) {

    elementoAviso.textContent = mensaje;
    elementoAviso.classList.add("activo");

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(function () {
        elementoAviso.classList.remove("activo");
    }, 2600);

}



/* --------------------------------------------------
   3) BOTONES PRINCIPALES DEL MENÚ
-------------------------------------------------- */

const botonNuevaPartida = document.getElementById("btn-nueva-partida");
const botonCargarPartida = document.getElementById("btn-cargar-partida");


botonNuevaPartida.addEventListener("click", function () {

    // TODO: acá va a ir la transición real a la pantalla de Prólogo
    // (por ahora, un aviso para probar que el botón responde)

    mostrarAviso("Iniciando nueva partida...");

});


botonCargarPartida.addEventListener("click", function () {

    // TODO: acá va a ir la lógica que revisa si existe una partida guardada
    // (localStorage / backend, según lo que definan)

    mostrarAviso("No hay una partida guardada todavía.");

});



/* --------------------------------------------------
   4) AJUSTES (música, sonido, texto, letra, pantalla)
-------------------------------------------------- */

const CLAVE_AJUSTES = "facundo-ajustes";

// Valores por defecto
const ajustesPorDefecto = {
    musica: 70,
    sonido: 80,
    velocidadTexto: "normal",
    tamanoFuente: "normal",
    pantallaCompleta: false
};


function cargarAjustesGuardados() {

    const guardado = localStorage.getItem(CLAVE_AJUSTES);

    if (!guardado) {
        return { ...ajustesPorDefecto };
    }

    try {
        return { ...ajustesPorDefecto, ...JSON.parse(guardado) };
    } catch (error) {
        return { ...ajustesPorDefecto };
    }

}


function guardarAjustes(ajustes) {

    localStorage.setItem(CLAVE_AJUSTES, JSON.stringify(ajustes));

}


let ajustesActuales = cargarAjustesGuardados();


// --- Elementos del modal de ajustes ---

const sliderMusica = document.getElementById("slider-musica");
const valorMusica = document.getElementById("valor-musica");

const sliderSonido = document.getElementById("slider-sonido");
const valorSonido = document.getElementById("valor-sonido");

const grupoVelocidad = document.getElementById("grupo-velocidad");
const grupoFuente = document.getElementById("grupo-fuente");

const botonPantallaCompleta = document.getElementById("btn-pantalla-completa");


// Pinta la interfaz de ajustes con los valores actuales
function aplicarAjustesALaInterfaz() {

    sliderMusica.value = ajustesActuales.musica;
    valorMusica.textContent = ajustesActuales.musica + "%";

    sliderSonido.value = ajustesActuales.sonido;
    valorSonido.textContent = ajustesActuales.sonido + "%";

    marcarOpcionSeleccionada(grupoVelocidad, ajustesActuales.velocidadTexto);
    marcarOpcionSeleccionada(grupoFuente, ajustesActuales.tamanoFuente);

    botonPantallaCompleta.classList.toggle("activo", ajustesActuales.pantallaCompleta);
    botonPantallaCompleta.textContent = ajustesActuales.pantallaCompleta ? "Desactivar" : "Activar";

}


function marcarOpcionSeleccionada(grupo, valorActivo) {

    const botones = grupo.querySelectorAll("button");

    botones.forEach(function (boton) {
        boton.classList.toggle("seleccionado", boton.dataset.valor === valorActivo);
    });

}


// --- Música ---

sliderMusica.addEventListener("input", function () {

    ajustesActuales.musica = Number(sliderMusica.value);
    valorMusica.textContent = ajustesActuales.musica + "%";

    // TODO: cuando haya audio real, acá se actualiza el volumen del elemento <audio>
    // ej: musicaDeFondo.volume = ajustesActuales.musica / 100;

    guardarAjustes(ajustesActuales);

});


// --- Efectos de sonido ---

sliderSonido.addEventListener("input", function () {

    ajustesActuales.sonido = Number(sliderSonido.value);
    valorSonido.textContent = ajustesActuales.sonido + "%";

    // TODO: acá se actualiza el volumen de los efectos (clicks, pasos, etc.)

    guardarAjustes(ajustesActuales);

});


// --- Velocidad de texto ---

grupoVelocidad.addEventListener("click", function (evento) {

    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    ajustesActuales.velocidadTexto = boton.dataset.valor;

    marcarOpcionSeleccionada(grupoVelocidad, ajustesActuales.velocidadTexto);

    guardarAjustes(ajustesActuales);

});


// --- Tamaño de letra ---

grupoFuente.addEventListener("click", function (evento) {

    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    ajustesActuales.tamanoFuente = boton.dataset.valor;

    marcarOpcionSeleccionada(grupoFuente, ajustesActuales.tamanoFuente);

    guardarAjustes(ajustesActuales);

    // TODO: cuando armemos la pantalla de diálogos, esto va a agrandar/achicar
    // el texto de las escenas (ej: agregando una clase al <body>)

});


// --- Pantalla completa ---

botonPantallaCompleta.addEventListener("click", function () {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {
            mostrarAviso("Este navegador no permite pantalla completa acá.");
        });
    } else {
        document.exitFullscreen();
    }

});


// Mantiene el botón sincronizado si el usuario sale con ESC en vez de con el botón
document.addEventListener("fullscreenchange", function () {

    ajustesActuales.pantallaCompleta = Boolean(document.fullscreenElement);

    botonPantallaCompleta.classList.toggle("activo", ajustesActuales.pantallaCompleta);
    botonPantallaCompleta.textContent = ajustesActuales.pantallaCompleta ? "Desactivar" : "Activar";

    guardarAjustes(ajustesActuales);

});


// Carga inicial: pinta la interfaz con lo que había guardado (o los valores por defecto)
aplicarAjustesALaInterfaz();



/* --------------------------------------------------
   5) PERFIL (progreso, relaciones, logros)
-------------------------------------------------- */

const CLAVE_PERFIL = "facundo-perfil";

// Cuántas decisiones "completan" la historia (ajustable a futuro)
const TOTAL_DECISIONES_ESPERADAS = 20;

// Cada 5 decisiones se pasa de capítulo (demo simple, se puede reemplazar
// después por los capítulos reales que arme el equipo de narrativa)
const NOMBRES_CAPITULOS = [
    "Capítulo 1 - Prólogo",
    "Capítulo 2 - Encrucijada",
    "Capítulo 3 - El desierto",
    "Capítulo 4 - La decisión final"
];


const perfilPorDefecto = {
    decisionesTomadas: 0,
    relaciones: {
        sarmiento: 0,
        quiroga: 0
    },
    tiempoJuegoSegundos: 0,
    fechaInicio: null
};


function cargarPerfilGuardado() {

    const guardado = localStorage.getItem(CLAVE_PERFIL);

    if (!guardado) {

        const nuevoPerfil = {
            ...perfilPorDefecto,
            fechaInicio: new Date().toLocaleDateString("es-AR")
        };

        localStorage.setItem(CLAVE_PERFIL, JSON.stringify(nuevoPerfil));

        return nuevoPerfil;

    }

    try {
        return { ...perfilPorDefecto, ...JSON.parse(guardado) };
    } catch (error) {
        return { ...perfilPorDefecto, fechaInicio: new Date().toLocaleDateString("es-AR") };
    }

}


function guardarPerfil(perfil) {

    localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));

}


let perfilActual = cargarPerfilGuardado();


// --- Elementos del modal de perfil ---

const elPerfilCapitulo = document.getElementById("perfil-capitulo");
const elPerfilTiempo = document.getElementById("perfil-tiempo");
const elPerfilFecha = document.getElementById("perfil-fecha");

const elPerfilDecisiones = document.getElementById("perfil-decisiones");
const elPerfilBarraRelleno = document.getElementById("perfil-barra-relleno");
const elPerfilPorcentaje = document.getElementById("perfil-porcentaje");

const elRelacionSarmiento = document.getElementById("relacion-sarmiento");
const elRelacionQuiroga = document.getElementById("relacion-quiroga");

const listaLogros = document.querySelectorAll(".logro");


// Convierte segundos a formato HH:MM:SS
function formatearTiempo(segundosTotales) {

    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;

    const dosDigitos = function (numero) {
        return String(numero).padStart(2, "0");
    };

    return dosDigitos(horas) + ":" + dosDigitos(minutos) + ":" + dosDigitos(segundos);

}


// Traduce un número de relación a una etiqueta + color (como en el mockup)
function textoDeRelacion(valor) {

    if (valor >= 2) {
        return { texto: "Confianza", clase: "confianza" };
    }

    if (valor <= -2) {
        return { texto: "Desconfianza", clase: "desconfianza" };
    }

    return { texto: "Neutral", clase: "neutral" };

}


function obtenerCapituloActual(decisionesTomadas) {

    const indice = Math.min(
        Math.floor(decisionesTomadas / 5),
        NOMBRES_CAPITULOS.length - 1
    );

    return NOMBRES_CAPITULOS[indice];

}


// Pinta el modal de perfil con los datos actuales
function actualizarPerfilEnPantalla() {

    elPerfilCapitulo.textContent = obtenerCapituloActual(perfilActual.decisionesTomadas);
    elPerfilTiempo.textContent = formatearTiempo(perfilActual.tiempoJuegoSegundos);
    elPerfilFecha.textContent = perfilActual.fechaInicio;

    elPerfilDecisiones.textContent = perfilActual.decisionesTomadas;

    const porcentaje = Math.min(
        100,
        Math.round((perfilActual.decisionesTomadas / TOTAL_DECISIONES_ESPERADAS) * 100)
    );

    elPerfilBarraRelleno.style.width = porcentaje + "%";
    elPerfilPorcentaje.textContent = porcentaje + "%";

    const relacionSarmiento = textoDeRelacion(perfilActual.relaciones.sarmiento);
    elRelacionSarmiento.textContent = relacionSarmiento.texto;
    elRelacionSarmiento.className = "perfil-personaje-estado " + relacionSarmiento.clase;

    const relacionQuiroga = textoDeRelacion(perfilActual.relaciones.quiroga);
    elRelacionQuiroga.textContent = relacionQuiroga.texto;
    elRelacionQuiroga.className = "perfil-personaje-estado " + relacionQuiroga.clase;

    actualizarLogros();

}


function actualizarLogros() {

    const desbloqueados = {
        "primeros-pasos": perfilActual.decisionesTomadas >= 1,
        "decisor": perfilActual.decisionesTomadas >= 10,
        "explorador": perfilActual.decisionesTomadas >= 5
    };

    listaLogros.forEach(function (elementoLogro) {

        const clave = elementoLogro.dataset.logro;

        elementoLogro.classList.toggle("desbloqueado", Boolean(desbloqueados[clave]));

    });

}


// --- Cronómetro de tiempo de juego ---

setInterval(function () {

    perfilActual.tiempoJuegoSegundos += 1;
    guardarPerfil(perfilActual);

    // Solo actualiza el texto en pantalla si el modal de perfil está abierto
    if (document.getElementById("modal-perfil").classList.contains("activo")) {
        elPerfilTiempo.textContent = formatearTiempo(perfilActual.tiempoJuegoSegundos);
    }

}, 1000);


// --- Botón "Cambiar avatar" (stub por ahora) ---

document.getElementById("btn-cambiar-avatar").addEventListener("click", function () {

    mostrarAviso("La selección de avatar va a estar disponible en el Sprint 8.");

});


