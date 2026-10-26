/* ================================================================
   FACUNDO: CAMINO DE LA BARBARIE — NAVEGACIÓN Y PROGRESO COMPARTIDO
   Este archivo centraliza los enlaces entre el menú y los capítulos.
   ================================================================ */
(function () {
  "use strict";

  const scriptUrl = document.currentScript && document.currentScript.src;
  const projectRoot = new URL("./", scriptUrl || window.location.href);

  const routes = Object.freeze({
    menu: new URL("Men%C3%BAPrincipal-contenido.html", projectRoot).href,
    prologo: new URL("Prologo/instancia-jugable%20(Prologo)/instancia-jugable/index.html", projectRoot).href,
    capitulo1: new URL("Capitulo1/Capitulo1/index.html", projectRoot).href,
    capitulo2: new URL("Capitulo2/index.html", projectRoot).href,
    capitulo3: new URL("Capitulo%203/index.html", projectRoot).href
  });

  const CURRENT_STEP_KEY = "facundo-current-step";
  const GAME_DATA_KEYS = [
    "facundo-cap1-stats",
    "facundo-cap2-stats",
    "facundo-cap3-stats",
    "facundo-perfil"
  ];

  function getCurrentStep() {
    try {
      return localStorage.getItem(CURRENT_STEP_KEY);
    } catch (error) {
      console.warn("No se pudo leer el progreso guardado.", error);
      return null;
    }
  }

  function setCurrentStep(step) {
    if (!Object.prototype.hasOwnProperty.call(routes, step) && step !== "completed") {
      return false;
    }
    try {
      localStorage.setItem(CURRENT_STEP_KEY, step);
      return true;
    } catch (error) {
      console.warn("No se pudo guardar el capítulo actual.", error);
      return false;
    }
  }

  function navigateTo(step) {
    if (!Object.prototype.hasOwnProperty.call(routes, step)) {
      console.error("Destino de navegación desconocido:", step);
      return false;
    }
    if (step !== "menu") setCurrentStep(step);
    window.location.href = routes[step];
    return true;
  }

  function openMenu() {
    // No cambia el capítulo guardado: así RETOMAR CAMINO puede volver a él.
    window.location.href = routes.menu;
  }

  function startNewGame() {
    try {
      GAME_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem(CURRENT_STEP_KEY);
    } catch (error) {
      console.warn("No se pudieron limpiar los datos de la partida anterior.", error);
    }
    navigateTo("prologo");
  }

  function resumeGame() {
    const step = getCurrentStep();
    if (!step || step === "completed" || !Object.prototype.hasOwnProperty.call(routes, step)) {
      return false;
    }
    return navigateTo(step);
  }

  function markCompleted() {
    return setCurrentStep("completed");
  }

  const GLOBAL_SETTINGS_DEFAULTS = Object.freeze({
    font: "font-serif",
    size: "size-medium",
    speedPercent: 70
  });
  const VALID_FONTS = ["font-serif", "font-sans", "font-dyslexic", "font-pixel"];
  const VALID_SIZES = ["size-small", "size-medium", "size-large"];

  function normaliseFont(value) {
    if (VALID_FONTS.includes(value)) return value;
    if (typeof value === "string" && VALID_FONTS.includes(`font-${value}`)) return `font-${value}`;
    return GLOBAL_SETTINGS_DEFAULTS.font;
  }

  function normaliseSize(value) {
    const sizeAliases = { "text-sm": "size-small", "text-md": "size-medium", "text-lg": "size-large" };
    if (VALID_SIZES.includes(value)) return value;
    return sizeAliases[value] || GLOBAL_SETTINGS_DEFAULTS.size;
  }

  function getSharedSettings() {
    try {
      const storedSpeed = Number(localStorage.getItem("gameTextSpeed"));
      return {
        font: normaliseFont(localStorage.getItem("gameFont") || GLOBAL_SETTINGS_DEFAULTS.font),
        size: normaliseSize(localStorage.getItem("gameFontSize") || GLOBAL_SETTINGS_DEFAULTS.size),
        speedPercent: Number.isFinite(storedSpeed) && storedSpeed > 0
          ? Math.min(100, Math.max(1, storedSpeed))
          : GLOBAL_SETTINGS_DEFAULTS.speedPercent
      };
    } catch (error) {
      return { ...GLOBAL_SETTINGS_DEFAULTS };
    }
  }

  function saveSharedSettings(settings = {}) {
    const current = getSharedSettings();
    const font = normaliseFont(settings.font ?? settings.fontFamily ?? current.font);
    const size = normaliseSize(settings.size ?? settings.fontSize ?? settings.textSize ?? current.size);
    const rawSpeed = settings.speedPercent;
    const speedPercent = Number.isFinite(Number(rawSpeed)) && rawSpeed !== null && rawSpeed !== undefined
      ? Math.min(100, Math.max(1, Number(rawSpeed)))
      : current.speedPercent;

    try {
      localStorage.setItem("gameFont", font);
      localStorage.setItem("gameFontSize", size);
      localStorage.setItem("gameTextSpeed", String(Math.round(speedPercent)));

      // El prólogo usa una estructura de ajustes heredada; mantenerla sincronizada permite compartirlos.
      let legacy = {};
      try { legacy = JSON.parse(localStorage.getItem("facundo_settings") || "{}"); }
      catch (error) { legacy = {}; }
      const fontLegacy = {
        "font-serif": "serif",
        "font-sans": "sans",
        "font-dyslexic": "dyslexic",
        "font-pixel": "pixel"
      }[font];
      const sizeLegacy = { "size-small": "text-sm", "size-medium": "text-md", "size-large": "text-lg" }[size];
      // Convertir el porcentaje a los rangos que usan los distintos capítulos.
      const desiredDelay = 80 - (0.75 * speedPercent);
      const prologueSlider = Math.min(60, Math.max(5, Math.round(65 - desiredDelay)));
      localStorage.setItem("facundo_settings", JSON.stringify({
        ...legacy,
        textSpeedVal: prologueSlider,
        textSize: sizeLegacy,
        fontFamily: fontLegacy
      }));
    } catch (error) {
      console.warn("No se pudieron guardar los ajustes compartidos.", error);
      return false;
    }
    return true;
  }

  window.FacundoProgress = Object.freeze({
    getCurrentStep,
    setCurrentStep,
    navigateTo,
    openMenu,
    startNewGame,
    resumeGame,
    markCompleted,
    getSharedSettings,
    saveSharedSettings
  });
})();
