# HUMA Digital Studio

Sitio web comercial de **HUMA Digital Studio** — agencia de diseño y desarrollo web.
Landing page de una sola página, estática (HTML + CSS + JS), sin backend.

## 🌐 Publicación

El sitio se despliega en **Cloudflare Pages** conectado a este repositorio:
cada vez que se hace `push` a la rama `main`, Cloudflare publica los cambios
automáticamente.

- Comando de build: _(ninguno — es HTML estático)_
- Carpeta de salida: la raíz del repositorio (`/`)

## 📁 Estructura

| Archivo          | Descripción                                          |
|------------------|------------------------------------------------------|
| `index.html`     | Página principal (todo el sitio en un solo archivo). |
| `favicon.png`    | Ícono del sitio.                                     |
| `og-image.png`   | Imagen para compartir en redes (Open Graph).         |
| `robots.txt`     | Instrucciones para buscadores.                       |
| `sitemap.xml`    | Mapa del sitio para SEO.                             |
| `_headers`       | Cabeceras de seguridad y caché (Cloudflare).         |
| `404.html`       | Página de error personalizada.                       |

## ✏️ Cómo hacer cambios

1. Edita el archivo que quieras en Visual Studio Code.
2. Guarda los cambios.
3. En el panel **Source Control**, escribe un mensaje y haz **Commit**.
4. Pulsa **Sync / Push**.
5. En 1–2 minutos los cambios estarán online.

---

© Ande Digital. Todos los derechos reservados.
