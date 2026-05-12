// POST { email } → creates a row in the configured Notion database.
// Requires env vars NOTION_TOKEN and NOTION_DATABASE_ID.
//
// We resolve the database's title-property name at request time (cached in
// module scope) so the route works regardless of whether the column is
// named "Name", "Email", or anything else.

export const runtime = "nodejs";

const NOTION_VERSION = "2022-06-28";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Notion accepts database IDs with or without dashes; strip any query string
// (people often paste the full URL including ?v=…).
function normalizeDatabaseId(raw) {
  if (!raw) return "";
  return raw.split("?")[0].replace(/-/g, "").trim();
}

let titlePropertyCache = null;

async function getTitleProperty(databaseId, token) {
  if (titlePropertyCache) return titlePropertyCache;
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion DB lookup failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  const entry = Object.entries(data.properties || {}).find(
    ([, v]) => v.type === "title",
  );
  if (!entry) throw new Error("No title property found on Notion database");
  titlePropertyCache = entry[0];
  return titlePropertyCache;
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = normalizeDatabaseId(process.env.NOTION_DATABASE_ID);
  if (!token || !databaseId) {
    console.error("Missing NOTION_TOKEN or NOTION_DATABASE_ID");
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  try {
    const titleProp = await getTitleProperty(databaseId, token);
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          [titleProp]: {
            title: [{ type: "text", text: { content: email } }],
          },
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Notion page create failed:", res.status, body);
      return Response.json({ error: "Notion write failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Waitlist route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
