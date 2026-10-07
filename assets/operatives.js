// Operatives on the platform: the live rows behind the Waiting list, the approve
// screen and "Send the link". Needs assets/auth.js first. Exposes window.fpOperatives.
// Reads and updates go straight through supabase-js (row-level security limits them
// to the manager's own tenant); creating an invite goes through the create-invite
// Edge Function, which also sends the text.
(function () {
  var cfg = window.FP_CONFIG || {};
  var client = window.fpAuth && window.fpAuth.client;
  var BUCKET = 'operatives';

  var COLS = 'id, status, first_name, surname, mobile, trade, starts_on, created_at, submitted_at, approved_at, ' +
    'date_of_birth, gender, address_line, town, postcode, ni_number, rtw_type, rtw_share_code, rtw_photo_path, ' +
    'licence_number, licence_expiry, licence_points, licence_front_path, licence_back_path, photo_path, signature_path, ' +
    'emergency_name, emergency_phone, emergency_relation, ' +
    'operative_cards(id, name, number, expires_on, front_path, back_path), ' +
    'operative_invites(opened_at, expires_at, used_at)';

  async function list() {
    var res = await client.from('operatives').select(COLS).neq('status', 'left').order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  // Every photo on an operative, in the order the approve screen shows them.
  function photoPaths(row) {
    var out = [];
    if (row.photo_path) out.push({ label: 'Photo', path: row.photo_path });
    if (row.licence_front_path) out.push({ label: 'Licence · front', path: row.licence_front_path });
    if (row.licence_back_path) out.push({ label: 'Licence · back', path: row.licence_back_path });
    if (row.rtw_photo_path) out.push({ label: row.rtw_type === 'brp' ? 'Residence permit' : 'Passport', path: row.rtw_photo_path });
    (row.operative_cards || []).forEach(function (c) {
      if (c.front_path) out.push({ label: c.name + ' · front', path: c.front_path });
      if (c.back_path) out.push({ label: c.name + ' · back', path: c.back_path });
    });
    if (row.signature_path) out.push({ label: 'Signature', path: row.signature_path });
    return out;
  }

  // Signed links, good for an hour, keyed by path.
  async function urls(paths) {
    var map = {};
    if (!paths.length) return map;
    var res = await client.storage.from(BUCKET).createSignedUrls(paths, 3600);
    if (res.error) throw res.error;
    (res.data || []).forEach(function (r) { if (r.signedUrl && r.path) map[r.path] = r.signedUrl; });
    return map;
  }

  async function approve(id) {
    var s = await client.auth.getSession();
    var user = s.data.session && s.data.session.user;
    var res = await client.from('operatives').update({ status: 'active', approved_at: new Date().toISOString(), approved_by: user ? user.id : null }).eq('id', id);
    if (res.error) throw res.error;
  }

  // "Starts on" is typed free-form; send a real date when it parses as dd/mm/yyyy.
  function startsOn(text) {
    var m = (text || '').match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if (!m) return null;
    return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
  }

  async function invite(inv) {
    var s = await client.auth.getSession();
    var token = s.data.session && s.data.session.access_token;
    if (!token) throw new Error('Log in again to send a link.');
    var r;
    try {
      r = await fetch(cfg.supabaseUrl + '/functions/v1/create-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseKey, Authorization: 'Bearer ' + token },
        body: JSON.stringify({ firstName: inv.name, mobile: inv.phone, startsOn: startsOn(inv.start), startText: inv.start })
      });
    } catch (e) { throw new Error("No signal. Try again when you're back online."); }
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.error || ('Something went wrong (' + r.status + ')'));
    return j;
  }

  function fmtPhone(e164) {
    var d = (e164 || '').replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('44') === 0) d = '0' + d.slice(2);
    return d.length === 11 ? d.slice(0, 5) + ' ' + d.slice(5) : (e164 || '');
  }

  window.fpOperatives = {
    ready: !!client,
    list: list,
    photoPaths: photoPaths,
    urls: urls,
    approve: approve,
    invite: invite,
    fmtPhone: fmtPhone
  };
})();
