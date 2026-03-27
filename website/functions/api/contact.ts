/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Nimmt Kontaktformular-Daten vom Browser, berechnet HMAC-SHA256
 * serverseitig und leitet an den CRM Webhook weiter.
 */

async function computeHmac(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    const secret = env.WEBHOOK_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Webhook nicht konfiguriert' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.json();

    if (!formData.name || !formData.email) {
      return new Response(JSON.stringify({ error: 'Name und E-Mail sind Pflichtfelder' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const webhookBody = JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      company_name: formData.company_name || undefined,
      message: formData.message || undefined,
      source_url: new URL(request.url).origin,
      timestamp: new Date().toISOString(),
    });

    const signature = await computeHmac(webhookBody, secret);

    const res = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: webhookBody,
    });

    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Interner Fehler', detail: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
