/**
 * =========================================================================
 * PO MOTOR BEKAS PT - CORE JAVASCRIPT APPLICATION
 * State Management, Real-time Calculations, 168 Real Orders Preloaded, WhatsApp
 * =========================================================================
 */

(function () {
  'use strict';

  // Constants
  const STORAGE_KEY_ORDERS = 'po_motor_orders_real_v2';
  const STORAGE_KEY_CONFIG = 'po_motor_config_v2';
  const DEFAULT_TARGET_UNITS = 300;
  const UNIT_PRICE = 2800000;
  const LUAR_KOTA_SURCHARGE = 50000;

  // Real Dataset from data real.txt (All 168 pemesan, status Belum Bayar)
  const SEED_ORDERS = [
  {
    "id": "PO-20261030-001",
    "nomorUrut": 1,
    "originalNum": 1,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fikri",
    "noHp": "082298025436",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 5,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 14000000
  },
  {
    "id": "PO-20261030-002",
    "nomorUrut": 2,
    "originalNum": 2,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Wahyu",
    "noHp": "08112520099",
    "alamat": "Jepara, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-003",
    "nomorUrut": 3,
    "originalNum": 3,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dzaki",
    "noHp": "08956010640102",
    "alamat": "Sleman, DIY",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-004",
    "nomorUrut": 4,
    "originalNum": 4,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rujik Jcp",
    "noHp": "081519007466",
    "alamat": "Jombang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-005",
    "nomorUrut": 5,
    "originalNum": 5,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Jimmy Febri",
    "noHp": "081919459599",
    "alamat": "Depok",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-006",
    "nomorUrut": 6,
    "originalNum": 6,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Anggra",
    "noHp": "082338864091",
    "alamat": "Probolinggo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-007",
    "nomorUrut": 7,
    "originalNum": 7,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Puja",
    "noHp": "081317767173",
    "alamat": "Pandeglang, Banten",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-008",
    "nomorUrut": 8,
    "originalNum": 8,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Andif",
    "noHp": "081249958558",
    "alamat": "Gresik, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-009",
    "nomorUrut": 9,
    "originalNum": 9,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Hasan Basri",
    "noHp": "081554415688",
    "alamat": "Jombang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-010",
    "nomorUrut": 10,
    "originalNum": 10,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rudi",
    "noHp": "08984167725",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-011",
    "nomorUrut": 11,
    "originalNum": 11,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Anam",
    "noHp": "08996672675",
    "alamat": "Karawang, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-012",
    "nomorUrut": 12,
    "originalNum": 12,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Kurniawan",
    "noHp": "0895634341337",
    "alamat": "DIY Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-013",
    "nomorUrut": 13,
    "originalNum": 13,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ipnu Eko Yulianto",
    "noHp": "085725520647",
    "alamat": "Purbalingga, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-014",
    "nomorUrut": 14,
    "originalNum": 14,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Wanto",
    "noHp": "085163100631",
    "alamat": "Gunung Sindur, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-015",
    "nomorUrut": 15,
    "originalNum": 15,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dony Susanto",
    "noHp": "089678888328",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-016",
    "nomorUrut": 16,
    "originalNum": 16,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ikbal",
    "noHp": "081219326005",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-017",
    "nomorUrut": 17,
    "originalNum": 17,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Yuyun",
    "noHp": "085157980775",
    "alamat": "Cibinong, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-018",
    "nomorUrut": 18,
    "originalNum": 18,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Edi",
    "noHp": "082326478600",
    "alamat": "Cikarang, Bekasi",
    "luarKota": false,
    "jumlahUnit": 5,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 14000000
  },
  {
    "id": "PO-20261030-019",
    "nomorUrut": 19,
    "originalNum": 19,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Aldian",
    "noHp": "081335446033",
    "alamat": "Tulungagung, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-020",
    "nomorUrut": 20,
    "originalNum": 20,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ryan",
    "noHp": "085889492589",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-021",
    "nomorUrut": 21,
    "originalNum": 21,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Aries",
    "noHp": "085719087887",
    "alamat": "Semarang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-022",
    "nomorUrut": 22,
    "originalNum": 22,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Barry",
    "noHp": "087774564772",
    "alamat": "Tangerang Selatan",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-023",
    "nomorUrut": 23,
    "originalNum": 23,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Anto",
    "noHp": "6283873160535",
    "alamat": "Pekanbaru, Riau",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-024",
    "nomorUrut": 24,
    "originalNum": 24,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Iwan",
    "noHp": "085136007778",
    "alamat": "Jember, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-025",
    "nomorUrut": 25,
    "originalNum": 25,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Santu",
    "noHp": "081808889944",
    "alamat": "Tangerang Selatan",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-026",
    "nomorUrut": 26,
    "originalNum": 26,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dani",
    "noHp": "085956576856",
    "alamat": "Jakarta Timur",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-027",
    "nomorUrut": 27,
    "originalNum": 27,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dani",
    "noHp": "089513369195",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-028",
    "nomorUrut": 28,
    "originalNum": 28,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Miftachul",
    "noHp": "085701180675",
    "alamat": "Cilacap, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-029",
    "nomorUrut": 29,
    "originalNum": 29,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus Tri Wibowo",
    "noHp": "0811236123",
    "alamat": "DIY Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 7,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 19950000
  },
  {
    "id": "PO-20261030-030",
    "nomorUrut": 30,
    "originalNum": 30,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Yanuar",
    "noHp": "082111928509",
    "alamat": "Pelabuhan Ratu, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-031",
    "nomorUrut": 31,
    "originalNum": 31,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus Tri Wibowo",
    "noHp": "0811236123",
    "alamat": "DIY Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 6,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 17100000
  },
  {
    "id": "PO-20261030-032",
    "nomorUrut": 32,
    "originalNum": 32,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Muhammad Hanif",
    "noHp": "089639521630",
    "alamat": "Rembang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-033",
    "nomorUrut": 33,
    "originalNum": 33,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ikhlas",
    "noHp": "081250123988",
    "alamat": "Banjarbaru, Kalsel",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-034",
    "nomorUrut": 34,
    "originalNum": 34,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Iwan Novi",
    "noHp": "081234324545",
    "alamat": "Bojonegoro, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-035",
    "nomorUrut": 35,
    "originalNum": 35,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Yanuar D.R",
    "noHp": "085733532552",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-036",
    "nomorUrut": 36,
    "originalNum": 36,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Mmt",
    "noHp": "085700800711",
    "alamat": "Blitar, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-037",
    "nomorUrut": 37,
    "originalNum": 37,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Adi",
    "noHp": "082337447742",
    "alamat": "Sidoarjo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-038",
    "nomorUrut": 38,
    "originalNum": 38,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ridwan Teknik",
    "noHp": "085786282000",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-039",
    "nomorUrut": 39,
    "originalNum": 39,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Idrusefendy",
    "noHp": "082122958835",
    "alamat": "Sidoarjo, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-040",
    "nomorUrut": 40,
    "originalNum": 40,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sugeng Santoso",
    "noHp": "081228444880",
    "alamat": "Cilacap, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-041",
    "nomorUrut": 41,
    "originalNum": 41,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Huda",
    "noHp": "085742822441",
    "alamat": "Semarang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-042",
    "nomorUrut": 42,
    "originalNum": 42,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Zakaria",
    "noHp": "085649594499",
    "alamat": "Blitar, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-043",
    "nomorUrut": 43,
    "originalNum": 43,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fitrah",
    "noHp": "082231426926",
    "alamat": "Tangerang",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-044",
    "nomorUrut": 44,
    "originalNum": 44,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fadjrin",
    "noHp": "085241733777",
    "alamat": "Makassar, Sulsel",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-045",
    "nomorUrut": 45,
    "originalNum": 45,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sugeng",
    "noHp": "085214864101",
    "alamat": "Cikarang, Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-046",
    "nomorUrut": 46,
    "originalNum": 46,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Koko",
    "noHp": "085888080364",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-047",
    "nomorUrut": 47,
    "originalNum": 47,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus Tri Wibowo",
    "noHp": "0811236123",
    "alamat": "DIY Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 5,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 14250000
  },
  {
    "id": "PO-20261030-048",
    "nomorUrut": 48,
    "originalNum": 48,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Bahruddin",
    "noHp": "",
    "alamat": "Pasuruan, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "minta utuh",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-049",
    "nomorUrut": 49,
    "originalNum": 49,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Cecep Abdul",
    "noHp": "0895359262226",
    "alamat": "Karawang, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-050",
    "nomorUrut": 50,
    "originalNum": 50,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Eswe",
    "noHp": "085774002122",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-051",
    "nomorUrut": 51,
    "originalNum": 51,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Prasetyo",
    "noHp": "08112580374",
    "alamat": "Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-052",
    "nomorUrut": 52,
    "originalNum": 52,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Johan",
    "noHp": "083812826929",
    "alamat": "Kab. Tangerang",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-053",
    "nomorUrut": 53,
    "originalNum": 53,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Hari",
    "noHp": "085646411012",
    "alamat": "Sidoarjo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-054",
    "nomorUrut": 54,
    "originalNum": 54,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rudy",
    "noHp": "085239766001",
    "alamat": "Sleman, DIY",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, silver",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-055",
    "nomorUrut": 55,
    "originalNum": 55,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Abdillah",
    "noHp": "",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-056",
    "nomorUrut": 56,
    "originalNum": 56,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Donnie Damari",
    "noHp": "08123573514",
    "alamat": "Surabaya, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-057",
    "nomorUrut": 57,
    "originalNum": 57,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Arlego",
    "noHp": "0817278691",
    "alamat": "Kebumen, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-058",
    "nomorUrut": 58,
    "originalNum": 58,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Slamet Suryono",
    "noHp": "081357598766",
    "alamat": "Gresik, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-059",
    "nomorUrut": 59,
    "originalNum": 59,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Jimmy",
    "noHp": "081252197416",
    "alamat": "Sidoarjo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-060",
    "nomorUrut": 60,
    "originalNum": 60,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Devin",
    "noHp": "088825250880",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna merah (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-061",
    "nomorUrut": 61,
    "originalNum": 61,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Asep",
    "noHp": "089664735717",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-062",
    "nomorUrut": 62,
    "originalNum": 62,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus Zaenal",
    "noHp": "087778622577",
    "alamat": "Semarang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-063",
    "nomorUrut": 63,
    "originalNum": 63,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Pendi",
    "noHp": "085641411818",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-064",
    "nomorUrut": 64,
    "originalNum": 64,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Toye",
    "noHp": "085210212323",
    "alamat": "Kab. Bekasi",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah, abu-abu, abu (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-065",
    "nomorUrut": 65,
    "originalNum": 65,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dharmawan",
    "noHp": "08119783453",
    "alamat": "Jakarta Selatan",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-066",
    "nomorUrut": 66,
    "originalNum": 66,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Nardi",
    "noHp": "087888202999",
    "alamat": "Jakarta Barat",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-067",
    "nomorUrut": 67,
    "originalNum": 67,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Saga",
    "noHp": "089504669111",
    "alamat": "Surabaya, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-068",
    "nomorUrut": 68,
    "originalNum": 68,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus",
    "noHp": "081312212207",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-069",
    "nomorUrut": 69,
    "originalNum": 69,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Krisna Ghalih",
    "noHp": "082132185277",
    "alamat": "Madiun, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, abu-abu, abu (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-070",
    "nomorUrut": 70,
    "originalNum": 70,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Eko Dian",
    "noHp": "085726400999",
    "alamat": "Purwokerto, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-071",
    "nomorUrut": 71,
    "originalNum": 71,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Jefry",
    "noHp": "082298683018",
    "alamat": "Tangerang",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna merah, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-072",
    "nomorUrut": 72,
    "originalNum": 72,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Imam Sudrajat",
    "noHp": "083836777746",
    "alamat": "Cilacap, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-073",
    "nomorUrut": 73,
    "originalNum": 73,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Arif Eka",
    "noHp": "085724272515",
    "alamat": "Bantul, DIY",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-074",
    "nomorUrut": 74,
    "originalNum": 74,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Raden Sunarto",
    "noHp": "081328745751",
    "alamat": "Sleman, DIY",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-075",
    "nomorUrut": 75,
    "originalNum": 75,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Pramu Sudita",
    "noHp": "0811885766",
    "alamat": "Bojongkulur, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, merah, abu (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-076",
    "nomorUrut": 76,
    "originalNum": 76,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Hadi",
    "noHp": "0812999119",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-077",
    "nomorUrut": 77,
    "originalNum": 77,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Haryanto",
    "noHp": "08122802840",
    "alamat": "Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-078",
    "nomorUrut": 78,
    "originalNum": 78,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Riris",
    "noHp": "089636963356",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-079",
    "nomorUrut": 79,
    "originalNum": 79,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Andrew",
    "noHp": "083873160570",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-080",
    "nomorUrut": 80,
    "originalNum": 80,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus Bengkel",
    "noHp": "085100649596",
    "alamat": "Purwokerto, Jateng",
    "luarKota": true,
    "jumlahUnit": 6,
    "catatan": "+1 baterai XT90",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 17100000
  },
  {
    "id": "PO-20261030-081",
    "nomorUrut": 81,
    "originalNum": 81,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ismuliana",
    "noHp": "087812500392",
    "alamat": "Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-082",
    "nomorUrut": 82,
    "originalNum": 82,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dedy",
    "noHp": "0816992776",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-083",
    "nomorUrut": 83,
    "originalNum": 83,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Decki",
    "noHp": "081368239090",
    "alamat": "Bengkulu",
    "luarKota": true,
    "jumlahUnit": 5,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 14250000
  },
  {
    "id": "PO-20261030-084",
    "nomorUrut": 84,
    "originalNum": 84,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Syaripudin",
    "noHp": "089624430567",
    "alamat": "Tangerang Selatan",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-085",
    "nomorUrut": 85,
    "originalNum": 85,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Hakam",
    "noHp": "085232939995",
    "alamat": "Lumajang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-086",
    "nomorUrut": 86,
    "originalNum": 86,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Iqbal",
    "noHp": "08563316622",
    "alamat": "Lamongan, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-087",
    "nomorUrut": 87,
    "originalNum": 87,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sisco",
    "noHp": "085785998799",
    "alamat": "Depok",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-088",
    "nomorUrut": 88,
    "originalNum": 88,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus",
    "noHp": "085204888575",
    "alamat": "Banyuwangi, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-089",
    "nomorUrut": 89,
    "originalNum": 89,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Giga",
    "noHp": "085748956756",
    "alamat": "Kediri, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-090",
    "nomorUrut": 90,
    "originalNum": 90,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ekobudi",
    "noHp": "08156583882",
    "alamat": "Kudus, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-091",
    "nomorUrut": 91,
    "originalNum": 91,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fachri",
    "noHp": "081381930728",
    "alamat": "Serang, Banten",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-092",
    "nomorUrut": 92,
    "originalNum": 92,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Adiyanto",
    "noHp": "081289585125",
    "alamat": "Karawang, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-093",
    "nomorUrut": 93,
    "originalNum": 93,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Burhan",
    "noHp": "085730958683",
    "alamat": "Tulungagung, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-094",
    "nomorUrut": 94,
    "originalNum": 94,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Catur",
    "noHp": "082134388035",
    "alamat": "Pamulang, Tangsel",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-095",
    "nomorUrut": 95,
    "originalNum": 95,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rido",
    "noHp": "085799390354",
    "alamat": "Gresik, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, grey (minta utuh)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-096",
    "nomorUrut": 96,
    "originalNum": 96,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Supriyadi",
    "noHp": "081331814327",
    "alamat": "Malang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-097",
    "nomorUrut": 97,
    "originalNum": 97,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Anwar",
    "noHp": "082311993312",
    "alamat": "Medan, Sumut",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-098",
    "nomorUrut": 98,
    "originalNum": 98,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Jusianto",
    "noHp": "081336299986",
    "alamat": "Malang Batu, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-099",
    "nomorUrut": 99,
    "originalNum": 100,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Erik",
    "noHp": "088983595961",
    "alamat": "Semarang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-100",
    "nomorUrut": 100,
    "originalNum": 101,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sasmito",
    "noHp": "085236827008",
    "alamat": "Jember, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-101",
    "nomorUrut": 101,
    "originalNum": 102,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dewi",
    "noHp": "082144156571",
    "alamat": "Probolinggo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-102",
    "nomorUrut": 102,
    "originalNum": 103,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Arsha",
    "noHp": "082358814956",
    "alamat": "Pandaan, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-103",
    "nomorUrut": 103,
    "originalNum": 104,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Oky Bayu",
    "noHp": "",
    "alamat": "Lampung Tengah",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-104",
    "nomorUrut": 104,
    "originalNum": 105,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Deky",
    "noHp": "081298571995",
    "alamat": "Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-105",
    "nomorUrut": 105,
    "originalNum": 106,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rifa Alqorni",
    "noHp": "087700380571",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-106",
    "nomorUrut": 106,
    "originalNum": 107,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rizal",
    "noHp": "",
    "alamat": "Duren Sawit, Jakarta Timur",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna merah, kuning",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-107",
    "nomorUrut": 107,
    "originalNum": 108,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Munif",
    "noHp": "085727375781",
    "alamat": "Salatiga, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-108",
    "nomorUrut": 108,
    "originalNum": 109,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Nelsen Meilendi",
    "noHp": "08885479779",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-109",
    "nomorUrut": 109,
    "originalNum": 110,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Heru",
    "noHp": "081223344641",
    "alamat": "Jakarta",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-110",
    "nomorUrut": 110,
    "originalNum": 111,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Tedi",
    "noHp": "081804045963",
    "alamat": "Yogyakarta",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-111",
    "nomorUrut": 111,
    "originalNum": 112,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ridwan",
    "noHp": "085777821685",
    "alamat": "Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-112",
    "nomorUrut": 112,
    "originalNum": 113,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fatkhur",
    "noHp": "08972309993",
    "alamat": "Salatiga, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-113",
    "nomorUrut": 113,
    "originalNum": 114,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dmaoels",
    "noHp": "08158278163",
    "alamat": "Batang, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-114",
    "nomorUrut": 114,
    "originalNum": 115,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Wahyu",
    "noHp": "089699544859",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-115",
    "nomorUrut": 115,
    "originalNum": 116,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Haris K",
    "noHp": "08999341311",
    "alamat": "Sawangan, Depok",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-116",
    "nomorUrut": 116,
    "originalNum": 117,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Malik",
    "noHp": "085755700666",
    "alamat": "Blitar, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-117",
    "nomorUrut": 117,
    "originalNum": 118,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Yuda",
    "noHp": "085175020225",
    "alamat": "Malang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-118",
    "nomorUrut": 118,
    "originalNum": 119,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Cecep",
    "noHp": "082120239533",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-119",
    "nomorUrut": 119,
    "originalNum": 120,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Marwan",
    "noHp": "081285703590",
    "alamat": "Bogor",
    "luarKota": false,
    "jumlahUnit": 3,
    "catatan": "Warna putih, silver, hitam",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 8400000
  },
  {
    "id": "PO-20261030-120",
    "nomorUrut": 120,
    "originalNum": 121,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Arif",
    "noHp": "085369663766",
    "alamat": "Palembang, Sumsel",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-121",
    "nomorUrut": 121,
    "originalNum": 122,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Deni",
    "noHp": "082337274999",
    "alamat": "Lumajang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-122",
    "nomorUrut": 122,
    "originalNum": 123,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Toto Sujianto",
    "noHp": "081348698194",
    "alamat": "Banjarbaru, Kalsel",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-123",
    "nomorUrut": 123,
    "originalNum": 124,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dian Syaihul",
    "noHp": "082330303115",
    "alamat": "Probolinggo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-124",
    "nomorUrut": 124,
    "originalNum": 125,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Taufiq",
    "noHp": "0811241399",
    "alamat": "Sleman, DIY",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-125",
    "nomorUrut": 125,
    "originalNum": 126,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Eko. Purwanto",
    "noHp": "085780895133",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-126",
    "nomorUrut": 126,
    "originalNum": 127,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Zen",
    "noHp": "085228173316",
    "alamat": "Tegal, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu2, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-127",
    "nomorUrut": 127,
    "originalNum": 128,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Arif",
    "noHp": "089672090243",
    "alamat": "Jakarta Timur",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu2, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-128",
    "nomorUrut": 128,
    "originalNum": 129,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Heri",
    "noHp": "085780296296",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu-abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-129",
    "nomorUrut": 129,
    "originalNum": 130,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Mulia Siregar",
    "noHp": "0819621114",
    "alamat": "Citayam, Depok",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-130",
    "nomorUrut": 130,
    "originalNum": 131,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Joysatriadi",
    "noHp": "087880220656",
    "alamat": "Indonesia",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-131",
    "nomorUrut": 131,
    "originalNum": 132,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ledi",
    "noHp": "087825786171",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-132",
    "nomorUrut": 132,
    "originalNum": 133,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rudy",
    "noHp": "08977767772",
    "alamat": "Palembang, Sumsel",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna merah, abu abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-133",
    "nomorUrut": 133,
    "originalNum": 134,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ali Akbar",
    "noHp": "082175957787",
    "alamat": "Baturaja, Sumsel",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-134",
    "nomorUrut": 134,
    "originalNum": 135,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rusli       Dan",
    "noHp": "081311770672",
    "alamat": "Babelan, Bekasi",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna putih, merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-135",
    "nomorUrut": 135,
    "originalNum": 136,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Catur    1",
    "noHp": "",
    "alamat": "Pamulang, Tangsel",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-136",
    "nomorUrut": 136,
    "originalNum": 137,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dicky Setiawan",
    "noHp": "081807407533",
    "alamat": "Jakarta Barat",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu-abu, abu (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-137",
    "nomorUrut": 137,
    "originalNum": 138,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Toko Oryza  Jawa Timur     Mulus",
    "noHp": "081335315845",
    "alamat": "Ponorogo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih (minta mulus)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-138",
    "nomorUrut": 138,
    "originalNum": 139,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Wahyu",
    "noHp": "081288063389",
    "alamat": "Cibinong, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-139",
    "nomorUrut": 139,
    "originalNum": 140,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Yudha",
    "noHp": "085735372102",
    "alamat": "Madiun, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu2, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-140",
    "nomorUrut": 140,
    "originalNum": 141,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Andreas Surya",
    "noHp": "082120005958",
    "alamat": "Tangerang",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-141",
    "nomorUrut": 141,
    "originalNum": 142,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Devis",
    "noHp": "082322072901",
    "alamat": "Tegal, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-142",
    "nomorUrut": 142,
    "originalNum": 143,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Rudi",
    "noHp": "08813458805",
    "alamat": "Malang, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-143",
    "nomorUrut": 143,
    "originalNum": 144,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fadkhur",
    "noHp": "085967011394",
    "alamat": "Mojokerto, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-144",
    "nomorUrut": 144,
    "originalNum": 145,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agus",
    "noHp": "083876229121",
    "alamat": "Kendal, Jateng",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-145",
    "nomorUrut": 145,
    "originalNum": 146,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Leo",
    "noHp": "",
    "alamat": "Jakarta Selatan",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-146",
    "nomorUrut": 146,
    "originalNum": 147,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Zeni",
    "noHp": "087871420768",
    "alamat": "Gunung Sindur, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-147",
    "nomorUrut": 147,
    "originalNum": 148,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Agung",
    "noHp": "085695295977",
    "alamat": "Jatiasih, Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-148",
    "nomorUrut": 148,
    "originalNum": 149,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sambrindil",
    "noHp": "083879682546",
    "alamat": "Jakarta Selatan",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-149",
    "nomorUrut": 149,
    "originalNum": 150,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dwi Toko Muthu",
    "noHp": "082111645511",
    "alamat": "Serang, Banten",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-150",
    "nomorUrut": 150,
    "originalNum": 151,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Fadli",
    "noHp": "085693614911",
    "alamat": "Jakarta Pusat",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih, abu abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-151",
    "nomorUrut": 151,
    "originalNum": 152,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Sandy",
    "noHp": "081805569555",
    "alamat": "Lamongan, Jatim",
    "luarKota": true,
    "jumlahUnit": 3,
    "catatan": "Warna putih, merah, abu (+50k request sortir)",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 8550000
  },
  {
    "id": "PO-20261030-152",
    "nomorUrut": 152,
    "originalNum": 153,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Benny",
    "noHp": "081235417052",
    "alamat": "Surabaya, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna abu2, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-153",
    "nomorUrut": 153,
    "originalNum": 154,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Mulyana  .  Dan",
    "noHp": "085960236777",
    "alamat": "Tangerang",
    "luarKota": false,
    "jumlahUnit": 2,
    "catatan": "Warna putih, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5600000
  },
  {
    "id": "PO-20261030-154",
    "nomorUrut": 154,
    "originalNum": 155,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Diyat",
    "noHp": "08122943583",
    "alamat": "Depok",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-155",
    "nomorUrut": 155,
    "originalNum": 156,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Alan Triwibowo",
    "noHp": "085926988730",
    "alamat": "Jakarta Timur",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna abu abu, abu",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-156",
    "nomorUrut": 156,
    "originalNum": 156,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dwi Fajar",
    "noHp": "082143108456",
    "alamat": "Probolinggo, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-157",
    "nomorUrut": 157,
    "originalNum": 157,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Irwancip",
    "noHp": "087786611888",
    "alamat": "Parung Panjang, Bogor",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-158",
    "nomorUrut": 158,
    "originalNum": 158,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Aris Widiyanto",
    "noHp": "081908264942",
    "alamat": "Kab. Tangerang",
    "luarKota": false,
    "jumlahUnit": 3,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 8400000
  },
  {
    "id": "PO-20261030-159",
    "nomorUrut": 159,
    "originalNum": 159,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Panjul",
    "noHp": "081904619101",
    "alamat": "Bali",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-160",
    "nomorUrut": 160,
    "originalNum": 160,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Ari",
    "noHp": "08111846857",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-161",
    "nomorUrut": 161,
    "originalNum": 161,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Joko",
    "noHp": "085710555901",
    "alamat": "Citayam, Depok",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-162",
    "nomorUrut": 162,
    "originalNum": 162,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Angga",
    "noHp": "081216122527",
    "alamat": "Tanjung Priok, Jakarta",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-163",
    "nomorUrut": 163,
    "originalNum": 163,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Dodo",
    "noHp": "085156821783",
    "alamat": "Bekasi",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "Warna merah, grey",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-164",
    "nomorUrut": 164,
    "originalNum": 164,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Zein",
    "noHp": "08983642701",
    "alamat": "Gresik, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "Warna putih",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-165",
    "nomorUrut": 165,
    "originalNum": 165,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Amal",
    "noHp": "0811833864",
    "alamat": "Tangerang",
    "luarKota": false,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2800000
  },
  {
    "id": "PO-20261030-166",
    "nomorUrut": 166,
    "originalNum": 166,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Bayu",
    "noHp": "087754200749",
    "alamat": "Trenggalek, Jatim",
    "luarKota": true,
    "jumlahUnit": 2,
    "catatan": "Warna merah",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 5700000
  },
  {
    "id": "PO-20261030-167",
    "nomorUrut": 167,
    "originalNum": 167,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Didi P",
    "noHp": "08123541100",
    "alamat": "Surabaya, Jatim",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  },
  {
    "id": "PO-20261030-168",
    "nomorUrut": 168,
    "originalNum": 168,
    "timestamp": "2026-10-30 10:00:00",
    "nama": "Nadi",
    "noHp": "085221041069",
    "alamat": "Bandung, Jabar",
    "luarKota": true,
    "jumlahUnit": 1,
    "catatan": "",
    "statusBayar": "Belum Bayar",
    "totalBiaya": 2850000
  }
];

  // App State
  const state = {
    orders: [],
    config: {
      targetUnits: DEFAULT_TARGET_UNITS,
      adminPhone: '6282298025436'
    },
    isAdmin: false,
    filterStatus: 'all',
    searchQuery: '',
    currentPage: 1,
    pageSize: 15
  };

  // DOM Elements
  const elements = {
    // Stats
    statCurrentUnits: document.getElementById('statCurrentUnits'),
    statTargetUnits: document.getElementById('statTargetUnits'),
    statProgressPct: document.getElementById('statProgressPct'),
    statProgressFill: document.getElementById('statProgressFill'),
    statTotalPemesan: document.getElementById('statTotalPemesan'),
    statSisaUnits: document.getElementById('statSisaUnits'),
    statSisaUnitsProgress: document.getElementById('statSisaUnitsProgress'),
    statTotalDana: document.getElementById('statTotalDana'),
    pillLunas: document.getElementById('pillLunas'),
    pillDp: document.getElementById('pillDp'),
    pillUnpaid: document.getElementById('pillUnpaid'),
    badgeLunasCount: document.getElementById('badgeLunasCount'),
    badgeDpCount: document.getElementById('badgeDpCount'),
    badgeUnpaidCount: document.getElementById('badgeUnpaidCount'),

    // Table & controls
    orderTableBody: document.getElementById('orderTableBody'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchInput'),
    statusFilterSelect: document.getElementById('statusFilterSelect'),
    tableInfo: document.getElementById('tableInfo'),
    paginationWrap: document.getElementById('paginationWrap'),

    // Modals
    orderModal: document.getElementById('orderModal'),
    importModal: document.getElementById('importModal'),
    adminLoginModal: document.getElementById('adminLoginModal'),
    successModal: document.getElementById('successModal'),

    // Form elements
    orderForm: document.getElementById('orderForm'),
    inputNama: document.getElementById('inputNama'),
    inputNoHp: document.getElementById('inputNoHp'),
    inputAlamat: document.getElementById('inputAlamat'),
    checkLuarKota: document.getElementById('checkLuarKota'),
    inputJumlahUnit: document.getElementById('inputJumlahUnit'),
    inputCatatan: document.getElementById('inputCatatan'),
    inputStatusBayar: document.getElementById('inputStatusBayar'),
    calcBasePrice: document.getElementById('calcBasePrice'),
    calcSurchargeRow: document.getElementById('calcSurchargeRow'),
    calcSurchargePrice: document.getElementById('calcSurchargePrice'),
    calcTotalPrice: document.getElementById('calcTotalPrice'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper: Format Currency (IDR)
  function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Helper: Format Phone for WhatsApp
  function formatWhatsAppPhone(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span style="font-weight: bold;">${icon}</span><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Modal Helpers
  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  // Initialize Data
  function initStorage() {
    const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (savedConfig) {
      try {
        state.config = Object.assign({}, state.config, JSON.parse(savedConfig));
      } catch (e) {
        console.error('Error parsing config', e);
      }
    }

    const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (savedOrders) {
      try {
        state.orders = JSON.parse(savedOrders);
      } catch (e) {
        state.orders = SEED_ORDERS;
      }
    } else {
      state.orders = SEED_ORDERS;
      saveOrdersToLocal();
    }
  }

  function saveOrdersToLocal() {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(state.orders));
  }

  // Calculate Aggregated Statistics
  function calculateStats() {
    let totalUnits = 0;
    const totalPemesan = state.orders.length;
    let totalDana = 0;

    let lunasUnits = 0;
    let dpUnits = 0;
    let unpaidUnits = 0;

    state.orders.forEach(order => {
      const units = Number(order.jumlahUnit) || 1;
      totalUnits += units;
      totalDana += Number(order.totalBiaya) || ((UNIT_PRICE + (order.luarKota ? LUAR_KOTA_SURCHARGE : 0)) * units);

      const status = (order.statusBayar || '').toLowerCase();
      if (status === 'lunas') {
        lunasUnits += units;
      } else if (status === 'dp') {
        dpUnits += units;
      } else {
        unpaidUnits += units;
      }
    });

    const target = state.config.targetUnits || DEFAULT_TARGET_UNITS;
    const sisaUnits = Math.max(0, target - totalUnits);
    const progressPct = Math.min(100, Math.round((totalUnits / target) * 100));

    return {
      totalPemesan,
      totalUnits,
      sisaUnits,
      target,
      progressPct,
      totalDana,
      lunasUnits,
      dpUnits,
      unpaidUnits
    };
  }

  // Update UI Stats
  function renderStats() {
    const stats = calculateStats();

    elements.statCurrentUnits.textContent = stats.totalUnits;
    elements.statTargetUnits.textContent = `/ ${stats.target} Unit`;
    elements.statProgressPct.textContent = `${stats.progressPct}%`;
    elements.statProgressFill.style.width = `${stats.progressPct}%`;

    elements.statTotalPemesan.textContent = `${stats.totalPemesan} Orang`;
    if (elements.statSisaUnits) elements.statSisaUnits.textContent = `${stats.sisaUnits} Unit`;
    if (elements.statSisaUnitsProgress) elements.statSisaUnitsProgress.textContent = `${stats.sisaUnits} Unit`;
    elements.statTotalDana.textContent = formatIDR(stats.totalDana);

    elements.badgeLunasCount.textContent = `${stats.lunasUnits} unit`;
    elements.badgeDpCount.textContent = `${stats.dpUnits} unit`;
    elements.badgeUnpaidCount.textContent = `${stats.unpaidUnits} unit`;
  }

  // Filter & Search Orders
  function getFilteredOrders() {
    let result = [...state.orders];

    if (state.filterStatus !== 'all') {
      result = result.filter(item => {
        const status = (item.statusBayar || '').toLowerCase();
        if (state.filterStatus === 'lunas') return status === 'lunas';
        if (state.filterStatus === 'dp') return status === 'dp';
        if (state.filterStatus === 'unpaid') return status === 'belum bayar' || status === 'unpaid' || !status;
        return true;
      });
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        return (
          (item.nama && item.nama.toLowerCase().includes(q)) ||
          (item.noHp && item.noHp.includes(q)) ||
          (item.alamat && item.alamat.toLowerCase().includes(q)) ||
          (item.catatan && item.catatan.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }

  // Render Table
  function renderTable() {
    const filtered = getFilteredOrders();
    const tbody = elements.orderTableBody;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      elements.emptyState.style.display = 'block';
      elements.tableInfo.textContent = 'Menampilkan 0 pemesan';
      elements.paginationWrap.innerHTML = '';
      return;
    }

    elements.emptyState.style.display = 'none';

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

    elements.tableInfo.textContent = `Menampilkan ${startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} dari ${totalItems} pemesan terdaftar`;

    paginatedItems.forEach((item, index) => {
      const tr = document.createElement('tr');
      const rowNum = startIndex + index + 1;
      const cleanPhone = formatWhatsAppPhone(item.noHp);
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '#';

      const statusLower = (item.statusBayar || '').toLowerCase();
      let statusClass = 'unpaid';
      let statusLabel = 'Belum Bayar';
      if (statusLower === 'lunas') {
        statusClass = 'lunas';
        statusLabel = 'Lunas';
      } else if (statusLower === 'dp') {
        statusClass = 'dp';
        statusLabel = 'DP';
      }

      tr.innerHTML = `
        <td class="cell-index">${rowNum}</td>
        <td class="cell-name">
          <div style="font-weight: 600;">${escapeHTML(item.nama)}</div>
          ${item.catatan ? `<div style="font-size: 0.75rem; color: #94a3b8; font-style: italic;">"${escapeHTML(item.catatan)}"</div>` : ''}
        </td>
        <td>
          <span class="city-badge">${escapeHTML(item.alamat || '-')}</span>
          ${item.luarKota ? `<span class="luar-kota-tag">Luar Kota</span>` : ''}
        </td>
        <td>
          ${cleanPhone ? `
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="cell-phone" title="Chat via WhatsApp">
              <span>📱</span> ${escapeHTML(item.noHp)}
            </a>
          ` : `<span style="color: #64748b;">-</span>`}
        </td>
        <td class="cell-units">
          <span class="units-badge">${item.jumlahUnit} Unit</span>
        </td>
        <td class="mono" style="font-size: 0.85rem; color: #cbd5e1;">
          ${formatIDR(item.totalBiaya || ((UNIT_PRICE + (item.luarKota ? LUAR_KOTA_SURCHARGE : 0)) * item.jumlahUnit))}
        </td>
        <td>
          <span class="status-badge ${statusClass}" ${state.isAdmin ? `style="cursor: pointer;" title="Klik untuk ubah status"` : ''} data-id="${item.id}">
            ● ${statusLabel}
          </span>
        </td>
        <td>
          <div class="action-btn-group">
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-table-wa" title="WhatsApp">
                WA
              </a>
            ` : ''}
            ${state.isAdmin ? `
              <button class="btn-edit-status btn-admin-toggle" data-id="${item.id}" title="Ubah Status">
                ⚙️ Status
              </button>
              <button class="btn-edit-status" data-action="delete" data-id="${item.id}" style="color: #ef4444;" title="Hapus">
                🗑️
              </button>
            ` : ''}
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    renderPagination(totalPages);
  }

  // Render Pagination
  function renderPagination(totalPages) {
    const wrap = elements.paginationWrap;
    wrap.innerHTML = '';
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary btn-sm';
    prevBtn.textContent = '←';
    prevBtn.disabled = state.currentPage === 1;
    prevBtn.onclick = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderTable();
      }
    };
    wrap.appendChild(prevBtn);

    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - state.currentPage) <= 1) {
        const pBtn = document.createElement('button');
        pBtn.className = `btn btn-sm ${p === state.currentPage ? 'btn-primary' : 'btn-secondary'}`;
        pBtn.textContent = p;
        pBtn.onclick = () => {
          state.currentPage = p;
          renderTable();
        };
        wrap.appendChild(pBtn);
      } else if (Math.abs(p - state.currentPage) === 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.padding = '0 0.3rem';
        dots.style.color = 'var(--text-dim)';
        wrap.appendChild(dots);
      }
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-secondary btn-sm';
    nextBtn.textContent = '→';
    nextBtn.disabled = state.currentPage === totalPages;
    nextBtn.onclick = () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderTable();
      }
    };
    wrap.appendChild(nextBtn);
  }

  // Live Calculator in Order Form
  function updateFormCalculation() {
    const units = Math.max(1, parseInt(elements.inputJumlahUnit.value) || 1);
    const isLuarKota = elements.checkLuarKota.checked;

    const basePrice = units * UNIT_PRICE;
    const surchargePrice = isLuarKota ? units * LUAR_KOTA_SURCHARGE : 0;
    const totalPrice = basePrice + surchargePrice;

    elements.calcBasePrice.textContent = `${units} × ${formatIDR(UNIT_PRICE)} = ${formatIDR(basePrice)}`;
    if (isLuarKota) {
      elements.calcSurchargeRow.style.display = 'flex';
      elements.calcSurchargePrice.textContent = `${units} × ${formatIDR(LUAR_KOTA_SURCHARGE)} = ${formatIDR(surchargePrice)}`;
    } else {
      elements.calcSurchargeRow.style.display = 'none';
    }
    elements.calcTotalPrice.textContent = formatIDR(totalPrice);

    return { units, isLuarKota, totalPrice };
  }

  // Handle Form Submission (Add Order)
  function handleOrderSubmit(e) {
    e.preventDefault();

    const nama = elements.inputNama.value.trim();
    const noHp = elements.inputNoHp.value.trim();
    const alamat = elements.inputAlamat.value.trim();
    const { units, isLuarKota, totalPrice } = updateFormCalculation();
    const catatan = elements.inputCatatan.value.trim();
    const statusBayar = elements.inputStatusBayar ? elements.inputStatusBayar.value : 'Belum Bayar';

    if (!nama) {
      showToast('Nama pemesan wajib diisi!', 'warning');
      return;
    }
    if (!noHp) {
      showToast('Nomor WhatsApp wajib diisi!', 'warning');
      return;
    }
    if (!alamat) {
      showToast('Alamat / kota pengiriman wajib diisi!', 'warning');
      return;
    }

    const newOrder = {
      id: 'PO-' + new Date().toISOString().replace(/\D/g, '').slice(0, 14) + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleString('id-ID'),
      nama,
      noHp,
      alamat,
      luarKota: isLuarKota,
      jumlahUnit: units,
      catatan,
      statusBayar,
      totalBiaya: totalPrice
    };

    state.orders.unshift(newOrder);
    saveOrdersToLocal();
    renderStats();
    renderTable();
    closeModal(elements.orderModal);

    showSuccessOrderModal(newOrder);
  }

  // Show Success Confirmation Modal with WhatsApp Confirmation Button
  function showSuccessOrderModal(order) {
    const modal = elements.successModal;
    document.getElementById('successSummaryNama').textContent = order.nama;
    document.getElementById('successSummaryUnits').textContent = `${order.jumlahUnit} Unit (${order.luarKota ? 'Luar Kota' : 'Jabodetabek'})`;
    document.getElementById('successSummaryTotal').textContent = formatIDR(order.totalBiaya);

    const waText = encodeURIComponent(
      `Halo Admin PO Motor PT, saya sudah mengisi form pemesanan:\n\n` +
      `👤 *Nama*: ${order.nama}\n` +
      `📱 *No. HP*: ${order.noHp}\n` +
      `📍 *Alamat*: ${order.alamat} (${order.luarKota ? 'Luar Kota +50rb' : 'Jabodetabek'})\n` +
      `🏍️ *Jumlah*: ${order.jumlahUnit} Unit\n` +
      (order.catatan ? `📝 *Catatan*: ${order.catatan}\n` : '') +
      `💰 *Total Biaya*: ${formatIDR(order.totalBiaya)}\n` +
      `🔖 *Status*: ${order.statusBayar}\n\n` +
      `Mohon petunjuk rekening transfer & nomor konfirmasi. Terima kasih!`
    );

    const waBtn = document.getElementById('btnConfirmWhatsApp');
    const adminPhone = formatWhatsAppPhone(state.config.adminPhone) || '6282298025436';
    waBtn.href = `https://wa.me/${adminPhone}?text=${waText}`;

    openModal(modal);
  }

  // Status Change (Admin Mode)
  function promptChangeStatus(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const nextStatusMap = {
      'Belum Bayar': 'DP',
      'DP': 'Lunas',
      'Lunas': 'Belum Bayar'
    };
    const currentStatus = order.statusBayar || 'Belum Bayar';
    const nextStatus = nextStatusMap[currentStatus] || 'Belum Bayar';

    if (confirm(`Ubah status pembayaran ${order.nama} dari "${currentStatus}" menjadi "${nextStatus}"?`)) {
      order.statusBayar = nextStatus;
      saveOrdersToLocal();
      renderStats();
      renderTable();
      showToast(`Status pembayaran ${order.nama} diubah ke ${nextStatus}`);
    }
  }

  // Delete Order (Admin Mode)
  function deleteOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    if (confirm(`Apakah Anda yakin ingin menghapus pesanan atas nama "${order.nama}" (${order.jumlahUnit} unit)?`)) {
      state.orders = state.orders.filter(o => o.id !== orderId);
      saveOrdersToLocal();
      renderStats();
      renderTable();
      showToast(`Pesanan ${order.nama} berhasil dihapus`, 'warning');
    }
  }

  // WhatsApp Broadcast Recap Generator
  function copyWhatsAppRecap() {
    const stats = calculateStats();
    const currentUrl = window.location.href;

    const recapText = 
`*REKAP SEMENTARA PO MOTOR BEKAS PT*
══════════════════════════
🎯 *Target Wajib*: ${stats.target} Unit
📊 *Total Terkumpul*: ${stats.totalUnits} Unit (${stats.progressPct}%)
⏳ *Sisa Menuju Target*: ${stats.sisaUnits} Unit Lagi!
👥 *Jumlah Pemesan*: ${stats.totalPemesan} Orang

💰 *Status Pembayaran*:
• Lunas: ${stats.lunasUnits} unit
• DP / Titip: ${stats.dpUnits} unit
• Menunggu Bayar: ${stats.unpaidUnits} unit

📋 *Ketentuan PO*:
• Harga: Rp2.800.000 / unit
• Kondisi: Motor only, tanpa baterai
• SS Lengkap, fisik random
• Controller sudah unlock, tinggal pasang baterai 60V
• Luar kota: Tambah Rp50.000 / unit

Segera amankan slot sebelum target 300 unit terpenuhi!
Cek & Ikut PO di sini:
👉 ${currentUrl}`;

    navigator.clipboard.writeText(recapText).then(() => {
      showToast('Teks rekap WhatsApp berhasil disalin ke clipboard! Siap dipaste ke grup.');
    }).catch(err => {
      prompt('Salin teks rekap berikut:', recapText);
    });
  }

  // Export to CSV
  function exportToCSV() {
    if (state.orders.length === 0) {
      showToast('Tidak ada data untuk diexport', 'warning');
      return;
    }

    const headers = ['No', 'ID', 'Timestamp', 'Nama', 'No HP', 'Alamat/Kota', 'Luar Kota', 'Jumlah Unit', 'Catatan', 'Status Bayar', 'Total Biaya'];
    const rows = state.orders.map((o, idx) => [
      idx + 1,
      `"${o.id || ''}"`,
      `"${o.timestamp || ''}"`,
      `"${(o.nama || '').replace(/"/g, '""')}"`,
      `"${o.noHp || ''}"`,
      `"${(o.alamat || '').replace(/"/g, '""')}"`,
      o.luarKota ? 'Ya' : 'Tidak',
      o.jumlahUnit || 1,
      `"${(o.catatan || '').replace(/"/g, '""')}"`,
      `"${o.statusBayar || 'Belum Bayar'}"`,
      o.totalBiaya || ((UNIT_PRICE + (o.luarKota ? LUAR_KOTA_SURCHARGE : 0)) * (o.jumlahUnit || 1))
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_PO_Motor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh!');
  }

  // Batch / Text Importer
  function handleBatchImportText() {
    const text = document.getElementById('batchImportText').value.trim();
    if (!text) {
      showToast('Tempelkan teks data pemesan terlebih dahulu', 'warning');
      return;
    }

    const lines = text.split('\n');
    const importedOrders = [];

    lines.forEach((line, index) => {
      const clean = line.trim();
      if (!clean) return;

      const withoutNumber = clean.replace(/^\d+[\.\-\)]\s*/, '');
      const parts = withoutNumber.split(/\s*[—\-\|, host]\s*/);

      if (parts.length >= 2) {
        const nama = parts[0] || `Pemesan ${index + 1}`;
        let alamat = '';
        let noHp = '';
        let units = 1;
        let catatan = '';

        for (let i = 1; i < parts.length; i++) {
          const part = parts[i].trim();
          if (/^08\d+|^628\d+/.test(part.replace(/\D/g, '')) && part.replace(/\D/g, '').length >= 9) {
            noHp = part;
          } else if (/(\d+)\s*unit/i.test(part)) {
            const match = part.match(/(\d+)\s*unit/i);
            if (match) units = parseInt(match[1]) || 1;
            if (part.toLowerCase().includes('putih')) catatan = 'Warna putih';
          } else if (!alamat) {
            alamat = part;
          } else {
            catatan += (catatan ? ', ' : '') + part;
          }
        }

        const isLuarKota = alamat && !['jakarta', 'bogor', 'depok', 'tangerang', 'bekasi'].some(c => alamat.toLowerCase().includes(c));
        const totalPrice = (UNIT_PRICE + (isLuarKota ? LUAR_KOTA_SURCHARGE : 0)) * units;

        importedOrders.push({
          id: 'PO-IMP-' + Date.now().toString().slice(-6) + '-' + (index + 1),
          timestamp: new Date().toLocaleString('id-ID'),
          nama,
          noHp,
          alamat: alamat || 'Indonesia',
          luarKota: isLuarKota,
          jumlahUnit: units,
          catatan,
          statusBayar: 'Belum Bayar',
          totalBiaya: totalPrice
        });
      }
    });

    if (importedOrders.length === 0) {
      showToast('Gagal membaca format teks. Pastikan format: Nama — Kota — No HP — X unit', 'error');
      return;
    }

    state.orders = [...importedOrders, ...state.orders];
    saveOrdersToLocal();
    renderStats();
    renderTable();
    closeModal(elements.importModal);
    document.getElementById('batchImportText').value = '';
    showToast(`Berhasil menambahkan ${importedOrders.length} pemesan baru!`);
  }

  // Escape HTML helper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Admin Mode Login
  function handleAdminLogin(e) {
    e.preventDefault();
    const pin = document.getElementById('adminPinInput').value;
    if (pin === 'admin123' || pin === 'admin' || pin === '1234') {
      state.isAdmin = true;
      document.body.classList.add('admin-mode-active');
      const badge = document.getElementById('adminModeBadge');
      if (badge) badge.style.display = 'inline-flex';
      closeModal(elements.adminLoginModal);
      document.getElementById('adminPinInput').value = '';
      showToast('Mode Admin aktif! Anda dapat mengubah status dan mengelola pesanan.');
      renderTable();
    } else {
      showToast('PIN Admin salah! (Default PIN: admin123)', 'error');
    }
  }

  // Bind Event Listeners
  function bindEvents() {
    document.getElementById('btnUnitMinus').onclick = () => {
      let val = parseInt(elements.inputJumlahUnit.value) || 1;
      if (val > 1) {
        elements.inputJumlahUnit.value = val - 1;
        updateFormCalculation();
      }
    };

    document.getElementById('btnUnitPlus').onclick = () => {
      let val = parseInt(elements.inputJumlahUnit.value) || 1;
      elements.inputJumlahUnit.value = val + 1;
      updateFormCalculation();
    };

    elements.inputJumlahUnit.oninput = updateFormCalculation;
    elements.checkLuarKota.onchange = updateFormCalculation;

    document.getElementById('btnOpenOrderModal').onclick = () => {
      elements.orderForm.reset();
      elements.inputJumlahUnit.value = 1;
      updateFormCalculation();
      openModal(elements.orderModal);
    };

    document.getElementById('btnOpenAdmin').onclick = () => {
      if (state.isAdmin) {
        if (confirm('Keluar dari Mode Admin?')) {
          state.isAdmin = false;
          document.body.classList.remove('admin-mode-active');
          const badge = document.getElementById('adminModeBadge');
          if (badge) badge.style.display = 'none';
          showToast('Mode Admin dinonaktifkan');
          renderTable();
        }
      } else {
        openModal(elements.adminLoginModal);
      }
    };

    document.getElementById('btnOpenImportModal').onclick = () => {
      openModal(elements.importModal);
    };

    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.onclick = function () {
        const modal = this.closest('.modal-overlay');
        closeModal(modal);
      };
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
      };
    });

    elements.orderForm.onsubmit = handleOrderSubmit;

    elements.pillLunas.onclick = () => toggleFilterPill('lunas');
    elements.pillDp.onclick = () => toggleFilterPill('dp');
    elements.pillUnpaid.onclick = () => toggleFilterPill('unpaid');

    function toggleFilterPill(status) {
      if (state.filterStatus === status) {
        state.filterStatus = 'all';
        elements.statusFilterSelect.value = 'all';
      } else {
        state.filterStatus = status;
        elements.statusFilterSelect.value = status;
      }
      updatePillsUI();
      state.currentPage = 1;
      renderTable();
    }

    function updatePillsUI() {
      elements.pillLunas.classList.toggle('active', state.filterStatus === 'lunas');
      elements.pillDp.classList.toggle('active', state.filterStatus === 'dp');
      elements.pillUnpaid.classList.toggle('active', state.filterStatus === 'unpaid');
    }

    elements.statusFilterSelect.onchange = (e) => {
      state.filterStatus = e.target.value;
      updatePillsUI();
      state.currentPage = 1;
      renderTable();
    };

    elements.searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      renderTable();
    };

    document.getElementById('btnShareWA').onclick = copyWhatsAppRecap;
    document.getElementById('btnExportCSV').onclick = exportToCSV;
    document.getElementById('btnSubmitImport').onclick = handleBatchImportText;
    document.getElementById('adminLoginForm').onsubmit = handleAdminLogin;

    elements.orderTableBody.onclick = (e) => {
      const statusBadge = e.target.closest('.status-badge');
      if (statusBadge && state.isAdmin) {
        const id = statusBadge.getAttribute('data-id');
        promptChangeStatus(id);
        return;
      }

      const adminBtn = e.target.closest('.btn-admin-toggle');
      if (adminBtn) {
        const id = adminBtn.getAttribute('data-id');
        promptChangeStatus(id);
        return;
      }

      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        deleteOrder(id);
        return;
      }
    };
  }

  // Application Entry Point
  function init() {
    initStorage();
    bindEvents();
    renderStats();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
