/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND REKAP PO MOTOR BEKAS PT
 * =========================================================================
 * 
 * CARA PAKAI:
 * 1. Buat Google Spreadsheet baru di https://sheets.new
 * 2. Beri nama sheet (misal: "Database PO Motor Bekas")
 * 3. Buka menu Extensions (Ekstensi) > Apps Script
 * 4. Hapus semua kode yang ada, lalu paste seluruh isi file ini
 * 5. Klik "Save" (ikon disket)
 * 6. Klik tombol biru "Deploy" (Terapkan) > "New deployment" (Penerapan baru)
 * 7. Pilih tipe: "Web app" (Aplikasi web)
 * 8. Konfigurasi:
 *    - Description: "PO Motor API v1"
 *    - Execute as: "Me" (Saya / akun Google Anda)
 *    - Who has access: "Anyone" (Siapa saja, bahkan anonim - PENTING agar web GitHub Pages bisa baca & tulis data)
 * 9. Klik "Deploy" dan izinkan akses Google jika diminta
 * 10. Salin "Web app URL" (akhiran /exec) dan tempel di Pengaturan Web App Anda!
 */

const SHEET_NAME = 'Data_PO';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Jika tab Data_PO belum ada
  if (!sheet) {
    const allSheets = ss.getSheets();
    // Jika hanya ada 1 sheet dan masih kosong (misal Sheet1 default)
    if (allSheets.length === 1 && allSheets[0].getLastRow() <= 1 && allSheets[0].getLastColumn() <= 1) {
      sheet = allSheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  // Jika sheet masih kosong (belum ada baris header)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'ID',
      'Timestamp',
      'Nama Pemesan',
      'No. WhatsApp / HP',
      'Alamat / Kota',
      'Luar Kota',
      'Jumlah Unit',
      'Catatan / Request',
      'Status Bayar',
      'Total Biaya (Rp)'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#10b981').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    const action = e.parameter.action || 'getAll';
    
    if (action === 'getAll') {
      const sheet = getOrCreateSheet();
      const rows = sheet.getDataRange().getValues();
      
      // Jika hanya header
      if (rows.length <= 1) {
        return createResponse({ status: 'success', count: 0, data: [] });
      }
      
      const headers = rows[0];
      const data = [];
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0] && !row[2]) continue; // Lewati baris kosong
        
        data.push({
          rowIndex: i + 1,
          id: String(row[0] || ''),
          timestamp: row[1] ? Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') : '',
          nama: String(row[2] || ''),
          noHp: String(row[3] || ''),
          alamat: String(row[4] || ''),
          luarKota: row[5] === true || String(row[5]).toLowerCase() === 'ya' || String(row[5]).toLowerCase() === 'true',
          jumlahUnit: Number(row[6]) || 1,
          catatan: String(row[7] || ''),
          statusBayar: String(row[8] || 'Belum Bayar'),
          totalBiaya: Number(row[9]) || 0
        });
      }
      
      return createResponse({ status: 'success', count: data.length, data: data });
    }
    
    // Quick Add via GET (opsional untuk fallback jika POST diblokir browser tertentu)
    if (action === 'add') {
      return handleAddOrder(e.parameter);
    }
    
    return createResponse({ status: 'error', message: 'Aksi tidak dikenal' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pErr) {
        payload = e.parameter;
      }
    } else {
      payload = e.parameter;
    }
    
    const action = payload.action || 'add';
    
    if (action === 'add') {
      return handleAddOrder(payload);
    } else if (action === 'updateStatus') {
      return handleUpdateStatus(payload);
    } else if (action === 'delete') {
      return handleDeleteOrder(payload);
    } else if (action === 'batchImport') {
      return handleBatchImport(payload);
    }
    
    return createResponse({ status: 'error', message: 'Aksi POST tidak valid' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleAddOrder(payload) {
  const sheet = getOrCreateSheet();
  const id = payload.id || 'PO-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 1000);
  const timestamp = new Date();
  const nama = payload.nama || 'Tanpa Nama';
  const noHp = payload.noHp || '';
  const alamat = payload.alamat || '';
  const luarKota = (payload.luarKota === true || String(payload.luarKota).toLowerCase() === 'ya' || String(payload.luarKota).toLowerCase() === 'true') ? 'Ya' : 'Tidak';
  const jumlahUnit = Number(payload.jumlahUnit) || 1;
  const catatan = payload.catatan || '';
  const statusBayar = payload.statusBayar || 'Belum Bayar';
  
  // Hitung total jika tidak disediakan
  const hargaPerUnit = 2800000;
  const biayaLuarKota = (luarKota === 'Ya') ? 50000 : 0;
  const calculatedTotal = (hargaPerUnit + biayaLuarKota) * jumlahUnit;
  const totalBiaya = Number(payload.totalBiaya) || calculatedTotal;
  
  sheet.appendRow([
    id,
    timestamp,
    nama,
    noHp,
    alamat,
    luarKota,
    jumlahUnit,
    catatan,
    statusBayar,
    totalBiaya
  ]);
  
  return createResponse({
    status: 'success',
    message: 'Data pemesanan berhasil ditambahkan ke Google Sheet',
    item: {
      id: id,
      timestamp: Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
      nama: nama,
      noHp: noHp,
      alamat: alamat,
      luarKota: luarKota === 'Ya',
      jumlahUnit: jumlahUnit,
      catatan: catatan,
      statusBayar: statusBayar,
      totalBiaya: totalBiaya
    }
  });
}

function handleUpdateStatus(payload) {
  const sheet = getOrCreateSheet();
  const id = payload.id;
  const newStatus = payload.statusBayar;
  
  if (!id || !newStatus) {
    return createResponse({ status: 'error', message: 'ID dan statusBayar wajib diisi' });
  }
  
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.getRange(i + 1, 9).setValue(newStatus);
      return createResponse({ status: 'success', message: 'Status berhasil diubah ke ' + newStatus });
    }
  }
  
  return createResponse({ status: 'error', message: 'Pesanan dengan ID tersebut tidak ditemukan' });
}

function handleDeleteOrder(payload) {
  const sheet = getOrCreateSheet();
  const id = payload.id;
  if (!id) {
    return createResponse({ status: 'error', message: 'ID wajib diisi untuk menghapus' });
  }
  
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return createResponse({ status: 'success', message: 'Pesanan berhasil dihapus' });
    }
  }
  return createResponse({ status: 'error', message: 'Pesanan tidak ditemukan' });
}

function handleBatchImport(payload) {
  const sheet = getOrCreateSheet();
  const items = payload.items;
  if (!Array.isArray(items) || items.length === 0) {
    return createResponse({ status: 'error', message: 'Daftar item tidak boleh kosong' });
  }
  
  const newRows = [];
  const now = new Date();
  
  items.forEach(function(item, index) {
    const id = item.id || 'PO-BATCH-' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + (index + 1);
    const nama = item.nama || '';
    const noHp = item.noHp || '';
    const alamat = item.alamat || '';
    const luarKota = (item.luarKota === true || String(item.luarKota).toLowerCase() === 'ya') ? 'Ya' : 'Tidak';
    const jumlahUnit = Number(item.jumlahUnit) || 1;
    const catatan = item.catatan || '';
    const statusBayar = item.statusBayar || 'Belum Bayar';
    const totalBiaya = Number(item.totalBiaya) || ((2800000 + (luarKota === 'Ya' ? 50000 : 0)) * jumlahUnit);
    
    newRows.push([
      id,
      now,
      nama,
      noHp,
      alamat,
      luarKota,
      jumlahUnit,
      catatan,
      statusBayar,
      totalBiaya
    ]);
  });
  
  if (newRows.length > 0) {
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, newRows.length, 10).setValues(newRows);
  }
  
  return createResponse({ status: 'success', message: newRows.length + ' data berhasil diimpor ke Google Sheet' });
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
