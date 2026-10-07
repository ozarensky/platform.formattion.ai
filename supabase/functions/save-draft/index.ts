// Form → after every step. Body: { token, draft }
// The draft is the form's state without the photos themselves (those are in Storage;
// draft.files maps each slot to its storage path).
import { admin, CORS, fail, json, loadInvite, ownPath } from "../_shared/intake.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("POST only", 405);
  const { token, draft } = await req.json().catch(() => ({}));
  const db = admin();
  const found = await loadInvite(db, String(token || ""));
  if (!found.invite) return json({ closed: found.reason });
  if (!draft || typeof draft !== "object") return fail("No draft");
  if (JSON.stringify(draft).length > 200_000) return fail("Draft too big");

  const files: Record<string, string> = {};
  for (const [k, v] of Object.entries(draft.files || {})) {
    const p = ownPath(found.invite, v);
    if (p) files[k] = p;
  }
  const { error } = await db.from("operatives").update({ draft: { ...draft, files } }).eq("id", found.invite.operative_id);
  if (error) return fail(error.message, 500);
  return json({ ok: true });
});
