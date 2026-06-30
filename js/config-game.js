// Configuración del juego — interacciones de la pantalla.

(function () {
  // --- Navegación por data-href (botón de inicio vuelve a game.html) ---
  document.addEventListener("click", function (e) {
    const nav = e.target.closest("[data-href]");
    if (nav) {
      window.location.href = nav.getAttribute("data-href");
    }
  });

  // --- Selección de modo de juego: mueve la clase activa a la card tocada ---
  const cards = document.querySelectorAll(".theme-card");
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      cards.forEach(function (c) {
        c.classList.remove("is-selected");
      });
      card.classList.add("is-selected");
    });
  });

  // --- Stepper de impostores (mínimo 1) ---
  const minusBtn = document.querySelector(".step-minus");
  const plusBtn = document.querySelector(".step-plus");
  const stepValue = document.querySelector(".step-value");

  if (minusBtn && plusBtn && stepValue) {
    const MIN = 1;
    const MAX = 10; // tope de seguridad

    const render = function (n) {
      stepValue.textContent = n;
      minusBtn.disabled = n <= MIN;
      plusBtn.disabled = n >= MAX;
    };

    let impostores = parseInt(stepValue.textContent, 10) || MIN;
    render(impostores);

    minusBtn.addEventListener("click", function () {
      if (impostores > MIN) {
        impostores -= 1;
        render(impostores);
      }
    });

    plusBtn.addEventListener("click", function () {
      if (impostores < MAX) {
        impostores += 1;
        render(impostores);
      }
    });
  }

  // --- Switch de "Pista para Impostores" (on/off) ---
  const sw = document.querySelector(".switch");
  if (sw) {
    sw.addEventListener("click", function () {
      const on = sw.classList.toggle("is-on");
      sw.setAttribute("aria-checked", on ? "true" : "false");
    });
  }
})();

// Registro del Service Worker (PWA).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("../sw.js", { updateViaCache: "none" })
      .then(function (reg) {
        reg.update();

        reg.addEventListener("updatefound", function () {
          const nuevo = reg.installing;
          if (!nuevo) return;
          nuevo.addEventListener("statechange", function () {
            if (nuevo.state === "installed" && navigator.serviceWorker.controller) {
              nuevo.postMessage("SKIP_WAITING");
            }
          });
        });
      })
      .catch(function () {
        /* Si falla el registro, la app sigue funcionando sin offline. */
      });

    let recargado = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (recargado) return;
      recargado = true;
      window.location.reload();
    });
  });
}
