export async function onRequestPost(context) {
  try {
    var secret = context.env.WEBHOOK_SECRET;
    var formData = await context.request.json();

    var payload = {
      name: formData.name,
      email: formData.email,
      source_url: new URL(context.request.url).origin,
      timestamp: new Date().toISOString()
    };
    if (formData.phone) payload.phone = formData.phone;
    if (formData.company_name) payload.company_name = formData.company_name;
    if (formData.message) payload.message = formData.message;

    var bodyStr = JSON.stringify(payload);

    var enc = new TextEncoder();
    var cryptoKey = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    var sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(bodyStr));
    var sigArr = new Uint8Array(sigBuf);
    var hex = '';
    for (var i = 0; i < sigArr.length; i++) {
      var h = sigArr[i].toString(16);
      hex += (h.length === 1 ? '0' + h : h);
    }

    var webhookRes = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': hex
      },
      body: bodyStr
    });

    var resBody = await webhookRes.text();
    return new Response(resBody || '{}', {
      status: webhookRes.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('{"error":"' + (e.message || 'unknown') + '"}', {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
