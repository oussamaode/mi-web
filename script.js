/* =========================================================
   MODO OSCURO CON MEMORIA (localStorage)
   - Recuerda la elección del usuario entre visitas.
   - Si es la primera visita, usa la preferencia del sistema.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    var boton = document.getElementById('toggle-tema');
    var CLAVE = 'tema'; // nombre de la clave guardada en localStorage

    // 1) Aplica un tema al <html> y actualiza el botón
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        var oscuro = tema === 'dark';
        boton.setAttribute('aria-pressed', String(oscuro));
        boton.textContent = oscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
    }

    // 2) Decide el tema inicial:
    //    - lo guardado en localStorage, o
    //    - la preferencia del sistema operativo si no hay nada guardado
    var guardado = localStorage.getItem(CLAVE);
    var prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var temaInicial = guardado || (prefiereOscuro ? 'dark' : 'light');
    aplicarTema(temaInicial);

    // 3) Al pulsar el botón, alterna y guarda la elección
    boton.addEventListener('click', function () {
        var actual = document.documentElement.getAttribute('data-theme');
        var nuevo = actual === 'dark' ? 'light' : 'dark';
        aplicarTema(nuevo);
        localStorage.setItem(CLAVE, nuevo);
    });
});
