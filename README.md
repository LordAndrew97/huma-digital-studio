# HUMA Digital Studio

Sitio web comercial de **HUMA Digital Studio** — agencia de diseño y desarrollo web.
Landing page comercial con generador de demos y una capa serverless mínima para captación de leads.

## 🌐 Publicación

El sitio se despliega en **Cloudflare Pages** conectado a este repositorio:
cada vez que se hace `push` a la rama `main`, Cloudflare publica los cambios
automáticamente.

- Comando de build: _(ninguno — es HTML estático)_
- Carpeta de salida: la raíz del repositorio (`/`)

## 📁 Estructura

| Archivo                              | Descripción                                          |
|--------------------------------------|------------------------------------------------------|
| `index.html`                         | Estructura semántica de la página principal.         |
| `assets/site.css` / `assets/site.js` | Estilos y comportamiento de la página principal.     |
| `demo.html`                          | Generador de demo accesible desde `/demo`.            |
| `assets/demo-image-selector.js`      | Selección contextual de imágenes según el negocio.    |
| `favicon.svg` / `favicon-huma.png`   | Iconos del sitio.                                    |
| `og-image.jpg`                       | Imagen optimizada para compartir en redes.           |
| `robots.txt`                         | Instrucciones para buscadores.                       |
| `sitemap.xml`                        | Mapa del sitio para SEO.                             |
| `_headers`                           | Cabeceras de seguridad y caché (Cloudflare).         |
| `404.html`                           | Página de error personalizada.                       |
| `scripts/validate-site.mjs`          | Validación automática de enlaces, IDs y dependencias.|
| `scripts/test-demo-images.cjs`       | Pruebas de relación entre negocio e imágenes.         |

## ✏️ Cómo hacer cambios

1. Edita el archivo que quieras en Visual Studio Code.
2. Guarda los cambios.
3. En el panel **Source Control**, escribe un mensaje y haz **Commit**.
4. Pulsa **Sync / Push**.
5. En 1–2 minutos los cambios estarán online.

---

© HUMA Digital Studio. Todos los derechos reservados.


## Captación de leads

El generador envía las solicitudes de clientes a `POST /api/leads`, implementado como Cloudflare Pages Function en `functions/api/leads.js`.

Configuración necesaria en Cloudflare Pages:
- Binding KV: `HUMA_LEADS` — almacena cada lead durante 365 días.
- Variable opcional: `LEAD_WEBHOOK_URL` — reenvía el lead a un CRM o automatización externa.

La demo sigue generándose en el navegador. Los datos solo se envían cuando el usuario pulsa **Enviar solicitud** y acepta expresamente el contacto.
