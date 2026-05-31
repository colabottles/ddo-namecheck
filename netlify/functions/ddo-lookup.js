// netlify/functions/ddo-lookup.js
// Proxies requests to DDO Audit API to avoid CORS issues in the browser.

const DDO_AUDIT_BASE = 'https://api.ddoaudit.com/v1/characters';

export async function handler(event) {
  const { server, name } = event.queryStringParameters || {};

  if (!server || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing server or name parameter' }),
    };
  }

  const url = `${DDO_AUDIT_BASE}/${encodeURIComponent(server)}/${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url, {
      headers: { 'accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    // 404 means character not found — valid result, not an error
    if (response.status === 404) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(null),
      };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `DDO Audit returned ${response.status}` }),
      };
    }

    const json = await response.json();

    // Response is wrapped: { data: {...}, source: "..." }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json.data ?? null),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Could not reach DDO Audit', detail: err.message }),
    };
  }
}