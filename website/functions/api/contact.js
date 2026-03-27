async function computeHmac(payload, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function onRequestPost(context) {
  try {
    const secret = context.env.WEBHOOK_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: 'WEBHOOK_SECRET not set', keys: Object.keys(context.env) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await context.request.json();
    if (!formData.name || !formData.email) {
      return new Response(
        JSON.stringify({ error: 'Name und E-Mail sind Pflichtfelder' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      company_name: formData.company_name || undefined,
      message: formData.message || undefined,
      source_url: new URL(context.request.url).origin,
      timestamp: new Date().toISOString(),
    });

    const signature = await computeHmac(body, secret);

    const res = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: body,
    });

    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
