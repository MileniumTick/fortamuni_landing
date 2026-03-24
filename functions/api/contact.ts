type Env = {
  RESEND_API_KEY?: string;
  CONTACT_EMAIL?: string;
  CONTACT_SENDER_EMAIL?: string;
  CONTACT_SENDER_NAME?: string;
};

type ContactPayload = {
  nombre?: string;
  cargo?: string;
  municipalidad?: string;
  requerimiento?: string;
  email?: string;
  telefono?: string;
  _honeypot?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\d\s+()-]{8,20}$/;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getClientIdentifier(request: Request): string | null {
  const cfIp = request.headers.get('CF-Connecting-IP')?.trim();
  if (cfIp) {
    return cfIp;
  }

  const forwardedFor = request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
  if (forwardedFor) {
    return forwardedFor;
  }

  return null;
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return true;
  }

  existing.count += 1;
  rateLimitStore.set(identifier, existing);
  return false;
}

function isValidPayload(payload: ContactPayload): boolean {
  const nombre = payload.nombre?.trim() ?? '';
  const cargo = payload.cargo?.trim() ?? '';
  const municipalidad = payload.municipalidad?.trim() ?? '';
  const requerimiento = payload.requerimiento?.trim() ?? '';
  const email = payload.email?.trim() ?? '';
  const telefono = payload.telefono?.trim() ?? '';

  return Boolean(
    nombre.length >= 2 &&
      nombre.length <= 100 &&
      cargo.length >= 2 &&
      cargo.length <= 100 &&
      municipalidad.length >= 2 &&
      municipalidad.length <= 100 &&
      requerimiento.length >= 10 &&
      requerimiento.length <= 2000 &&
      email.length <= 254 &&
      emailPattern.test(email) &&
      (!telefono || phonePattern.test(telefono)),
  );
}

function formatEmailHTML(payload: Required<Omit<ContactPayload, '_honeypot'>>): string {
  return `
    <h1>Nueva consulta desde Fortamuni</h1>
    <p><strong>Nombre:</strong> ${escapeHtml(payload.nombre)}</p>
    <p><strong>Cargo:</strong> ${escapeHtml(payload.cargo)}</p>
    <p><strong>Municipalidad:</strong> ${escapeHtml(payload.municipalidad)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(payload.telefono || 'No indicado')}</p>
    <hr />
    <p><strong>Requerimiento:</strong></p>
    <p>${escapeHtml(payload.requerimiento).replace(/\n/g, '<br />')}</p>
  `;
}

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  try {
    const payload = (await request.json()) as ContactPayload;

    if (payload._honeypot?.trim()) {
      return jsonResponse({ success: true }, 200);
    }

    if (!isValidPayload(payload)) {
      return jsonResponse({ success: false, error: 'Campos requeridos faltantes o inválidos.' }, 400);
    }

    const clientIdentifier = getClientIdentifier(request);
    if (clientIdentifier && isRateLimited(clientIdentifier)) {
      return jsonResponse({ success: false, error: 'Demasiados intentos. Intente nuevamente en una hora.' }, 429);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse({ success: false, error: 'Falta configurar el servicio de correo.' }, 500);
    }

    if (!env.CONTACT_SENDER_EMAIL) {
      return jsonResponse({ success: false, error: 'Falta configurar el remitente del formulario.' }, 500);
    }

    const contactEmail = env.CONTACT_EMAIL ?? 'fortamunisaskya@gmail.com';
    const senderName = env.CONTACT_SENDER_NAME?.trim() || 'Fortamuni Web';

    const normalizedPayload = {
      nombre: payload.nombre!.trim(),
      cargo: payload.cargo!.trim(),
      municipalidad: payload.municipalidad!.trim(),
      requerimiento: payload.requerimiento!.trim(),
      email: payload.email!.trim(),
      telefono: payload.telefono?.trim() ?? '',
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${senderName} <${env.CONTACT_SENDER_EMAIL}>`,
        to: contactEmail,
        subject: `Nueva consulta: ${normalizedPayload.municipalidad} - ${normalizedPayload.cargo}`,
        html: formatEmailHTML(normalizedPayload),
        reply_to: normalizedPayload.email,
      }),
    });

    if (!resendResponse.ok) {
      return jsonResponse({ success: false, error: 'Error al enviar el mensaje.' }, 500);
    }

    return jsonResponse({ success: true }, 200);
  } catch {
    return jsonResponse({ success: false, error: 'Error al procesar la solicitud.' }, 500);
  }
};
