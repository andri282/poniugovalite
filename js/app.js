/**
 * =========================================================================
 * PO MOTOR BEKAS PT - CORE JAVASCRIPT APPLICATION
 * State Management, Real-time Calculations, Google Sheets Sync, WhatsApp
 * =========================================================================
 */

(function () {
  'use strict';

  // Constants
  const STORAGE_KEY_ORDERS = 'po_motor_orders_v1';
  const STORAGE_KEY_CONFIG = 'po_motor_config_v1';
  const DEFAULT_TARGET_UNITS = 300;
  const UNIT_PRICE = 2800000;
  const LUAR_KOTA_SURCHARGE = 50000;

  // Default Initial Data (From user's screenshot)
  const SEED_ORDERS = [
    {
      id: 'PO-20261030-001',
      timestamp: '2026-10-30 10:15:00',
      nama: 'Fikri',
      noHp: '082298025436',
      alamat: 'Bekasi',
      luarKota: true,
      jumlahUnit: 5,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 5
    },
    {
      id: 'PO-20261030-002',
      timestamp: '2026-10-30 10:30:00',
      nama: 'Wahyu',
      noHp: '08112520099',
      alamat: 'Jepara',
      luarKota: true,
      jumlahUnit: 1,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-003',
      timestamp: '2026-10-30 11:05:00',
      nama: 'Dzaki',
      noHp: '08956010640102',
      alamat: 'Sleman',
      luarKota: true,
      jumlahUnit: 2,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 2
    },
    {
      id: 'PO-20261030-004',
      timestamp: '2026-10-30 11:20:00',
      nama: 'Rujik JCP',
      noHp: '081519007466',
      alamat: 'Jombang',
      luarKota: true,
      jumlahUnit: 1,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-005',
      timestamp: '2026-10-30 12:00:00',
      nama: 'Jimmy Febri',
      noHp: '081919459599',
      alamat: 'Depok',
      luarKota: false,
      jumlahUnit: 2,
      catatan: '',
      statusBayar: 'DP',
      totalBiaya: UNIT_PRICE * 2
    },
    {
      id: 'PO-20261030-006',
      timestamp: '2026-10-30 12:45:00',
      nama: 'Anggra',
      noHp: '082338864091',
      alamat: 'Probolinggo',
      luarKota: true,
      jumlahUnit: 1,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-007',
      timestamp: '2026-10-30 13:10:00',
      nama: 'Puja',
      noHp: '0813-1776-7173',
      alamat: 'Pandeglang',
      luarKota: true,
      jumlahUnit: 1,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-008',
      timestamp: '2026-10-30 13:40:00',
      nama: 'Andif',
      noHp: '081249958558',
      alamat: 'Gresik',
      luarKota: true,
      jumlahUnit: 1,
      catatan: 'warna putih',
      statusBayar: 'Lunas',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-009',
      timestamp: '2026-10-30 14:15:00',
      nama: 'Hasan Basri',
      noHp: '081554415688',
      alamat: 'Jombang',
      luarKota: true,
      jumlahUnit: 1,
      catatan: 'warna putih',
      statusBayar: 'Lunas',
      totalBiaya: (UNIT_PRICE + LUAR_KOTA_SURCHARGE) * 1
    },
    {
      id: 'PO-20261030-010',
      timestamp: '2026-10-30 14:30:00',
      nama: 'Rudi',
      noHp: '08984167725',
      alamat: 'Jakarta',
      luarKota: false,
      jumlahUnit: 1,
      catatan: '',
      statusBayar: 'Belum Bayar',
      totalBiaya: UNIT_PRICE * 1
    }
  ];

  // App State
  const state = {
    orders: [],
    config: {
      gasApiUrl: '',
      targetUnits: DEFAULT_TARGET_UNITS,
      adminPhone: '6282298025436', // Default WhatsApp Admin
      useBaseOffset: true, // Reconciles with the 137 pemesan / 168 units from the user's screenshot
      baseOffsetPemesan: 127, // 127 + 10 = 137
      baseOffsetUnits: 152    // 152 + 16 = 168
    },
    isAdmin: false,
    filterStatus: 'all',
    searchQuery: '',
    currentPage: 1,
    pageSize: 15,
    isSyncing: false
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
    
    // Sync indicator
    syncStatusBtn: document.getElementById('syncStatusBtn'),
    syncDot: document.getElementById('syncDot'),
    syncText: document.getElementById('syncText'),
    
    // Table & controls
    orderTableBody: document.getElementById('orderTableBody'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchInput'),
    statusFilterSelect: document.getElementById('statusFilterSelect'),
    tableInfo: document.getElementById('tableInfo'),
    paginationWrap: document.getElementById('paginationWrap'),

    // Modals
    orderModal: document.getElementById('orderModal'),
    settingsModal: document.getElementById('settingsModal'),
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
    // Load config
    const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (savedConfig) {
      try {
        state.config = Object.assign({}, state.config, JSON.parse(savedConfig));
      } catch (e) {
        console.error('Error parsing saved config', e);
      }
    }

    // Load orders
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

  function saveConfigToLocal() {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(state.config));
  }

  // Calculate Aggregated Statistics
  function calculateStats() {
    let listUnits = 0;
    let listPemesan = state.orders.length;
    let totalDana = 0;

    let lunasUnits = 0;
    let dpUnits = 0;
    let unpaidUnits = 0;

    state.orders.forEach(order => {
      const units = Number(order.jumlahUnit) || 1;
      listUnits += units;
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

    // Apply baseline offset if enabled (reconciling with 137 pemesan / 168 units)
    let totalPemesan = listPemesan;
    let totalUnits = listUnits;

    if (state.config.useBaseOffset) {
      totalPemesan += state.config.baseOffsetPemesan;
      totalUnits += state.config.baseOffsetUnits;
      totalDana += (state.config.baseOffsetUnits * UNIT_PRICE);
    }

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
      unpaidUnits,
      listPemesan,
      listUnits
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

    // Sync button status
    if (state.config.gasApiUrl) {
      elements.syncDot.className = 'sync-dot';
      elements.syncText.textContent = state.isSyncing ? 'Menyinkronkan...' : 'Google Sheets Aktif';
    } else {
      elements.syncDot.className = 'sync-dot offline';
      elements.syncText.textContent = 'Mode Lokal (Belum Sync)';
    }
  }

  // Filter & Search Orders
  function getFilteredOrders() {
    let result = [...state.orders];

    // Filter by status
    if (state.filterStatus !== 'all') {
      result = result.filter(item => {
        const status = (item.statusBayar || '').toLowerCase();
        if (state.filterStatus === 'lunas') return status === 'lunas';
        if (state.filterStatus === 'dp') return status === 'dp';
        if (state.filterStatus === 'unpaid') return status === 'belum bayar' || status === 'unpaid' || !status;
        return true;
      });
    }

    // Filter by search query
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

      // Status Badge class
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

  // Render Pagination Buttons
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
  async function handleOrderSubmit(e) {
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

    // Add to Local State
    state.orders.unshift(newOrder);
    saveOrdersToLocal();
    renderStats();
    renderTable();
    closeModal(elements.orderModal);

    // Show Success Modal
    showSuccessOrderModal(newOrder);

    // Sync to Google Sheets if configured
    if (state.config.gasApiUrl) {
      syncOrderToGoogleSheets(newOrder);
    }
  }

  // Show Success Confirmation Modal with WhatsApp Confirmation Button
  function showSuccessOrderModal(order) {
    const modal = elements.successModal;
    document.getElementById('successSummaryNama').textContent = order.nama;
    document.getElementById('successSummaryUnits').textContent = `${order.jumlahUnit} Unit (${order.luarKota ? 'Luar Kota' : 'Jabodetabek'})`;
    document.getElementById('successSummaryTotal').textContent = formatIDR(order.totalBiaya);

    // WhatsApp Message Generator for Buyer to Admin
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

      // Sync status to Google Sheets
      if (state.config.gasApiUrl) {
        updateGoogleSheetsStatus(orderId, nextStatus);
      }
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

      // Sync delete to Google Sheets
      if (state.config.gasApiUrl) {
        deleteGoogleSheetsOrder(orderId);
      }
    }
  }

  // Google Sheets API Integration
  async function fetchFromGoogleSheets() {
    if (!state.config.gasApiUrl) {
      showToast('URL Google Apps Script belum dikonfigurasi!', 'warning');
      return;
    }

    state.isSyncing = true;
    renderStats();
    showToast('Menghubungkan ke Google Sheets...', 'info');

    try {
      const url = `${state.config.gasApiUrl}?action=getAll&_t=${Date.now()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.status === 'success' && Array.isArray(data.data)) {
        if (data.data.length > 0) {
          state.orders = data.data;
          saveOrdersToLocal();
          renderStats();
          renderTable();
          showToast(`Berhasil menarik ${data.data.length} data dari Google Sheets!`);
        } else {
          showToast('Google Sheet terhubung tetapi belum memiliki baris data.');
        }
      } else {
        throw new Error(data.message || 'Gagal memproses data Google Sheets');
      }
    } catch (err) {
      console.error('GAS Fetch Error:', err);
      showToast(`Koneksi Google Sheets gagal: ${err.message}`, 'error');
    } finally {
      state.isSyncing = false;
      renderStats();
    }
  }

  async function syncOrderToGoogleSheets(order) {
    if (!state.config.gasApiUrl) return;

    try {
      // POST with text/plain to prevent CORS preflight blocker on Google Apps Script
      await fetch(state.config.gasApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'add',
          ...order
        })
      });
      console.log('Order synced to Google Sheets successfully');
    } catch (e) {
      console.warn('Gagal sync ke Google Sheets via POST, mencoba fallback GET:', e);
      try {
        const params = new URLSearchParams({
          action: 'add',
          id: order.id,
          nama: order.nama,
          noHp: order.noHp,
          alamat: order.alamat,
          luarKota: order.luarKota ? 'Ya' : 'Tidak',
          jumlahUnit: order.jumlahUnit,
          catatan: order.catatan || '',
          statusBayar: order.statusBayar,
          totalBiaya: order.totalBiaya
        });
        await fetch(`${state.config.gasApiUrl}?${params.toString()}`);
      } catch (fallbackErr) {
        console.error('Fallback sync also failed:', fallbackErr);
      }
    }
  }

  async function updateGoogleSheetsStatus(id, newStatus) {
    if (!state.config.gasApiUrl) return;
    try {
      await fetch(state.config.gasApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          id: id,
          statusBayar: newStatus
        })
      });
    } catch (e) {
      console.error('Gagal update status di Google Sheets:', e);
    }
  }

  async function deleteGoogleSheetsOrder(id) {
    if (!state.config.gasApiUrl) return;
    try {
      await fetch(state.config.gasApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          id: id
        })
      });
    } catch (e) {
      console.error('Gagal hapus di Google Sheets:', e);
    }
  }

  // Upload Current Local Data to Google Sheets in Bulk
  async function uploadLocalDataToGoogleSheets() {
    if (!state.config.gasApiUrl) {
      showToast('Konfigurasi URL Google Apps Script terlebih dahulu!', 'warning');
      return;
    }

    if (!confirm(`Kirim seluruh ${state.orders.length} data pemesan lokal ke Google Sheet?`)) {
      return;
    }

    showToast('Mengirim seluruh data ke Google Sheet...', 'info');
    try {
      const res = await fetch(state.config.gasApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batchImport',
          items: state.orders
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast('Semua data lokal berhasil diunggah ke Google Sheet!');
      } else {
        throw new Error(data.message || 'Gagal batch import');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      showToast(`Gagal mengunggah ke Google Sheet: ${err.message}`, 'error');
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

💰 *Status Pembayaran Terdata*:
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
      console.error('Gagal copy clipboard', err);
      // Fallback
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

      // Match pattern like: "1. Fikri — Bekasi — 082298025436 — 5 unit" or CSV or comma separated
      // Remove leading numbering like "1.", "1 -", etc.
      const withoutNumber = clean.replace(/^\d+[\.\-\)]\s*/, '');
      const parts = withoutNumber.split(/\s*[—\-\|,]\s*/);

      if (parts.length >= 2) {
        const nama = parts[0] || `Pemesan ${index + 1}`;
        let alamat = '';
        let noHp = '';
        let units = 1;
        let catatan = '';

        // Inspect remaining parts
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

  // Escape HTML helper for safety
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
    // Default PIN: admin123 or admin
    if (pin === 'admin123' || pin === 'admin' || pin === '1234') {
      state.isAdmin = true;
      document.body.classList.add('admin-mode-active');
      const badge = document.getElementById('adminModeBadge');
      if (badge) badge.style.display = 'inline-flex';
      closeModal(elements.adminLoginModal);
      document.getElementById('adminPinInput').value = '';
      showToast('Mode Admin aktif! Anda dapat mengedit status dan mengelola pesanan.');
      renderTable();
    } else {
      showToast('PIN Admin salah! (Default PIN: admin123)', 'error');
    }
  }

  // Bind Event Listeners
  function bindEvents() {
    // Stepper buttons
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

    // Open Modals
    document.getElementById('btnOpenOrderModal').onclick = () => {
      elements.orderForm.reset();
      elements.inputJumlahUnit.value = 1;
      updateFormCalculation();
      openModal(elements.orderModal);
    };

    document.getElementById('btnOpenSettings').onclick = () => {
      document.getElementById('settingGasUrl').value = state.config.gasApiUrl || '';
      document.getElementById('settingAdminPhone').value = state.config.adminPhone || '';
      document.getElementById('settingTargetUnits').value = state.config.targetUnits || DEFAULT_TARGET_UNITS;
      document.getElementById('settingUseBaseOffset').checked = state.config.useBaseOffset;
      openModal(elements.settingsModal);
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

    // Close Modals
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.onclick = function () {
        const modal = this.closest('.modal-overlay');
        closeModal(modal);
      };
    });

    // Close Modal on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
      };
    });

    // Submit Order Form
    elements.orderForm.onsubmit = handleOrderSubmit;

    // Filter status pills
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

    // Search query
    elements.searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      renderTable();
    };

    // WhatsApp Broadcast Recap Button
    document.getElementById('btnShareWA').onclick = copyWhatsAppRecap;

    // Export CSV
    document.getElementById('btnExportCSV').onclick = exportToCSV;

    // Batch Import submit
    document.getElementById('btnSubmitImport').onclick = handleBatchImportText;

    // Admin Login Form
    document.getElementById('adminLoginForm').onsubmit = handleAdminLogin;

    // Save Settings
    document.getElementById('settingsForm').onsubmit = (e) => {
      e.preventDefault();
      state.config.gasApiUrl = document.getElementById('settingGasUrl').value.trim();
      state.config.adminPhone = document.getElementById('settingAdminPhone').value.trim();
      state.config.targetUnits = parseInt(document.getElementById('settingTargetUnits').value) || DEFAULT_TARGET_UNITS;
      state.config.useBaseOffset = document.getElementById('settingUseBaseOffset').checked;
      saveConfigToLocal();
      closeModal(elements.settingsModal);
      showToast('Pengaturan berhasil disimpan!');
      renderStats();
      renderTable();
    };

    // Test & Sync Google Sheets Buttons in Settings
    document.getElementById('btnSyncGoogleSheets').onclick = () => {
      fetchFromGoogleSheets();
    };

    document.getElementById('btnUploadToGoogleSheets').onclick = () => {
      uploadLocalDataToGoogleSheets();
    };

    // Table click delegation (Status change & Delete)
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

    // Copy Google Script Button in Settings
    const btnCopyCode = document.getElementById('btnCopyGasScript');
    if (btnCopyCode) {
      btnCopyCode.onclick = () => {
        const code = document.getElementById('gasScriptCode').textContent;
        navigator.clipboard.writeText(code).then(() => {
          showToast('Kode Apps Script berhasil disalin ke clipboard!');
        });
      };
    }
  }

  // Application Entry Point
  function init() {
    initStorage();
    bindEvents();
    renderStats();
    renderTable();

    // Auto-sync on startup if Google Sheets URL is available
    if (state.config.gasApiUrl) {
      fetchFromGoogleSheets();
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
