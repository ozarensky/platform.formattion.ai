// Form → on open. Body: { token }
// Returns what the welcome screen needs plus the saved draft, or { closed: "expired" | "used" | "missing" }.
import { admin, CORS, fail, json, loadInvite, signedUrls } from "../_shared/intake.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("POST only", 405);
  const { token } = await req.json().catch(() => ({}));
  const db = admin();
  const found = await loadInvite(db, String(token || ""));
  if (!found.invite) return json({ closed: found.reason });
  const inv = found.invite;

  const { data: op } = await db.from("operatives")
    .select("first_name, starts_on, invited_by_name, status, draft, tenants(name)")
    .eq("id", inv.operative_id).single();
  if (!op) return json({ closed: "missing" });

  if (!inv.opened_at) await db.from("operative_invites").update({ opened_at: new Date().toISOString() }).eq("id", inv.id);
  if (op.status === "invited") await db.from("operatives").update({ status: "draft" }).eq("id", inv.operative_id);

  const draft = (op.draft || null) as { files?: Record<string, string> } | null;
  const urls = await signedUrls(db, Object.values(draft?.files || {}));

  return json({
    firstName: op.first_name,
    contact: op.invited_by_name || "Your manager",
    company: (op as { tenants?: { name?: string } }).tenants?.name || "the team",
    startsOn: op.starts_on,
    expiresAt: inv.expires_at,
    draft,
    urls,
  });
});
