document.addEventListener("DOMContentLoaded", () => {
    const homeBtn = document.getElementById("homeBtn");
    const settingsBtnTop = document.getElementById("settingsBtnTop");
    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const creditsBtn = document.getElementById("creditsBtn");
    const exitGameBtn = document.getElementById("exitGameBtn");

    const exitModal = document.getElementById("exitModal");
    const modalCloseXBtn = document.getElementById("modalCloseXBtn");
    const modalConfirmBtn = document.getElementById("modalConfirmBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const toggleFullscreenBtn = document.getElementById("toggleFullscreenBtn");
    const fontSelect = document.getElementById("fontSelect");
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const textSpeedInput = document.getElementById("textSpeed");
    const creditsModal = document.getElementById("creditsModal");
    const closeCreditsBtn = document.getElementById("closeCreditsBtn");
    const toastMessage = document.getElementById("toastMessage");
    let toastTimer = null;

    function showToast(message) {
        if (!toastMessage) return;
        if (toastTimer) clearTimeout(toastTimer);
        toastMessage.textContent = message;
        toastMessage.classList.add("show");
        toastTimer = setTimeout(() => toastMessage.classList.remove("show"), 3000);
    }

    function readStorage(key, fallback) {
        try { return localStorage.getItem(key) || fallback; }
        catch (error) { return fallback; }
    }

    function saveSharedSettings(settings) {
        if (window.FacundoProgress && typeof window.FacundoProgress.saveSharedSettings === "function") {
            window.FacundoProgress.saveSharedSettings(settings);
            return;
        }
        try {
            if (settings.font) localStorage.setItem("gameFont", settings.font);
            if (settings.size) localStorage.setItem("gameFontSize", settings.size);
            if (Number.isFinite(settings.speedPercent)) localStorage.setItem("gameTextSpeed", String(settings.speedPercent));
        } catch (error) { /* El juego sigue funcionando aunque el navegador bloquee el almacenamiento. */ }
    }

    const supportedFonts = ["font-serif", "font-sans", "font-pixel", "font-dyslexic"];
    function applyFont(fontClass) {
        if (!supportedFonts.includes(fontClass)) fontClass = "font-serif";
        supportedFonts.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(fontClass);
        if (fontSelect) fontSelect.value = fontClass;
        saveSharedSettings({ font: fontClass });
    }
    applyFont(readStorage("gameFont", "font-serif"));
    if (fontSelect) fontSelect.addEventListener("change", event => {
        applyFont(event.target.value);
        showToast("Tipografía actualizada");
    });

    const supportedSizes = ["size-small", "size-medium", "size-large"];
    function applyFontSize(sizeClass) {
        if (!supportedSizes.includes(sizeClass)) sizeClass = "size-medium";
        supportedSizes.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(sizeClass);
        if (fontSizeSelect) fontSizeSelect.value = sizeClass;
        saveSharedSettings({ size: sizeClass });
    }
    applyFontSize(readStorage("gameFontSize", "size-medium"));
    if (fontSizeSelect) fontSizeSelect.addEventListener("change", event => {
        applyFontSize(event.target.value);
        showToast("Tamaño de letra actualizado");
    });

    function updateSliderFill(value) {
        if (textSpeedInput) textSpeedInput.style.setProperty("--slider-pos", `${value}%`);
    }
    if (textSpeedInput) {
        const storedSpeed = Number(readStorage("gameTextSpeed", "70"));
        const initialSpeed = Number.isFinite(storedSpeed) ? Math.min(100, Math.max(1, storedSpeed)) : 70;
        textSpeedInput.value = String(initialSpeed);
        updateSliderFill(initialSpeed);
        saveSharedSettings({ speedPercent: initialSpeed });
        textSpeedInput.addEventListener("input", event => {
            const value = Math.min(100, Math.max(1, Number(event.target.value) || 70));
            updateSliderFill(value);
            saveSharedSettings({ speedPercent: value });
        });
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
    }
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    }

    if (startBtn) startBtn.addEventListener("click", () => {
        if (window.FacundoProgress && typeof window.FacundoProgress.startNewGame === "function") {
            window.FacundoProgress.startNewGame();
        } else {
            window.location.href = "Prologo/instancia-jugable%20(Prologo)/instancia-jugable/index.html";
        }
    });

    if (continueBtn) continueBtn.addEventListener("click", () => {
        const resumed = window.FacundoProgress && typeof window.FacundoProgress.resumeGame === "function"
            ? window.FacundoProgress.resumeGame()
            : false;
        if (!resumed) {
            const step = window.FacundoProgress && window.FacundoProgress.getCurrentStep
                ? window.FacundoProgress.getCurrentStep()
                : null;
            showToast(step === "completed"
                ? "La aventura ya está terminada. Elegí COMENZAR CAMINO para jugar de nuevo."
                : "Todavía no hay una partida guardada. Elegí COMENZAR CAMINO para empezar.");
        }
    });

    if (creditsBtn) creditsBtn.addEventListener("click", () => openModal(creditsModal));
    if (exitGameBtn) exitGameBtn.addEventListener("click", () => openModal(exitModal));
    if (homeBtn) homeBtn.addEventListener("click", () => showToast("Ya estás en el menú principal."));
    if (settingsBtnTop) settingsBtnTop.addEventListener("click", () => openModal(settingsModal));

    if (modalCloseXBtn) modalCloseXBtn.addEventListener("click", () => closeModal(exitModal));
    if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", () => {
        closeModal(exitModal);
        showToast("Para salir del juego, cerrá esta pestaña o ventana del navegador.");
    });
    if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", () => closeModal(settingsModal));
    if (closeCreditsBtn) closeCreditsBtn.addEventListener("click", () => closeModal(creditsModal));

    if (toggleFullscreenBtn) toggleFullscreenBtn.addEventListener("click", async () => {
        try {
            if (window.FacundoFullscreen) await window.FacundoFullscreen.toggle();
            else if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
            else if (document.exitFullscreen) await document.exitFullscreen();
        } catch (error) {
            showToast("El navegador no permitió cambiar a pantalla completa.");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal(exitModal);
            closeModal(settingsModal);
            closeModal(creditsModal);
        }
    });
    [exitModal, settingsModal, creditsModal].filter(Boolean).forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal);
        });
    });
});
