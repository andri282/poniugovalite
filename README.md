# Web App Rekap PO Motor Bekas PT 🛵⚡

Aplikasi web modern, responsif, dan real-time untuk merekap pemesanan pre-order (PO) unit motor listrik bekas PT dengan target wajib take all **300 unit**.

Dibuat khusus agar dapat di-host secara gratis di **GitHub Pages** dengan database online real-time memanfaatkan **Google Sheets** (tanpa perlu server berbayar).

---

## 🌟 Fitur Utama

1. **Dashboard & Summary Real-time di Bagian Atas**:
   - **Progress Bar Visual**: Menampilkan persentase pencapaian kuota menuju target 300 unit.
   - **Statistik Utama**:
     - Total unit terpesan (sementara 168 unit)
     - Sisa unit menuju target take all (132 unit)
     - Jumlah pemesan (137 orang)
     - Estimasi nilai PO terkumpul
   - **Filter Status Pembayaran**: Pil status interaktif (Lunas, DP / Sebagian, Belum Bayar).

2. **Ketentuan & Spesifikasi PO**:
   - Harga: Rp 2.800.000 / unit (Motor only, tanpa baterai)
   - Fisik random, Surat-Surat (SS) Lengkap
   - Controller sudah unlock, tinggal pasang baterai 60V
   - Pemilihan unit luar kota: +Rp 50.000 / unit
   - Target wajib take all: 300 unit

3. **Form Pendaftaran / Ikut PO (Akses Publik)**:
   - Pengunjung web dapat langsung mendaftarkan diri.
   - Input: Nama, No. WhatsApp, Alamat / Kota, Opsi Luar Kota, Jumlah Unit (dengan stepper +/-), Catatan, dan Status Bayar.
   - **Kalkulator Biaya Otomatis**: Menghitung subtotal unit dan biaya luar kota secara instan.
   - **Konfirmasi WhatsApp Otomatis**: Setelah submit, tombol langsung membuka WhatsApp Admin dengan pesan konfirmasi yang sudah terformat rapi.

4. **Daftar Pemesan Interaktif**:
   - Tabel pemesan dengan nomor urut, nama, kota, jumlah unit, dan nominal.
   - Tombol cepat **Chat WhatsApp** pada setiap nomor HP pemesan (berwarna hijau seperti di catatan Anda).
   - Pencarian real-time (Nama, No HP, Kota/Alamat, Catatan).
   - Filter dropdown status pembayaran.
   - Pagination untuk kenyamanan melihat ratusan pemesan.

5. **Fitur Admin & Manajemen Data**:
   - **Mode Admin (PIN: `admin123`)**: Klik status pembayaran langsung di tabel untuk mengubah (Belum Bayar ⇄ DP ⇄ Lunas) atau menghapus data.
   - **Impor Data Massal**: Cukup paste catatan daftar teks (misal: `11. Budi — Semarang — 08123... — 2 unit`), sistem otomatis mengekstrak nama, nomor HP, kota, dan unit ke dalam tabel!
   - **Export ke Excel / CSV**: Unduh seluruh daftar pemesan dalam format CSV dengan 1 klik.
   - **Salin Rekap WhatsApp**: Format broadcast WhatsApp otomatis siap kirim ke grup.

6. **Integrasi Google Sheets (Gratis & Real-time)**:
   - Terhubung dengan Google Sheets via Google Apps Script.
   - Data tersimpan aman di Google Drive Anda dan dapat diedit langsung dari Google Sheets di HP atau laptop.

---

## 🚀 Cara Pasang di GitHub Pages

1. **Push kode ini ke repositori GitHub Anda**:
   ```bash
   git add .
   git commit -m "feat: Rekap PO Motor Bekas PT web app"
   git push origin main
   ```
2. Di halaman repositori GitHub Anda, buka menu **Settings** > **Pages** (di sidebar kiri).
3. Di bagian **Build and deployment**:
   - Source: Pilih **Deploy from a branch**
   - Branch: Pilih **`main`** dan folder **`/(root)`**
   - Klik **Save**
4. Tunggu 1–2 menit, web Anda akan online di:
   `https://<username-github>.github.io/<nama-repo>/`

---

## 📊 Cara Menghubungkan Google Sheets

### Struktur Kolom Spreadsheet (Tab: `Data_PO`)

| Kolom | Header | Tipe Data | Keterangan & Contoh |
| :---: | :--- | :--- | :--- |
| **A** | `ID` | Teks | Kode pesanan unik (contoh: `PO-20261030-001`) |
| **B** | `Timestamp` | Tanggal/Waktu | Waktu pendaftaran (contoh: `2026-10-30 10:15:00`) |
| **C** | `Nama Pemesan` | Teks | Nama lengkap (contoh: `Fikri`) |
| **D** | `No. WhatsApp / HP` | Teks | Nomor HP/WA (contoh: `082298025436`) |
| **E** | `Alamat / Kota` | Teks | Kota tujuan (contoh: `Bekasi`) |
| **F** | `Luar Kota` | Teks | `Ya` (+Rp 50.000/unit) atau `Tidak` |
| **G** | `Jumlah Unit` | Angka | Jumlah motor yang dipesan (contoh: `5`) |
| **H** | `Catatan / Request` | Teks | Catatan khusus (contoh: `warna putih`) |
| **I** | `Status Bayar` | Teks | `Belum Bayar`, `DP`, atau `Lunas` |
| **J** | `Total Biaya (Rp)` | Angka | Total tagihan rupiah (contoh: `14250000`) |

> **Catatan Praktis**: Jika Anda membuat spreadsheet baru dan membiarkannya kosong, script backend akan **otomatis membuatkan nama tab `Data_PO` dan seluruh 10 judul kolom di atas** saat data pertama kali dikirimkan!

Silakan ikuti panduan lengkap langkah demi langkah di file:
👉 **[TUTORIAL_SETUP_GOOGLE_SHEETS.md](./TUTORIAL_SETUP_GOOGLE_SHEETS.md)**

Kode Google Apps Script yang siap di-copy-paste tersedia di:
👉 **[`google-apps-script/Code.gs`](./google-apps-script/Code.gs)**

---

## 🛠️ Struktur Folder

```
poniugovalite/
├── index.html                     # Halaman utama aplikasi web
├── css/
│   └── style.css                  # Desain modern dark mode & responsive
├── js/
│   └── app.js                     # Logika rekap, kalkulasi, sinkronisasi Google Sheets
├── google-apps-script/
│   └── Code.gs                    # Backend script untuk Google Sheets
├── TUTORIAL_SETUP_GOOGLE_SHEETS.md# Panduan integrasi Google Sheets
└── README.md                      # Dokumentasi project
```
