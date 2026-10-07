// Form → "Send to <manager>". Body: { token, d, cards, files }
// Writes the answers into their columns, one row per card, the bank row, closes the
// link and puts the operative in the manager's Waiting list as "to approve".
import { admin, CORS, fail, json, loadInvite, ownPath } from "../_shared/intake.ts";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "") || null;
const date = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("POST only", 405);
  const body = await req.json().catch(() => ({}));
  const db = admin();
  const found = await loadInvite(db, String(body.token || ""));
  if (!found.invite) return json({ closed: found.reason });
  const inv = found.invite;

  const d = (body.d || {}) as Record<string, unknown>;
  const files = (body.files || {}) as Record<string, unknown>;
  const file = (k: string) => ownPath(inv, files[k]);
  const cards = Array.isArray(body.cards) ? body.cards : [];

  if (!str(d.firstName) || !str(d.surname)) return fail("Name missing");
  if (!file("signature")) return fail("Signature missing");
  if (!file("photo")) return fail("Photo missing");

  const rtw = ["passport", "code", "brp"].includes(d.rtw as string) ? (d.rtw as string) : null;
  const points = typeof d.licPoints === "string" && /^\d{1,2}$/.test(d.licPoints) ? Number(d.licPoints) : null;
  const now = new Date().toISOString();

  const { error: opErr } = await db.from("operatives").update({
    first_name: str(d.firstName), surname: str(d.surname), gender: str(d.gender, 40), date_of_birth: date(d.dob),
    trade: str(d.trade), address_line: str([d.addrLine, d.addrLine2].filter(Boolean).join(", ")), town: str(d.addrTown), postcode: str(d.postcode, 10),
    licence_number: str(d.licNumber, 32), licence_expiry: date(d.licExpiry), licence_points: points,
    licence_front_path: file("licence/front"), licence_back_path: file("licence/back"),
    rtw_type: rtw, rtw_share_code: rtw === "code" ? str(d.shareCode, 20) : null, rtw_photo_path: rtw && rtw !== "code" ? file("right-to-work/document") : null,
    ni_number: str(d.ni, 13),
    emergency_name: str(d.ecName), emergency_phone: str(d.ecPhone, 20), emergency_relation: str(d.ecRel, 60),
    photo_path: file("photo"), signature_path: file("signature"), signed_at: now,
    submitted_at: now, status: "to_approve", draft: null,
  }).eq("id", inv.operative_id);
  if (opErr) return fail(opErr.message, 500);

  await db.from("operative_cards").delete().eq("operative_id", inv.operative_id);
  const rows = cards.slice(0, 20).map((c: Record<string, unknown>) => ({
    tenant_id: inv.tenant_id, operative_id: inv.operative_id,
    name: str(c.name, 80) || "Card", number: str(c.number, 40), expires_on: date(c.expiresOn),
    front_path: ownPath(inv, c.front), back_path: ownPath(inv, c.back),
  }));
  if (rows.length) {
    const { error } = await db.from("operative_cards").insert(rows);
    if (error) return fail(error.message, 500);
  }

  if (str(d.account) || str(d.sortCode)) {
    const { error } = await db.from("operative_bank").upsert({
      operative_id: inv.operative_id, tenant_id: inv.tenant_id,
      account_name: str(d.accountName), sort_code: str(d.sortCode, 8), account: str(d.account, 8),
    });
    if (error) return fail(error.message, 500);
  }

  await db.from("operative_invites").update({ used_at: now }).eq("id", inv.id);
  return json({ ok: true, sentAt: now });
});
