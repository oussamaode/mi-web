# mi-web

Web personal de **Oussama El Abbas Akhrif**: técnico eléctrico de trenes de alta velocidad en **Talgo** y estudiante de **Desarrollo de Aplicaciones Web (DAW)** a distancia en el IES Virgen de la Paz (Alcobendas).

Sitio estático hecho con HTML, CSS y JavaScript puro, sin dependencias ni proceso de compilación.

Publicada en GitHub Pages: https://oussamaode.github.io/mi-web/

## Estructura

| Archivo             | Descripción                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `index.html`        | Página completa (contenido, navegación, SEO y datos estructurados) |
| `style.css`         | Estilos, paleta, temas claro/oscuro y diseño responsive            |
| `script.js`         | Tema, navegación, vía del tren, widget, GitHub y animaciones       |
| `tren/tren.png`     | Dibujo del tren que recorre la vía de navegación                   |
| `fotopersonal.avif` | Foto de perfil                                                     |
| `in.png`            | Icono de LinkedIn (botón del footer)                               |
| `assets/`           | Logo/favicon e iconos del sitio                                    |
| `robots.txt`        | Reglas para buscadores                                             |
| `sitemap.xml`       | Mapa del sitio para buscadores                                     |

## Secciones

- **Inicio**: presentación, foto, roles actuales y accesos rápidos.
- **Sobre mí** y formación (DAW, instalaciones eléctricas, E.S.O.).
- **Lo que he hecho**: experiencia en Honeywell, Gollman Zwick y Talgo (popovers nativos).
- **Me gusta**: fútbol, proyectos IoT y programación.
- **Contacto**: email, ubicación, LinkedIn y widget flotante con ubicación, fecha y hora local.

## Navegación

- Barra fija con logo, enlaces a cada sección y botón de modo claro/oscuro.
- Menú desplegable accesible en móvil (Escape, clic fuera y cierre al elegir sección).
- Vía con un tren que avanza según el scroll y paradas que se iluminan en cada sección.
- Enlace activo resaltado automáticamente y botón para volver arriba.
- Enlace "saltar al contenido" y desplazamiento con margen para no quedar bajo la barra.

## Características

- Modo claro/oscuro con memoria (`localStorage`) y detección de la preferencia del sistema.
- Paleta rojo/coral con neutros y `theme-color` sincronizado con el tema activo.
- Diseño responsive (2 columnas en escritorio, 1 en móvil).
- Widget flotante con ubicación, fecha y hora del visitante (freeipapi.com).
- Proyectos de GitHub cargados automáticamente (3 repositorios públicos más recientes).
- Accesibilidad: foco visible, menú accesible y soporte de `prefers-reduced-motion`.
- Funciona sin JavaScript: el contenido y el menú siguen siendo visibles y navegables.
- SEO: título y descripción, Open Graph/Twitter, canonical, favicon, `robots.txt`, `sitemap.xml` y datos estructurados JSON-LD.

## Cómo verla

Abre `index.html` directamente en el navegador o sirve la carpeta con un servidor local:

```powershell
python -m http.server 8000
```

Luego visita http://localhost:8000
