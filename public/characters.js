const base = `
<path fill="#302a2a" d="M20 54h24v18h-2v4H30v-4h-2v4H16v-5h3V59h1z"/>
<path fill="#736f7c" d="M22 57h9v11h-9zm12 0h8v11h-8z"/>
<path fill="#f5e3ca" d="M21 66h7v6h-7zm14 0h6v6h-6z"/>
<path fill="#f7f2e8" d="M18 72h11v3H17v-2h1zm15 0h10v3H33z"/>
<path fill="#292731" d="M20 34h24v3h5v3h3v15h-4v5H16v-5h-4V40h3v-3h5z"/>
<path fill="#3f5668" d="M21 37h22v3h5v9h-6v8H22v-8h-6v-9h5z"/>
<path fill="#536d7b" d="M22 40h5v14h-5zm21 0h3v7h-3z"/>
<g class="shirt-mark"></g>
<path fill="#f0c399" d="M13 49h7v10h-7zm31 0h7v10h-7z"/>
<path fill="#d99d79" d="M13 55h3v4h-3zm31 0h3v4h-3z"/>
<path fill="#302a2a" d="M21 5h22v3h5v5h3v17h-3v6h-5v4H22v-4h-5v-6h-3V14h3V8h4z"/>
<path fill="#f0c399" d="M20 16h25v5h3v7h-3v6h-5v3H24v-3h-4v-6h-3v-7h3z"/>
<path fill="#d99d79" d="M20 26h3v7h-3zm21 5h4v3h-4zm-15 4h13v2H26z"/>
<path fill="#46362e" d="M18 13h3V9h20v3h5v8h-5v-3h-7v-3h-7v5h-6v4h-3z"/>
<path fill="#665042" d="M22 10h14v3H22zm-3 5h3v3h-3zm18-1h5v2h-5z"/>
<g class="normal-eyes"><path fill="#302a2a" d="M24 22h3v4h-3zm13 0h3v4h-3z"/><path fill="#fff4dc" d="M24 22h1v1h-1zm13 0h1v1h-1z"/></g>
<path fill="#c38468" d="M31 26h3v3h-3z"/>
<path class="normal-mouth" fill="#553b34" d="M27 30h3v2h7v-2h2v4H27z"/>
<g class="injury" data-injury="1"><path fill="#c17670" d="M20 27h6v3h-6z"/><path fill="#ad5b61" d="M21 27h2v2h-2z"/></g>
<g class="injury" data-injury="2"><path fill="#96758d" d="M35 21h8v7h-8z"/><path fill="#634e68" d="M36 23h6v2h-6z"/><path fill="#d69c92" d="M35 27h8v2h-8z"/></g>
<g class="injury" data-injury="3"><path fill="#a84e4c" d="M20 15h2v6h-2zm2 4h2v4h-2zM35 31h4v4h-4z"/><path fill="#50333c" d="M27 31h11v4H27z"/><path fill="#fff0d5" d="M28 31h3v2h-3z"/></g>
<g class="injury" data-injury="4"><path fill="#775c7e" d="M22 21h7v6h-7z"/><path fill="#4d394e" d="M23 23h5v2h-5z"/><path fill="#e2b78c" d="M37 14h7v3h-7zm2-2h3v7h-3z"/><path fill="#b9846c" d="M39 14h3v3h-3z"/><path fill="#dba77f" d="M23 50h7v4h-7z"/><path fill="#292731" d="M26 49h3v2h-3z"/></g>
<g class="injury" data-injury="5"><path fill="#be746d" d="M27 26h9v4h-9z"/><path fill="#8e4e60" d="M25 27h2v3h-2zm10 1h5v3h-5z"/><path fill="#302a2a" d="M19 8h4v4h-4zm19-3h4v5h-4z"/><path fill="#dba77f" d="M38 43h5v8h-5z"/><path fill="#292731" d="M38 46h3v2h-3z"/></g>
<g class="injury" data-injury="6"><path fill="#f6dfb6" d="M18 23h6v3h-6zm2-2h2v7h-2z"/><path fill="#bc886e" d="M20 23h2v3h-2z"/></g>
<g class="injury" data-injury="7"><path fill="#9f7588" d="M14 50h4v5h-4zm31 4h4v4h-4z"/><path fill="#e8b78e" d="M31 53h5v4h-5z"/></g>
<g class="injury" data-injury="8"><path fill="#9d657b" d="M39 28h6v4h-6z"/><path fill="#c18b82" d="M41 28h2v3h-2z"/></g>
<g class="injury" data-injury="9"><path fill="#ead9b5" d="M27 39h10v4H27z"/><path fill="#c6977c" d="M31 39h3v4h-3z"/></g>
<g class="injury" data-injury="10"><path fill="#6c516d" d="M22 26h7v3h-7zm13 0h8v3h-8z"/><path fill="#3c303a" d="M23 22h6v2h-6zm12 0h7v2h-7z"/></g>
<g class="injury" data-injury="11"><path fill="#e8b78e" d="M22 42h4v6h-4zm13 9h7v5h-7z"/><path fill="#292731" d="M24 44h2v2h-2zm13 7h2v3h-2z"/><path fill="#9f958c" d="M18 73h5v2h-5zm18 0h4v2h-4z"/></g>
<g class="injury" data-injury="12"><path fill="#f0c399" d="M30 14h8v4h-8z"/><path fill="#665042" d="M27 10h3v3h-3zm11 3h4v2h-4z"/></g>
<g class="injury" data-injury="13"><path fill="#f9efda" d="M19 15h27v4H19z"/><path fill="#c8baa6" d="M22 15h2v4h-2zm17 0h2v4h-2z"/><path fill="#bd8b79" d="M30 16h5v2h-5z"/></g>
<g class="injury" data-injury="14"><path fill="#7bb1be" d="M21 29h2v5h-2zm20 1h2v5h-2z"/><path fill="#dbad4b" d="M7 12h3V9h2v3h3v2h-3v3h-2v-3H7zm43-4h3V5h2v3h3v2h-3v3h-2v-3h-3z"/></g>
<g class="injury" data-injury="15"><path fill="#443343" d="M23 22h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2z"/><path fill="#4b3543" d="M35 22h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2z"/><path fill="#e5b4ac" d="M29 33h6v3h-6v4h-3v-6h3z"/><path fill="#f4e2c8" d="M23 11h7v3h-7zm2-2h3v7h-3z"/></g>
`;

const jonathanConditions = [
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
export const people = [
  { id:'jonathan', name:'Jonathan', title:'Larping count', label:'TOTAL LARPS', caption:'omong gede, piksel kecil.', action:'TAMBAH LARP', undo:'UDAH MINTA MAAF', accent:'#ed4935', skin:'#f7d9bf', shirt:'#3f5668', effect:'bonyok', sound:'hit', office:'Jonathan mulai cerita lagi. Naufal menghela napas.', reply:'Bro, sumbernya dari mana?', calm:'Oke, satu larp dimaafkan.' },
  { id:'naufal', name:'Naufal', title:'Angry count', label:'TOTAL MARAH', caption:'dari karyawan jadi naga. kacamata tetap.', action:'TAMBAH MARAH', undo:'UDAH TENANG', accent:'#df542e', skin:'#efc39c', shirt:'#b65443', effect:'naga', sound:'anger', office:'Naufal berubah jadi naga berkacamata. Monitor butuh asuransi.', reply:'Fal, monitor bukan panggangan!' , calm:'Naufal tarik napas. Meja aman dulu.' },
  { id:'zikri', name:'Zikri', title:'Bahas cewek count', label:'BAHAS CEWEK', caption:'satu topik cewek lagi, dunia makin muter.', action:'BAHAS CEWEK', undo:'GANTI TOPIK', accent:'#d64b88', skin:'#e9bc94', shirt:'#648875', effect:'mabok', sound:'dizzy', office:'Zikri bahas cewek lagi. Sekarang dia melihat tiga monitor padahal cuma satu.', reply:'Kri, napas dulu. Topiknya kerjaan sekarang.', calm:'Topik diganti. Dunia Zikri pelan-pelan berhenti muter.' },
  // shortcut: Aji memakai draft rambut ikal dan jenggot, sesuaikan setelah referensi Sinan jelas.
  { id:'aji', name:'Aji', title:'Ngejokes ga lucu count', label:'JOKES GA LUCU', caption:'niatnya stand-up. jadinya stand alone.', action:'JOKES GA LUCU', undo:'KETAWA DIKIT', accent:'#597fba', skin:'#e5b38e', shirt:'#665b89', effect:'kosong', sound:'sad', office:'Jokes Aji tidak disambut. Satu sudut kantor berubah abu-abu.', reply:'Ji... kita masih di sini. Nih tisu.', calm:'Ada yang ketawa sedikit. Warna hidup Aji balik setitik.' },
  { id:'agung', name:'Agung', title:'Solat ga tepat waktu count', label:'TELAT SOLAT', caption:'dari halo ke tanduk. ayo tepat waktu.', action:'CATAT TELAT', undo:'UDAH TEPAT WAKTU', accent:'#a46cbd', skin:'#edc29c', shirt:'#ece5cf', effect:'iblis', sound:'devil', office:'Halo Agung mulai redup. Yasir muncul buat ngingetin.', reply:'Gung, ayo dulu. Meja bisa nunggu.', calm:'Agung mulai tepat waktu. Halo-nya balik sedikit.' },
];
export const officeSeatIds = ['yasir','jonathan','agung','naufal','zikri','aji'];
export const levelOf = (state) => Math.min(15, Math.floor(state.count / state.step));

const moodTitles = {
  naufal:['B aja.','Mulai sebal.','Muka merah.','Kepala mendidih.','Pipi mengembang.','Urat di mana-mana.','Tanduk tumbuh.','Sisik nongol.','Ekor ikut rapat.','Setengah naga.','Sayap terbuka.','Mulai nyembur.','Naga satu divisi.','Monitor meleleh.','Evakuasi kantor.','NAGA BERKACAMATA.'],
  zikri:['Masih fokus.','Sekali bahas cewek.','Senyum nggak jelas.','Pipi memerah.','Kepala miring.','Mulai oleng.','Mata muter.','Lidah ikut keluar.','Lihat dobel.','Topik makin ngawur.','Dunia bergoyang.','Nyaris tumbang.','Mabok topik cewek.','Kursi terasa kapal.','Susah berdiri.','MABOK TOTAL.'],
  aji:['Masih pede.','Jokes nyangkut.','Senyum dipaksa.','Hening panjang.','Senyum padam.','Mata meredup.','Mendung pribadi.','Tawanya AFK.','Mulai nangis.','Hujan lokal.','Ekspresi hilang.','Mata kosong.','Jiwa AFK.','Badai perasaan.','Kosong melompong.','NOT RESPONDING.'],
  agung:['Masih malaikat.','Halo meredup.','Sayap kusam.','Tanduk mengintip.','Mulai berubah.','Aura menggelap.','Sayap berganti.','Mata memerah.','Halo makin tipis.','Ekor muncul.','Tanduk tumbuh.','Api kecil.','Aura iblis.','Sayap gelap.','Halo hampir habis.','MODE IBLIS.'],
};
export function conditionFor(person, level) {
  if (person.id === 'jonathan') return jonathanConditions[level];
  const phase = Math.min(3, Math.floor(level / 4));
  const lines = {
    naufal:[['Gue biasa aja.','Biasa aja, katanya.'],['Kok baju mulai sempit?','Kepala membesar. Tanduk menyusul.'],['GRAWR. Tapi mana kacamatanya?','Sisik dan sayap mengambil alih.'],['GRAAAWR! KACAMATA AMAN!','Sudah jadi naga. Gedung belum diasuransikan.']],
    zikri:[['Kerjaan dulu deh.','Masih fokus. Belum bahas cewek.'],['Eh tapi kalau soal dia...','Topik cewek bikin kepala oleng.'],['Monitornya kok jadi tiga?','Mata spiral. Lidah keluar. Lihat dobel.'],['Gue berdiri kok... kayaknya.','Mabok bahas cewek. Lantai ikut muter.']],
    aji:[['Gue punya jokes nih.','Masih optimis lucu.'],['Oh... nggak ada yang ketawa.','Warna hidup mulai hilang.'],['Hehe... ya udah.','Mata kosong. Awan hujan milik pribadi.'],['...','Kosong, murung, dan tenggelam di air mata.']],
    agung:[['Masih ada waktu kok.','Halo masih bersinar.'],['Bentar lagi, bentar.','Halo mulai kehilangan daya.'],['Kok mulai anget ya?','Tanduk mulai terlihat.'],['Oke, gue berangkat.','Saatnya kembali tepat waktu.']],
  }[person.id][phase];
  return [moodTitles[person.id][level], lines[1], lines[0], `LEVEL ${level} · ${person.effect.toUpperCase()}`];
}

function heart(x,y,size=1) {
  return `<path transform="translate(${x} ${y}) scale(${size})" fill="#ed6196" d="M0 1h1V0h2v1h1V0h2v1h1v3H6v1H5v1H4v1H3V6H2V5H1V4H0z"/>`;
}
function mix(a,b,ratio) {
  return `rgb(${a.map((value,index)=>Math.round(value+(b[index]-value)*ratio)).join(' ')})`;
}
const letters = {
  J:['111','001','001','101','111'], N:['1001','1101','1011','1001','1001'],
  Z:['1111','0001','0010','0100','1111'], A:['0110','1001','1111','1001','1001'],
  Y:['1001','1001','0110','0010','0010'],
};
function initialMark(letter, x=29, y=44, color='#eee6c9') {
  const pixels=letters[letter].flatMap((row,dy)=>[...row].flatMap((pixel,dx)=>pixel==='1'?[`<rect x="${dx}" y="${dy}" width="1" height="1"/>`]:[])).join('');
  return `<g class="shirt-initial" data-initial="${letter}" fill="${color}" transform="translate(${x} ${y}) scale(1.5)">${pixels}</g>`;
}
const glasses = '<g class="glasses"><path fill="none" stroke="#27232b" stroke-width="1.8" d="M21 21h10v8H21zm13 0h10v8H34zm-3 3h3m-16-1h4m22 0h4"/><path fill="#fff8dc" opacity=".6" d="M23 22h2v2h-2zm13 0h2v2h-2z"/></g>';

function dragon(level) {
  const size=1+(level-9)*.035;
  const reach=70+(level-9)*11;
  const fire=level>=10?`<g class="dragon-breath"><path fill="#dc3b2d" d="M56 26h12v-4h12v-5h${reach-72}v7h-9v5h14v6h-14v6H79v-4H66v-4H56z"/><path fill="#f29832" d="M57 27h18v-3h${reach-70}v5h-8v6H77v-3H57z"/><path fill="#ffe496" d="M57 28h${reach-60}v4H57z"/></g>`:'';
  return `<g class="dragon-form" transform="translate(32 76) scale(${size}) translate(-32 -76)">
    <path fill="#743448" stroke="#362b35" stroke-width="2" d="M16 44L-8 23l4 36 9-9 10 14zm30 0 25-21-5 36-9-9-9 14z"/>
    <path fill="#a75545" stroke="#362b35" stroke-width="2" d="M20 58H6v9H-5v7h20l11-8z"/>
    <path fill="#d9ae60" d="M8 61H3v5h5zm-8 8h-5v5h5z"/>
    <path fill="#49313a" d="M15 38h32v7h8v22h-8v10H34v-9h-5v9H15V66H8V45h7z"/>
    <path fill="#a2514a" d="M18 41h25v23H18zm-7 7h7v14h-7zm32 0h9v14h-9z"/>
    <path fill="#753b42" d="M21 43h19v18H21z"/>
    <path fill="#f7d28a" d="M14 73h5v4h-5zm7 0h4v4h-4zm14 0h4v4h-4zm7 0h5v4h-5z"/>
    <path fill="#342a33" d="M18 10h26v5h9v9h10v14H46v5H20v-6h-7V18h5z"/>
    <path fill="#b95e4a" d="M21 13h20v5h8v10h11v7H43v5H22v-6h-6V20h5z"/>
    <path fill="#e3b76e" d="M23 15l-5-13h7l4 13zm13 0L42 2h7l-8 16z"/>
    <path fill="#e9c081" d="M43 29h16v4H43z"/><path fill="#412b32" d="M47 25h4v3h-4zm8 2h3v3h-3z"/>
    <path fill="#fff1ca" d="M44 34h4v5h-4zm9 0h4v4h-4z"/>
    ${glasses}${initialMark('N')}${fire}
  </g>`;
}

export function personSprite(id, inputLevel=0) {
  if (id === 'yasir') return `<svg class="person-svg ghost-svg" viewBox="0 0 64 90" role="img" aria-label="Yasir, hantu departemen sebelah" shape-rendering="crispEdges"><ellipse cx="32" cy="83" rx="19" ry="3" fill="#a9a4bf" opacity=".25"/><g class="pixel-person"><path fill="#b3acd0" d="M23 16h18v3h6v6h4v42h-4v7h-6v-5h-6v7h-6v-7h-6v5h-7v-7h-4V25h4v-6h7z"/><path fill="#eeeafa" d="M24 20h16v3h6v6h2v34h-4v7h-3v-6h-9v8h-3v-8h-9v5h-3V29h2v-6h5z"/><path fill="#625a7e" d="M22 32h5v7h-5zm15 0h5v7h-5zm-8 12h7v6h-7z"/>${initialMark('Y',29,54,'#aea3ca')}</g></svg>`;
  const person = people.find((entry)=>entry.id===id) || people[0];
  const level = Math.max(0,Math.min(15,inputLevel));
  const stage=Math.floor(level/3);
  let art = base.replaceAll('#f0c399',person.skin).replaceAll('#3f5668',person.shirt).replace('<g class="shirt-mark"></g>',initialMark(person.name[0].toUpperCase(),29,44,id==='agung' && level<7?'#635843':'#eee6c9'));
  if (id !== 'jonathan') art=art.replace(/<g class="injury" data-injury="\d+">[\s\S]*?<\/g>/g,'');
  else art=art.replace(/class="injury" data-injury="(\d+)"/g,(_,value)=>`class="injury${Number(value)<=level?' visible':''}" data-injury="${value}"`);
  let behind='',front='',pose='',copies='';
  if(id==='jonathan') {
    if(level>=6) front+=`<path fill="#b488a0" opacity=".85" d="M17 24h10v10H17zm20 0h11v11H37z"/>`;
    if(level>=9) front+='<path fill="#c0dce0" stroke="#5a7b82" stroke-width="1" d="M22 8h19v7H22z"/><path fill="#eef6ef" d="M26 6h10v3H26z"/>';
    if(level>=12) {
      front+='<g class="cartoon-bandages" fill="#f3ead9" stroke="#b8aa97" stroke-width=".6"><path d="M18 17h29v5H18zm-5 33h8v4h-8zm31 1h8v4h-8zM22 59h9v4h-9zm12 0h9v4h-9z"/></g>';
      for(let i=0;i<stage;i++) front+=`<g class="dizzy-orbit orbit-${i%2}"><path transform="translate(${3+i*12} ${2+i%2*4})" fill="#d9ac38" d="M0 3h3V0h3v3h3v3H6v3H3V6H0z"/></g>`;
    }
  }
  if(id==='naufal' && level<9) {
    art=art.replaceAll(person.skin,mix([239,195,156],[231,64,43],level/9)).replaceAll('#46362e','#292630');
    front+=glasses;
    if(level) front+=`<path fill="#382832" d="M20 17l10 ${2+level/2}v3l-10-4zm15 ${2+level/2} 10-${2+level/2}v3l-10 4z"/>`;
    if(level>=3) front+='<path fill="none" stroke="#b52b2c" stroke-width="2" d="M43 12v5m-3-2h6m-2 16v5m-3-3h6"/>';
    if(level>=6) {
      behind+='<path fill="#904653" d="M18 43L2 30l4 25 12-5zm28 0 16-13-4 25-12-5zM18 60H6v9h17z"/>';
      front+='<path fill="#e7be76" d="M21 13l-2-10h5l3 10zm17 0 3-10h5l-3 10z"/>';
    }
    for(let i=0;i<stage;i++) behind+=`<path class="flame" transform="translate(${14+i*12} ${2-stage*2})" fill="#ef8b35" d="M0 13V6h3V0h3v6h4v9H0z"/>`;
  }
  if(id==='zikri') {
    art=art.replaceAll(person.skin,mix([233,188,148],[238,119,133],level/15));
    const points=[[3,8],[53,12],[0,30],[55,36],[5,49],[51,57],[16,0],[42,2],[0,63],[55,69],[19,49],[42,44],[10,20],[46,25],[29,0]];
    points.slice(0,level).forEach(([x,y],index)=>{front+=`<g class="floating-love love-${index%3}">${heart(x,y,index%3===0?1.2:.8)}</g>`;});
    if(level>=3) front+='<path fill="#e87880" d="M19 27h9v5h-9zm17 0h10v5H36z"/>';
    if(level>=6) {
      art=art.replace(/<g class="normal-eyes">[\s\S]*?<\/g>/,'');
      front+='<g class="spiral-eyes" fill="none" stroke="#6a3b59" stroke-width="1.5"><path d="M21 21h9v8h-7v-6h5v4h-3m9-6h9v8h-7v-6h5v4h-3"/></g><path fill="#d26b85" d="M29 33h8v9h-5v-5h-3z"/>';
    }
    if(level>=9) {
      const offset=3+stage;
      copies=`<g class="double-vision" opacity=".2" transform="translate(-${offset} 0)">${art}</g><g class="double-vision" opacity=".15" transform="translate(${offset} 1)">${art}</g>`;
      for(let i=0;i<stage;i++) front+=`<path class="dizzy-orbit orbit-${i%2}" fill="#d7ad40" transform="translate(${6+i*12} ${-2+i%2*5})" d="M0 2h2V0h2v2h2v2H4v2H2V4H0z"/>`;
    }
    const angle=level>=13?-35-(level-13)*13:level>=6?-(level-3)*2:level>=3?-5:0;
    pose=angle?`rotate(${angle} 32 76)`:'';
  }
  if(id==='aji') {
    front+='<path fill="#352b2a" d="M18 13h3V8h4V5h4v3h4V5h4v4h5v4h4v6h-5v-3h-5v2h-5v-3h-5v3h-8zM23 31h3v4h13v-4h3v5h-3v3H26v-3h-3z"/>';
    if(level) {
      art=art.replace(/<path class="normal-mouth"[^>]*\/>/,'');
      front+='<path fill="none" stroke="#68423e" stroke-width="2" d="M27 34v-2h3v-2h6v2h3v2"/>';
    }
    if(level>=4) front+='<path fill="#9a8b9b" d="M21 26h10v5H21zm13 0h10v5H34z"/>';
    if(level>=7) {
      art=art.replace(/<g class="normal-eyes">[\s\S]*?<\/g>/,'');
      front+=`<g class="empty-eyes"><path fill="#655966" d="M20 20h12v10H20zm13 0h12v10H33z"/><path fill="#f6f3e7" d="M23 22h7v6h-7zm12 0h7v6h-7z"/></g>`;
    }
    for(let i=0;i<level;i++) front+=`<rect class="tear tear-${i%3}" x="${i%2?38:23}" y="${28+i%3*4}" width="${2+stage}" height="${3+level}" fill="#81b9cb" opacity="${.35+level/30}"/>`;
    if(level>=6) {
      const cloud=level>=12?'#44434d':'#8b91a5';
      behind+=`<g class="sad-cloud"><path fill="${cloud}" d="M4 3h9V-3h12V-7h16v4h12v6h8v10H4z"/>${Array.from({length:level-3},(_,i)=>`<rect class="rain rain-${i%3}" x="${6+i%9*6}" y="${13+i%3*13}" width="2" height="${5+stage*2}" fill="#9eb4c6"/>`).join('')}</g><ellipse cx="32" cy="76" rx="${16+level}" ry="${2+stage}" fill="#86adba" opacity=".5"/>`;
    }
    if(level>=12) behind+='<g class="empty-aura"><ellipse cx="32" cy="43" rx="38" ry="43" fill="#595862" opacity=".2"/><path fill="#35343d" d="M18 37h28v5H18z"/></g>';
  }
  if(id==='agung') {
    const ratio=level/15;
    art=art.replaceAll(person.shirt,mix([236,229,207],[106,48,65],ratio)).replaceAll(person.skin,mix([237,194,156],[189,72,64],ratio)).replaceAll('#46362e','#252b27').replaceAll('#665042','#353d32');
    const wing=8+stage*4;
    behind+=`<g opacity="${1-ratio}"><path fill="#fff8e9" stroke="#d9c99b" stroke-width="1" d="M19 39L7 30v17l11 8zm26 0 12-9v17L46 55z"/><ellipse cx="32" cy="1" rx="11" ry="3" fill="none" stroke="#d8ad49" stroke-width="2"/></g><path fill="#78374c" stroke="#432c3d" stroke-width="1" opacity="${ratio}" d="M19 40L${12-wing} ${31-stage*2}l3 ${24+stage} 9-8 6 13zm26 0 ${7+wing}-${9+stage*2}-3 ${24+stage}-9-8-6 13z"/>`;
    front+='<path fill="#252b27" d="M18 13h3V9h22v4h4v8H17v-8zm-1 8h4v7h-4zm26 0h4v7h-4z"/>';
    if(level>=3) front+=`<path fill="#b9504c" d="M21 13V${11-level}h5v${level+2}zm17 0 5-${level+2}v${level+2}z"/>`;
    if(level>=7) front+='<path fill="#ee4238" d="M22 22h8v5h-8zm13 0h8v5h-8z"/><path fill="#fff3d5" d="M27 32h4v7h-4zm8 0h4v7h-4z"/>';
    if(level>=9) behind+='<path fill="none" stroke="#b9504c" stroke-width="3" d="M43 58h18V42h-6V32"/><path fill="#b9504c" d="M50 34l5-10 6 10z"/>';
    for(let i=0;i<Math.max(0,level-8);i++) behind+=`<path class="flame" transform="translate(${-5+i*11} ${61-stage})" fill="${i%2?'#e8ae4a':'#db6444'}" d="M0 18V8h3V0h3v8h4v12H0z"/>`;
  }
  const split=art.indexOf('<path fill="#302a2a" d="M21 5');
  const tall=id==='zikri';
  art=`<g class="body-proportions" data-height="${tall?'tall':'normal'}" transform="translate(0 ${tall?-2:-1}) scale(1 ${tall?1.16:1.06})">${art.slice(0,split)}</g>${art.slice(split)}`;
  if(id==='naufal' && level>=9) { art=dragon(level); front=''; behind=''; }
  const classes=['person-svg',`stage-${stage}`,id==='jonathan'&&level>=4?'hurt-eyes':'',id==='jonathan'&&level>=3?'hurt-mouth':'',id==='jonathan'&&level>=14?'dazed':'',id==='zikri'&&level>=4?'drunk':'',`mood-${id}`].join(' ');
  return `<svg class="${classes}" viewBox="0 0 64 90" role="img" aria-label="${person.name}, level ${level} dari 15" shape-rendering="crispEdges"><ellipse cx="32" cy="86" rx="24" ry="3" fill="#d8cdb8"/><g class="pixel-person" transform="translate(0 ${tall?0:6})"><g class="character-pose" transform="${pose}">${behind}${copies}${art}${front}</g></g></svg>`;
}
