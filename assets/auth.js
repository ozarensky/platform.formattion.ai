// One-time-code log-in through Supabase Auth. Needs the supabase-js UMD build and
// assets/config.js loaded first. Exposes window.fpAuth.
(function () {
  var cfg = window.FP_CONFIG || {};
  var configured = !!(window.supabase && cfg.supabaseUrl && cfg.supabaseKey && cfg.supabaseKey.indexOf('PASTE') !== 0);
  var client = configured
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
      })
    : null;

  var MSG = {
    notSetUp: "Log-in isn't set up yet.",
    offline: "No signal. Try again when you're back online.",
    tooMany: 'Too many codes asked for. Wait a minute, then try again.',
    sendFailed: "The code didn't send. Try again in a minute.",
    badCode: "That code isn't right or has run out. Ask for a new one."
  };

  function isOffline() { return navigator.onLine === false; }
  function isNetwork(err) { return !err.status || /fetch|network/i.test(err.message || ''); }

  // Every address gets the same answer, so nobody can find out who has an account.
  async function sendCode(email) {
    if (!client) return { ok: false, message: MSG.notSetUp };
    if (isOffline()) return { ok: false, message: MSG.offline };
    var res;
    try {
      res = await client.auth.signInWithOtp({ email: email, options: { shouldCreateUser: false } });
    } catch (e) {
      return { ok: false, message: MSG.offline };
    }
    var err = res.error;
    if (!err) return { ok: true };
    if (err.status === 429 || /security purposes|rate limit/i.test(err.message)) return { ok: false, message: MSG.tooMany };
    if (err.code === 'otp_disabled' || err.code === 'signup_disabled' || /signups not allowed/i.test(err.message)) return { ok: true };
    if (isNetwork(err)) return { ok: false, message: MSG.offline };
    return { ok: false, message: MSG.sendFailed };
  }

  async function verifyCode(email, code) {
    if (!client) return { ok: false, message: MSG.notSetUp };
    if (isOffline()) return { ok: false, message: MSG.offline };
    var res;
    try {
      res = await client.auth.verifyOtp({ email: email, token: code, type: 'email' });
    } catch (e) {
      return { ok: false, message: MSG.offline };
    }
    if (!res.error) return { ok: true };
    if (res.error.status === 429) return { ok: false, message: MSG.tooMany };
    if (isNetwork(res.error)) return { ok: false, message: MSG.offline };
    return { ok: false, message: MSG.badCode };
  }

  async function getSession() {
    if (!client) return null;
    var res = await client.auth.getSession();
    return res.data.session;
  }

  // Log-in page: skip straight in if this phone is already signed in.
  async function redirectIfSignedIn(to) {
    if (await getSession()) location.replace(to || 'Platform.dc.html');
  }

  // Platform pages: hide until a session is confirmed, otherwise back to log-in.
  // This only stops casual viewing; real data is protected by row-level security.
  function requireSession(loginPage) {
    if (!client) return;
    var root = document.documentElement;
    root.style.visibility = 'hidden';
    getSession().then(function (s) {
      if (s) root.style.visibility = '';
      else location.replace(loginPage || 'index.html');
    }, function () { location.replace(loginPage || 'index.html'); });
  }

  async function signOut(loginPage) {
    if (client) await client.auth.signOut();
    location.replace(loginPage || 'index.html');
  }

  window.fpAuth = {
    configured: configured,
    client: client,
    sendCode: sendCode,
    verifyCode: verifyCode,
    getSession: getSession,
    redirectIfSignedIn: redirectIfSignedIn,
    requireSession: requireSession,
    signOut: signOut
  };
})();
