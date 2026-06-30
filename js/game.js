// Modo oscuro fijo. Sin lógica de tema por ahora.

// Navegación por tarjetas: cualquier elemento con data-href redirige al hacer clic.
document.addEventListener("click", function (e) {
  const target = e.target.closest("[data-href]");
  if (target) {
    window.location.href = target.getAttribute("data-href");
  }
});

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
