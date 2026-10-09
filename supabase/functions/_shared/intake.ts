// Shared helpers for the operative intake functions. Every function runs with the
// service-role key (so it can write to tables the form itself cannot touch) and
// checks the invite token itself before doing anything.
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

export const BUCKET = "operatives";

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export function fail(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export function admin(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// "07734 373852" → "+447734373852". Anything that is not a UK mobile comes back null.
export function ukMobile(raw: string): string | null {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("0044")) d = d.slice(4);
  if (d.startsWith("44")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (!/^7\d{9}$/.test(d)) return null;
  return "+44" + d;
}

export type Invite = {
  id: string;
  tenant_id: string;
  operative_id: string;
  sent_to: string;
  expires_at: string;
  opened_at: string | null;
  used_at: string | null;
};

// Finds the invite for a token. Returns a reason string when the link is not usable.
export async function loadInvite(db: SupabaseClient, token: string):
  Promise<{ invite: Invite; reason?: undefined } | { invite?: undefined; reason: "missing" | "expired" | "used" }> {
  if (!token || token.length < 20) return { reason: "missing" };
  const { data } = await db.from("operative_invites").select("*").eq("token_hash", await sha256(token)).maybeSingle();
  if (!data) return { reason: "missing" };
  if (data.used_at) return { reason: "used" };
  if (new Date(data.expires_at) < new Date()) return { reason: "expired" };
  return { invite: data as Invite };
}

// Sends a text through Twilio when its secrets are set; otherwise reports it as not sent
// so the platform shows the link to copy or share instead.
export async function sendSms(to: string, body: string): Promise<{ sent: boolean; error?: string }> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID"), auth = Deno.env.get("TWILIO_AUTH_TOKEN"), from = Deno.env.get("TWILIO_FROM");
  if (!sid || !auth || !from) return { sent: false, error: "sms not configured" };
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${sid}:${auth}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (res.ok) return { sent: true };
  const text = await res.text();
  console.error("twilio", res.status, text);
  return { sent: false, error: `twilio ${res.status}` };
}

// Storage paths the form may upload to, under {tenant}/{operative}/.
const KIND = /^(photo|signature|licence\/(front|back)|right-to-work\/document|cards\/c\d{1,16}\/(front|back))$/;

export function filePath(invite: Invite, kind: string): string | null {
  if (!KIND.test(kind)) return null;
  const ext = kind === "signature" ? "png" : "jpg";
  return `${invite.tenant_id}/${invite.operative_id}/${kind}.${ext}`;
}

// Only paths inside this operative's own folder are accepted back from the form.
export function ownPath(invite: Invite, path: unknown): string | null {
  if (typeof path !== "string") return null;
  const prefix = `${invite.tenant_id}/${invite.operative_id}/`;
  if (!path.startsWith(prefix)) return null;
  const kind = path.slice(prefix.length).replace(/\.(jpg|png)$/, "");
  return KIND.test(kind) ? path : null;
}

export async function signedUrls(db: SupabaseClient, paths: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!paths.length) return out;
  const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 3600);
  for (const row of data || []) if (row.signedUrl && row.path) out[row.path] = row.signedUrl;
  return out;
}
