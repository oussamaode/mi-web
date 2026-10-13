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

    // 4) Widget: ubicación, fecha y hora del visitante (freeipapi.com)
    //    Obtiene la zona horaria del visitante y actualiza fecha/hora cada segundo.
    async function iniciarWidget() {
        var elUbicacion = document.getElementById('widget-ubicacion');
        var elFecha = document.getElementById('widget-fecha');
        var elHora = document.getElementById('widget-hora');
        if (!elUbicacion || !elFecha || !elHora) return; // el widget no está en la página

        try {
            var respuesta = await fetch('https://freeipapi.com/api/json');
            if (!respuesta.ok) throw new Error('Respuesta HTTP ' + respuesta.status);
            var datos = await respuesta.json();

            // Zona horaria del visitante (o la del navegador como respaldo)
            var zona = datos.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Ciudad y país (si falta alguno, mostramos lo que haya)
            var ciudad = datos.cityName || '';
            var pais = datos.countryName || '';
            elUbicacion.textContent = [ciudad, pais].filter(Boolean).join(', ') || 'Desconocida';

            var opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: zona };
            var opcionesFecha = { day: '2-digit', month: 'short', year: 'numeric', timeZone: zona };

            // Pinta la fecha/hora ahora y las refresca cada segundo
            function actualizarReloj() {
                var ahora = new Date();
                elHora.textContent = ahora.toLocaleTimeString('es-ES', opcionesHora);
                elFecha.textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
            }

            actualizarReloj();
            setInterval(actualizarReloj, 1000);
        } catch (error) {
            elUbicacion.textContent = 'No disponible';
            console.error('No se pudo obtener la ubicación:', error);
        }
    }
    iniciarWidget();

    // 5) Proyectos: 3 repos públicos más recientes (GitHub REST API, sin token)
    async function cargarRepositorios() {
        var contenedor = document.getElementById('github-repos');
        if (!contenedor) return; // el bloque no está en la página

        var USUARIO = 'oussamaode';
        var url = 'https://api.github.com/users/' + USUARIO + '/repos?sort=updated&per_page=3';

        // Construye una tarjeta con DOM (evita inyección de HTML)
        function crearTarjeta(repo) {
            var tarjeta = document.createElement('article');
            tarjeta.className = 'github-repo';

            var titulo = document.createElement('h4');
            titulo.className = 'github-titulo';
            var enlaceTitulo = document.createElement('a');
            enlaceTitulo.href = repo.html_url;
            enlaceTitulo.target = '_blank';
            enlaceTitulo.rel = 'noopener';
            enlaceTitulo.textContent = repo.name;
            titulo.appendChild(enlaceTitulo);

            var descripcion = document.createElement('p');
            descripcion.className = 'github-desc';
            descripcion.textContent = repo.description || 'Sin descripción.';

            var meta = document.createElement('div');
            meta.className = 'github-meta';

            var estrellas = document.createElement('span');
            estrellas.className = 'github-stars';
            estrellas.textContent = '★ ' + repo.stargazers_count;

            var enlaceRepo = document.createElement('a');
            enlaceRepo.href = repo.html_url;
            enlaceRepo.target = '_blank';
            enlaceRepo.rel = 'noopener';
            enlaceRepo.textContent = 'Ver repositorio →';

            meta.append(estrellas, enlaceRepo);
            tarjeta.append(titulo, descripcion, meta);
            return tarjeta;
        }

        try {
            var respuesta = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
            if (!respuesta.ok) throw new Error('Respuesta HTTP ' + respuesta.status);
            var repos = await respuesta.json();

            contenedor.innerHTML = '';
            if (!Array.isArray(repos) || repos.length === 0) {
                contenedor.innerHTML = '<p class="github-estado">No hay repositorios públicos todavía.</p>';
                return;
            }
            repos.forEach(function (repo) {
                contenedor.appendChild(crearTarjeta(repo));
            });
        } catch (error) {
            contenedor.innerHTML = '<p class="github-estado">No se pudieron cargar los repositorios.</p>';
            console.error('Error al cargar los repositorios de GitHub:', error);
        }
    }
    cargarRepositorios();

    // 6) Animación de aparición de las secciones al hacer scroll
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
