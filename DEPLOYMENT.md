# Deploy de Fortamuni Landing

## Stack de producción

- **Hosting**: Cloudflare Pages
- **Frontend**: Vite + Tailwind CSS v4 + TypeScript
- **Backend de formulario**: Cloudflare Pages Functions
- **Correo saliente**: Resend

---

## 1. Requisitos previos

Antes de publicar, necesitás definir estas varas reales:

1. **Dominio final**
   - Ejemplo: `fortamuni.com` o `www.fortamuni.com`
2. **Correo destino real**
   - Ejemplo: `info@fortamuni.com`
3. **Dominio verificado en Resend**
   - Obligatorio para usar `CONTACT_SENDER_EMAIL`
4. **Remitente real del formulario**
   - Ejemplo: `noreply@fortamuni.com`

---

## 2. Variables de entorno requeridas

En Cloudflare Pages configurá estas variables:

| Variable | Requerida | Ejemplo | Uso |
|---|---:|---|---|
| `RESEND_API_KEY` | Sí | `re_xxxxx` | Autenticación con Resend |
| `CONTACT_EMAIL` | Sí | `info@fortamuni.com` | Destino del formulario |
| `CONTACT_SENDER_EMAIL` | Sí | `noreply@fortamuni.com` | Remitente verificado |
| `CONTACT_SENDER_NAME` | No | `Fortamuni Web` | Nombre visible del remitente |

Para desarrollo local, copiá:

```bash
cp .dev.vars.example .dev.vars
```

Y luego reemplazá los valores de ejemplo.

---

## 3. Configuración en Cloudflare Pages

### Crear el proyecto

1. Entrá a **Cloudflare Dashboard**
2. Ir a **Workers & Pages**
3. Seleccioná **Create application**
4. Elegí **Pages**
5. Conectá el repositorio Git

### Build settings

Usá estos valores:

- **Framework preset**: `None`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (o vacío si el repo es solo este proyecto)

---

## 4. Configuración del dominio

Cuando tengás el dominio real:

1. Agregalo en **Custom domains** dentro del proyecto Pages
2. Actualizá estos valores en `index.html`:
   - `canonical`
   - `og:url`
   - `og:image`
   - `twitter:image`
   - `schema.org url/logo/image`

### Importante

Mientras el dominio final no exista, el sitio sigue usando `https://fortamuni.pages.dev/` como placeholder operativo.

---

## 5. Configuración en Resend

1. Crear cuenta en Resend
2. Verificar dominio real
3. Crear el sender email, por ejemplo:
   - `noreply@fortamuni.com`
4. Copiar la API key a `RESEND_API_KEY`

### Ojo

Si `CONTACT_SENDER_EMAIL` no pertenece a un dominio verificado, **el formulario va a fallar**. Así de simple.

---

## 6. Estado actual del rate limiting

El endpoint ya tiene **rate limiting básico en memoria**.

### Qué significa

- Sirve como protección inicial
- No es persistente entre instancias
- No es la versión ideal para tráfico real distribuido

### Recomendación de siguiente nivel

Si el formulario empieza a recibir spam o más tráfico, migrar el rate limit a:

- **Cloudflare KV**, o
- **Durable Objects**, o
- agregar **Cloudflare Turnstile**

---

## 7. Checklist antes de producción real

- [ ] Definir dominio final
- [ ] Verificar dominio en Resend
- [ ] Configurar `CONTACT_SENDER_EMAIL`
- [ ] Configurar `CONTACT_EMAIL`
- [ ] Reemplazar URLs `fortamuni.pages.dev` en `index.html`
- [ ] Sustituir métricas ilustrativas de casos de éxito
- [ ] Agregar imágenes/fotos/logo finales si existen

---

## 8. Comandos útiles

### Desarrollo frontend

```bash
npm run dev
```

### Typecheck

```bash
npm run typecheck
```

### Build local

```bash
npm run build
```

### Servir Pages Functions localmente (cuando se necesite)

```bash
npx wrangler pages dev dist
```

---

## 9. Pendientes operativos

El proyecto está técnicamente encaminado, pero todavía depende de datos reales para considerarse “deploy final”:

- dominio
- remitente verificado
- correo real destino
- métricas definitivas de casos
- assets de marca definitivos
