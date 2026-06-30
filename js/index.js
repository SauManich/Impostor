(function () {
  const startBtn = document.getElementById("startBtn");

  if (startBtn) {
    startBtn.addEventListener("click", function () {
      window.location.href = "html/game.html";
    });
  }

  // Registro del Service Worker (PWA).
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("sw.js", { updateViaCache: "none" })
        .then(function (reg) {
          // Busca actualizaciones del SW cada vez que se carga la página.
          reg.update();

          // Si entra un SW nuevo, lo activamos en cuanto esté listo.
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

      // Cuando el SW nuevo toma el control, recargamos una sola vez
      // para mostrar siempre la versión más reciente.
      let recargado = false;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (recargado) return;
        recargado = true;
        window.location.reload();
      });
    });
  }
})();
