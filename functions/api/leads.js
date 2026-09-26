const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}
function clean(value, max = 200) {
  return String(value || '').trim().slice(0, max);
}
export async function onRequestPost(context) {
  try {
    const request = context.request;
    const type = request.headers.get('content-type') || '';
    if (!type.includes('application/json')) return json({ error: 'unsupported_media_type' }, 415);
    const body = await request.json();
    const contact = body.contact || {};
    const demo = body.demo || {};
    const name = clean(contact.name, 80);
    const email = clean(contact.email, 120);
    const phone = clean(contact.phone, 30);
    if (!name || (!email && !phone)) return json({ error: 'invalid_contact' }, 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);

    const id = clean(body.demoId, 100) || crypto.randomUUID();
    const record = {
      id,
      createdAt: new Date().toISOString(),
      source: 'demo_generator',
      contact: { name, email, phone },
      business: {
        name: clean(demo.businessName, 80),
        sector: clean(demo.sector, 40),
        city: clean(demo.city, 70),
        description: clean(demo.description, 360),
        services: Array.isArray(demo.services) ? demo.services.slice(0, 3).map(v => clean(v, 60)) : [],
        style: clean(demo.style, 30),
        color: clean(demo.color, 30)
      }
    };

    if (context.env.HUMA_LEADS) {
      await context.env.HUMA_LEADS.put('lead:' + id, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 365 });
    } else {
      return json({ error: 'lead_store_not_configured' }, 503);
    }

    if (context.env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(context.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(record) });
      } catch (_) {}
    }
    return json({ ok: true, id }, 201);
  } catch (_) {
    return json({ error: 'bad_request' }, 400);
  }
}

export function onRequest() {
  return json({ error: 'method_not_allowed' }, 405);
}
