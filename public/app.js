import { people, officeSeatIds, levelOf, conditionFor, personSprite } from './characters.js';

const $ = (id) => document.getElementById(id);
const hitButton = $('hit-button');
const forgiveButton = $('forgive-button');
const dialog = $('admin-dialog');
const form = $('admin-form');
const password = $('admin-password');
const stepInput = $('damage-step');
const submit = $('admin-submit');
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

const personFor = (id=selectedId) => people.find((person)=>person.id===id);
let states = {};
let selectedId = 'jonathan';
let view = 'office';
let adminCharacter = 'jonathan';
const bubbleTimers = new Map();
let ghostVisits = 0;

function speak(id, text) {
  const bubble = $(`bubble-${id}`);
  clearTimeout(bubbleTimers.get(id));
  bubble.textContent = text;
  bubble.classList.add('show');
  bubbleTimers.set(id,setTimeout(()=>bubble.classList.remove('show'),3200));
}

function officeReaction(id, action) {
  const person = personFor(id);
  $('office-feed').textContent = action === 'hit' ? person.office : person.calm;
  speak(id, action === 'hit' ? conditionFor(person,levelOf(states[id]))[2] : 'Oke. Lebih baik.');
  if(action === 'hit') {
    const other = id === 'agung' ? 'yasir' : officeSeatIds[(officeSeatIds.indexOf(id)+1)%officeSeatIds.length];
    speak(other,person.reply);
    $('office-room').classList.remove('rumble');
    if(id==='naufal' && levelOf(states[id])>=8) {
      void $('office-room').offsetWidth;
      $('office-room').classList.add('rumble');
    }
  }
}

function chooseCharacter(id, nextView=view) {
  if(hitting || adminBusy || dialog.open) return;
  if(id==='yasir') {
    const lines=['Gue udah pindah departemen, tapi masih nongkrong.','Tenang, gue cuma numpang Wi-Fi.','Departemen baru, meja lama tetap dihantui.','Jangan lupa istirahat, para penghuni kantor.'];
    const text=lines[ghostVisits++%lines.length];
    speak('yasir',text);
    $('office-feed').textContent=`Yasir: “${text}”`;
    playSound('ghost');
    return;
  }
  if(!personFor(id)) return;
  selectedId=id;
  view=nextView;
  state=states[id] || null;
  resetCombo();
  clearTimeout(eventTimer);
  $('level-event').classList.remove('show');
  $('hit-effects').replaceChildren();
  $('sprite-wrap').classList.remove('hit','heal');
  $('feedback').textContent='';
  document.body.dataset.person=id;
  document.body.dataset.view=view;
  document.documentElement.style.setProperty('--accent',personFor().accent);
  $('arena-panel').hidden=view==='office';
  $('office-panel').hidden=view!=='office';
  $('arena-panel').setAttribute('aria-labelledby',`tab-${id}`);
  $('office-panel').setAttribute('aria-labelledby','tab-office');
  document.querySelectorAll('[role="tab"]').forEach((tab)=>{
    const active=tab.id===`tab-${view==='office'?'office':id}`;
    tab.setAttribute('aria-selected',String(active));
    tab.tabIndex=active?0:-1;
  });
  $('scene-label').textContent=view==='office'?'OPENSPACE · ENAM PENGHUNI':`${personFor().name.toUpperCase()} · ${personFor().title.toUpperCase()}`;
  document.title=view==='office'?'Kantor Count — satu meja, banyak tingkah.':`${personFor().name} — ${personFor().title} · Kantor Count`;
  history.replaceState(null,'',`#${view==='office'?'kantor':id}`);
  renderSelected();
  renderOffice();
  if(view==='office' && states[id]) speak(id,conditionFor(personFor(),levelOf(states[id]))[2]);
}

$('character-tabs').innerHTML='<button id="tab-office" class="person-tab" role="tab" type="button" aria-selected="true" aria-controls="office-panel">▦ <span>Kantor<small>SEMUA KUMPUL</small></span></button>'+people.map((person)=>`<button id="tab-${person.id}" class="person-tab" data-person="${person.id}" role="tab" type="button" aria-selected="false" aria-controls="arena-panel" tabindex="-1"><span class="tab-dot" aria-hidden="true"></span><span>${person.name}<small>${person.title}</small></span></button>`).join('');
$('tab-office').addEventListener('click',()=>chooseCharacter(selectedId,'office'));
people.forEach((person)=>$(`tab-${person.id}`).addEventListener('click',()=>chooseCharacter(person.id,'arena')));
$('character-tabs').addEventListener('keydown',(event)=>{
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  const index=tabs.indexOf(document.activeElement);
  if(index<0 || hitting || adminBusy) return;
  let next;
  if(event.key==='ArrowRight') next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home') next=0;
  else if(event.key==='End') next=tabs.length-1;
  if(next===undefined) return;
  event.preventDefault();
  tabs[next].click();
  tabs[next].focus();
});
const occupants=officeSeatIds.map((id)=>people.find((person)=>person.id===id) || {id:'yasir',name:'Yasir',title:'Departemen sebelah'});
$('office-panel').innerHTML=`<div class="office-workspace"><div class="office-room" id="office-room"><div class="office-window window-left"></div><div class="office-window window-right"></div><span class="room-sign">OPENSPACE / 06</span><span class="office-plant plant-one" aria-hidden="true">✳</span><span class="office-plant plant-two" aria-hidden="true">✳</span><div class="office-table"><div class="table-seam"></div>${occupants.map((person,index)=>`<div class="desk-setup setup-${index}" id="desk-${person.id}" aria-hidden="true"><i class="monitor"></i><i class="keyboard"></i><i class="mug"></i></div>`).join('')}</div>${occupants.map((person,index)=>`<button class="office-person seat-${index}${person.id==='yasir'?' ghost-seat':''}" id="seat-${person.id}" type="button" aria-label="${person.id==='yasir'?'Ajak Yasir si hantu ngobrol':`Pilih counter ${person.name}`}"><span class="desk-chair" aria-hidden="true"></span><span class="office-sprite" id="office-sprite-${person.id}"></span><strong>${person.name}</strong><small id="seat-level-${person.id}">${person.id==='yasir'?'PINDAH DEPARTEMEN':'LV. 0'}</small></button><span class="office-bubble bubble-${index}" id="bubble-${person.id}"></span>`).join('')}<span class="floor-note">KLIK ORANGNYA, PILIH COUNTERNYA.</span></div><aside class="office-roster" aria-label="Kondisi penghuni kantor">${occupants.map((person)=>`<button class="roster-person" id="roster-${person.id}" type="button"><span class="roster-avatar" id="avatar-${person.id}"></span><span class="roster-info"><strong>${person.name}</strong><small id="mood-${person.id}">${person.id==='yasir'?'Hantu departemen sebelah':person.title}</small></span><span class="roster-count" id="roster-count-${person.id}">${person.id==='yasir'?'☁':'—'}</span></button>`).join('')}</aside></div><div class="office-caption"><p id="office-feed" role="status" aria-live="polite">Lima orang kerja. Satu hantu numpang nongkrong. Semua punya tingkah.</p><button id="open-counter" type="button">Lihat detail ↗</button></div>`;
occupants.forEach((person)=>{
  $(`seat-${person.id}`).addEventListener('click',()=>chooseCharacter(person.id,'office'));
  $(`roster-${person.id}`).addEventListener('click',()=>chooseCharacter(person.id,'office'));
});
$('open-counter').addEventListener('click',()=>chooseCharacter(selectedId,'arena'));
function fromHash() {
  const id=location.hash.slice(1);
  chooseCharacter(personFor(id)?id:selectedId,personFor(id)?'arena':'office');
}
window.addEventListener('hashchange',fromHash);

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
      anger: [120, 85, 55], love: [523, 659, 784], sad: [392, 330, 262], devil: [130, 155, 196], ghost: [440, 660, 440], dizzy: [392, 415, 349, 370, 311],
    }[kind];
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + index * 0.075;
      oscillator.type = ['heal','love','ghost','dizzy'].includes(kind) ? 'triangle' : 'square';
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
  const response = await fetch(`/api/counter?character=${encodeURIComponent(body?.character || selectedId)}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    ...(body ? { body: JSON.stringify({ ...body, character: body.character || selectedId }) } : {}),
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
  document.querySelectorAll('.person-tab,.office-person,.roster-person,#open-counter').forEach((button)=>{button.disabled=hitting || adminBusy;});
}

function renderSelected() {
  const person=personFor();
  const snapshot=state || {count:0,step:3,revision:0};
  const level=levelOf(snapshot);
  const remaining=snapshot.step-snapshot.count%snapshot.step;
  const [condition,caption,speech,stamp]=conditionFor(person,level);
  $('counter-label').textContent=person.label;
  $('counter-caption').textContent=person.caption;
  $('watermark').textContent=person.name.toUpperCase();
  $('hero-name').textContent=person.name.toUpperCase();
  $('count').textContent=state?String(state.count).padStart(4,'0'):'—';
  $('count').ariaLabel=`${person.name}, ${person.title}, ${state?.count ?? 'belum terhubung'}`;
  $('level').textContent=level;
  $('level-label').textContent=`${String(level).padStart(2,'0')} / 15`;
  $('report-label').textContent=`${person.effect.toUpperCase()} REPORT`;
  $('condition').textContent=condition;
  $('condition-panel').setAttribute('aria-label',`Kondisi ${person.name}`);
  $('damage-caption').textContent=caption;
  $('speech').textContent=speech;
  $('damage-stamp').textContent=stamp;
  const spriteKey=`${selectedId}:${level}`;
  if($('jonathan').dataset.spriteKey!==spriteKey) {
    $('jonathan').innerHTML=personSprite(selectedId,level);
    $('jonathan').dataset.spriteKey=spriteKey;
  }
  $('damage-meter').setAttribute('aria-valuenow',level);
  $('damage-meter').setAttribute('aria-label',`Level ${person.effect} ${person.name}`);
  [...$('damage-meter').children].forEach((segment,index)=>segment.classList.toggle('active',index<level));
  $('level-progress').max=snapshot.step;
  $('level-progress').value=level===15?snapshot.step:snapshot.count%snapshot.step;
  $('progress-label').textContent=level===15?'MAX LEVEL REACHED':'NEXT LEVEL';
  $('next-description').textContent=level===15?'Kurangi counter buat mulai pulih.':`${remaining} count ke level ${level+1}`;
  $('next-count').textContent=level===15?'LEVEL MAKS.':`${remaining} count`;
  $('next-copy').textContent=level===15?` ${person.name} butuh jeda.`:` lagi sampai makin ${person.effect}.`;
  $('step-value').textContent=snapshot.step;
  $('action-label').textContent=person.action;
  $('undo-label').textContent=person.undo+' ♡';
  $('active-counter').textContent=`${person.name.toUpperCase()} · ${person.title.toUpperCase()}${view==='office'?` · ${state?.count ?? '—'}`:''}`;
  document.body.classList.toggle('max-damage',level===15);
  syncControls();
}

function renderOffice() {
  occupants.forEach((person)=>{
    const snapshot=states[person.id];
    const level=snapshot?levelOf(snapshot):0;
    const key=`${person.id}:${level}`;
    for(const prefix of ['office-sprite','avatar']) {
      const portrait=$(`${prefix}-${person.id}`);
      if(portrait.dataset.spriteKey!==key) {
        portrait.innerHTML=personSprite(person.id,level);
        portrait.dataset.spriteKey=key;
      }
    }
    $(`seat-${person.id}`).classList.toggle('selected',person.id===selectedId);
    $(`roster-${person.id}`).classList.toggle('selected',person.id===selectedId);
    if(person.id!=='yasir') {
      const seat=$(`seat-${person.id}`);
      const desk=$(`desk-${person.id}`);
      seat.classList.toggle('is-dragon',person.id==='naufal' && level>=9);
      seat.classList.toggle('is-drunk',person.id==='zikri' && level>=6);
      seat.classList.toggle('is-void',person.id==='aji' && level>=9);
      desk.classList.toggle('is-scorched',person.id==='naufal' && level>=9);
      desk.classList.toggle('is-messy',person.id==='zikri' && level>=6);
      desk.classList.toggle('is-wrecked',person.id==='zikri' && level>=12);
      desk.classList.toggle('is-muted',person.id==='aji' && level>=6);
      $(`seat-${person.id}`).setAttribute('aria-pressed',String(person.id===selectedId));
      $(`roster-${person.id}`).setAttribute('aria-pressed',String(person.id===selectedId));
      $(`seat-level-${person.id}`).textContent=`LV. ${level} · ${snapshot?.count ?? '—'}`;
      $(`roster-count-${person.id}`).textContent=snapshot?.count ?? '—';
      $(`mood-${person.id}`).textContent=conditionFor(person,level)[0];
    }
  });
  $('office-room').classList.toggle('hot-office',states.naufal && levelOf(states.naufal)>=12);
}

function render(next) {
  const previous=state;
  for(const [id,snapshot] of Object.entries(next.characters || {jonathan:next})) {
    if(personFor(id) && (!states[id] || snapshot.revision>=states[id].revision)) states[id]=snapshot;
  }
  state=states[selectedId] || null;
  renderSelected();
  renderOffice();
  if(previous && state && previous.count!==state.count) {
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
  effect.textContent = label || (type === 'heal' ? 'LEBIH BAIK.' : {jonathan:'BONK!',naufal:state && levelOf(state)>=9?'GRAWR!':'BOOM!',zikri:'OLENG!',aji:'...',agung:'HALO?!'}[selectedId]);
  $('hit-effects').append(effect);
  setTimeout(() => effect.remove(), 850);
  for (let i = 0; i < (type === 'critical' ? 12 : 5); i++) {
    const spark = document.createElement('i');
    spark.className = `pixel-spark ${type} particle-${selectedId}`;
    if(selectedId==='zikri' && type!=='heal') spark.textContent=['♥','↻','✦'][i%3];
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
  $('level-event').textContent = level === 15 ? `MAX LEVEL · ${personFor().name.toUpperCase()} LEGEND` : `LEVEL ${level} · MAKIN ${personFor().effect.toUpperCase()}!`;
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
    const changedPerson=people.find((person)=>states[person.id] && next.characters?.[person.id] && next.characters[person.id].count!==states[person.id].count);
    const officeAction=changedPerson && next.characters[changedPerson.id].count>states[changedPerson.id].count?'hit':'forgive';
    if (render(next) && previous) {
      if (state.count > previous.count) animateAction('hit');
      else if (state.count < previous.count) { resetCombo(); animateAction('heal', 'LEBIH BAIK.'); }
      if (levelOf(state) > levelOf(previous)) announceLevel(levelOf(state));
    }
    if(changedPerson) officeReaction(changedPerson.id,officeAction);
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
  playSound(action === 'hit' ? personFor().sound : 'heal');
  animateAction(action === 'hit' ? 'hit' : 'heal', action === 'forgive' ? 'LEBIH BAIK.' : undefined);
  const previous = state;
  try {
    const next = await request({ action });
    if (render(next)) {
      officeReaction(selectedId,action);
      if (action === 'hit' && next.count > previous.count) addCombo();
      if (action === 'forgive') { resetCombo(); $('feedback').textContent = `−1 untuk ${personFor().name}. ${personFor().undo.toLowerCase()}.`; }
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
  adminCharacter=selectedId;
  form.reset();
  password.value = '';
  stepInput.value = state?.step || 3;
  stepInput.disabled = action === 'reset';
  $('step-field').hidden = action === 'reset';
  $('admin-error').textContent = '';
  $('dialog-title').textContent = action === 'reset' ? `Reset ${personFor().name}?` : `Atur level ${personFor().name}.`;
  $('step-question').textContent=`${personFor().name} naik level setiap berapa count?`;
  $('dialog-description').textContent = action === 'reset'
    ? `Counter ${personFor().name} untuk semua pengunjung kembali ke 0. Counter orang lain tidak ikut direset.`
    : `Kelipatan hanya berlaku untuk ${personFor().name}. Makin kecil, makin cepat level ${personFor().effect} naik.`;
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
      character: adminCharacter,
      password: password.value,
      ...(adminAction === 'settings' ? { step: Number(stepInput.value) } : {}),
    });
    render(next);
    resetCombo();
    $('feedback').textContent = adminAction === 'reset' ? `Fresh start untuk ${personFor().name}.` : `${personFor().name} naik level setiap ${next.step} count.`;
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
fromHash();
// shortcut: polling delapan detik untuk sinkronisasi ringan, pakai push jika butuh update seketika.
setInterval(refresh, 8000);
refresh();
