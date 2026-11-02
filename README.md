# Larping Count

Satu Jonathan, satu tombol `+1`, satu counter untuk semua pengunjung.

## Perilaku

- `+1` menambah counter bersama dan memberi Jonathan animasi damage.
- Setiap kelipatan 3 menaikkan level damage. Kelipatan bisa diganti menjadi 1–1.000.
- Ada enam tahap luka visual, lalu tampilan bonyok maksimal. Counter dan level tetap bertambah.
- Reset mengembalikan counter ke 0 dan memulihkan Jonathan; kelipatan tidak diubah.
- Reset dan setting selalu memerlukan password yang diverifikasi di server.
- Pengunjung lain menerima pembaruan paling lambat sekitar 8 detik ketika tab aktif.
- Counter disimpan di Redis, bukan memori function atau browser. Penambahan menggunakan Lua atomik agar klik bersamaan tidak hilang.

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

Tes belum dijalankan atas permintaan pemilik. Test API ringan tersedia lewat `npm test`; tes ini memakai mock sehingga tidak menyentuh database.

Cek manual yang disarankan:

- Buka dua browser: `+1` di satu browser harus tersinkron ke browser lain.
- Klik sampai 3, 6, 9, 12, 15, dan 18 untuk melihat enam tahap bonyok.
- Password salah harus menolak reset dan setting tanpa mengubah data.
- Ubah kelipatan ke 2: kondisi langsung dihitung ulang dari counter yang sama.
- Reset dengan password yang benar: semua browser kembali 0, kelipatan tetap.
- Refresh atau buka kembali: counter tetap tersimpan.
- Periksa tampilan mobile dan navigasi keyboard; animasi mengikuti `prefers-reduced-motion`.

## Batas sederhana

Tombol `+1` memang terbuka untuk siapa saja; ini counter iseng, bukan sistem voting anti-bot. Satu browser menunggu konfirmasi hit sebelum mengirim hit berikutnya. Jika koneksi putus setelah request dikirim, aplikasi tidak mengulang hit otomatis agar tidak menambah dua kali; tunggu sinkronisasi untuk melihat angka yang tersimpan.

Dokumentasi platform: [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js) dan [Upstash REST API](https://upstash.com/docs/redis/features/restapi).
