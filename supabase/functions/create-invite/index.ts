// Platform → "Send the link". Needs the manager's log-in (Authorization: Bearer <access token>).
// Creates the operative (status invited) and a 7-day invite link, texts it when SMS is set up.
// Body: { firstName, mobile, startsOn?, startText? }
// Returns: { operativeId, link, expiresAt, sent }
import { admin, CORS, fail, json, randomToken, sendSms, sha256, ukMobile } from "../_shared/intake.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("POST only", 405);

  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!jwt) return fail("Log in first", 401);
  const db = admin();
  const { data: { user }, error: authErr } = await db.auth.getUser(jwt);
  if (authErr || !user) return fail("Log in first", 401);

  const { data: membership } = await db.from("memberships").select("tenant_id, tenants(name)").eq("user_id", user.id).limit(1).maybeSingle();
  if (!membership) return fail("Your log-in isn't attached to a company yet", 403);
  const tenantId = membership.tenant_id as string;
  const company = (membership as { tenants?: { name?: string } }).tenants?.name || "the team";

  const body = await req.json().catch(() => ({}));
  const firstName = String(body.firstName || "").trim();
  const mobile = ukMobile(String(body.mobile || ""));
  if (firstName.length < 2) return fail("First name needed");
  if (!mobile) return fail("That doesn't look like a UK mobile");
  const startsOn = /^\d{4}-\d{2}-\d{2}$/.test(body.startsOn || "") ? body.startsOn : null;
  const startText = String(body.startText || "").trim() || (startsOn ? new Date(startsOn).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "");

  const meta = (user.user_metadata || {}) as Record<string, string>;
  const inviterName = (meta.first_name || meta.full_name || meta.name || (user.email || "").split("@")[0] || "Your manager").split(" ")[0];

  const { data: op, error: opErr } = await db.from("operatives").insert({
    tenant_id: tenantId, status: "invited", first_name: firstName, mobile, starts_on: startsOn,
    invited_by: user.id, invited_by_name: inviterName,
  }).select("id").single();
  if (opErr || !op) return fail("Couldn't save the operative: " + (opErr?.message || ""), 500);

  const token = randomToken();
  const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
  const { error: invErr } = await db.from("operative_invites").insert({
    tenant_id: tenantId, operative_id: op.id, token_hash: await sha256(token), sent_to: mobile, expires_at: expiresAt, created_by: user.id,
  });
  if (invErr) return fail("Couldn't create the link: " + invErr.message, 500);

  const base = (Deno.env.get("INTAKE_BASE_URL") || "https://platform.formattion.ai/join.html").replace(/\/$/, "");
  const link = `${base}?t=${token}`;
  const until = new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const text = `Hi ${firstName}, ${inviterName} at ${company} has added you. Tap the link, photograph your cards and you're set${startText ? " for " + startText : ""}. It works until ${until}: ${link}`;
  const sms = await sendSms(mobile, text);

  return json({ operativeId: op.id, link, expiresAt, sent: sms.sent, smsError: sms.error, text });
});
