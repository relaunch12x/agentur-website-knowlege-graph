import type { APIRoute } from 'astro';
import { createHmac } from 'node:crypto';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.json();

  const secret = import.meta.env.WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Nicht konfiguriert' }), { status: 500 });
  }

  const body = JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone || undefined,
    company_name: formData.company_name || undefined,
    message: formData.message || undefined,
    source_url: new URL(request.url).origin,
    timestamp: new Date().toISOString(),
  });

  const signature = createHmac('sha256', secret).update(body).digest('hex');

  const res = await fetch('https://onboarding.relaunch12x.agency/api/crm/webhook/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    },
    body,
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
};
