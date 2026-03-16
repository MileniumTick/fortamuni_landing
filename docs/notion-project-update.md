# Fortamuni Landing — Estado del Proyecto

## Estado actual
- **Fase:** implementación avanzada / refinamiento comercial y UX
- **Stack:** Vite + Tailwind CSS v4 + TypeScript + Chart.js + Cloudflare Pages Functions + Resend

---

## Objetivo
Construir una landing profesional para Fortamuni que:
- posicione a la firma como consultora especializada en gestión vial municipal
- convierta visitas en contactos calificados
- comunique respaldo técnico, normativo e institucional
- prepare el terreno para deploy en Cloudflare Pages

---

## Avances completados

### Base técnica
- estructura del proyecto creada
- Vite + Tailwind v4 + TypeScript configurados
- Cloudflare Pages Functions integradas para formulario
- endpoint de contacto endurecido
- `.dev.vars.example` agregado
- `DEPLOYMENT.md` creado
- git inicializado y commits realizados

### Landing / contenido
- hero optimizado
- sección de confianza y respaldo institucional
- sección sobre Fortamuni / Saskya
- sección de proceso de trabajo
- sección de riesgos que Fortamuni ayuda a evitar
- sección de diferenciación (“Por qué Fortamuni”)
- servicios con acordeón accesible
- casos de éxito con mejor framing comercial
- FAQ
- sección de contacto reforzada

### UX / accesibilidad
- navegación móvil con mejor accesibilidad
- smooth scroll con focus management
- reduced motion support
- errores del formulario se limpian al editar
- fallback para fallo de carga de charts
- charts con contexto textual accesible
- acordeón con navegación por teclado y altura dinámica

### SEO / posicionamiento
- meta title y description
- OG / Twitter
- canonical
- JSON-LD `ProfessionalService`
- JSON-LD `FAQPage`
- refuerzo semántico con:
  - CGR
  - MOPT
  - NICSP
  - Ley 8114
  - Ley 9329
  - UTGV
  - SICOP

---

## Commits realizados
- `f7d08d0` — `feat: scaffold Fortamuni landing page`
- `391bafc` — `chore: add project agent skills and configuration`
- `d7760eb` — `feat: refine landing messaging and interactions`

---

## Decisiones importantes
- `.agent/`, `.agents/` y `skills-lock.json` **sí se versionan**
- no se usó framework frontend; se mantuvo **vanilla TypeScript**
- charts se cargan lazy
- anti-spam con honeypot
- rate limiting actual del formulario es básico e **in-memory**
- deploy queda a cargo del usuario

---

## Pendientes reales

### 1. Dominio final
**Pendiente**
- reemplazar `https://fortamuni.pages.dev/` por dominio real en:
  - canonical
  - og:url
  - og:image
  - twitter:image
  - schema `url/logo/image`

### 2. Datos reales de contacto
**Pendiente**
- confirmar correo final visible en landing
- confirmar `CONTACT_EMAIL`
- confirmar `CONTACT_SENDER_EMAIL`
- confirmar `CONTACT_SENDER_NAME`

### 3. Resend / correo saliente
**Pendiente**
- verificar dominio en Resend
- configurar sender real
- cargar `RESEND_API_KEY`

### 4. Casos de éxito con métricas reales
**Pendiente**
- reemplazar datos ilustrativos por métricas verificadas
- definir si se mostrarán:
  - km intervenidos
  - porcentaje de red inventariada
  - horizonte de planificación
  - activos valorados
  - tipo de entregable oficial

### 5. Branding final
**Pendiente**
- logo definitivo
- imágenes reales si se van a usar
- confirmar si se mantienen colores actuales o se ajustan

### 6. Hardening futuro opcional
**Pendiente opcional**
- mover rate limit a KV / Durable Objects si el formulario recibe tráfico real
- considerar Turnstile si aparece spam

---

## Próximos pasos recomendados
1. definir dominio y correos reales
2. reemplazar datos ilustrativos de casos
3. cerrar branding final
4. preparar deploy real en Cloudflare Pages
5. testear formulario en entorno real con Resend

---

## Archivos clave
- `index.html`
- `src/style.css`
- `src/sections/services.ts`
- `src/sections/contact.ts`
- `src/sections/case-studies.ts`
- `src/components/smooth-scroll.ts`
- `functions/api/contact.ts`
- `DEPLOYMENT.md`
- `.dev.vars.example`

---

## Riesgos actuales
- dominio y email aún no definitivos
- métricas de casos todavía ilustrativas
- rate limiting no persistente
- branding visual todavía puede cambiar
