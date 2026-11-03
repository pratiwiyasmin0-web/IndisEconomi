<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>indisEconomi – Kelola Dompet Anak Kos</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="bg-gray-50 font-inter min-h-screen pb-24">

  <!-- ═══════════════════════════════════════════
       TOP APP BAR
  ═══════════════════════════════════════════ -->
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div class="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <span class="text-white text-xs font-bold">iE</span>
        </div>
        <span class="font-bold text-gray-900 text-base tracking-tight">indisEconomi</span>
      </div>
      <div class="flex items-center gap-3">
        <span id="topBadgeDate" class="text-xs text-gray-400 font-medium"></span>
        <button id="btnNotif" class="relative p-1.5 rounded-full hover:bg-gray-100 transition">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span id="notifDot" class="hidden absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- ═══════════════════════════════════════════
       GATE SCREEN — Muncul sebelum aktivasi Pro
  ═══════════════════════════════════════════ -->
  <div id="gateScreen" style="display:none;position:fixed;inset:0;z-index:9999;flex-direction:column;align-items:center;justify-content:flex-end;background:linear-gradient(160deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%);">

    <!-- Dekorasi lingkaran -->
    <div style="position:absolute;top:-60px;left:-60px;width:220px;height:220px;border-radius:50%;background:rgba(139,92,246,.15);"></div>
    <div style="position:absolute;top:80px;right:-40px;width:150px;height:150px;border-radius:50%;background:rgba(236,72,153,.1);"></div>
    <div style="position:absolute;top:200px;left:30px;width:80px;height:80px;border-radius:50%;background:rgba(99,102,241,.12);"></div>

    <!-- Logo area -->
    <div style="position:absolute;top:0;left:0;right:0;padding:60px 32px 0;text-align:center;">
      <div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 8px 32px rgba(99,102,241,.4);">
        <span style="color:white;font-size:1.6rem;font-weight:900;font-family:Inter,sans-serif;">iE</span>
      </div>
      <h1 style="color:white;font-size:1.75rem;font-weight:900;margin:0;letter-spacing:-0.5px;">indisEconomi</h1>
      <p style="color:#c4b5fd;font-size:0.85rem;margin-top:6px;">Kelola Dompet Anak Kos, Lebih Cerdas</p>

      <!-- Fitur list -->
      <div style="margin-top:32px;text-align:left;max-width:280px;margin-left:auto;margin-right:auto;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;shrink:0;">📊</div>
          <p style="color:#e0d9ff;font-size:0.8rem;margin:0;">Pantau saldo, pengeluaran &amp; pemasukan</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;">🤖</div>
          <p style="color:#e0d9ff;font-size:0.8rem;margin:0;">AI Advisor konsultasi keuangan unlimited</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;">💰</div>
          <p style="color:#e0d9ff;font-size:0.8rem;margin:0;">Alokasi otomatis harian &amp; mingguan</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;">📥</div>
          <p style="color:#e0d9ff;font-size:0.8rem;margin:0;">Export data &amp; analitik lanjutan</p>
        </div>
      </div>
    </div>

    <!-- Bottom sheet CTA -->
    <div style="width:100%;max-width:480px;background:white;border-radius:28px 28px 0 0;padding:28px 24px 40px;">
      <!-- Badge harga -->
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px;">
        <span style="font-size:1.8rem;">👑</span>
        <div>
          <p style="font-size:1.1rem;font-weight:900;color:#111827;margin:0;">indisEconomi <span style="color:#7c3aed;">Pro</span></p>
          <p style="font-size:0.75rem;color:#9ca3af;margin:0;">Akses penuh semua fitur</p>
        </div>
        <div style="margin-left:auto;text-align:right;">
          <p style="font-size:0.7rem;color:#9ca3af;text-decoration:line-through;margin:0;">Rp30.000</p>
          <p style="font-size:1.2rem;font-weight:900;color:#7c3aed;margin:0;">Rp15.000<span style="font-size:0.65rem;font-weight:500;color:#9ca3af;">/bln</span></p>
        </div>
      </div>

      <!-- Tombol WA Admin -->
      <button onclick="gateOpenWA()"
        style="width:100%;padding:16px;border-radius:16px;background:linear-gradient(to right,#7c3aed,#4f46e5);color:white;font-weight:800;font-size:1rem;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(99,102,241,.4);margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span style="font-size:1.1rem;">💬</span> Berlangganan via WhatsApp
      </button>

      <!-- Tombol punya kode -->
      <button onclick="openActivationModal()"
        style="width:100%;padding:13px;border-radius:16px;background:#f5f3ff;color:#7c3aed;font-weight:700;font-size:0.9rem;border:2px solid #ede9fe;cursor:pointer;">
        🔑 Sudah punya kode aktivasi?
      </button>

      <p style="text-align:center;font-size:0.65rem;color:#d1d5db;margin-top:14px;">
        Hanya Rp15.000/bulan · Bayar via transfer · Kode dikirim admin
      </p>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       APP WRAPPER (disembunyikan sebelum Pro)
  ═══════════════════════════════════════════ -->
  <div id="appWrapper">
  <main class="max-w-lg mx-auto px-4 pt-5">

    <!-- ───────── PAGE: DASHBOARD ───────── -->
    <div id="pageDashboard" class="page-section">

      <!-- Greeting -->
      <div class="mb-5">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Selamat datang 👋</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">Dompetmu hari ini</h1>
      </div>

      <!-- Balance Hero Card -->
      <div class="relative overflow-hidden rounded-2xl p-5 mb-4 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 shadow-lg shadow-indigo-200">
        <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full"></div>
        <div class="absolute -bottom-8 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
        <p class="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Sisa Saldo Keseluruhan</p>
        <p id="heroBalance" class="text-4xl font-extrabold text-white mb-3 relative z-10">Rp 0</p>
        <div class="flex gap-4 relative z-10">
          <div class="flex-1 bg-white/15 rounded-xl p-3">
            <p class="text-indigo-100 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Pemasukan Bulan Ini</p>
            <p id="heroIncome" class="text-white text-lg font-bold">Rp 0</p>
          </div>
          <div class="flex-1 bg-white/15 rounded-xl p-3">
            <p class="text-indigo-100 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Pengeluaran Bulan Ini</p>
            <p id="heroExpense" class="text-white text-lg font-bold">Rp 0</p>
          </div>
        </div>
      </div>

      <!-- Weekly & Daily Summary Row -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <!-- Kartu Minggu Ini -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-xs text-gray-400 font-medium">Minggu Ini</p>
          </div>
          <p id="weeklyExpense" class="text-lg font-bold text-gray-800">Rp 0</p>
          <p id="weeklyRemain" class="text-[10px] text-gray-400 mt-0.5 font-semibold">pengeluaran</p>
          <p id="weeklyAlloc" class="text-[10px] text-gray-300 mt-0.5">minggu ini</p>
        </div>
        <!-- Kartu Hari Ini -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs text-gray-400 font-medium">Hari Ini</p>
          </div>
          <p id="dailyAvg" class="text-lg font-bold text-gray-800">Rp 0</p>
          <p id="dailyRemain" class="text-[10px] text-gray-400 mt-0.5 font-semibold">pengeluaran</p>
          <p id="dailyAlloc" class="text-[10px] text-gray-300 mt-0.5">hari ini</p>
        </div>
      </div>

      <!-- Monthly Breakdown Bar -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold text-gray-700">Rincian Bulan Ini</p>
          <span id="monthLabel" class="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full"></span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div id="budgetBar" class="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500" style="width:0%"></div>
          </div>
          <span id="budgetPct" class="text-xs font-bold text-gray-600 w-9 text-right">0%</span>
        </div>
        <p class="text-[11px] text-gray-400">Sisa <span id="budgetLeft" class="font-semibold text-gray-600">Rp 0</span> dari budget <span id="budgetTotal" class="font-semibold text-gray-600">Rp 0</span></p>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold text-gray-700">Pengeluaran per Kategori</p>
          <button id="btnSemuaKat" class="text-xs text-indigo-500 font-medium">Lihat Semua</button>
        </div>
        <div id="categoryList" class="space-y-2.5">
          <p class="text-xs text-gray-400 text-center py-4">Belum ada transaksi pengeluaran.</p>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold text-gray-700">Transaksi Terbaru</p>
          <button id="btnSemuaTrx" class="text-xs text-indigo-500 font-medium">Lihat Semua</button>
        </div>
        <div id="recentTxList" class="space-y-1.5">
          <p class="text-xs text-gray-400 text-center py-4">Belum ada transaksi.</p>
        </div>
      </div>

      <!-- Quick AI Tip Card -->
      <div id="aiTipCard" class="relative overflow-hidden rounded-2xl p-4 mb-2 bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg shadow-pink-100 cursor-pointer" onclick="openAiChat()">
        <div class="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div class="flex items-start gap-3 relative z-10">
          <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span class="text-xl">🤖</span>
          </div>
          <div>
            <p class="text-white font-bold text-sm mb-0.5">Tanya AI Advisor</p>
            <p id="aiTipText" class="text-pink-100 text-xs leading-relaxed">Konsultasikan kondisi keuanganmu ke AI untuk tips hemat ala anak kos!</p>
          </div>
        </div>
      </div>

    </div><!-- /pageDashboard -->


    <!-- ───────── PAGE: TRANSAKSI ───────── -->
    <div id="pageTransaksi" class="page-section hidden">
      <div class="mb-5">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Riwayat Lengkap</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">Transaksi</h1>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <button class="filter-tab active-tab" data-filter="all">Semua</button>
        <button class="filter-tab" data-filter="expense">Pengeluaran</button>
        <button class="filter-tab" data-filter="income">Pemasukan</button>
        <button class="filter-tab" data-filter="Makanan">🍜 Makanan</button>
        <button class="filter-tab" data-filter="Transportasi">🚌 Transport</button>
        <button class="filter-tab" data-filter="Kos/Sewa">🏠 Kos</button>
        <button class="filter-tab" data-filter="Hiburan">🎮 Hiburan</button>
        <button class="filter-tab" data-filter="Lainnya">📦 Lainnya</button>
      </div>

      <!-- Transaction List Full -->
      <div id="fullTxList" class="space-y-2">
        <p class="text-xs text-gray-400 text-center py-8">Belum ada transaksi.</p>
      </div>
    </div><!-- /pageTransaksi -->


    <!-- ───────── PAGE: TAMBAH TRANSAKSI ───────── -->
    <div id="pageTambah" class="page-section hidden">
      <div class="mb-5">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Tambah Baru</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">Catat Transaksi</h1>
      </div>

      <!-- Type Toggle -->
      <div class="flex bg-gray-100 rounded-2xl p-1 mb-5">
        <button id="typeExpense" class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white text-red-500 shadow-sm" onclick="setType('expense')">
          🔴 Pengeluaran
        </button>
        <button id="typeIncome" class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-gray-400" onclick="setType('income')">
          🟢 Pemasukan
        </button>
      </div>

      <form id="formTambah" onsubmit="submitTransaction(event)" class="space-y-4">
        <!-- Amount -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label class="form-label">Jumlah (Rp)</label>
          <div class="relative mt-1.5">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rp</span>
            <input id="fAmount" type="number" placeholder="0" min="0"
              class="form-input pl-9" required oninput="updateBudgetPreview()" />
          </div>
          <!-- Quick Amount Buttons -->
          <div class="flex flex-wrap gap-2 mt-2.5">
            <button type="button" class="quick-amt" onclick="addQuickAmt(5000)">+5K</button>
            <button type="button" class="quick-amt" onclick="addQuickAmt(10000)">+10K</button>
            <button type="button" class="quick-amt" onclick="addQuickAmt(20000)">+20K</button>
            <button type="button" class="quick-amt" onclick="addQuickAmt(50000)">+50K</button>
            <button type="button" class="quick-amt" onclick="addQuickAmt(100000)">+100K</button>
          </div>
        </div>

        <!-- Category -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label class="form-label">Kategori</label>
          <div id="categoryGrid" class="grid grid-cols-3 gap-2 mt-2">
          </div>
        </div>

        <!-- Date & Note -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div>
            <label class="form-label">Tanggal</label>
            <input id="fDate" type="date" class="form-input mt-1.5" required />
          </div>
          <div>
            <label class="form-label">Catatan (opsional)</label>
            <input id="fNote" type="text" placeholder="mis. Makan siang nasi goreng..." class="form-input mt-1.5" />
          </div>
        </div>

        <!-- Budget setup (income only) -->
        <div id="budgetSection" class="hidden bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <label class="form-label text-indigo-700">Set sebagai Budget Bulanan?</label>
          <div class="flex items-center gap-2 mt-2">
            <input id="fSetBudget" type="checkbox" class="w-4 h-4 accent-indigo-600" onchange="updateBudgetPreview()" />
            <span class="text-xs text-indigo-600">Ya, jadikan ini budget bulan ini</span>
          </div>
          <!-- Preview alokasi otomatis -->
          <div id="budgetPreview" class="hidden mt-3 pt-3 border-t border-indigo-100 space-y-2">
            <p class="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">Alokasi Otomatis</p>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-white rounded-xl p-2.5 text-center">
                <p class="text-[10px] text-gray-400 mb-0.5">Per Minggu</p>
                <p id="previewWeekly" class="text-sm font-extrabold text-indigo-600">Rp 0</p>
                <p class="text-[9px] text-gray-300">÷ 4,33 minggu</p>
              </div>
              <div class="bg-white rounded-xl p-2.5 text-center">
                <p class="text-[10px] text-gray-400 mb-0.5">Per Hari</p>
                <p id="previewDaily" class="text-sm font-extrabold text-orange-500">Rp 0</p>
                <p class="text-[9px] text-gray-300">÷ hari bulan ini</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button type="submit"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
          💾 Simpan Transaksi
        </button>
      </form>
    </div><!-- /pageTambah -->


    <!-- ───────── PAGE: AI ADVISOR ───────── -->
    <div id="pageAI" class="page-section hidden flex flex-col">
      <div class="mb-4">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Konsultasi Cerdas</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">AI Advisor 🤖</h1>
      </div>

      <!-- AI Summary Banner -->
      <div id="aiSummaryBanner" class="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <span class="text-xl">💰</span>
        </div>
        <div>
          <p class="text-xs text-gray-500">Sisa saldo kamu saat ini</p>
          <p id="aiBannerBalance" class="text-lg font-extrabold text-indigo-700">Rp 0</p>
        </div>
        <div class="ml-auto">
          <span id="aiUsageChip" class="text-xs font-semibold px-2 py-1 rounded-full bg-violet-100 text-violet-600">3 sisa</span>
        </div>
      </div>

      <!-- Suggested Questions -->
      <div class="mb-3">
        <p class="text-xs text-gray-400 font-medium mb-2">Pertanyaan Cepat</p>
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button class="suggest-chip" onclick="sendSuggest(this)">💸 Tips hemat akhir bulan</button>
          <button class="suggest-chip" onclick="sendSuggest(this)">🍜 Menu makan murah</button>
          <button class="suggest-chip" onclick="sendSuggest(this)">📊 Evaluasi pengeluaranku</button>
          <button class="suggest-chip" onclick="sendSuggest(this)">🎯 Cara nabung anak kos</button>
        </div>
      </div>

      <!-- Chat Box -->
      <div id="chatBox" class="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-3 min-h-64 max-h-96 overflow-y-auto mb-3 scroll-smooth">
        <!-- Welcome Message -->
        <div class="flex gap-2 items-start">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
            <span class="text-xs">🤖</span>
          </div>
          <div class="bg-indigo-50 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[80%]">
            <p class="text-xs text-gray-700 leading-relaxed">Halo! Aku AI Advisor kamu 👋 Cerita kondisi keuanganmu atau tanya apapun soal tips hemat ala anak kos. Aku siap bantu!</p>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="flex gap-2 items-end">
        <div class="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm px-3 py-2.5">
          <textarea id="chatInput" rows="1" placeholder="Tanya AI soal keuanganmu..."
            class="w-full text-sm text-gray-700 resize-none bg-transparent outline-none leading-relaxed"
            onkeydown="handleChatKey(event)"
            oninput="autoResize(this)"></textarea>
        </div>
        <button onclick="sendChat()" id="btnSendChat"
          class="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 active:scale-95 transition-transform shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p class="text-center text-[10px] text-gray-300 mt-2">AI ini memberikan saran umum. Bukan nasihat keuangan profesional.</p>
    </div><!-- /pageAI -->


    <!-- ───────── PAGE: RIWAYAT BULANAN ───────── -->
    <div id="pageRiwayat" class="page-section hidden">
      <div class="mb-5">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Arsip Keuangan</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">Riwayat Bulanan</h1>
      </div>
      <!-- Info banner -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 mb-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🗂️</span>
        <div>
          <p class="text-xs font-semibold text-indigo-700">Arsip Otomatis</p>
          <p class="text-xs text-indigo-500 mt-0.5">Data bulan lalu otomatis diarsipkan setiap awal bulan baru. Data tidak hilang!</p>
        </div>
      </div>
      <div id="riwayatList">
        <div class="text-center py-12">
          <p class="text-4xl mb-3">📭</p>
          <p class="text-sm font-semibold text-gray-500">Belum ada riwayat</p>
          <p class="text-xs text-gray-400 mt-1">Riwayat muncul otomatis tiap pergantian bulan</p>
        </div>
      </div>
    </div><!-- /pageRiwayat -->

    <!-- ───────── PAGE: PROFIL ───────── -->
    <div id="pageProfil" class="page-section hidden">
      <div class="mb-5">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Akun Kamu</p>
        <h1 class="text-2xl font-extrabold text-gray-900 mt-0.5">Profil</h1>
      </div>

      <!-- Avatar & Name -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 mb-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl shadow-md shrink-0">
          😊
        </div>
        <div class="flex-1 min-w-0">
          <p id="profileName" class="font-bold text-gray-900 text-lg truncate">Pengguna Baru</p>
          <p id="profileInfo" class="text-xs text-gray-400 truncate mt-0.5">Anggota indisEconomi</p>
          <span id="profileBadge" class="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">FREE</span>
        </div>
        <button onclick="openEditProfile()" class="p-2 rounded-xl hover:bg-gray-50 transition shrink-0">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p id="statTxCount" class="text-xl font-extrabold text-gray-800">0</p>
          <p class="text-[10px] text-gray-400 mt-0.5">Transaksi</p>
        </div>
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p id="statDaysActive" class="text-xl font-extrabold text-gray-800">0</p>
          <p class="text-[10px] text-gray-400 mt-0.5">Hari Aktif</p>
        </div>
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p id="statAiUsed" class="text-xl font-extrabold text-purple-600">0</p>
          <p class="text-[10px] text-gray-400 mt-0.5">Tanya AI</p>
        </div>
      </div>

      <!-- Upgrade Banner (disembunyikan jika sudah Pro) -->
      <div id="upgradeBanner" class="relative overflow-hidden rounded-2xl p-4 mb-4 bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 shadow-lg shadow-orange-100 cursor-pointer" onclick="openPaywall('profile')">
        <div class="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full"></div>
        <div class="flex items-start gap-3 relative z-10">
          <span class="text-3xl">👑</span>
          <div>
            <p class="text-white font-bold">Upgrade ke Pro</p>
            <p class="text-orange-50 text-xs mt-0.5">AI unlimited + fitur eksklusif hanya Rp15.000/bulan!</p>
          </div>
        </div>
        <button class="mt-3 w-full py-2 rounded-xl bg-white font-bold text-orange-500 text-sm shadow-sm active:scale-95 transition-transform">
          Berlangganan via WhatsApp →
        </button>
      </div>

      <!-- Settings Menu -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="proFeature('export')">
          <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Export Data (CSV) <span class="text-[10px] font-bold text-orange-400 ml-1">PRO</span></span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="navigate('Riwayat')">
          <div class="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Riwayat Bulanan</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="proFeature('backup')">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Backup Data <span class="text-[10px] font-bold text-orange-400 ml-1">PRO</span></span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="proFeature('import')">
          <div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Restore Backup <span class="text-[10px] font-bold text-orange-400 ml-1">PRO</span></span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="proFeature('chart')">
          <div class="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Grafik Analitik <span class="text-[10px] font-bold text-orange-400 ml-1">PRO</span></span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="openEditProfile()">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Edit Data Pribadi</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="openActivationModal()">
          <div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Masukkan Kode Aktivasi Pro</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50" onclick="resetData()">
          <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Reset Data Transaksi</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button onclick="openOnboarding()" class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50">
          <div class="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Panduan Cara Pakai</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition">
          <div class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 flex-1 text-left">Tentang Aplikasi</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <p class="text-center text-[11px] text-gray-300 pb-2">indisEconomi v1.0 · Made with ❤️ for Anak Kos</p>
    </div><!-- /pageProfil -->

  </main>
  </div><!-- /appWrapper -->

  <!-- ═══════════════════════════════════════════
       BOTTOM NAV BAR
  ═══════════════════════════════════════════ -->
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-2xl shadow-black/5">
    <div class="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
      <button class="nav-btn active-nav" data-page="Dashboard" onclick="navigate('Dashboard')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </button>
      <button class="nav-btn" data-page="Transaksi" onclick="navigate('Transaksi')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>Transaksi</span>
      </button>
      <!-- FAB Add Button -->
      <button onclick="navigate('Tambah')" class="relative -top-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-300 active:scale-95 transition-transform">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button class="nav-btn" data-page="AI" onclick="navigate('AI')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>AI Chat</span>
      </button>
      <button class="nav-btn" data-page="Profil" onclick="navigate('Profil')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Profil</span>
      </button>
    </div>
  </nav>


  <!-- ═══════════════════════════════════════════
       MODAL: PAYWALL (Drama China ✨)
  ═══════════════════════════════════════════ -->
  <div id="paywallModal" class="fixed inset-0 z-50 hidden flex items-end justify-center bg-black/50 backdrop-blur-sm p-4">
    <div id="paywallSheet" class="paywall-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden transform translate-y-full">
      <!-- Gradient Banner -->
      <div class="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 p-6 text-center">
        <div class="absolute inset-0 opacity-20" style="background: radial-gradient(circle at 50% 0%, white 0%, transparent 60%)"></div>
        <!-- Sparkle decorations -->
        <div class="absolute top-3 left-6 text-2xl opacity-60 animate-bounce-slow">✨</div>
        <div class="absolute top-5 right-8 text-xl opacity-40 animate-bounce-slow" style="animation-delay:.3s">⭐</div>
        <div class="absolute bottom-3 left-10 text-lg opacity-30">💫</div>
        <div class="relative z-10">
          <div class="text-5xl mb-2">👑</div>
          <h2 class="text-white text-2xl font-extrabold leading-tight">indisEconomi</h2>
          <div class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-1 tracking-widest">PRO</div>
        </div>
      </div>

      <!-- Drama Text -->
      <div class="px-5 pt-5 pb-3 text-center">
        <p id="paywallHeadline" class="text-gray-900 text-lg font-extrabold leading-snug mb-2">
          Dompetmu menjerit di tanggal tua? 😭
        </p>
        <p class="text-gray-500 text-sm leading-relaxed">
          Jangan biarkan AI berhenti menyelamatkan keuanganmu!<br/>
          Buka akses <strong class="text-violet-600">Pro</strong> sepuasnya dan atasi krisis dompet selamanya.
        </p>
      </div>

      <!-- Features List -->
      <div class="mx-5 my-3 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 space-y-2.5">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0"><span class="text-sm">🤖</span></div>
          <p class="text-sm text-gray-700 font-medium">AI Advisor <span class="font-bold text-violet-600">UNLIMITED</span></p>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"><span class="text-sm">📊</span></div>
          <p class="text-sm text-gray-700 font-medium">Grafik & Analitik Lanjutan</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0"><span class="text-sm">📥</span></div>
          <p class="text-sm text-gray-700 font-medium">Export Data ke CSV / PDF</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center shrink-0"><span class="text-sm">🎯</span></div>
          <p class="text-sm text-gray-700 font-medium">Target Tabungan Otomatis</p>
        </div>
      </div>

      <!-- Price Badge -->
      <div class="mx-5 flex items-center justify-center gap-3 my-3">
        <p class="text-gray-400 text-sm line-through">Rp 30.000</p>
        <div class="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">HEMAT 50%!</div>
        <p class="text-2xl font-extrabold text-gray-900">Rp 15.000<span class="text-sm font-normal text-gray-400">/bln</span></p>
      </div>

      <!-- CTA Buttons -->
      <div class="px-5 pb-6 space-y-2.5">
        <button onclick="subscribePro()"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-fuchsia-200 active:scale-95 transition-transform flex items-center justify-center gap-2 pulse-glow">
          <span>👑</span> Berlangganan Sekarang
        </button>
        <button onclick="closePaywall()"
          class="w-full py-3 rounded-2xl border border-gray-200 text-gray-400 font-medium text-sm hover:bg-gray-50 transition">
          Nanti saja, tetap gratis
        </button>
      </div>
    </div>
  </div>


  <!-- ═══════════════════════════════════════════
       MODAL: SUCCESS TOAST
  ═══════════════════════════════════════════ -->
  <div id="toastSuccess" class="fixed top-20 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
    <div id="toastInner" class="hidden bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-xs">
      <span id="toastIcon" class="text-base">✅</span>
      <span id="toastMsg">Berhasil!</span>
    </div>
  </div>


  <!-- ═══════════════════════════════════════════
       MODAL: CONFIRM DIALOG
  ═══════════════════════════════════════════ -->
  <div id="confirmModal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl">
      <p class="text-base font-bold text-gray-900 mb-2" id="confirmTitle">Konfirmasi</p>
      <p class="text-sm text-gray-500 mb-5" id="confirmMsg">Apakah kamu yakin?</p>
      <div class="flex gap-2">
        <button id="confirmCancel" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">Batal</button>
        <button id="confirmOk" class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold active:scale-95 transition-transform">Ya, Lanjutkan</button>
      </div>
    </div>
  </div>


  <!-- ═══════════════════════════════════════════
       MODAL: ONBOARDING (Cara Pakai)
  ═══════════════════════════════════════════ -->
  <div id="onboardingModal" class="ob-modal-wrap">
    <div id="onboardingSheet" class="ob-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden">

      <!-- Progress Bar -->
      <div class="h-1 bg-gray-100 w-full">
        <div id="obProgress" class="h-full bg-indigo-500 transition-all duration-500 rounded-full" style="width:20%"></div>
      </div>

      <!-- Gradient Header -->
      <div id="obGradient" class="ob-gradient bg-gradient-to-br from-violet-600 to-indigo-600 px-6 pt-8 pb-6 text-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background:radial-gradient(circle at 50% 0%,white,transparent 70%)"></div>
        <!-- Back button -->
        <button onclick="onboardingPrev()"
          style="position:absolute;top:16px;left:16px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.2);color:white;font-size:16px;border:none;cursor:pointer;z-index:10;">
          &#8592;
        </button>
        <div id="obEmoji" style="font-size:3.5rem;margin-bottom:12px;position:relative;z-index:10;">👋</div>
        <h2 id="obTitle" style="color:white;font-size:1.2rem;font-weight:800;line-height:1.3;position:relative;z-index:10;">
          Selamat datang di<br/>indisEconomi!
        </h2>
      </div>

      <!-- Dots -->
      <div id="obDots" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 0 4px;"></div>

      <!-- Content -->
      <div id="obContent" class="px-5 pt-3 pb-2">
        <p id="obDesc" class="text-sm text-gray-600 leading-relaxed text-center"></p>

        <!-- Tip box -->
        <div id="obTip" class="hidden mt-4 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <p id="obTipText" class="text-xs text-amber-700 font-medium leading-relaxed"></p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="px-5 pb-8 pt-4 space-y-2.5">
        <button id="obBtnNext" onclick="onboardingNext()"
          style="width:100%;padding:16px;border-radius:16px;background:linear-gradient(to right,#7c3aed,#4f46e5);color:white;font-weight:700;font-size:1rem;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(99,102,241,0.4);">
          Lanjut &rarr;
        </button>
        <button id="obBtnSkip" onclick="closeOnboarding()"
          style="width:100%;padding:12px;border-radius:16px;background:transparent;color:#9ca3af;font-size:0.875rem;border:none;cursor:pointer;">
          Lewati panduan
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       MODAL: SETUP PROFIL (pertama kali masuk)
  ═══════════════════════════════════════════ -->
  <div id="setupProfileModal" class="ob-modal-wrap">
    <div id="setupProfileSheet" class="ob-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden">

      <!-- Gradient Header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 24px 24px;text-align:center;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;opacity:.1;background:radial-gradient(circle at 50% 0%,white,transparent 70%);"></div>
        <div style="font-size:3rem;margin-bottom:10px;position:relative;z-index:1;">🎉</div>
        <h2 style="color:white;font-size:1.2rem;font-weight:900;margin:0;position:relative;z-index:1;">Aktivasi Berhasil!</h2>
        <p style="color:#c4b5fd;font-size:0.8rem;margin-top:6px;position:relative;z-index:1;">Satu langkah lagi — isi data dirimu dulu</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center gap-2 px-5 pt-4 pb-2">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span class="text-xs font-semibold text-emerald-600">Kode Aktivasi</span>
        </div>
        <div class="flex-1 h-0.5 bg-indigo-200 rounded-full"></div>
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
            <span class="text-white text-[10px] font-bold">2</span>
          </div>
          <span class="text-xs font-semibold text-indigo-600">Data Diri</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-200 rounded-full"></div>
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400 text-[10px] font-bold">3</span>
          </div>
          <span class="text-xs font-semibold text-gray-400">Masuk App</span>
        </div>
      </div>

      <!-- Form -->
      <div class="px-5 pt-2 pb-2 space-y-3 overflow-y-auto max-h-[50vh]">
        <p id="spError" class="hidden text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-xl"></p>

        <div>
          <label class="form-label">Nama Lengkap <span class="text-red-400">*</span></label>
          <input id="spName" type="text" placeholder="mis. Budi Santoso"
            class="form-input mt-1.5" oninput="document.getElementById('spError').classList.add('hidden')" />
        </div>

        <div>
          <label class="form-label">Jenjang Pendidikan</label>
          <div class="grid grid-cols-3 gap-2 mt-1.5" id="spLevelGrid">
            <button type="button" class="sp-level-btn selected" data-level="Kuliah" onclick="selectLevel(this)">
              🎓 Kuliah
            </button>
            <button type="button" class="sp-level-btn" data-level="SMA/SMK" onclick="selectLevel(this)">
              📚 SMA/SMK
            </button>
            <button type="button" class="sp-level-btn" data-level="Lainnya" onclick="selectLevel(this)">
              📖 Lainnya
            </button>
          </div>
        </div>

        <div>
          <label class="form-label" id="spSchoolLabel">Nama Sekolah / Kampus</label>
          <input id="spUniversity" type="text" placeholder="mis. Universitas Telkom / SMKN 1 Bandung"
            class="form-input mt-1.5" />
        </div>

        <div>
          <label class="form-label" id="spMajorLabel">Jurusan / Program Studi</label>
          <input id="spMajor" type="text" placeholder="mis. Teknik Informatika / RPL"
            class="form-input mt-1.5" />
        </div>

        <div>
          <label class="form-label" id="spYearLabel">Angkatan / Tahun Masuk</label>
          <input id="spYear" type="text" placeholder="mis. 2023"
            class="form-input mt-1.5" maxlength="4" />
        </div>
      </div>

      <!-- Submit -->
      <div class="px-5 pb-8 pt-3">
        <button onclick="saveSetupProfile()"
          style="width:100%;padding:16px;border-radius:16px;background:linear-gradient(to right,#7c3aed,#4f46e5);color:white;font-weight:800;font-size:1rem;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(99,102,241,.35);display:flex;align-items:center;justify-content:center;gap:8px;">
          <span>🚀</span> Masuk ke indisEconomi!
        </button>
        <p style="text-align:center;font-size:0.7rem;color:#9ca3af;margin-top:10px;">Data ini hanya tersimpan di perangkatmu</p>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       MODAL: EDIT DATA PRIBADI
  ═══════════════════════════════════════════ -->
  <div id="editProfileModal" class="ob-modal-wrap">
    <div id="editProfileSheet" class="ob-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden">
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
      </div>
      <!-- Header -->
      <div class="px-5 pt-2 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-base font-extrabold text-gray-900">Data Pribadi</h3>
        <button onclick="closeEditProfile()" class="p-1.5 rounded-xl hover:bg-gray-100 transition">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Form -->
      <div class="px-5 py-4 space-y-3 overflow-y-auto max-h-[65vh]">
        <p class="text-xs text-gray-400 leading-relaxed">Isi data dirimu agar admin bisa mengenalimu saat berlangganan Pro.</p>

        <div>
          <label class="form-label">Nama Lengkap <span class="text-red-400">*</span></label>
          <input id="epName" type="text" placeholder="mis. Budi Santoso"
            class="form-input mt-1.5" />
        </div>

        <div>
          <label class="form-label">Jenjang Pendidikan</label>
          <div class="grid grid-cols-3 gap-2 mt-1.5" id="epLevelGrid">
            <button type="button" class="sp-level-btn selected" data-level="Kuliah" onclick="selectLevelEdit(this)">
              🎓 Kuliah
            </button>
            <button type="button" class="sp-level-btn" data-level="SMA/SMK" onclick="selectLevelEdit(this)">
              📚 SMA/SMK
            </button>
            <button type="button" class="sp-level-btn" data-level="Lainnya" onclick="selectLevelEdit(this)">
              📖 Lainnya
            </button>
          </div>
        </div>

        <div>
          <label class="form-label">Nama Sekolah / Kampus</label>
          <input id="epUniversity" type="text" placeholder="mis. Universitas Telkom / SMKN 1 Bandung"
            class="form-input mt-1.5" />
        </div>
        <div>
          <label class="form-label">Jurusan / Program Studi</label>
          <input id="epMajor" type="text" placeholder="mis. Teknik Informatika / RPL"
            class="form-input mt-1.5" />
        </div>
        <div>
          <label class="form-label">Angkatan / Tahun Masuk</label>
          <input id="epYear" type="text" placeholder="mis. 2023"
            class="form-input mt-1.5" maxlength="4" />
        </div>
      </div>
      <!-- Save Button -->
      <div class="px-5 pb-8 pt-3">
        <button onclick="saveProfileData()"
          style="width:100%;padding:16px;border-radius:16px;background:linear-gradient(to right,#7c3aed,#4f46e5);color:white;font-weight:700;font-size:1rem;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(99,102,241,0.35);">
          💾 Simpan Data Pribadi
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       MODAL: KODE AKTIVASI PRO
  ═══════════════════════════════════════════ -->
  <div id="activationModal" class="ob-modal-wrap">
    <div id="activationSheet" class="ob-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden">
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
      </div>
      <!-- Header Gradient -->
      <div class="mx-5 mt-2 mb-4 rounded-2xl overflow-hidden" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:20px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔑</div>
        <p style="color:white;font-weight:800;font-size:1rem;margin:0;">Aktivasi indisEconomi Pro</p>
        <p style="color:#c4b5fd;font-size:0.75rem;margin-top:4px;">Masukkan kode yang dikirim admin via WhatsApp</p>
      </div>
      <!-- Langkah -->
      <div class="mx-5 mb-4 bg-indigo-50 rounded-2xl p-4 space-y-2">
        <p class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Cara Mendapatkan Kode:</p>
        <div class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
          <p class="text-xs text-indigo-600">Tap <strong>"Berlangganan via WhatsApp"</strong> → kamu chat langsung ke admin</p>
        </div>
        <div class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
          <p class="text-xs text-indigo-600">Admin konfirmasi &amp; kirim info pembayaran <strong>Rp15.000/bulan</strong></p>
        </div>
        <div class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
          <p class="text-xs text-indigo-600">Setelah bayar, admin kirim <strong>kode aktivasi</strong> → masukkan di sini</p>
        </div>
      </div>
      <!-- Input -->
      <div class="px-5 mb-4">
        <label class="form-label">Kode Aktivasi</label>
        <input id="activationInput" type="text" placeholder="Contoh: INDISPRO1126"
          class="form-input mt-1.5 uppercase text-center text-lg font-bold tracking-widest"
          maxlength="15" oninput="this.value=this.value.toUpperCase()" />
        <p id="activationError" class="hidden text-xs text-red-500 mt-2 text-center font-medium"></p>
      </div>
      <!-- Buttons -->
      <div class="px-5 pb-8 space-y-2.5">
        <button onclick="submitActivationCode()"
          style="width:100%;padding:16px;border-radius:16px;background:linear-gradient(to right,#7c3aed,#4f46e5);color:white;font-weight:700;font-size:1rem;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(99,102,241,0.35);">
          ✅ Aktivasi Sekarang
        </button>
        <button onclick="closeActivationModal(); openPaywall('profile')"
          style="width:100%;padding:12px;border-radius:16px;background:linear-gradient(to right,#f59e0b,#ec4899);color:white;font-weight:600;font-size:0.875rem;border:none;cursor:pointer;">
          💬 Hubungi Admin via WhatsApp
        </button>
        <button onclick="closeActivationModal()"
          style="width:100%;padding:12px;border-radius:16px;background:transparent;color:#9ca3af;font-size:0.875rem;border:none;cursor:pointer;">
          Batal
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       MODAL: DETAIL RIWAYAT BULAN
  ═══════════════════════════════════════════ -->
  <div id="archiveDetailModal" class="ob-modal-wrap">
    <div id="archiveDetailSheet" class="ob-sheet w-full max-w-lg bg-white rounded-t-3xl overflow-hidden">
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
      </div>
      <div class="px-5 pt-2 pb-3 border-b border-gray-100 flex items-center justify-between">
        <h3 id="archiveDetailTitle" class="text-base font-extrabold text-gray-900">Riwayat</h3>
        <button onclick="closeArchiveDetail()" class="p-1.5 rounded-xl hover:bg-gray-100 transition">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div id="archiveDetailList" class="px-4 py-3 overflow-y-auto max-h-[70vh] space-y-1"></div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
