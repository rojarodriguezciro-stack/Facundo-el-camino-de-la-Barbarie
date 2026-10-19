document.addEventListener("DOMContentLoaded", () => {
    // Referencias Barra Superior
    const homeBtn = document.getElementById("homeBtn");
    const settingsBtnTop = document.getElementById("settingsBtnTop");

    // Referencias Menú Central
    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const creditsBtn = document.getElementById("creditsBtn");
    const exitGameBtn = document.getElementById("exitGameBtn");

    // Modales
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

    function showToast(text) {
        if (toastTimer) clearTimeout(toastTimer);
        toastMessage.textContent = text;
        toastMessage.classList.add("show");

        toastTimer = setTimeout(() => {
            toastMessage.classList.remove("show");
        }, 2500);
    }

    // --- TIPOGRAFÍA GLOBAL ---
    const supportedFonts = ["font-serif", "font-sans", "font-pixel", "font-dyslexic"];

    function applyFont(fontClass) {
        supportedFonts.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(fontClass);
        localStorage.setItem("gameFont", fontClass);
        if (fontSelect) fontSelect.value = fontClass;
    }

    const savedFont = localStorage.getItem("gameFont") || "font-serif";
    applyFont(savedFont);

    if (fontSelect) {
        fontSelect.addEventListener("change", (e) => {
            applyFont(e.target.value);
            showToast("Tipografía actualizada");
        });
    }

    // --- TAMAÑO DE LETRA GLOBAL ---
    const supportedSizes = ["size-small", "size-medium", "size-large"];

    function applyFontSize(sizeClass) {
        supportedSizes.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(sizeClass);
        localStorage.setItem("gameFontSize", sizeClass);
        if (fontSizeSelect) fontSizeSelect.value = sizeClass;
    }

    const savedFontSize = localStorage.getItem("gameFontSize") || "size-medium";
    applyFontSize(savedFontSize);

    if (fontSizeSelect) {
        fontSizeSelect.addEventListener("change", (e) => {
            applyFontSize(e.target.value);
            showToast("Tamaño de letra actualizado");
        });
    }

    // --- VELOCIDAD DE TEXTO ---
    function updateSliderFill(val) {
        if (textSpeedInput) {
            textSpeedInput.style.setProperty('--slider-pos', val + '%');
        }
    }

    if (textSpeedInput) {
        const savedSpeed = localStorage.getItem("gameTextSpeed") || "70";
        textSpeedInput.value = savedSpeed;
        updateSliderFill(savedSpeed);

        textSpeedInput.addEventListener("input", (e) => {
            const val = e.target.value;
            updateSliderFill(val);
            localStorage.setItem("gameTextSpeed", val);
        });
    }

    // --- FUNCIONES DE MODALES ---
    function openExitModal() {
        exitModal.classList.add("is-open");
        exitModal.setAttribute("aria-hidden", "false");
    }

    function closeExitModal() {
        exitModal.classList.remove("is-open");
        exitModal.setAttribute("aria-hidden", "true");
    }

    function openSettingsModal() {
        settingsModal.classList.add("is-open");
        settingsModal.setAttribute("aria-hidden", "false");
    }

    function closeSettingsModal() {
        settingsModal.classList.remove("is-open");
        settingsModal.setAttribute("aria-hidden", "true");
    }

    function openCreditsModal() {
        creditsModal.classList.add("is-open");
        creditsModal.setAttribute("aria-hidden", "false");
    }

    function closeCreditsBtnModal() {
        creditsModal.classList.remove("is-open");
        creditsModal.setAttribute("aria-hidden", "true");
    }

    // Eventos Menú Central
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            window.location.href = "Capitulos.html";
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            showToast("Retomando la partida guardada...");
        });
    }

    if (creditsBtn) creditsBtn.addEventListener("click", openCreditsModal);
    if (exitGameBtn) exitGameBtn.addEventListener("click", openExitModal);

    // Eventos Barra Superior
    if (homeBtn) homeBtn.addEventListener("click", () => showToast("Menú Principal"));
    if (settingsBtnTop) settingsBtnTop.addEventListener("click", openSettingsModal);

    // Cierres de Modales
    if (modalCloseXBtn) modalCloseXBtn.addEventListener("click", closeExitModal);
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener("click", () => {
            showToast("Saliendo del juego...");
            closeExitModal();
        });
    }

    if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", closeSettingsModal);
    if (closeCreditsBtn) closeCreditsBtn.addEventListener("click", closeCreditsBtnModal);

    // Pantalla Completa
    if (toggleFullscreenBtn) {
        toggleFullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    // Tecla Escape y Clic Exterior
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (exitModal.classList.contains("is-open")) closeExitModal();
            if (settingsModal.classList.contains("is-open")) closeSettingsModal();
            if (creditsModal.classList.contains("is-open")) closeCreditsBtnModal();
        }
    });

    exitModal.addEventListener("click", (e) => {
        if (e.target === exitModal) closeExitModal();
    });

    settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

    creditsModal.addEventListener("click", (e) => {
        if (e.target === creditsModal) closeCreditsBtnModal();
    });
});