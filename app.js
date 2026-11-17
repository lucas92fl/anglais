(function () {
"use strict";

/* ---------- helpers ---------- */
const $app = document.getElementById("app");
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const dayKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const today = () => dayKey(new Date());
const clone = (o) => JSON.parse(JSON.stringify(o));
const pctOf = (x) => Math.round(x * 100);
const norm = (s) => String(s || "").toLowerCase().replace(/[‘’ʼ`]/g, "'").replace(/[.,!?;:"«»“”()]/g, "").replace(/\s+/g, " ").trim();
function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
function ssDel(k) { try { window.sessionStorage.removeItem(k); } catch (e) {} }
function parse(raw) { try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function withTimeout(p, ms) { return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]); }
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ---------- content index ---------- */
const THEMES = window.THEMES;
const ITEMS = {};
const BY_THEME = {};
THEMES.forEach((t) => {
  BY_THEME[t.id] = { v: [], g: [] };
  t.vocab.forEach((v, i) => { const id = t.id + "-v-" + i; ITEMS[id] = { id, theme: t, kind: "v", data: v }; BY_THEME[t.id].v.push(id); });
  t.grammar.forEach((g, i) => { const id = t.id + "-g-" + i; ITEMS[id] = { id, theme: t, kind: "g", data: g }; BY_THEME[t.id].g.push(id); });
});
const ALL_IDS = Object.keys(ITEMS);
const ALL_V = ALL_IDS.filter((id) => ITEMS[id].kind === "v");
const ALL_G = ALL_IDS.filter((id) => ITEMS[id].kind === "g");
const MAX = 3; // correct answers needed to master an item

/* ---------- state ---------- */
const S = {
  mode: "local",           // "cloud" = Supabase accounts, "local" = demo on this device
  uid: "local",
  account: null,           // {email}
  prog: null,              // {m:{id:[lvl,seen,ok]}, stats:{a,c}, days:[], hist:[], cur:null, ts}
  view: "loading",
  viewArg: null,
  tmpPwd: null,            // demo mode: freshly generated password (memory only)
  pendingEmail: "",
  codeSentAt: 0,
  busy: false,
  authErr: "",
  saveState: "ok",
  modal: null,
  gq: { kind: "all", n: 20 }
};
const emptyProg = () => ({ m: {}, stats: { a: 0, c: 0 }, days: [], hist: [], cur: null, ts: 0 });

/* ---------- backend: Supabase (cloud) or this device (demo) ---------- */
const CFG = window.APP_CONFIG || {};
const remembering = () => lsGet("eff_remember") === "1";
function setRememberFlag(on) { if (on) lsSet("eff_remember", "1"); else lsDel("eff_remember"); }
// Sessions go to localStorage when "remember me" is ticked, otherwise to sessionStorage (cleared when the app is closed).
const authStorage = {
  getItem: (k) => (remembering() ? lsGet(k) : ssGet(k)),
  setItem: (k, v) => { if (remembering()) lsSet(k, v); else ssSet(k, v); },
  removeItem: (k) => { lsDel(k); ssDel(k); }
};
let sb = null;
if (CFG.supabaseUrl && CFG.supabaseKey && window.supabase && window.supabase.createClient) {
  try {
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, { auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
    S.mode = "cloud";
  } catch (e) { sb = null; }
}
// Configured but the Supabase library could not load (first visit while offline): don't fall back to demo mode.
const LIB_MISSING = !!(CFG.supabaseUrl && CFG.supabaseKey) && S.mode !== "cloud";
const cacheKey = () => "eff_cache_" + S.uid;

async function loadProgress() {
  if (S.mode === "cloud") {
    const cache = parse(lsGet(cacheKey()));
    let remote = null, reached = false;
    try {
      const { data, error } = await withTimeout(sb.from("progress").select("data").eq("user_id", S.uid).maybeSingle(), 12000);
      if (error) throw error;
      remote = data ? data.data : null; reached = true;
    } catch (e) { if (!cache) throw e; }
    let chosen = remote;
    if (cache && (!remote || (cache.ts || 0) > (remote.ts || 0))) chosen = cache;
    S.prog = Object.assign(emptyProg(), chosen || {});
    if (chosen === cache && cache && reached) saveProg(); // push progress made offline
    if (!reached) setSave("offline");
  } else {
    S.prog = Object.assign(emptyProg(), parse(lsGet("eff_progress")) || {});
  }
}
async function writeProgress() {
  S.prog.ts = Date.now();
  if (S.mode === "cloud") {
    lsSet(cacheKey(), JSON.stringify(S.prog));
    const { error } = await withTimeout(sb.from("progress").upsert({ user_id: S.uid, data: S.prog, updated_at: new Date().toISOString() }), 12000);
    if (error) throw error;
  } else if (!lsSet("eff_progress", JSON.stringify(S.prog))) throw new Error("no storage");
}
let saving = false, saveAgain = false;
async function saveProg() {
  if (!S.prog) return;
  if (saving) { saveAgain = true; return; }
  saving = true; setSave("busy");
  try { await writeProgress(); setSave("ok"); }
  catch (e) { setSave(S.mode === "cloud" ? "offline" : "err"); }
  saving = false;
  if (saveAgain) { saveAgain = false; saveProg(); }
}
window.addEventListener("online", () => { if (S.saveState === "offline") saveProg(); });
function setSave(st) {
  S.saveState = st;
  const el = document.getElementById("save");
  if (el) { el.className = "save " + st; el.textContent = saveLabel(); }
}
function saveLabel() {
  if (S.saveState === "busy") return "Sauvegarde…";
  if (S.saveState === "offline") return "Hors ligne : gardé sur l'appareil, synchronisé au retour";
  if (S.saveState === "err") return "Sauvegarde impossible sur cet appareil";
  return S.mode === "cloud" ? "Progression synchronisée" : "Mode démo : sauvegardé sur cet appareil";
}

/* ---------- cloud auth (Supabase): the emailed code becomes your password ---------- */
function authMessage(err) {
  const m = String((err && (err.message || err.error_description)) || err || "").toLowerCase();
  if (m.indexOf("not authorized") >= 0) return "L'envoi d'e-mails n'est pas encore configuré pour cette adresse (voir le guide, étape « Gmail »).";
  if (m.indexOf("rate limit") >= 0 || m.indexOf("security purposes") >= 0 || m.indexOf("too many") >= 0) return "Trop de demandes d'un coup. Attends une minute puis réessaie.";
  if (m.indexOf("expired") >= 0 || m.indexOf("invalid") >= 0 && m.indexOf("token") >= 0) return "Ce mot de passe est incorrect ou a expiré. Vérifie l'e-mail le plus récent, ou demande-en un nouveau.";
  if (m.indexOf("invalid login") >= 0 || m.indexOf("credentials") >= 0) return "E-mail ou mot de passe incorrect. Utilise le dernier mot de passe reçu, ou demande-en un nouveau.";
  if (m.indexOf("timeout") >= 0 || m.indexOf("fetch") >= 0 || m.indexOf("network") >= 0) return "Connexion impossible. Vérifie ton accès à internet.";
  return "Une erreur est survenue : " + ((err && err.message) || "réessaie dans un instant.");
}
async function sendCode(email) {
  const { error } = await withTimeout(sb.auth.signInWithOtp({ email: email, options: { shouldCreateUser: true } }), 15000);
  if (error) throw error;
  lsSet("eff_last_email", email);
  S.pendingEmail = email; S.codeSentAt = Date.now();
}
async function verifyCode(email, code, remember) {
  setRememberFlag(remember);
  const { data, error } = await withTimeout(sb.auth.verifyOtp({ email: email, token: code, type: "email" }), 15000);
  if (error) throw error;
  // Keep the emailed code as this account's password, so it can be typed again next time.
  try { await sb.auth.updateUser({ password: code }); } catch (e) {}
  await afterLogin((data && data.user) || (data && data.session && data.session.user));
}
async function passwordLogin(email, pwd, remember) {
  setRememberFlag(remember);
  const { data, error } = await withTimeout(sb.auth.signInWithPassword({ email: email, password: pwd }), 15000);
  if (error) throw error;
  lsSet("eff_last_email", email);
  await afterLogin(data.user);
}
async function afterLogin(user) {
  S.uid = user.id; S.account = { email: user.email };
  await loadProgress();
  go("dash");
}

/* ---------- demo auth (no Supabase configured): password shown on screen ---------- */
const PW_WORDS = ["orbit", "rover", "signal", "circuit", "rocket", "sensor", "vector", "fusion", "quantum", "matrix", "turbine", "photon", "laser", "piston", "voltage", "radar"];
function rand(n) { try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; } catch (e) { return Math.floor(Math.random() * n); } }
function genPwd() { return PW_WORDS[rand(PW_WORDS.length)] + "-" + String(1000 + rand(9000)); }
async function hash(str) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return "f" + (h >>> 0).toString(16); }
}
async function demoCreate(email) {
  const pwd = genPwd(); const salt = genPwd() + Date.now();
  S.account = { email: email, salt: salt, hash: await hash(salt + "|" + pwd) };
  lsSet("eff_account", JSON.stringify(S.account));
  S.tmpPwd = pwd; lsDel("eff_demo_remember");
}
const demoRemembered = () => !!(S.account && lsGet("eff_demo_remember") === S.account.hash);
function demoRemember(on) { if (on && S.account) lsSet("eff_demo_remember", S.account.hash); else lsDel("eff_demo_remember"); }

/* ---------- mastery ---------- */
function lvl(id) { const m = S.prog.m[id]; return m ? m[0] : 0; }
function seen(id) { const m = S.prog.m[id]; return m ? m[1] : 0; }
function mastery(ids) { if (!ids.length) return 0; let s = 0; ids.forEach((id) => { s += Math.min(MAX, lvl(id)); }); return s / (MAX * ids.length); }
function masteredCount(ids) { return ids.filter((id) => lvl(id) >= MAX).length; }
function weakIds() { return ALL_IDS.filter((id) => seen(id) > 0 && lvl(id) < 2); }
function streak() {
  const set = new Set(S.prog.days); const d = new Date(); let n = 0;
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- question generation ---------- */
function distractors(item, n) {
  const v = item.data;
  const same = ALL_V.filter((id) => id !== item.id && ITEMS[id].data.p === v.p);
  const other = ALL_V.filter((id) => id !== item.id && ITEMS[id].data.p !== v.p);
  const pool = shuffle(same.filter((id) => ITEMS[id].theme.id === item.theme.id)).concat(shuffle(same.filter((id) => ITEMS[id].theme.id !== item.theme.id)), shuffle(other));
  const out = []; const seenW = new Set([norm(v.w)]); const seenF = new Set([norm(v.f)]);
  for (const id of pool) {
    const d = ITEMS[id].data;
    if (seenW.has(norm(d.w)) || seenF.has(norm(d.f))) continue;
    seenW.add(norm(d.w)); seenF.add(norm(d.f)); out.push(d);
    if (out.length >= n) break;
  }
  return out;
}
function vocabAccepted(v) {
  const base = v.w.replace(/\(.*?\)/g, "").replace(/sthg\.?/g, "").trim();
  return Array.from(new Set([norm(base), norm(base.replace(/^to /, "")), norm(v.f)]));
}
function genQuestion(id) {
  const it = ITEMS[id];
  if (it.kind === "v") {
    const v = it.data; const L = lvl(id);
    const fmt = (L >= 2 && Math.random() < 0.4) ? "type" : pick(["def2word", "word2def", "gap"]);
    const ds = distractors(it, 3);
    const exSentence = v.s.replace("___", v.f);
    if (fmt === "def2word") return { k: "mcq", label: "Quel mot correspond à cette définition ?", prompt: v.d, opts: shuffle([v.w].concat(ds.map((d) => d.w))), ans: v.w, x: "Exemple : " + exSentence };
    if (fmt === "word2def") return { k: "mcq", label: "Que signifie ce mot ?", prompt: v.w, word: true, opts: shuffle([v.d].concat(ds.map((d) => d.d))), ans: v.d, x: "Exemple : " + exSentence };
    if (fmt === "gap") return { k: "mcq", label: "Complète la phrase", prompt: v.s, gap: true, opts: shuffle([v.f].concat(ds.map((d) => d.f))), ans: v.f, x: v.w + " : " + v.d };
    const shown = v.w.replace(/\(.*?\)/g, "").trim().replace(/^to /, "");
    return { k: "in", label: "Écris le mot en anglais", prompt: v.d, hint: "Commence par « " + shown[0] + " » · " + shown.length + " caractères" + (/^to /.test(v.w) ? " · verbe" : ""), acc: vocabAccepted(v), ans: v.w, x: "Exemple : " + exSentence };
  }
  const g = it.data;
  if (g.t === "in") return { k: "in", label: "Écris ta réponse en anglais", prompt: g.q, acc: g.a.map(norm), ans: g.a[0], x: g.x, passive: /passive/i.test(g.q) };
  return { k: "mcq", label: "Choisis la bonne réponse", prompt: g.q, gap: g.q.indexOf("___") >= 0, opts: shuffle(g.o), ans: g.o[0], x: g.x };
}
function checkTyped(q, given) {
  let n = norm(given);
  if (q.acc.indexOf(n) >= 0) return true;
  if (q.passive) { n = n.replace(/ by (the )?researchers$/, ""); if (q.acc.indexOf(n) >= 0) return true; }
  return false;
}
function selectIds(pool, n) {
  return shuffle(pool.map((id) => ({ id, k: Math.min(MAX, lvl(id)) + Math.random() * 1.6 })).sort((a, b) => a.k - b.k).slice(0, n).map((o) => o.id));
}

/* ---------- quiz flow ---------- */
function startQuiz(spec) {
  let pool = [], title = "", n = 10;
  if (spec.type === "theme") {
    const t = THEMES.find((x) => x.id === spec.theme);
    pool = spec.kind === "v" ? BY_THEME[t.id].v : spec.kind === "g" ? BY_THEME[t.id].g : BY_THEME[t.id].v.concat(BY_THEME[t.id].g);
    title = "Leçon " + t.n + " · " + (spec.kind === "v" ? t.vocabLabel : spec.kind === "g" ? t.gram : "Tout");
    n = Math.min(pool.length, 10);
  } else if (spec.type === "global") {
    pool = spec.kind === "v" ? ALL_V : spec.kind === "g" ? ALL_G : ALL_IDS;
    title = "Quiz global · " + (spec.kind === "v" ? "vocabulaire" : spec.kind === "g" ? "grammaire" : "grammaire + vocabulaire");
    n = Math.min(pool.length, spec.n || 20);
    if (spec.kind === "all") {
      const half = Math.round(n / 2);
      return beginQuiz(title, spec, shuffle(selectIds(ALL_V, half).concat(selectIds(ALL_G, n - half))));
    }
  } else if (spec.type === "weak") {
    pool = weakIds(); title = "Révision de mes points faibles"; n = Math.min(pool.length, 15);
  } else if (spec.type === "list") {
    pool = spec.ids; title = "Revoir mes erreurs"; n = pool.length;
  }
  if (!pool.length) { toast("Rien à réviser ici pour l'instant."); return; }
  beginQuiz(title, spec, selectIds(pool, n));
}
function beginQuiz(title, spec, ids) {
  S.prog.cur = { title: title, spec: { type: spec.type, kind: spec.kind || null, theme: spec.theme || null }, qs: ids.map((id) => ({ id: id, q: genQuestion(id) })), i: 0, ans: [], started: Date.now() };
  saveProg();
  go("quiz");
}
function answer(given) {
  const cur = S.prog.cur; if (!cur || cur.ans.length > cur.i) return;
  const item = cur.qs[cur.i]; const q = item.q;
  if (!ITEMS[item.id]) { nextQ(true); return; }
  const ok = q.k === "mcq" ? given === q.ans : checkTyped(q, given);
  cur.ans.push({ g: given, ok: ok });
  const m = S.prog.m[item.id] || [0, 0, 0];
  m[1] += 1; if (ok) { m[0] = Math.min(MAX, m[0] + 1); m[2] += 1; } else { m[0] = Math.max(0, m[0] - 1); }
  S.prog.m[item.id] = m;
  S.prog.stats.a += 1; if (ok) S.prog.stats.c += 1;
  const d = today(); if (S.prog.days.indexOf(d) < 0) { S.prog.days.push(d); if (S.prog.days.length > 120) S.prog.days = S.prog.days.slice(-120); }
  saveProg();
  render();
}
function nextQ(force) {
  const cur = S.prog.cur; if (!cur || (!force && cur.ans.length <= cur.i)) return;
  if (cur.i + 1 >= cur.qs.length) { finishQuiz(); return; }
  cur.i += 1; saveProg(); render();
}
function finishQuiz() {
  const cur = S.prog.cur;
  const score = cur.ans.filter((a) => a.ok).length;
  const res = { t: cur.title, s: score, n: cur.qs.length, d: new Date().toISOString(), spec: cur.spec,
    miss: cur.qs.map((x, i) => ({ id: x.id, q: x.q.prompt, a: x.q.ans, g: cur.ans[i] ? cur.ans[i].g : "", ok: cur.ans[i] && cur.ans[i].ok })).filter((x) => !x.ok && ITEMS[x.id]) };
  S.prog.hist.unshift({ t: res.t, s: res.s, n: res.n, d: res.d });
  S.prog.hist = S.prog.hist.slice(0, 25);
  S.prog.cur = null;
  saveProg();
  go("result", res);
}

/* ---------- navigation ---------- */
function go(view, arg) { S.view = view; S.viewArg = arg === undefined ? null : arg; S.authErr = ""; S.busy = false; render(); window.scrollTo(0, 0); }
let toastTimer = null;
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.remove(); }, 2800);
}

/* ---------- views: app ---------- */
function topBar() {
  return `<div class="top">
    <div class="brand"><div class="logo">EN</div><span>English for Engineers</span></div>
    <div class="who">
      <span id="save" class="save ${S.saveState}">${esc(saveLabel())}</span>
      <span class="chip">${esc(S.account ? S.account.email : "")}</span>
      <button class="btn ghost sm" data-a="logout">Se déconnecter</button>
    </div></div>`;
}
function ring(p) {
  const r = 64, c = 2 * Math.PI * r;
  return `<div class="ring" aria-label="Progression globale ${pctOf(p)} %"><svg width="148" height="148" viewBox="0 0 148 148">
    <circle cx="74" cy="74" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/>
    <circle cx="74" cy="74" r="${r}" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/>
    </svg><div class="num"><div><b>${pctOf(p)}<small style="font-size:18px">%</small></b><span>appris</span></div></div></div>`;
}
function bar(label, p, cls) {
  return `<div class="bar-row"><span>${label}</span><div class="bar ${cls || ""}"><i style="width:${pctOf(p)}%"></i></div><span class="mono">${pctOf(p)}%</span></div>`;
}
function dots(n) { let h = '<span class="dots" title="Maîtrise ' + n + "/" + MAX + '">'; for (let i = 0; i < MAX; i++) h += `<i class="${i < n ? "on" : ""}"></i>`; return h + "</span>"; }
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
function pill(s, n) { const p = n ? s / n : 0; return `<span class="score-pill ${p >= 0.8 ? "hi" : p >= 0.5 ? "mid" : "lo"}">${s}/${n}</span>`; }

function vDash() {
  const P = S.prog; const all = mastery(ALL_IDS);
  const acc = P.stats.a ? Math.round((P.stats.c / P.stats.a) * 100) + "%" : "–";
  const weak = weakIds().length;
  const cur = P.cur;
  const first = P.stats.a === 0;
  let h = topBar();
  h += `<section class="card hero">${ring(all)}<div>
    <h1>${first ? "Bienvenue ! On commence ?" : all >= 0.8 ? "Excellent travail, continue comme ça" : "Ta progression d'apprentissage"}</h1>
    <p class="muted" style="margin:0">${first ? "Choisis une leçon ci-dessous ou lance le quiz global. Chaque mot et chaque point de grammaire est maîtrisé après 3 bonnes réponses." : "Un mot ou un point de grammaire est maîtrisé après 3 bonnes réponses. Une erreur te fait reculer d'un cran."}</p>
    <div class="stats">
      <div class="stat"><b>${masteredCount(ALL_V)}<span class="muted" style="font-size:14px">/${ALL_V.length}</span></b><span>mots maîtrisés</span></div>
      <div class="stat"><b>${masteredCount(ALL_G)}<span class="muted" style="font-size:14px">/${ALL_G.length}</span></b><span>points de grammaire</span></div>
      <div class="stat"><b>${acc}</b><span>bonnes réponses (${P.stats.a})</span></div>
      <div class="stat"><b>${streak()} j</b><span>jours d'affilée</span></div>
    </div>
    <div class="bars" style="margin-top:14px">${bar("Vocabulaire", mastery(ALL_V))}${bar("Grammaire", mastery(ALL_G), "g")}</div>
  </div></section>`;
  if (cur) {
    h += `<section class="card resume"><div><div class="lnum" style="color:var(--hi)">Quiz en cours</div><h3>${esc(cur.title)}</h3><div class="muted small">Question ${cur.i + 1} sur ${cur.qs.length} · tu reprends là où tu t'étais arrêté</div></div>
      <div class="row"><button class="btn ghost sm" data-a="dropquiz">Abandonner</button><button class="btn primary" data-a="resume">Reprendre le quiz</button></div></section>`;
  }
  const seg = (key, val, label) => `<button aria-pressed="${S.gq[key] === val}" data-a="gq" data-k="${key}" data-v="${val}">${label}</button>`;
  h += `<div class="grid2">
    <section class="card panel"><div class="lnum">Toutes les leçons</div><h2>Quiz global</h2>
      <p class="muted small" style="margin:4px 0 0">Mélange toutes les leçons, en commençant par ce que tu maîtrises le moins.</p>
      <div class="opts">
        <div><div class="lbl">Contenu</div><div class="seg" role="group" aria-label="Contenu">${seg("kind", "all", "Grammaire + vocabulaire")}${seg("kind", "v", "Vocabulaire")}${seg("kind", "g", "Grammaire")}</div></div>
        <div><div class="lbl">Questions</div><div class="seg" role="group" aria-label="Nombre de questions">${seg("n", 10, "10")}${seg("n", 20, "20")}${seg("n", 30, "30")}</div></div>
      </div>
      <button class="btn primary big" data-a="global">Lancer le quiz global</button>
    </section>
    <section class="card panel"><div class="lnum" style="color:var(--hi)">Révision ciblée</div><h2>Mes points faibles</h2>
      <p class="muted small" style="margin:4px 0 16px">${weak ? `${weak} élément${weak > 1 ? "s" : ""} que tu as déjà rencontré${weak > 1 ? "s" : ""} mais pas encore bien fixé${weak > 1 ? "s" : ""}.` : "Aucun pour l'instant. Les mots et règles que tu rates apparaîtront ici."}</p>
      <button class="btn big" data-a="weak" ${weak ? "" : "disabled"}>Réviser mes erreurs${weak ? " (" + Math.min(weak, 15) + ")" : ""}</button>
    </section></div>`;
  h += `<div class="sec-title"><h2>Quiz par leçon</h2><span class="muted small">Vocabulaire et structures de chaque cours</span></div><div class="lessons">`;
  THEMES.slice().reverse().forEach((t) => {
    const b = BY_THEME[t.id]; const pv = mastery(b.v), pg = mastery(b.g), pa = mastery(b.v.concat(b.g));
    const fresh = !b.v.concat(b.g).some((id) => seen(id) > 0);
    h += `<article class="card lesson"><div class="lesson-top"><div><div class="lnum">Leçon ${t.n}${fresh && !first ? ' <span class="new">Nouveau</span>' : ""}</div><h3>${esc(t.title)}</h3><div class="sub">${esc(t.sub)}</div></div><div class="pct">${pctOf(pa)}<small>%</small></div></div>
      <div><span class="tag">${esc(t.gram)}</span></div>
      <div class="bars">${bar(t.vocabLabel === "Key terms" ? "Mots clés" : "Vocabulaire", pv)}${bar("Grammaire", pg, "g")}</div>
      <div class="row"><button class="btn sm primary" data-a="tq" data-t="${t.id}" data-k="v">Quiz vocabulaire</button><button class="btn sm primary" data-a="tq" data-t="${t.id}" data-k="g">Quiz grammaire</button><button class="btn sm" data-a="sheet" data-t="${t.id}">Fiche de cours</button></div>
    </article>`;
  });
  h += `</div>`;
  h += `<div class="sec-title"><h2>Derniers quiz</h2></div><section class="card hist">`;
  if (!P.hist.length) h += `<div class="hist-row"><span class="muted">Tes résultats apparaîtront ici après ton premier quiz.</span></div>`;
  P.hist.slice(0, 8).forEach((r) => { h += `<div class="hist-row"><span>${esc(r.t)}</span><span class="muted mono small">${esc(fmtDate(r.d))}</span>${pill(r.s, r.n)}</div>`; });
  h += `</section>`;
  h += `<div class="foot"><span>${S.mode === "cloud" ? "Ta progression est enregistrée dans ton compte après chaque réponse : tu la retrouves sur tous tes appareils." : "Mode démo : la progression reste dans ce navigateur. Ajoute ta configuration Supabase pour activer les comptes."}</span><button class="link" data-a="reset">Réinitialiser ma progression</button></div>`;
  return `<div class="wrap">${h}</div>`;
}

function vQuiz() {
  const cur = S.prog.cur; if (!cur) return vDash();
  const item = cur.qs[cur.i]; const q = item.q; const it = ITEMS[item.id];
  if (!it) return vDash();
  const done = cur.ans.length > cur.i; const a = done ? cur.ans[cur.i] : null;
  const prompt = q.gap ? esc(q.prompt).replace("___", '<span class="blank"></span>') : esc(q.prompt);
  let h = `<div class="wrap"><div class="quiz">
    <div class="qhead"><button class="btn ghost sm" data-a="leave">← Quitter (ta progression est gardée)</button><span class="mono small muted">${cur.i + 1} / ${cur.qs.length}</span></div>
    <div class="qprog"><i style="width:${((cur.i + (done ? 1 : 0)) / cur.qs.length) * 100}%"></i></div>
    <section class="card qcard">
      <div class="qmeta"><span class="tag">Leçon ${it.theme.n} · ${it.kind === "v" ? "Vocabulaire" : esc(it.theme.gram)}</span><span class="small muted">Maîtrise ${dots(Math.min(MAX, lvl(item.id)))}</span></div>
      <div class="qlabel">${esc(q.label)}</div>
      <div class="qprompt ${q.word ? "word" : ""}">${prompt}</div>`;
  if (q.k === "mcq") {
    h += `<div class="choices">`;
    q.opts.forEach((o, i) => {
      let cls = "";
      if (done) { if (o === q.ans) cls = "right"; else if (o === a.g) cls = "wrong"; else cls = "dim"; }
      h += `<button class="choice ${cls}" data-a="pick" data-i="${i}" ${done ? "disabled" : ""}><span class="k">${i + 1}</span><span>${esc(o)}</span></button>`;
    });
    h += `</div>`;
  } else {
    if (q.hint) h += `<div class="hint">${esc(q.hint)}</div>`;
    h += `<form data-f="typed" class="row" autocomplete="off"><input id="typed" class="input" style="flex:1;min-width:200px" placeholder="Ta réponse en anglais" value="${done ? esc(a.g) : ""}" ${done ? "disabled" : ""} autocapitalize="off" autocorrect="off" spellcheck="false"><button class="btn primary" ${done ? "disabled" : ""}>Vérifier</button></form>`;
  }
  if (done) {
    h += `<div class="fb ${a.ok ? "ok" : "no"}" role="status"><b class="t">${a.ok ? "Bonne réponse !" : "Pas tout à fait."}</b>${a.ok ? "" : `Réponse attendue : <b>${esc(q.ans)}</b><br>`}${esc(q.x)}</div>`;
  }
  h += `<div class="qfoot"><span class="kbd">${q.k === "mcq" ? "Touches 1–" + q.opts.length + " pour répondre · " : ""}Entrée pour continuer</span>
      ${done ? `<button class="btn primary" data-a="next" id="nextbtn">${cur.i + 1 >= cur.qs.length ? "Voir mon résultat" : "Question suivante →"}</button>` : ""}</div>
    </section></div></div>`;
  return h;
}

function vResult() {
  const r = S.viewArg; if (!r) return vDash();
  const p = r.n ? r.s / r.n : 0;
  const msg = p === 1 ? "Parfait, tout est juste !" : p >= 0.8 ? "Très bien joué." : p >= 0.5 ? "Pas mal, encore un petit effort." : "Continue, la répétition fait tout.";
  let h = topBar() + `<div class="quiz"><section class="card result">
    <div class="lnum">${esc(r.t)}</div>
    <div class="big">${r.s}<span class="muted" style="font-size:32px">/${r.n}</span></div>
    <p style="margin:0 0 6px;font-size:18px">${msg}</p>
    <p class="muted small" style="margin:0 0 20px">Progression globale : <b class="mono">${pctOf(mastery(ALL_IDS))} %</b></p>
    <div class="row" style="justify-content:center">
      ${r.miss.length ? `<button class="btn primary" data-a="redo">Revoir mes ${r.miss.length} erreur${r.miss.length > 1 ? "s" : ""}</button>` : ""}
      <button class="btn" data-a="again">Refaire un quiz du même type</button>
      <button class="btn" data-a="home">Tableau de bord</button>
    </div>`;
  if (r.miss.length) {
    h += `<div class="mist">`;
    r.miss.forEach((m) => { h += `<div><div class="q">${esc(m.q)}</div>${m.g ? `<span class="y">${esc(m.g)}</span> → ` : ""}<span class="a">${esc(m.a)}</span></div>`; });
    h += `</div>`;
  }
  h += `</section></div>`;
  return `<div class="wrap">${h}</div>`;
}

function vSheet() {
  const t = THEMES.find((x) => x.id === S.viewArg); if (!t) return vDash();
  const b = BY_THEME[t.id];
  let h = topBar() + `<div class="sheet"><div class="qhead"><button class="btn ghost sm" data-a="home">← Tableau de bord</button>
    <div class="row"><button class="btn sm primary" data-a="tq" data-t="${t.id}" data-k="v">Quiz vocabulaire</button><button class="btn sm primary" data-a="tq" data-t="${t.id}" data-k="g">Quiz grammaire</button></div></div>
    <section class="card sheet-body"><div class="lnum">Leçon ${t.n} · fiche de cours</div><h2 style="font-size:28px;margin:4px 0 4px">${esc(t.title)}</h2><p class="muted" style="margin:0 0 20px">${esc(t.sub)}</p>
    <h3>${esc(t.vocabLabel)}</h3><div class="tbl"><table class="vocab"><thead><tr><th>Mot</th><th>Définition</th><th>Exemple</th><th>Maîtrise</th></tr></thead><tbody>`;
  b.v.forEach((id) => { const v = ITEMS[id].data; h += `<tr><td>${esc(v.w)}</td><td>${esc(v.d)}</td><td class="s">${esc(v.s.replace("___", v.f))}</td><td>${dots(Math.min(MAX, lvl(id)))}</td></tr>`; });
  h += `</tbody></table></div>${t.sheet}</section></div>`;
  return `<div class="wrap">${h}</div>`;
}

/* ---------- views: sign-in ---------- */
function authShell(inner) {
  return `<div class="auth"><section class="card auth-box"><div class="brand"><div class="logo">EN</div><span>English for Engineers</span></div>${inner}</section></div>`;
}
const errBox = () => (S.authErr ? `<div class="err-msg" role="alert">${esc(S.authErr)}</div>` : "");
const busyBtn = (label, busyLabel) => `<button class="btn primary big" style="width:100%;justify-content:center" ${S.busy ? "disabled" : ""}>${S.busy ? busyLabel : label}</button>`;
const rememberBox = (checked) => `<label class="check"><input type="checkbox" id="remember" ${checked ? "checked" : ""}> <span>Ne plus me demander de me connecter sur cet appareil</span></label>`;

function vEmail() {
  const last = lsGet("eff_last_email") || "";
  return authShell(`<h1>Ta session de révision</h1>
    <p>Entre ton adresse e-mail : tu vas recevoir ton mot de passe personnel par e-mail.</p>
    <form data-f="c-email" novalidate>
      <div class="field"><label for="email">Adresse e-mail</label><input id="email" class="input" type="email" autocomplete="email" inputmode="email" placeholder="prenom.nom@exemple.fr" value="${esc(S.pendingEmail || last)}" required></div>
      ${errBox()}${busyBtn("Recevoir mon mot de passe", "Envoi de l'e-mail…")}
    </form>
    <div class="auth-foot"><button class="link" data-a="tologin">J'ai déjà mon mot de passe</button></div>`);
}
function vCode() {
  const e = S.pendingEmail;
  const wait = Math.max(0, 60 - Math.floor((Date.now() - S.codeSentAt) / 1000));
  return authShell(`<h1>Regarde ta boîte mail</h1>
    <div class="mail"><div class="mail-head"><span>À : <b>${esc(e)}</b></span><span>Objet : <b>Ton mot de passe English for Engineers</b></span></div>
      <div class="mail-body"><p>Eh voici ton mot de passe pour ta session :</p><div class="pwd" aria-hidden="true">• • • • • •</div></div></div>
    <p class="small">L'e-mail peut mettre une minute à arriver. Pense à regarder dans les spams.</p>
    <form data-f="c-code">
      <div class="field"><label for="code">Mot de passe reçu</label><input id="code" class="input mono" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456" style="font-size:22px;letter-spacing:.2em;text-align:center"></div>
      ${errBox()}${rememberBox(true)}${busyBtn("Ouvrir ma session", "Vérification…")}
    </form>
    <div class="auth-foot"><button class="link" data-a="resend" ${wait ? "disabled" : ""}>${wait ? "Renvoyer l'e-mail (dans " + wait + " s)" : "Renvoyer l'e-mail"}</button><button class="link" data-a="toemail">Changer d'adresse</button></div>`);
}
function vLogin() {
  const last = lsGet("eff_last_email") || "";
  return authShell(`<h1>Bon retour !</h1>
    <p>Entre ton e-mail et le dernier mot de passe que tu as reçu.</p>
    <form data-f="c-login">
      <div class="field"><label for="email">Adresse e-mail</label><input id="email" class="input" type="email" autocomplete="username" value="${esc(last)}"></div>
      <div class="field"><label for="pw">Mot de passe</label><input id="pw" class="input mono" type="password" autocomplete="current-password" placeholder="123456"></div>
      ${errBox()}${rememberBox(false)}${busyBtn("Ouvrir ma session", "Connexion…")}
    </form>
    <div class="auth-foot"><button class="link" data-a="forgot">Mot de passe oublié ? En recevoir un nouveau</button><button class="link" data-a="toemail">Nouvelle adresse</button></div>`);
}
// demo views (no Supabase config)
function vDemoSignup() {
  return authShell(`<h1>Ta session de révision</h1>
    <p>Mode démo : entre ton e-mail, ton mot de passe s'affichera à l'écran.</p>
    <form data-f="d-signup" novalidate>
      <div class="field"><label for="email">Adresse e-mail</label><input id="email" class="input" type="email" autocomplete="email" value="${esc(S.account ? S.account.email : "")}"></div>
      ${errBox()}${busyBtn("Recevoir mon mot de passe", "…")}
    </form>${S.account ? `<div class="auth-foot"><button class="link" data-a="tologin">← J'ai déjà un mot de passe</button></div>` : ""}`);
}
function vDemoPass() {
  return authShell(`<h1>Ton mot de passe est prêt</h1>
    <div class="mail"><div class="mail-head"><span>À : <b>${esc(S.account.email)}</b></span><span>Objet : <b>Ton mot de passe English for Engineers</b></span></div>
      <div class="mail-body"><p>Eh voici ton mot de passe pour ta session :</p><div class="pwd" id="pwd">${esc(S.tmpPwd)}</div></div></div>
    <div class="row" style="margin-bottom:16px"><button class="btn sm" data-a="copy">Copier le mot de passe</button></div>
    ${rememberBox(true)}<button class="btn primary big" style="width:100%;justify-content:center" data-a="enter">Accéder à ma session</button>`);
}
function vDemoLogin() {
  return authShell(`<h1>Bon retour !</h1>
    <p>Session de <b style="color:var(--ink)">${esc(S.account.email)}</b>.</p>
    <form data-f="d-login">
      <div class="field"><label for="pw">Mot de passe</label><input id="pw" class="input mono" type="password" autocomplete="current-password" placeholder="ex. rocket-1234"></div>
      ${errBox()}${rememberBox(false)}${busyBtn("Ouvrir ma session", "…")}
    </form>
    <div class="auth-foot"><button class="link" data-a="forgot">Mot de passe oublié ?</button></div>`);
}
function vError() {
  return `<div class="center"><div><h2 style="margin-bottom:8px">Impossible de charger ta progression</h2><p class="muted">Vérifie ta connexion internet, puis réessaie.</p><button class="btn primary" data-a="retry">Réessayer</button></div></div>`;
}
function vModal() {
  if (S.modal !== "reset") return "";
  return `<div class="modal-bg" data-a="closemodal"><div class="card modal" role="dialog" aria-modal="true" aria-labelledby="mt"><h3 id="mt">Réinitialiser ta progression ?</h3><p>Tous tes niveaux de maîtrise, ton historique et le quiz en cours seront effacés.</p><div class="row" style="justify-content:flex-end"><button class="btn" data-a="closemodal">Annuler</button><button class="btn primary" style="background:var(--bad);border-color:var(--bad)" data-a="doreset">Tout effacer</button></div></div></div>`;
}

function render() {
  const cloud = S.mode === "cloud";
  let h = "";
  switch (S.view) {
    case "loading": h = `<div class="center"><div class="spinner"></div><p class="muted">Chargement de ta session…</p></div>`; break;
    case "error": h = vError(); break;
    case "email": h = cloud ? vEmail() : vDemoSignup(); break;
    case "code": h = cloud ? vCode() : vDemoPass(); break;
    case "login": h = cloud ? vLogin() : vDemoLogin(); break;
    case "quiz": h = vQuiz(); break;
    case "result": h = vResult(); break;
    case "sheet": h = vSheet(); break;
    default: h = vDash();
  }
  $app.innerHTML = h + vModal();
  if (S.view === "quiz") {
    const t = document.getElementById("typed"); if (t && !t.disabled) t.focus();
    const nb = document.getElementById("nextbtn"); if (nb) nb.focus();
  }
  if (S.view === "email") { const e = document.getElementById("email"); if (e) e.focus(); }
  if (S.view === "code") { const c = document.getElementById("code"); if (c) c.focus(); }
  if (S.view === "login") { const e = document.getElementById("email"); const p = document.getElementById("pw"); if (e && !e.value) e.focus(); else if (p) p.focus(); }
}
setInterval(() => { if (S.view === "code" && S.mode === "cloud" && Date.now() - S.codeSentAt < 62000) { const b = document.querySelector('[data-a="resend"]'); if (b) { const w = Math.max(0, 60 - Math.floor((Date.now() - S.codeSentAt) / 1000)); b.disabled = !!w; b.textContent = w ? "Renvoyer l'e-mail (dans " + w + " s)" : "Renvoyer l'e-mail"; } } }, 1000);

/* ---------- events ---------- */
async function guarded(fn) {
  S.busy = true; S.authErr = ""; render();
  try { await fn(); }
  catch (e) { S.busy = false; S.authErr = authMessage(e); render(); }
}
$app.addEventListener("click", async (ev) => {
  const el = ev.target.closest("[data-a]"); if (!el || el.disabled) return;
  const a = el.dataset.a;
  if (a === "closemodal" && el !== ev.target && el.classList.contains("modal-bg")) return;
  switch (a) {
    case "pick": { const q = S.prog.cur.qs[S.prog.cur.i].q; answer(q.opts[+el.dataset.i]); break; }
    case "next": nextQ(); break;
    case "leave": go("dash"); toast("Quiz mis en pause. Tu pourras le reprendre depuis le tableau de bord."); break;
    case "resume": go("quiz"); break;
    case "dropquiz": S.prog.cur = null; saveProg(); render(); break;
    case "tq": startQuiz({ type: "theme", theme: el.dataset.t, kind: el.dataset.k }); break;
    case "global": startQuiz({ type: "global", kind: S.gq.kind, n: S.gq.n }); break;
    case "weak": startQuiz({ type: "weak" }); break;
    case "gq": S.gq[el.dataset.k] = el.dataset.k === "n" ? +el.dataset.v : el.dataset.v; render(); break;
    case "sheet": go("sheet", el.dataset.t); break;
    case "home": go("dash"); break;
    case "redo": startQuiz({ type: "list", ids: S.viewArg.miss.map((m) => m.id) }); break;
    case "again": { const sp = S.viewArg.spec || { type: "global", kind: "all" }; if (sp.type === "list") startQuiz({ type: "weak" }); else startQuiz({ type: sp.type, theme: sp.theme, kind: sp.kind, n: S.gq.n }); break; }
    case "reset": S.modal = "reset"; render(); break;
    case "closemodal": S.modal = null; render(); break;
    case "doreset": S.modal = null; S.prog = emptyProg(); await saveProg(); go("dash"); toast("Progression réinitialisée."); break;
    case "logout":
      if (S.mode === "cloud") { try { await sb.auth.signOut(); } catch (e) { authStorage.removeItem("sb"); } setRememberFlag(false); S.prog = null; }
      else demoRemember(false);
      go("login"); break;
    case "tologin": go("login"); break;
    case "toemail": go("email"); break;
    case "resend": await guarded(async () => { await sendCode(S.pendingEmail); S.busy = false; render(); toast("Nouvel e-mail envoyé."); }); break;
    case "forgot":
      if (S.mode === "cloud") {
        const e = (document.getElementById("email") || {}).value || lsGet("eff_last_email") || "";
        if (!validEmail(e.trim())) { S.authErr = "Entre d'abord ton adresse e-mail ci-dessus."; render(); break; }
        await guarded(async () => { await sendCode(e.trim()); go("code"); });
      } else { await demoCreate(S.account.email); go("code"); }
      break;
    case "copy": try { await navigator.clipboard.writeText(S.tmpPwd); toast("Mot de passe copié."); } catch (e) { toast("Copie impossible : sélectionne le mot de passe et copie-le."); } break;
    case "enter": { const r = document.getElementById("remember"); demoRemember(r && r.checked); S.tmpPwd = null; go("dash"); break; }
    case "retry": if (LIB_MISSING) location.reload(); else boot(); break;
  }
});
$app.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const f = ev.target.dataset.f;
  const val = (id) => ((document.getElementById(id) || {}).value || "").trim();
  const rem = () => !!(document.getElementById("remember") || {}).checked;
  if (f === "typed") { const v = val("typed"); if (v) answer(v); return; }
  if (S.busy) return;
  if (f === "c-email") {
    const email = val("email").toLowerCase();
    if (!validEmail(email)) { S.authErr = "Cette adresse e-mail ne semble pas valide."; render(); return; }
    await guarded(async () => { await sendCode(email); go("code"); });
  }
  if (f === "c-code") {
    const code = val("code").replace(/\s/g, "");
    if (!code) return;
    const r = rem();
    await guarded(async () => { await verifyCode(S.pendingEmail, code, r); });
  }
  if (f === "c-login") {
    const email = val("email").toLowerCase(); const pw = val("pw"); const r = rem();
    if (!validEmail(email) || !pw) { S.authErr = "Entre ton e-mail et ton mot de passe."; render(); return; }
    await guarded(async () => { await passwordLogin(email, pw, r); });
  }
  if (f === "d-signup") {
    const email = val("email");
    if (!validEmail(email)) { S.authErr = "Cette adresse e-mail ne semble pas valide."; render(); return; }
    await demoCreate(email); go("code");
  }
  if (f === "d-login") {
    const pw = val("pw"); if (!pw) return; const r = rem();
    const ok = (await hash(S.account.salt + "|" + pw.toLowerCase())) === S.account.hash;
    if (ok) { demoRemember(r); go("dash"); } else { S.authErr = "Mot de passe incorrect."; render(); }
  }
});
document.addEventListener("keydown", (ev) => {
  if (S.modal && ev.key === "Escape") { S.modal = null; render(); return; }
  if (S.view !== "quiz" || !S.prog || !S.prog.cur) return;
  const cur = S.prog.cur; const q = cur.qs[cur.i].q; const done = cur.ans.length > cur.i;
  if (ev.target && ev.target.tagName === "INPUT" && !done) return;
  if (!done && q.k === "mcq" && /^[1-9]$/.test(ev.key)) { const i = +ev.key - 1; if (i < q.opts.length) { ev.preventDefault(); answer(q.opts[i]); } }
  else if (done && ev.key === "Enter") { ev.preventDefault(); nextQ(); }
});

/* ---------- boot ---------- */
async function boot() {
  S.view = "loading"; render();
  if (LIB_MISSING) { S.view = "error"; render(); return; }
  if (S.mode === "cloud") {
    try {
      const { data } = await withTimeout(sb.auth.getSession(), 12000);
      if (data && data.session) { await afterLogin(data.session.user); return; }
    } catch (e) { S.view = "error"; render(); return; }
    go(lsGet("eff_last_email") ? "login" : "email");
    return;
  }
  S.account = parse(lsGet("eff_account"));
  await loadProgress();
  if (!S.account) go("email");
  else if (demoRemembered()) go("dash");
  else go("login");
}
boot();

/* ---------- installable app: offline cache & updates ---------- */
if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
})();
