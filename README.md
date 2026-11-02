# Kantor Count

Satu kantor pixel dari atas, lima counter bersama, dan enam penghuni. URL proyek tetap `larping-count.vercel.app`.

| Karakter | Counter | Ciri dan progres |
| --- | --- | --- |
| Jonathan | Larping count | Kulit putih, makin bonyok |
| Naufal | Angry count | Kacamata, makin merah, berapi, dan meledak |
| Zikri | Zikli count | Lebih tinggi, makin penuh love |
| Aji | Ngejokes ga lucu count | Rambut ikal dan jenggot tipis, makin sedih dan menangis |
| Agung | Solat ga tepat waktu count | Rambut mangkuk Rock Lee, malaikat berubah jadi iblis |
| Yasir | Tanpa counter | Hantu yang sudah pindah departemen, bisa diajak ngobrol |

Tab **Kantor** menampilkan meja persegi panjang dengan enam kursi, monitor, kursi kerja, dan tanaman. Klik penghuni atau daftar di samping untuk memilih target tombol `+1`/`−1`; nama target selalu tampil di atas tombol. **Lihat detail** dan tab nama membuka arena karakter. Mood mengikuti counter dan saling merespons lewat balon percakapan. Yasir hanya memberi dialog, tanpa mengubah counter. Pilihan karakter bisa dibagikan lewat hash, misalnya `#naufal` atau `#kantor`.

## Perilaku

- `+1` menambah counter karakter yang dipilih, dengan efek visual dan suara sesuai karakter. Setiap karakter punya counter dan kelipatan sendiri.
- Setiap kelipatan 3 menaikkan level damage. Kelipatan bisa diganti menjadi 1–1.000.
- Ada 15 level reaksi visual sesuai karakter: bonyok, marah, love, menangis, atau berubah menjadi iblis. Level setiap karakter berhenti di 15; counter tetap bertambah. Dengan kelipatan default 3, level 15 tercapai di 45 larp.
- `−1 · Udah minta maaf` mengurangi counter bersama satu angka, minimal 0. Level dan luka ikut pulih ketika melewati batas kelipatan. Tombol ini terbuka untuk semua pengunjung.
- Combo lokal menghitung hit yang dikonfirmasi berurutan dalam 2,2 detik. Combo hanya efek permainan, tidak menggandakan penambahan counter.
- Ada partikel, animasi kena hit/pulih, progres level, dan banner naik level. `prefers-reduced-motion` mengurangi animasi.
- Suara arcade dibuat dengan Web Audio setelah interaksi pengguna; tombol sound/mute tersimpan per browser. Pembaruan dari pengunjung lain tidak mengeluarkan suara.
- Desktop menempatkan karakter besar di tengah, counter di kiri, kondisi di kanan, dan utilitas di kanan atas. Di HP, panel ringkas di atas karakter menjaga tombol utama terlihat; layar sangat pendek dapat digulir.
- Reset hanya mengembalikan counter karakter yang dipilih ke 0; kelipatan dan counter orang lain tidak diubah.
- Reset dan setting selalu memerlukan password yang diverifikasi di server.
- Pengunjung lain menerima pembaruan paling lambat sekitar 8 detik ketika tab aktif.
- Counter disimpan di Redis. Jonathan tetap memakai key lama `larping-count:state`, sehingga data sebelumnya tidak direset atau dipindah. Empat karakter lain memakai key terpisah. Satu Lua script memperbarui target dan mengembalikan snapshot kelima counter secara atomik.

## Lokal

Butuh Node.js 22. Tidak ada dependency yang perlu di-install.

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `ADMIN_PASSWORD` dengan password yang ditentukan pemilik.
3. Isi `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` dari database Upstash Redis. Gunakan token read/write, bukan readonly.
4. Jalankan `npm run dev`, lalu buka `http://localhost:3000`.

Tanpa konfigurasi Redis, halaman tetap bisa dibuka tetapi tombol `+1` dinonaktifkan dan pesan setup ditampilkan. Tidak ada fallback counter lokal agar angka tidak terpecah.

## Deploy ke Vercel

1. Import repository ini di Vercel dengan framework preset **Other**. `vercel.json` sudah mengatur output `public`; tidak diperlukan build command.
2. Buat atau hubungkan Upstash Redis melalui Vercel Marketplace. Pilih paket dan batas biaya yang sesuai; aplikasi tidak otomatis membuat layanan berbayar.
3. Integrasi Upstash Vercel otomatis mengisi `KV_REST_API_URL` dan `KV_REST_API_TOKEN`; aplikasi langsung mendukung keduanya. Untuk setup manual, gunakan `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` dari `.env.example`.
4. Isi `ADMIN_PASSWORD` dengan password yang ditentukan pemilik pada environment Production (dan Preview jika dibutuhkan).
5. Deploy atau redeploy setelah environment variable disimpan.

Password tidak disertakan dalam source atau frontend. `.env.local` diabaikan Git. Mengganti password cukup melalui environment variable lalu redeploy.

Preview yang memakai database Production akan mengubah counter Production juga. Gunakan database terpisah jika ingin menguji tanpa menyentuh angka publik.

## Tes oleh pemilik

Tes belum dijalankan atas permintaan pemilik. Test API dan variasi karakter tersedia lewat `npm test`; tes API memakai mock sehingga tidak menyentuh database.

Cek manual yang disarankan:

- Buka dua browser: pilih Naufal dan klik `+1`. Naufal harus tersinkron tanpa mengubah Jonathan, Zikri, Aji, atau Agung.
- Buka Kantor: pilih tiap orang, lihat target tombol, kondisi di meja, balon respons, dan tab detail. Klik Yasir untuk dialog hantu.
- Cek kacamata Naufal, tubuh tinggi Zikri, kulit Jonathan, rambut Agung, serta tema visual sampai level 15.
- Reset dan ubah setting satu karakter; pastikan karakter lain tetap sama dan data Jonathan lama masih ada.
- Klik sampai setiap kelipatan 3 hingga 45 untuk melihat 15 tahap bonyok; setelah 45, level tetap 15 dan counter lanjut.
- Klik `−1` sampai 0: angka tidak boleh negatif; cek dua browser untuk memastikan pengurangan tersinkron dan level ikut pulih.
- Cek combo, suara hit/naik level/pulih, tombol mute, dan preferensi suara setelah refresh.
- Password salah harus menolak reset dan setting tanpa mengubah data.
- Ubah kelipatan ke 2: kondisi langsung dihitung ulang dari counter yang sama.
- Reset dengan password yang benar: semua browser kembali 0, kelipatan tetap.
- Refresh atau buka kembali: counter tetap tersimpan.
- Periksa tampilan mobile dan navigasi keyboard; animasi mengikuti `prefers-reduced-motion`.

## Batas sederhana

Tombol `+1` dan `−1` memang terbuka untuk siapa saja; ini counter iseng, bukan sistem voting anti-bot. Satu browser menunggu konfirmasi perubahan sebelum mengirim perubahan berikutnya. Jika koneksi putus setelah request dikirim, aplikasi tidak mengulang otomatis dan menunggu sinkronisasi sebelum mengaktifkan tombol lagi.

Dokumentasi platform: [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js) dan [Upstash REST API](https://upstash.com/docs/redis/features/restapi).
