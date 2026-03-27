export async function onRequestPost(context) {
  try {
    var secret = context.env.WEBHOOK_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Webhook nicht konfiguriert' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    var formData = await context.request.json();
    if (!formData.name || !formData.email) {
      return new Response(JSON.stringify({ error: 'Name und E-Mail sind Pflichtfelder' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    var webhookPayload = {
      name: formData.name,
      email: formData.email,
      source_url: new URL(context.request.url).origin,
      timestamp: new Date().toISOString()
    };
    if (formData.phone) webhookPayload.phone = formData.phone;
    if (formData.company_name) webhookPayload.company_name = formData.company_name;
    if (formData.message) webhookPayload.message = formData.message;

    var bodyString = JSON.stringify(webhookPayload);

    // HMAC-SHA256 via Web Crypto API
    var encoder = new TextEncoder();
    var key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    var sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyString));
    var signature = Array.from(new Uint8Array(sigBuf))
      .map(function(b) { return b.toString(16).padStart(2, '0'); })
      .join('');

    var res = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      },
      body: bodyString
    });

    var data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
