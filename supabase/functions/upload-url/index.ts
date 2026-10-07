// Form → before each photo upload. Body: { token, kind }
// kind: photo | signature | licence/front | licence/back | right-to-work/document | cards/<id>/front | cards/<id>/back
// Returns a one-off signed upload for exactly that path, so the phone uploads straight to Storage.
import { admin, BUCKET, CORS, fail, filePath, json, loadInvite } from "../_shared/intake.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("POST only", 405);
  const { token, kind } = await req.json().catch(() => ({}));
  const db = admin();
  const found = await loadInvite(db, String(token || ""));
  if (!found.invite) return json({ closed: found.reason });
  const path = filePath(found.invite, String(kind || ""));
  if (!path) return fail("Unknown file kind");

  const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true });
  if (error || !data) return fail(error?.message || "Couldn't prepare the upload", 500);
  return json({ path, uploadToken: data.token, signedUrl: data.signedUrl });
});
