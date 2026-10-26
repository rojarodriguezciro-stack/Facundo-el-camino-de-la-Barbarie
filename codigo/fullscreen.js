/*
 * Control compartido de pantalla completa para todas las escenas.
 * Con el menú principal como contenedor persistente, la pantalla completa
 * pertenece al contenedor y no a cada página, por lo que sobrevive al navegar.
 */
(function () {
  'use strict';

  function getShell() {
    try {
      if (window.top && window.top !== window && window.top.FacundoShell) {
        return window.top.FacundoShell;
      }
    } catch (error) {
      // Si se abre un capítulo por separado o el navegador bloquea el acceso,
      // se utiliza el modo de pantalla completa local como alternativa.
    }
    return null;
  }

  async function enter() {
    const shell = getShell();
    if (shell) return shell.enterFullscreen();
    if (document.fullscreenElement) return true;
    if (!document.documentElement.requestFullscreen) return false;
    await document.documentElement.requestFullscreen();
    return true;
  }

  async function exit() {
    const shell = getShell();
    if (shell) return shell.exitFullscreen();
    if (!document.fullscreenElement) return true;
    if (!document.exitFullscreen) return false;
    await document.exitFullscreen();
    return true;
  }

  async function toggle() {
    const shell = getShell();
    if (shell) return shell.toggleFullscreen();
    return document.fullscreenElement ? exit() : enter();
  }

  window.FacundoFullscreen = Object.freeze({ enter, exit, toggle });

  // Escape abandona la pantalla completa. F11 solicita la misma salida si el
  // navegador entrega el evento a la página; el comportamiento nativo de F11
  // sigue dependiendo del navegador y del sistema operativo.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'F11') {
      const shell = getShell();
      if (shell && shell.isFullscreen()) {
        shell.exitFullscreen().catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  });
})();
