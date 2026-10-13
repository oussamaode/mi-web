# mi-web

Web personal de **Oussama El Abbas Akhrif**: técnico eléctrico de trenes de alta velocidad en **Talgo** y estudiante de **Desarrollo de Aplicaciones Web (DAW)** a distancia en el IES Virgen de la Paz (Alcobendas).

Sitio estático hecho con HTML, CSS y JavaScript puro, sin dependencias ni proceso de compilación.

## Estructura

| Archivo             | Descripción                                          |
| ------------------- | ---------------------------------------------------- |
| `index.html`        | Página completa (contenido, SEO y datos estructurados) |
| `style.css`         | Estilos, tema claro/oscuro y diseño responsive       |
| `script.js`         | Modo oscuro con memoria + animaciones al hacer scroll |
| `fotopersonal.avif` | Foto de perfil                                        |
| `in.png`            | Icono de LinkedIn (también usado como favicon)       |

## Secciones

- **Sobre mí** y formación (DAW, instalaciones eléctricas, E.S.O.)
- **Lo que he hecho**: experiencia en Honeywell, Gollman Zwick y Talgo (popovers nativos)
- **Me gusta**: fútbol, proyectos IoT y programación
- **Contacto**: teléfono, email, ubicación y LinkedIn

## Cómo verla

Abre `index.html` directamente en el navegador o sirve la carpeta con un servidor local:

```powershell
python -m http.server 8000
```

Luego visita http://localhost:8000

## Características

- Modo claro/oscuro con memoria (`localStorage`) y detección de la preferencia del sistema.
- Diseño responsive (2 columnas en escritorio, 1 en móvil).
- Accesibilidad: enlace "saltar al contenido", foco visible y soporte de `prefers-reduced-motion`.
- SEO: metadatos Open Graph/Twitter, favicon y datos estructurados JSON-LD.
