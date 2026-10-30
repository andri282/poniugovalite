# Panduan Setup Google Sheets Sebagai Database PO Motor

Web apps rekap PO motor ini dirancang agar dapat langsung berjalan di **GitHub Pages** (gratis tanpa server) dan menggunakan **Google Sheets** sebagai database online real-time.

Dengan Google Sheets:
- Anda dan tim bisa memantau dan mengedit data langsung dari Excel/Google Sheets di HP atau laptop.
- Form pendaftaran di web akan otomatis menambahkan baris baru ke Google Sheet.
- Setiap kali web dibuka, data akan disinkronkan secara real-time.

---

## 📋 Struktur Kolom Spreadsheet

Nama Tab / Sheet: **`Data_PO`**  
*(Catatan: Jika Anda membuat spreadsheet baru dan membiarkannya kosong, script akan **otomatis membuatkan nama tab dan 10 header kolom ini** saat data pertama kali dikirim. Namun jika Anda ingin menyiapkannya secara manual terlebih dahulu, berikut daftar kolomnya di baris ke-1):*

| Kolom | Nama Kolom Header | Tipe Data | Keterangan & Contoh Isi |
| :---: | :--- | :--- | :--- |
| **A** | `ID` | Teks | Kode pesanan unik (contoh: `PO-20261030-001`) |
| **B** | `Timestamp` | Tanggal/Waktu | Waktu pendaftaran (contoh: `2026-10-30 10:15:00`) |
| **C** | `Nama Pemesan` | Teks | Nama lengkap pembeli (contoh: `Fikri`) |
| **D** | `No. WhatsApp / HP` | Teks | Nomor HP/WA aktif (contoh: `082298025436`) |
| **E** | `Alamat / Kota` | Teks | Kota tujuan (contoh: `Bekasi`) |
| **F** | `Luar Kota` | Teks | `Ya` (tambah Rp50.000/unit) atau `Tidak` |
| **G** | `Jumlah Unit` | Angka | Jumlah motor yang dipesan (contoh: `5`) |
| **H** | `Catatan / Request` | Teks | Catatan khusus (contoh: `warna putih`, `SS lengkap`) |
| **I** | `Status Bayar` | Teks | `Belum Bayar`, `DP`, atau `Lunas` |
| **J** | `Total Biaya (Rp)` | Angka | Total tagihan (contoh: `14250000`) |

---

### 💡 Contoh Tampilan 5 Baris Pertama di Google Sheets:

| ID | Timestamp | Nama Pemesan | No. WhatsApp / HP | Alamat / Kota | Luar Kota | Jumlah Unit | Catatan / Request | Status Bayar | Total Biaya (Rp) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PO-20261030-001` | 2026-10-30 10:15:00 | Fikri | 082298025436 | Bekasi | Ya | 5 | | Belum Bayar | 14250000 |
| `PO-20261030-002` | 2026-10-30 10:30:00 | Wahyu | 08112520099 | Jepara | Ya | 1 | | Belum Bayar | 2850000 |
| `PO-20261030-003` | 2026-10-30 11:05:00 | Dzaki | 08956010640102 | Sleman | Ya | 2 | | Belum Bayar | 5700000 |
| `PO-20261030-004` | 2026-10-30 11:20:00 | Rujik JCP | 081519007466 | Jombang | Ya | 1 | | Belum Bayar | 2850000 |
| `PO-20261030-005` | 2026-10-30 12:00:00 | Jimmy Febri | 081919459599 | Depok | Tidak | 2 | | DP | 5600000 |

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi: [https://sheets.new](https://sheets.new)
2. Beri judul spreadsheet Anda, misalnya: **Database PO Motor Bekas PT**
3. Ganti nama tab di pojok kiri bawah menjadi: **`Data_PO`** *(atau biarkan default `Sheet1`, script akan otomatis mendeteksi)*.
4. Anda bisa mengisi baris ke-1 dengan 10 judul kolom di atas, atau biarkan kosong dan biarkan script yang mengisinya secara otomatis.

---

## Langkah 2: Buka Apps Script
1. Di Google Sheets, klik menu **Extensions (Ekstensi)** > **Apps Script**.
2. Anda akan diarahkan ke halaman editor kode Google Apps Script.
3. Hapus semua teks bawaan (`function myFunction() { ... }`).
4. Buka file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), salin semua kodenya, dan paste ke editor Apps Script tersebut.
5. Klik ikon **Save** (Disket) atau tekan `Ctrl + S` / `Cmd + S`.

---

## Langkah 3: Deploy Sebagai Web App (Aplikasi Web)
1. Di sudut kanan atas Apps Script, klik tombol biru **Deploy** > pilih **New deployment** (Penerapan baru).
2. Di sebelah tulisan "Select type", klik ikon gerigi ⚙️ lalu pilih **Web app**.
3. Isi form berikut:
   - **Description**: `PO Motor API v1`
   - **Execute as**: **Me (email Google Anda)**
   - **Who has access**: **Anyone** *(PENTING: Wajib pilih "Anyone" / "Siapa saja" agar web GitHub Pages dan pembeli dapat mengirim & membaca data tanpa hambatan login akun Google).*
4. Klik tombol **Deploy**.
5. Jika muncul jendela otorisasi izin akun Google:
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) di bagian kiri bawah.
   - Klik **Go to (Untitled project) (unsafe)** / **Buka project (tidak aman)**.
   - Klik **Allow** (Izinkan).
6. Google akan memberikan **Web app URL** (berakhiran `/exec`).
   Contoh format URL:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. **Salin / Copy URL tersebut!**

---

## Langkah 4: Sambungkan ke Web App
1. Buka web app rekap PO Anda (di browser lokal atau setelah deploy ke GitHub Pages).
2. Klik tombol **⚙️** (Pengaturan) di pojok kanan atas navbar.
3. Tempelkan URL Web App yang tadi disalin ke kolom **URL Google Apps Script**.
4. Klik tombol **Simpan Pengaturan**.
5. Klik tombol **"📤 Upload Data Lokal ke Google Sheet"** jika Anda ingin langsung mengirim 10 pemesan bawaan ke Google Sheet Anda.
6. Klik tombol **"🔄 Tarik Data dari Google Sheet"** untuk mengetes pengambilan data. Jika status di navbar berubah menjadi hijau 🟢 **Google Sheets Aktif**, berarti database Anda sudah 100% online dan terhubung!
