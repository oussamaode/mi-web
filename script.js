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
        var metaColor = document.getElementById('meta-theme-color');
        if (metaColor) {
            metaColor.setAttribute('content', tema === 'dark' ? '#181818' : '#fafafa');
        }
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
        } finally {
            // Los repos pueden cambiar la altura de la página: recolocamos la vía
            alHacerScroll();
        }
    }
    cargarRepositorios();

    // 5.1) Modal interactivo: experiencia en Gollmann
    var modalGollmann = document.getElementById('modal-gollmann');
    if (modalGollmann) {
        var disparadoresGollmann = document.querySelectorAll('[data-abrir-modal="modal-gollmann"]');
        var cerrarGollmann = modalGollmann.querySelector('.modal-gollmann__cerrar');
        var focoAnteriorGollmann = null;
        var temporizadorCierreGollmann = null;
        var reducirMovimientoModal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function bloquearScrollPagina() {
            var anchoBarra = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = anchoBarra > 0 ? anchoBarra + 'px' : '';
            document.body.classList.add('modal-abierto');
            document.documentElement.classList.add('modal-abierto');
        }

        function desbloquearScrollPagina() {
            document.body.classList.remove('modal-abierto');
            document.documentElement.classList.remove('modal-abierto');
            document.body.style.paddingRight = '';
        }

        function abrirModalGollmann(disparador) {
            focoAnteriorGollmann = disparador || document.activeElement;
            if (temporizadorCierreGollmann) {
                window.clearTimeout(temporizadorCierreGollmann);
                temporizadorCierreGollmann = null;
            }
            modalGollmann.classList.remove('cerrando');
            bloquearScrollPagina();

            if (typeof modalGollmann.showModal === 'function') {
                modalGollmann.showModal();
            } else {
                modalGollmann.setAttribute('open', '');
            }

            if (cerrarGollmann) cerrarGollmann.focus();
        }

        function cerrarModalGollmann() {
            if (!modalGollmann.open || modalGollmann.classList.contains('cerrando')) return;
            modalGollmann.classList.add('cerrando');

            temporizadorCierreGollmann = window.setTimeout(function () {
                temporizadorCierreGollmann = null;
                if (typeof modalGollmann.close === 'function') {
                    modalGollmann.close();
                } else {
                    modalGollmann.removeAttribute('open');
                    desbloquearScrollPagina();
                    if (focoAnteriorGollmann) focoAnteriorGollmann.focus();
                }
            }, reducirMovimientoModal ? 0 : 180);
        }

        disparadoresGollmann.forEach(function (disparador) {
            disparador.addEventListener('click', function () {
                abrirModalGollmann(disparador);
            });
        });

        if (cerrarGollmann) {
            cerrarGollmann.addEventListener('click', cerrarModalGollmann);
        }

        // Cierra al hacer clic fuera de la tarjeta (la zona del overlay)
        modalGollmann.addEventListener('click', function (evento) {
            if (evento.target === modalGollmann) cerrarModalGollmann();
        });

        // Escape: evita el cierre inmediato para respetar la animación
        modalGollmann.addEventListener('cancel', function (evento) {
            evento.preventDefault();
            cerrarModalGollmann();
        });

        modalGollmann.addEventListener('close', function () {
            modalGollmann.classList.remove('cerrando');
            desbloquearScrollPagina();
            if (focoAnteriorGollmann && typeof focoAnteriorGollmann.focus === 'function') {
                focoAnteriorGollmann.focus();
            }
        });
    }

    // 6) Navegación: menú móvil, enlace activo, vía del tren y volver arriba
    var navbar = document.getElementById('navbar');
    var menuToggle = document.getElementById('menu-toggle');
    var menuPrincipal = document.getElementById('menu-principal');
    var barraProgreso = document.getElementById('barra-progreso-relleno');
    var viaCarril = document.getElementById('via-carril');
    var viaTren = document.getElementById('via-tren');
    var viaParadas = document.getElementById('via-paradas');
    var btnArriba = document.getElementById('btn-arriba');
    var enlacesMenu = menuPrincipal ? menuPrincipal.querySelectorAll('.menu-enlace') : [];
    var reducirMovimientoNav = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 6.1) Menú desplegable en móvil
    function menuAbierto() {
        return menuPrincipal && menuPrincipal.classList.contains('abierto');
    }

    function abrirMenu() {
        if (!menuPrincipal || !menuToggle) return;
        menuPrincipal.classList.add('abierto');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
    }

    function cerrarMenu(instantaneo) {
        if (!menuPrincipal || !menuToggle) return;
        if (instantaneo) {
            // Cierre sin animación: evita que el menú desplace el destino del ancla
            menuPrincipal.style.transition = 'none';
            menuPrincipal.classList.remove('abierto');
            void menuPrincipal.offsetHeight;
            menuPrincipal.style.transition = '';
        } else {
            menuPrincipal.classList.remove('abierto');
        }
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    }

    if (menuToggle && menuPrincipal) {
        menuToggle.addEventListener('click', function () {
            if (menuAbierto()) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        });

        enlacesMenu.forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                cerrarMenu(true);
            });
        });

        // Cierra al pulsar fuera de la barra
        document.addEventListener('click', function (evento) {
            if (!menuAbierto()) return;
            if (navbar && !navbar.contains(evento.target)) cerrarMenu();
        });

        // Cierra con Escape y devuelve el foco al botón
        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape' && menuAbierto()) {
                cerrarMenu();
                menuToggle.focus();
            }
        });

        // Al pasar a escritorio, aseguramos que el menú quede cerrado
        var escritorio = window.matchMedia('(min-width: 769px)');
        var alCambiarAncho = function (evento) {
            if (evento.matches) cerrarMenu();
        };
        if (escritorio.addEventListener) {
            escritorio.addEventListener('change', alCambiarAncho);
        } else if (escritorio.addListener) {
            escritorio.addListener(alCambiarAncho);
        }
    }

    // 6.2) Enlace activo según la sección en la que estamos
    var secciones = [];
    enlacesMenu.forEach(function (enlace) {
        var destino = document.querySelector(enlace.getAttribute('href'));
        if (destino) secciones.push({ enlace: enlace, elemento: destino });
    });

    // Crea un punto de parada en la vía por cada sección
    if (viaParadas) {
        viaParadas.innerHTML = '';
        secciones.forEach(function (item) {
            var parada = document.createElement('span');
            parada.className = 'via-parada';
            parada.title = item.enlace.textContent.trim();
            viaParadas.appendChild(parada);
        });
    }

    function marcarEnlaceActivo() {
        if (!secciones.length) return;
        var limite = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80;
        var activa = secciones[0];

        secciones.forEach(function (item) {
            if (item.elemento.offsetTop <= limite) activa = item;
        });

        // Si hemos llegado al final, marcamos el último enlace (Contacto)
        var alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (alFinal) activa = secciones[secciones.length - 1];

        secciones.forEach(function (item) {
            var esActiva = item === activa;
            item.enlace.classList.toggle('is-active', esActiva);
            if (esActiva) {
                item.enlace.setAttribute('aria-current', 'location');
            } else {
                item.enlace.removeAttribute('aria-current');
            }
        });
    }

    // 6.3) Vía del tren: progreso, paradas y sombra de la navbar
    function actualizarVia() {
        if (!viaCarril || !viaTren) return;

        var ancho = viaCarril.clientWidth;
        if (!ancho) return;

        var anchoTren = viaTren.offsetWidth;
        var mitad = Math.min(anchoTren / 2, ancho / 2);
        var recorrido = Math.max(0, ancho - anchoTren);
        var altura = document.documentElement.scrollHeight - window.innerHeight;
        var progreso = altura > 0 ? Math.max(0, Math.min(1, window.scrollY / altura)) : 0;
        var centro = mitad + progreso * recorrido;

        viaTren.style.left = centro + 'px';

        if (barraProgreso) {
            barraProgreso.style.left = mitad + 'px';
            barraProgreso.style.width = Math.max(0, centro - mitad) + 'px';
        }

        var lectura = (navbar ? navbar.offsetHeight : 0) + 80;
        var nodos = viaParadas ? viaParadas.children : [];
        var indiceActual = 0;

        secciones.forEach(function (item, i) {
            var p = altura > 0 ? (item.elemento.offsetTop - lectura) / altura : 0;
            p = Math.max(0, Math.min(1, p));
            if (i === 0) p = 0;
            if (i === secciones.length - 1) p = 1;

            var nodo = nodos[i];
            if (nodo) {
                nodo.style.left = (mitad + p * recorrido) + 'px';
                nodo.classList.toggle('is-reached', progreso >= p - 0.001);
            }
            if (progreso >= p - 0.001) indiceActual = i;
        });

        Array.prototype.forEach.call(nodos, function (nodo, i) {
            nodo.classList.toggle('is-current', i === indiceActual);
        });

        if (viaCarril.parentElement) {
            viaCarril.parentElement.classList.add('via-lista');
        }
    }

    function actualizarBotonArriba() {
        if (!btnArriba) return;
        btnArriba.hidden = window.scrollY <= 400;
    }

    function actualizarNavbar() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 8);
    }

    if (btnArriba) {
        btnArriba.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: reducirMovimientoNav ? 'auto' : 'smooth'
            });
        });
    }

    var pendiente = false;
    function alHacerScroll() {
        if (pendiente) return;
        pendiente = true;
        window.requestAnimationFrame(function () {
            actualizarNavbar();
            marcarEnlaceActivo();
            actualizarVia();
            actualizarBotonArriba();
            pendiente = false;
        });
    }

    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alHacerScroll);
    window.addEventListener('load', alHacerScroll);
    alHacerScroll();

    // 7) Animación de aparición de las secciones al hacer scroll
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
