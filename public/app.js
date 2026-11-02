const $ = (id) => document.getElementById(id);
const hitButton = $('hit-button');
const dialog = $('admin-dialog');
const form = $('admin-form');
const password = $('admin-password');
const stepInput = $('damage-step');
const submit = $('admin-submit');
let state = null;
let hitting = false;
let reading = false;
let adminBusy = false;
let adminAction = 'settings';
let hitTimer;

const conditions = [
  ['Masih mulus.', 'Belum ada kerusakan.\nUntuk sekarang.', 'Gue mah kuat.', '100% CONFIDENCE'],
  ['Sedikit lecet.', 'Baru pemanasan.\nKatanya sih nggak sakit.', 'Cuma segitu?', 'JUST A SCRATCH'],
  ['Mulai memar.', 'Ego masih tinggi.\nKondisi mulai turun.', 'Oke, kerasa dikit.', 'EGO > HP'],
  ['Udah bonyok.', 'Omongan masih jalan.\nMuka mulai protes.', 'Santai, masih aman.', 'CONFIDENCE: SHAKY'],
  ['Babak belur.', 'Senyumnya hilang.\nLarping-nya belum.', 'Bentar. Bentar.', 'SEND HELP'],
  ['Ampun, bang.', 'Tinggal gengsi\nyang menopang.', 'Kita bisa ngobrol...', 'CRITICAL EGO DAMAGE'],
  ['Bonyok maksimal.', 'Pikselnya menyerah.\nLegendanya berlanjut.', 'Gue... masih... kuat.', 'CERTIFIED LARP LEGEND'],
];

async function request(body) {
  const response = await fetch('/api/counter', {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Counter belum bisa dihubungi.');
  return data;
}

function connection(online) {
  $('live-dot').className = `live-dot ${online ? 'connected' : 'error'}`;
  $('connection').textContent = online ? 'SHARED COUNTER · LIVE' : 'KONEKSI TERPUTUS';
}

function render(next) {
  if (state && next.revision < state.revision) return false;
  const changed = state && next.count !== state.count;
  state = next;
  const level = Math.floor(state.count / state.step);
  // shortcut: enam tahap luka visual, tambah sprite jika butuh variasi setelah level enam.
  const damage = Math.min(level, conditions.length - 1);
  const [condition, caption, speech, stamp] = conditions[damage];
  $('count').textContent = String(state.count).padStart(4, '0');
  $('count').ariaLabel = `Total ${state.count} larp`;
  $('level').textContent = level;
  $('condition').textContent = condition;
  $('damage-caption').textContent = caption;
  $('speech').textContent = speech;
  $('damage-stamp').textContent = stamp;
  $('jonathan').dataset.damage = damage;
  $('jonathan').setAttribute('aria-label', `Jonathan, ${condition.toLowerCase()}`);
  $('damage-meter').setAttribute('aria-valuenow', damage);
  [...$('damage-meter').children].forEach((segment, index) => segment.classList.toggle('active', index < damage));
  $('next-count').textContent = `${state.step - state.count % state.step} larp`;
  $('step-value').textContent = state.step;
  hitButton.disabled = hitting || adminBusy;
  if (changed) {
    $('count').classList.remove('pop');
    void $('count').offsetWidth;
    $('count').classList.add('pop');
  }
  connection(true);
  return true;
}

function animateHit(critical) {
  const wrap = $('sprite-wrap');
  clearTimeout(hitTimer);
  wrap.classList.remove('hit');
  void wrap.offsetWidth;
  wrap.classList.add('hit');
  const effect = document.createElement('span');
  effect.className = `hit-particle${critical ? ' critical' : ''}`;
  effect.textContent = critical ? 'BONYOK!' : ['OOF!', 'BONK!', 'OUCH!', '+1'][Math.floor(Math.random() * 4)];
  $('hit-effects').append(effect);
  setTimeout(() => effect.remove(), 700);
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement('i');
    spark.className = 'pixel-spark';
    // CSSOM properties work with the self-only Content Security Policy.
    spark.style.setProperty('--x', `${40 + Math.random() * 30}%`);
    spark.style.setProperty('--y', `${20 + Math.random() * 25}%`);
    spark.style.setProperty('--dx', `${(Math.random() - .5) * 100}px`);
    spark.style.setProperty('--dy', `${-20 - Math.random() * 50}px`);
    $('hit-effects').append(spark);
    setTimeout(() => spark.remove(), 500);
  }
  hitTimer = setTimeout(() => wrap.classList.remove('hit'), 350);
}

async function refresh() {
  if (reading || hitting || adminBusy || document.hidden) return;
  reading = true;
  try {
    const next = await request();
    const previous = state;
    if (render(next) && previous && next.count > previous.count) {
      animateHit(Math.floor(next.count / next.step) > Math.floor(previous.count / previous.step));
    }
    $('feedback').textContent = '';
  } catch (error) {
    connection(false);
    $('feedback').textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Nyambung lagi otomatis sebentar lagi.' : error.message;
  } finally {
    reading = false;
  }
}

hitButton.addEventListener('click', async () => {
  if (!state || hitting || adminBusy) return;
  hitting = true;
  hitButton.disabled = true;
  hitButton.classList.add('busy');
  hitButton.setAttribute('aria-busy', 'true');
  $('feedback').textContent = '';
  animateHit(false);
  const previousLevel = Math.floor(state.count / state.step);
  try {
    const next = await request({ action: 'hit' });
    if (render(next) && Math.floor(next.count / next.step) > previousLevel) animateHit(true);
  } catch {
    connection(false);
    $('feedback').textContent = 'Hit belum terkonfirmasi. Tunggu sinkronisasi sebelum klik lagi.';
  } finally {
    hitting = false;
    hitButton.disabled = false;
    hitButton.classList.remove('busy');
    hitButton.removeAttribute('aria-busy');
  }
});

function openAdmin(action) {
  if (adminBusy || hitting) return;
  adminAction = action;
  form.reset();
  password.value = '';
  stepInput.value = state?.step || 3;
  stepInput.disabled = action === 'reset';
  $('step-field').hidden = action === 'reset';
  $('admin-error').textContent = '';
  $('dialog-title').textContent = action === 'reset' ? 'Kasih dia kesempatan?' : 'Atur tingkat penderitaan.';
  $('dialog-description').textContent = action === 'reset'
    ? 'Counter semua pengunjung kembali ke 0. Jonathan kembali mulus. Kelipatan tetap sama.'
    : 'Makin kecil kelipatannya, makin cepat Jonathan bonyok. Berlaku untuk semua pengunjung.';
  submit.textContent = action === 'reset' ? 'Reset counter ↺' : 'Simpan setting ↗';
  dialog.showModal();
  password.focus();
}

$('reset-button').addEventListener('click', () => openAdmin('reset'));
$('settings-button').addEventListener('click', () => openAdmin('settings'));
$('close-dialog').addEventListener('click', () => dialog.close());
$('cancel-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { password.value = ''; });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (adminBusy || hitting) return;
  adminBusy = true;
  submit.disabled = true;
  hitButton.disabled = true;
  $('admin-error').textContent = '';
  try {
    const next = await request({
      action: adminAction,
      password: password.value,
      ...(adminAction === 'settings' ? { step: Number(stepInput.value) } : {}),
    });
    render(next);
    $('feedback').textContent = adminAction === 'reset' ? 'Fresh start. Jonathan berterima kasih.' : `Beres. Jonathan makin bonyok setiap ${next.step} larp.`;
    dialog.close();
  } catch (error) {
    $('admin-error').textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Tutup dialog dan tunggu sinkronisasi.' : error.message;
    password.select();
  } finally {
    adminBusy = false;
    submit.disabled = false;
    hitButton.disabled = !state;
  }
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
window.addEventListener('online', refresh);
// shortcut: polling delapan detik untuk sinkronisasi ringan, pakai push jika butuh update seketika.
setInterval(refresh, 8000);
refresh();
