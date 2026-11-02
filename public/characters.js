const base = `
<path fill="#302a2a" d="M20 54h24v18h-2v4H30v-4h-2v4H16v-5h3V59h1z"/>
<path fill="#736f7c" d="M22 57h9v11h-9zm12 0h8v11h-8z"/>
<path fill="#f5e3ca" d="M21 66h7v6h-7zm14 0h6v6h-6z"/>
<path fill="#f7f2e8" d="M18 72h11v3H17v-2h1zm15 0h10v3H33z"/>
<path fill="#292731" d="M20 34h24v3h5v3h3v15h-4v5H16v-5h-4V40h3v-3h5z"/>
<path fill="#3f5668" d="M21 37h22v3h5v9h-6v8H22v-8h-6v-9h5z"/>
<path fill="#536d7b" d="M22 40h5v14h-5zm21 0h3v7h-3z"/>
<path fill="#c5c2aa" d="M29 44h7v2h-2v6h-3v-6h-2z"/>
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
  { id:'naufal', name:'Naufal', title:'Angry count', label:'TOTAL MARAH', caption:'tarik napas. jangan banting monitor.', action:'TAMBAH MARAH', undo:'UDAH TENANG', accent:'#df542e', skin:'#efc39c', shirt:'#b65443', effect:'marah', sound:'anger', office:'Naufal panas. Satu meja langsung pura-pura sibuk.', reply:'Monitor kantor jangan dibanting, Fal.', calm:'Naufal tarik napas. Meja aman dulu.' },
  { id:'zikri', name:'Zikri', title:'Zikli count', label:'TOTAL ZIKLI', caption:'makin tinggi, makin berbunga-bunga.', action:'TAMBAH ZIKLI', undo:'NAPAK TANAH', accent:'#d64b88', skin:'#e9bc94', shirt:'#648875', effect:'berbunga', sound:'love', office:'Zikri berbunga-bunga. Love-nya sampai ke meja sebelah.', reply:'Kantor apa taman bunga nih?', calm:'Zikri napak tanah sebentar.' },
  // shortcut: Aji memakai draft rambut ikal dan jenggot, sesuaikan setelah referensi Sinan jelas.
  { id:'aji', name:'Aji', title:'Ngejokes ga lucu count', label:'JOKES GA LUCU', caption:'niatnya stand-up. jadinya stand alone.', action:'JOKES GA LUCU', undo:'KETAWA DIKIT', accent:'#597fba', skin:'#e5b38e', shirt:'#665b89', effect:'sedih', sound:'sad', office:'Aji lempar jokes. Suara AC mendadak paling kencang.', reply:'Hehe... semangat, Ji.', calm:'Ada yang ketawa. Aji punya harapan lagi.' },
  { id:'agung', name:'Agung', title:'Solat ga tepat waktu count', label:'TELAT SOLAT', caption:'dari halo ke tanduk. ayo tepat waktu.', action:'CATAT TELAT', undo:'UDAH TEPAT WAKTU', accent:'#a46cbd', skin:'#edc29c', shirt:'#ece5cf', effect:'iblis', sound:'devil', office:'Halo Agung mulai redup. Yasir muncul buat ngingetin.', reply:'Gung, ayo dulu. Meja bisa nunggu.', calm:'Agung mulai tepat waktu. Halo-nya balik sedikit.' },
];
export const levelOf = (state) => Math.min(15, Math.floor(state.count / state.step));

const moodTitles = {
  naufal:['B aja.','Mulai sebal.','Alis naik.','Sabar menipis.','Ngomel dikit.','Muka memanas.','Urat muncul.','Panas kepala.','Mulai ngebul.','Jangan disenggol.','Mode mendidih.','Api menyala.','Meja bergetar.','Nyaris meledak.','Evakuasi dulu.','MELEDAK!'],
  zikri:['Masih kalem.','Satu love.','Senyum sendiri.','Mulai berbunga.','Ada kupu-kupu.','Kepikiran terus.','Love ke mana-mana.','Bucin ringan.','Mata jadi love.','Taman berjalan.','Berbunga lebat.','Satu meja pink.','Love overload.','Melayang dikit.','Kantor kasmaran.','SEMESTA LOVE.'],
  aji:['Masih pede.','Nggak ada respons.','Ketawa sendiri.','Senyum dipaksa.','Mulai canggung.','Mata berkaca.','Satu air mata.','Jokes ditarik.','Awan mendung.','Mulai gerimis.','Nangis pelan.','Tisu habis.','Hujan air mata.','Butuh pelukan.','Banjir perasaan.','NANGIS KEJER.'],
  agung:['Masih malaikat.','Halo meredup.','Sayap kusam.','Tanduk mengintip.','Mulai berubah.','Aura menggelap.','Sayap berganti.','Mata memerah.','Halo makin tipis.','Ekor muncul.','Tanduk tumbuh.','Api kecil.','Aura iblis.','Sayap gelap.','Halo hampir habis.','MODE IBLIS.'],
};
export function conditionFor(person, level) {
  if (person.id === 'jonathan') return jonathanConditions[level];
  const phase = Math.min(3, Math.floor(level / 4));
  const lines = {
    naufal:[['Gue biasa aja.','Biasa aja, katanya.'],['Siapa yang mulai?','Volume mulai naik.'],['JANGAN SEKARANG.','Jaga jarak dari monitor.'],['UDAH, GUE PANAS!','Kantor butuh pemadam.']],
    zikri:[['Hari ini cerah ya.','Masih napak di lantai.'],['Kok jadi senyum ya?','Satu love jadi banyak.'],['Love you semua ♡','Sudah bukan kantor biasa.'],['Dunia indah banget!','Tolong jangan dipetik.']],
    aji:[['Gue punya jokes nih.','Masih optimis lucu.'],['Kok pada diem?','Tawa sedang buffering.'],['Hehe... nggak lucu ya.','Yang pecah cuma hati.'],['Ketawa dikit, plis.','Butuh tisu dan dukungan.']],
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
export function personSprite(id, inputLevel=0) {
  if (id === 'yasir') return `<svg class="person-svg ghost-svg" viewBox="0 0 64 90" role="img" aria-label="Yasir, hantu departemen sebelah" shape-rendering="crispEdges"><ellipse cx="32" cy="83" rx="19" ry="3" fill="#a9a4bf" opacity=".25"/><g class="pixel-person"><path fill="#b3acd0" d="M23 16h18v3h6v6h4v42h-4v7h-6v-5h-6v7h-6v-7h-6v5h-7v-7h-4V25h4v-6h7z"/><path fill="#eeeafa" d="M24 20h16v3h6v6h2v34h-4v7h-3v-6h-9v8h-3v-8h-9v5h-3V29h2v-6h5z"/><path fill="#625a7e" d="M22 32h5v7h-5zm15 0h5v7h-5zm-8 12h7v6h-7z"/><path fill="#dad2ed" d="M18 44h5v14h-5zm23 0h5v14h-5z"/></g></svg>`;
  const person = people.find((entry)=>entry.id===id) || people[0];
  const level = Math.max(0,Math.min(15,inputLevel));
  let art = base.replaceAll('#f0c399', person.skin).replaceAll('#3f5668',person.shirt);
  if (id !== 'jonathan') art = art.replace(/<g class="injury" data-injury="\d+">[\s\S]*?<\/g>/g,'');
  else art = art.replace(/class="injury" data-injury="(\d+)"/g,(_,value)=>`class="injury${Number(value)<=level?' visible':''}" data-injury="${value}"`);
  let behind = '', front = '';
  if (id === 'naufal') {
    art = art.replaceAll(person.skin,mix([239,195,156],[225,78,54],level/15)).replaceAll('#46362e','#292630');
    front += '<path fill="none" stroke="#25232a" stroke-width="1.5" d="M21 21h10v8H21zm13 0h10v8H34zm-3 3h3m-16-1h4m22 0h4"/>';
    if (level) front += `<path fill="#302a2a" d="M22 18l8 ${Math.min(5,level/3)}v2l-8-2zm13 ${Math.min(5,level/3)}l8-${Math.min(5,level/3)}v2l-8 2z"/>`;
    for(let i=0;i<Math.ceil(level/3);i++) behind += `<path class="flame flame-${i%2}" transform="translate(${10+i*9} ${4-Math.min(level,10)})" fill="${i%2?'#f3ae3f':'#ec6036'}" d="M0 14V8h2V4h2V0h2v6h2v4h2v6H0z"/>`;
    if(level>=12) front += '<path fill="#ea593b" d="M4 28H0v-3h6zm51-5h8v3h-8zM9 10H5V6h4zm44 0h4V6h-4z"/>';
  }
  if (id === 'zikri') {
    const points=[[3,8],[52,13],[0,30],[55,35],[7,47],[49,53],[15,0],[42,2],[2,62],[54,68],[20,49],[40,43],[10,21],[46,24],[29,0]];
    points.slice(0,level).forEach(([x,y],index)=>{front+=`<g class="floating-love love-${index%3}">${heart(x,y,index%3===0?1.1:.8)}</g>`;});
    if(level>=8) front += heart(23,21,.6)+heart(36,21,.6);
  }
  if (id === 'aji') {
    front += '<path fill="#352b2a" d="M18 13h3V9h4V7h4v2h4V7h4v3h5v3h4v6h-5v-3h-5v2h-5v-3h-5v3h-8zM23 31h3v4h13v-4h3v5h-3v3H26v-3h-3z"/>';
    if(level) {
      art=art.replace(/<path class="normal-mouth"[^>]*\/>/,'');
      front += '<path fill="none" stroke="#68423e" stroke-width="2" d="M27 34v-2h3v-2h6v2h3v2"/>';
    }
    for(let i=0;i<level;i++) front += `<rect class="tear tear-${i%3}" x="${i%2?38:23}" y="${27+(i%5)*3}" width="${level>9?3:2}" height="${2+Math.floor(level/5)}" fill="#73afcc" opacity="${.45+level/30}"/>`;
    if(level>=8) behind += `<path fill="#a8b5c6" d="M20 1h6v-3h13v3h7v6H17V3h3z"/><ellipse cx="32" cy="75" rx="${9+level}" ry="2" fill="#8dbbc8" opacity=".5"/>`;
  }
  if (id === 'agung') {
    const ratio=level/15;
    art=art.replaceAll(person.shirt,mix([236,229,207],[106,48,65],ratio)).replaceAll('#46362e','#252b27').replaceAll('#665042','#353d32');
    behind+=`<g opacity="${1-ratio}"><path fill="#fff8e9" stroke="#d9c99b" stroke-width="1" d="M19 39L7 30v17l11 8zm26 0 12-9v17L46 55z"/><ellipse cx="32" cy="1" rx="11" ry="3" fill="none" stroke="#d8ad49" stroke-width="2"/></g><path fill="#7d465b" opacity="${ratio}" d="M19 40L3 31l3 20 5-6 7 12zm26 0 16-9-3 20-5-6-7 12z"/>`;
    front+='<path fill="#252b27" d="M18 13h3V9h22v4h4v8H17v-8zm-1 8h4v7h-4zm26 0h4v7h-4z"/>';
    if(level>=3) front+=`<path fill="#b9504c" d="M21 13V${12-level/2}l5 8zm17 0 5-${5+level/2}v${5+level/2}z"/>`;
    if(level>=7) front+='<path fill="#d54e44" d="M24 23h3v3h-3zm13 0h3v3h-3z"/>';
    if(level>=9) behind+='<path fill="none" stroke="#b9504c" stroke-width="2" d="M43 58h11v-9h5v-5"/><path fill="#b9504c" d="M55 45l4-7 4 7z"/>';
    for(let i=0;i<Math.max(0,level-10);i++) behind+=`<path class="flame" transform="translate(${8+i*10} 64)" fill="#dc8148" d="M0 10V5h2V0h2v5h3v7H0z"/>`;
  }
  if(id==='zikri') {
    const split=art.indexOf('<path fill="#302a2a" d="M21 5');
    art=`<g transform="translate(0 -2) scale(1 1.16)">${art.slice(0,split)}</g>${art.slice(split)}`;
  }
  const classes=['person-svg',id==='jonathan'&&level>=4?'hurt-eyes':'',id==='jonathan'&&level>=3?'hurt-mouth':'',level>=14?'dazed':'',`mood-${id}`].join(' ');
  return `<svg class="${classes}" viewBox="0 0 64 90" role="img" aria-label="${person.name}, level ${level} dari 15" shape-rendering="crispEdges"><ellipse cx="32" cy="86" rx="24" ry="3" fill="#d8cdb8"/><g class="pixel-person" transform="translate(0 ${id==='zikri'?0:10})">${behind}${art}${front}</g></svg>`;
}
