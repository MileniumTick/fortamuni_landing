# Deploy de Fortamuni Landing (Astro + Cloudflare Pages)

## Stack actual de producción

- **Hosting**: Cloudflare Pages
- **Frontend**: Astro + Tailwind CSS v4 + TypeScript
- **API del formulario**: Cloudflare Pages Functions en `functions/api/contact.ts`
- **Correo saliente**: Resend (ejecutado en servidor)

## Flujo del formulario de contacto

- El cliente **NO** usa Resend directamente.
- El cliente solo hace `POST` a `/api/contact`.
- Resend corre del lado servidor en `functions/api/contact.ts` (Cloudflare Pages Functions).

## Variables de entorno (solo servidor)

Configurarlas en **Cloudflare Pages > Settings > Environment variables**:

| Variable | Requerida | Uso |
|---|---:|---|
| `RESEND_API_KEY` | Si | API key de Resend |
| `CONTACT_EMAIL` | Si | Correo destino de los mensajes |
| `CONTACT_SENDER_EMAIL` | Si | Remitente verificado en Resend |
| `CONTACT_SENDER_NAME` | No | Nombre visible del remitente |

Importante:

- `RESEND_API_KEY` y demas variables de correo van **solo** en Cloudflare Pages (server env vars).
- No exponer estas variables en frontend.
- Valor recomendado para `CONTACT_EMAIL`: `fortamunisaskya@gmail.com`.

Para entorno local de Functions:

```bash
cp .dev.vars.example .dev.vars
```

## Despliegue en Cloudflare Pages

### Crear proyecto

1. Ir a **Cloudflare Dashboard**.
2. Entrar a **Workers & Pages**.
3. Crear proyecto de **Pages** y conectar este repo.

### Build settings recomendados

- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

Cloudflare detecta `functions/` automaticamente para exponer `/api/contact`.

## SEO y dominio

1. Configurar dominio custom (por ejemplo `fortamuni.com`) en Pages.
2. Verificar que los metadatos SEO usen el dominio final:
   - canonical
   - `og:url`
   - `og:image`
   - `twitter:image`
   - URLs de `schema.org`
3. Mantener `public/sitemap.xml` alineado con las rutas publicas vigentes.

## Checklist de salida a produccion

- [ ] Dominio final configurado en Cloudflare Pages
- [ ] Dominio verificado en Resend
- [ ] `RESEND_API_KEY` cargada en variables de entorno del servidor
- [ ] `CONTACT_EMAIL` y `CONTACT_SENDER_EMAIL` configurados
- [ ] Prueba E2E del formulario (`POST /api/contact`) exitosa
- [ ] Metadatos SEO y sitemap apuntando al dominio final
