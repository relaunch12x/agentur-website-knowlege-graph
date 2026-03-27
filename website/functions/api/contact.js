export async function onRequestPost(context) {
  var step = 'init';
  try {
    var secret = context.env.WEBHOOK_SECRET;
    if (!secret) {
      return Response.json({ error: 'no secret' }, { status: 500 });
    }

    step = 'parse';
    var formData = await context.request.json();
    if (!formData.name || !formData.email) {
      return Response.json({ error: 'missing fields' }, { status: 400 });
    }

    step = 'build';
    var payload = { name: formData.name, email: formData.email, source_url: new URL(context.request.url).origin, timestamp: new Date().toISOString() };
    if (formData.phone) payload.phone = formData.phone;
    if (formData.company_name) payload.company_name = formData.company_name;
    if (formData.message) payload.message = formData.message;
    var bodyStr = JSON.stringify(payload);

    step = 'hmac';
    var enc = new TextEncoder();
    var key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    var sig = await crypto.subtle.sign('HMAC', key, enc.encode(bodyStr));
    var hex = '';
    var arr = new Uint8Array(sig);
    for (var i = 0; i < arr.length; i++) {
      hex += arr[i].toString(16).padStart(2, '0');
    }

    step = 'fetch';
    var res = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': hex },
      body: bodyStr
    });

    step = 'response';
    var data = await res.text();
    return new Response(data, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return Response.json({ error: e.message, step: step }, { status: 500 });
  }
}
