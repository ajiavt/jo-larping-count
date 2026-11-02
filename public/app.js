const $ = (id) => document.getElementById(id);
const hitButton = $('hit-button');
const forgiveButton = $('forgive-button');
const dialog = $('admin-dialog');
const form = $('admin-form');
const password = $('admin-password');
const stepInput = $('damage-step');
const submit = $('admin-submit');
const injuries = [...document.querySelectorAll('[data-injury]')];
let state = null;
let hitting = false;
let reading = false;
let uncertain = false;
let mutation = 0;
let adminBusy = false;
let adminAction = 'settings';
let hitTimer, eventTimer, comboTimer;
let combo = 0;
let lastHit = 0;
let audio, master;
let soundEnabled = true;
try { soundEnabled = localStorage.getItem('larping-count:sound') !== 'off'; } catch {}

const conditions = [
  ['Masih mulus.', 'Belum ada kerusakan.\nKepercayaan diri berlebih.', 'Gue mah kuat.', '100% CONFIDENCE'],
  ['Sedikit lecet.', 'Baru kesenggol.\nMasih banyak gaya.', 'Cuma segitu?', 'JUST A SCRATCH'],
  ['Mulai memar.', 'Pipi mulai berwarna.\nOmongan belum berkurang.', 'Oke, kerasa dikit.', 'EGO > HP'],
  ['Senyum hilang.', 'Satu senyum tumbang.\nSeribu alasan datang.', 'Gue lagi nggak fokus.', 'SMILE NOT FOUND'],
  ['Mata lebam.', 'Mata mulai protes.\nMulut masih aktif.', 'Ini cuma pemanasan.', 'VISION: QUESTIONABLE'],
  ['Hidung protes.', 'Napas dulu sebentar.\nKatanya belum kapok.', 'Bentar, atur napas.', 'CONFIDENCE: SHAKY'],
  ['Butuh plester.', 'Plester pertama terpasang.\nGengsi masih utuh.', 'Ada plester nggak?', 'PATCH UPDATE 1.0'],
  ['Baju ikut kena.', 'Bukan cuma muka.\nOutfit juga terdampak.', 'Baju gue, bang...', 'OUTFIT DOWNGRADE'],
  ['Bonyok beneran.', 'Kedua pipi sepakat.\nIni sudah kelewatan.', 'Kita santai dulu ya.', 'EGO TAKING DAMAGE'],
  ['Tambah tambalan.', 'Plester nambah.\nAlasan juga nambah.', 'Gue bisa jelasin.', 'PATCH UPDATE 2.0'],
  ['Mata tinggal niat.', 'Tatapan mulai kosong.\nGengsi masih nyala.', 'Masih... keliatan kok.', 'LOW BATTERY ENERGY'],
  ['Babak belur.', 'Baju makin bolong.\nArgumen makin tipis.', 'Kayaknya cukup deh.', 'SEND HELP'],
  ['Rambut menyerah.', 'Gaya rambut ikut mundur.\nMundur teratur, Jon.', 'Rambut gue ke mana?', 'BAD HAIR CENTURY'],
  ['Diperban dulu.', 'Perban sudah melingkar.\nMinta maaf masih bisa.', 'Oke, gue dengerin.', 'RECOVERY REQUIRED'],
  ['Lihat bintang.', 'Bintang muter di kepala.\nBukan tanda terkenal.', 'Kok ada bintang ya?', 'ORBITAL EGO DAMAGE'],
  ['Bonyok legendaris.', 'Level 15. Piksel menyerah.\nSaatnya bilang maaf.', 'Iya... gue minta maaf.', 'CERTIFIED LARP LEGEND'],
];
const levelOf = (snapshot) => Math.min(15, Math.floor(snapshot.count / snapshot.step));

function updateSoundButton() {
  $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
  $('sound-button').setAttribute('aria-label', soundEnabled ? 'Suara aktif, klik untuk membisukan' : 'Suara mati, klik untuk mengaktifkan');
  $('sound-icon').textContent = soundEnabled ? '♫' : '♪';
  $('sound-label').textContent = soundEnabled ? 'Sound on' : 'Muted';
  $('sound-button').classList.toggle('muted', !soundEnabled);
}

async function playSound(kind) {
  if (!soundEnabled || document.hidden) return;
  try {
    if (!audio) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audio = new Audio();
      master = audio.createGain();
      master.gain.value = 0.08;
      master.connect(audio.destination);
    }
    if (audio.state === 'suspended') await audio.resume();
    if (!soundEnabled || document.hidden || audio.state !== 'running') return;
    const notes = {
      hit: [160, 90], heal: [330, 440, 660], level: [440, 554, 659, 880],
      max: [523, 659, 784, 1047, 1568], error: [120, 70],
    }[kind];
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + index * 0.075;
      oscillator.type = kind === 'heal' ? 'triangle' : 'square';
      oscillator.frequency.setValueAtTime(frequency, start);
      if (kind === 'hit') oscillator.frequency.exponentialRampToValueAtTime(frequency / 2, start + 0.08);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.7, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(start + 0.13);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch {
    // Audio yang diblokir browser tidak boleh menggagalkan counter.
  }
}

$('sound-button').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (master) master.gain.value = soundEnabled ? 0.08 : 0;
  try { localStorage.setItem('larping-count:sound', soundEnabled ? 'on' : 'off'); } catch {}
  updateSoundButton();
  if (soundEnabled) playSound('heal');
});
updateSoundButton();

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

function syncControls() {
  hitButton.disabled = !state || hitting || adminBusy || uncertain;
  forgiveButton.disabled = hitButton.disabled || state.count === 0;
}

function render(next) {
  if (state && next.revision < state.revision) return false;
  const changed = state && next.count !== state.count;
  state = next;
  const level = levelOf(state);
  const remaining = state.step - state.count % state.step;
  const [condition, caption, speech, stamp] = conditions[level];
  $('count').textContent = String(state.count).padStart(4, '0');
  $('count').ariaLabel = `Total ${state.count} larp`;
  $('level').textContent = level;
  $('level-label').textContent = `${String(level).padStart(2, '0')} / 15`;
  $('condition').textContent = condition;
  $('damage-caption').textContent = caption;
  $('speech').textContent = speech;
  $('damage-stamp').textContent = stamp;
  $('jonathan').dataset.damage = level;
  $('jonathan').classList.toggle('hurt-eyes', level >= 4);
  $('jonathan').classList.toggle('hurt-mouth', level >= 3);
  $('jonathan').classList.toggle('dazed', level >= 14);
  $('jonathan').setAttribute('aria-label', `Jonathan, level ${level} dari 15, ${condition.toLowerCase()}`);
  injuries.forEach((injury) => injury.classList.toggle('visible', Number(injury.dataset.injury) <= level));
  $('damage-meter').setAttribute('aria-valuenow', level);
  [...$('damage-meter').children].forEach((segment, index) => segment.classList.toggle('active', index < level));
  $('level-progress').max = state.step;
  $('level-progress').value = level === 15 ? state.step : state.count % state.step;
  $('progress-label').textContent = level === 15 ? 'MAX LEVEL REACHED' : 'NEXT LEVEL';
  $('next-description').textContent = level === 15 ? 'Minta maaf buat mulai pulih.' : `${remaining} larp ke level ${level + 1}`;
  $('next-count').textContent = level === 15 ? 'LEVEL MAKS.' : `${remaining} larp`;
  $('next-copy').textContent = level === 15 ? ' Jonathan butuh minta maaf.' : ' lagi sampai makin bonyok.';
  $('step-value').textContent = state.step;
  document.body.classList.toggle('max-damage', level === 15);
  syncControls();
  if (changed) {
    $('count').classList.remove('pop');
    void $('count').offsetWidth;
    $('count').classList.add('pop');
  }
  connection(true);
  return true;
}

function resetCombo() {
  clearTimeout(comboTimer);
  combo = 0;
  lastHit = 0;
  $('combo').textContent = 'LET’S GO AGAIN.';
  $('combo').classList.remove('active');
}

function addCombo() {
  const now = performance.now();
  combo = now - lastHit < 2200 ? combo + 1 : 1;
  lastHit = now;
  $('combo').textContent = combo > 1 ? `${combo}× COMBO${combo >= 5 ? ' · NO MERCY!' : '!'}` : 'CLEAN HIT!';
  $('combo').classList.add('active');
  clearTimeout(comboTimer);
  comboTimer = setTimeout(resetCombo, 2200);
}

function animateAction(type, label) {
  const wrap = $('sprite-wrap');
  clearTimeout(hitTimer);
  wrap.classList.remove('hit', 'heal');
  void wrap.offsetWidth;
  wrap.classList.add(type === 'heal' ? 'heal' : 'hit');
  const effect = document.createElement('span');
  effect.className = `hit-particle ${type}`;
  effect.textContent = label || (type === 'heal' ? 'MAAF DITERIMA.' : ['OOF!', 'BONK!', 'OUCH!', '+1'][Math.floor(Math.random() * 4)]);
  $('hit-effects').append(effect);
  setTimeout(() => effect.remove(), 850);
  for (let i = 0; i < (type === 'critical' ? 12 : 5); i++) {
    const spark = document.createElement('i');
    spark.className = `pixel-spark ${type}`;
    spark.style.setProperty('--x', `${30 + Math.random() * 40}%`);
    spark.style.setProperty('--y', `${15 + Math.random() * 35}%`);
    spark.style.setProperty('--dx', `${(Math.random() - .5) * 180}px`);
    spark.style.setProperty('--dy', `${-25 - Math.random() * 90}px`);
    $('hit-effects').append(spark);
    setTimeout(() => spark.remove(), 650);
  }
  hitTimer = setTimeout(() => wrap.classList.remove('hit', 'heal'), 400);
}

function announceLevel(level) {
  clearTimeout(eventTimer);
  $('level-event').textContent = level === 15 ? 'MAX LEVEL · LARP LEGEND' : `LEVEL ${level} · MAKIN BONYOK!`;
  $('level-event').classList.remove('show');
  void $('level-event').offsetWidth;
  $('level-event').classList.add('show');
  eventTimer = setTimeout(() => $('level-event').classList.remove('show'), 1800);
}

async function refresh() {
  if (reading || hitting || adminBusy || document.hidden) return;
  reading = true;
  try {
    const mutationAtStart = mutation;
    const next = await request();
    if (mutationAtStart !== mutation) return;
    const previous = state;
    if (render(next) && previous) {
      if (next.count > previous.count) animateAction('hit');
      else if (next.count < previous.count) { resetCombo(); animateAction('heal', 'LEBIH BAIK.'); }
      if (levelOf(next) > levelOf(previous)) announceLevel(levelOf(next));
    }
    uncertain = false;
    syncControls();
    $('feedback').textContent = '';
  } catch (error) {
    connection(false);
    $('feedback').textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Nyambung lagi otomatis sebentar lagi.' : error.message;
  } finally {
    reading = false;
  }
}

async function changeCount(action) {
  if (!state || hitting || adminBusy || uncertain || (action === 'forgive' && state.count === 0)) return;
  mutation++;
  hitting = true;
  syncControls();
  const button = action === 'hit' ? hitButton : forgiveButton;
  button.classList.add('busy');
  button.setAttribute('aria-busy', 'true');
  $('feedback').textContent = '';
  playSound(action === 'hit' ? 'hit' : 'heal');
  animateAction(action === 'hit' ? 'hit' : 'heal', action === 'forgive' ? 'MAAF DITERIMA.' : undefined);
  const previous = state;
  try {
    const next = await request({ action });
    if (render(next)) {
      if (action === 'hit' && next.count > previous.count) addCombo();
      if (action === 'forgive') { resetCombo(); $('feedback').textContent = '−1 larp. Satu maaf, satu kesempatan.'; }
      if (levelOf(next) > levelOf(previous)) {
        animateAction('critical', 'LEVEL UP!');
        announceLevel(levelOf(next));
        playSound(levelOf(next) === 15 ? 'max' : 'level');
      }
    }
  } catch {
    uncertain = true;
    connection(false);
    resetCombo();
    $('feedback').textContent = 'Belum terkonfirmasi. Tombol aktif lagi setelah sinkronisasi.';
    playSound('error');
  } finally {
    hitting = false;
    syncControls();
    button.classList.remove('busy');
    button.removeAttribute('aria-busy');
  }
}

hitButton.addEventListener('click', () => changeCount('hit'));
forgiveButton.addEventListener('click', () => changeCount('forgive'));

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
  mutation++;
  submit.disabled = true;
  syncControls();
  $('admin-error').textContent = '';
  try {
    const next = await request({
      action: adminAction,
      password: password.value,
      ...(adminAction === 'settings' ? { step: Number(stepInput.value) } : {}),
    });
    render(next);
    resetCombo();
    $('feedback').textContent = adminAction === 'reset' ? 'Fresh start. Jonathan berterima kasih.' : `Beres. Jonathan makin bonyok setiap ${next.step} larp.`;
    dialog.close();
  } catch (error) {
    $('admin-error').textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Tutup dialog dan tunggu sinkronisasi.' : error.message;
    password.select();
  } finally {
    adminBusy = false;
    submit.disabled = false;
    syncControls();
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
  else { resetCombo(); if (audio?.state === 'running') audio.suspend().catch(() => {}); }
});
window.addEventListener('online', refresh);
// shortcut: polling delapan detik untuk sinkronisasi ringan, pakai push jika butuh update seketika.
setInterval(refresh, 8000);
refresh();
