export async function onRequestPost(context) {
  return new Response(JSON.stringify({ status: 'ok', hasSecret: !!context.env.WEBHOOK_SECRET }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
