/* =========================================================
   MODO OSCURO CON MEMORIA (localStorage) + ANIMACIONES
   - Recuerda la elección del usuario entre visitas.
   - Si es la primera visita, usa la preferencia del sistema.
   - El tema inicial ya se aplica en index.html para evitar
     el parpadeo; aquí solo sincronizamos el botón.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    var boton = document.getElementById('toggle-tema');
    var CLAVE = 'tema'; // nombre de la clave guardada en localStorage

    // 1) Aplica un tema al <html> y actualiza el botón
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        if (!boton) return;
        var oscuro = tema === 'dark';
        boton.setAttribute('aria-pressed', String(oscuro));
        boton.textContent = oscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
    }

    // 2) Sincroniza el botón con el tema que ya se aplicó en la cabecera
    var temaActual = document.documentElement.getAttribute('data-theme');
    if (!temaActual) {
        var guardado = localStorage.getItem(CLAVE);
        var prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        temaActual = guardado || (prefiereOscuro ? 'dark' : 'light');
    }
    aplicarTema(temaActual);

    // 3) Al pulsar el botón, alterna y guarda la elección
    if (boton) {
        boton.addEventListener('click', function () {
            var actual = document.documentElement.getAttribute('data-theme');
            var nuevo = actual === 'dark' ? 'light' : 'dark';
            aplicarTema(nuevo);
            localStorage.setItem(CLAVE, nuevo);
        });
    }

    // 4) Animación de aparición de las secciones al hacer scroll
    var elementos = document.querySelectorAll('.revelar');
    var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducirMovimiento || !('IntersectionObserver' in window)) {
        elementos.forEach(function (el) { el.classList.add('visible'); });
        return;
    }

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach(function (el) { observador.observe(el); });
});
