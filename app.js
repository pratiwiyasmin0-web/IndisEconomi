/* ═══════════════════════════════════════════════════════
   indisEconomi – Application Logic
   ═══════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────
// CONSTANTS & CONFIG
// ──────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'Makanan',      icon: '🍜', color: 'bg-orange-50',  bar: '#f97316' },
  { id: 'Minuman',      icon: '☕', color: 'bg-amber-50',   bar: '#f59e0b' },
  { id: 'Transportasi', icon: '🚌', color: 'bg-blue-50',    bar: '#3b82f6' },
  { id: 'Kos/Sewa',     icon: '🏠', color: 'bg-teal-50',    bar: '#14b8a6' },
  { id: 'Listrik/Air',  icon: '💡', color: 'bg-yellow-50',  bar: '#eab308' },
  { id: 'Belanja',      icon: '🛒', color: 'bg-pink-50',    bar: '#ec4899' },
  { id: 'Kesehatan',    icon: '💊', color: 'bg-green-50',   bar: '#22c55e' },
  { id: 'Hiburan',      icon: '🎮', color: 'bg-purple-50',  bar: '#a855f7' },
  { id: 'Pulsa/Data',   icon: '📱', color: 'bg-cyan-50',    bar: '#06b6d4' },
  { id: 'Pemasukan',    icon: '💰', color: 'bg-emerald-50', bar: '#10b981' },
  { id: 'Tabungan',     icon: '🐷', color: 'bg-rose-50',    bar: '#f43f5e' },
  { id: 'Lainnya',      icon: '📦', color: 'bg-gray-50',    bar: '#6b7280' },
];

const MAX_FREE_AI = 3;

// ──────────────────────────────────────────────────────
// STATE  (persisted via localStorage)
// ──────────────────────────────────────────────────────
let state = {
  transactions: [],
  monthlyArchive: {},
  budget: 0,
  aiUsed: 0,
  isPro: false,
  proCode: '',           // kode yang dipakai user
  proExpireDate: null,   // ISO string tanggal expire
  userName: 'Pengguna Baru',
  userLevel: 'Kuliah',
  userUniversity: '',
  userMajor: '',
  userYear: '',
  txType: 'expense',
  selectedCat: 'Makanan',
  filterTab: 'all',
  joinDate: new Date().toISOString(),
  onboardingDone: false,
  lastActiveMonth: '',
};

function loadState() {
  try {
    const saved = localStorage.getItem('indisEconomi_state');
    if (saved) state = { ...state, ...JSON.parse(saved) };
    if (!state.monthlyArchive) state.monthlyArchive = {};
  } catch (_) {}
}
function saveState() {
  localStorage.setItem('indisEconomi_state', JSON.stringify(state));
}

// ──────────────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────────────
const fmt = (n) =>
  'Rp ' + Math.abs(n).toLocaleString('id-ID', { maximumFractionDigits: 0 });

const fmtShort = (n) => {
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000) return 'Rp ' + (n / 1_000).toFixed(0) + 'K';
  return 'Rp ' + n;
};

function today() {
  return new Date().toISOString().split('T')[0];
}
function monthLabel(d) {
  return new Date(d + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}
function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function catMeta(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ──────────────────────────────────────────────────────
// COMPUTED DATA
// ──────────────────────────────────────────────────────
function getMonthTx(month) {
  return state.transactions.filter(t => t.date.startsWith(month));
}
function getWeekTx() {
  const now = new Date();
  const startOfWeek = new Date(now);
  // Mulai dari Senin (1), bukan Minggu (0)
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
  startOfWeek.setDate(now.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  return state.transactions.filter(function(t) {
    const d = new Date(t.date + 'T00:00:00');
    return d >= startOfWeek && t.type === 'expense';
  });
}
function getTodayTx() {
  const todayStr = today();
  return state.transactions.filter(function(t) {
    return t.date === todayStr && t.type === 'expense';
  });
}
function totalBalance() {
  return state.transactions.reduce(function(s, t) {
    return t.type === 'income' ? s + t.amount : s - t.amount;
  }, 0);
}
function monthlyIncome(month) {
  return getMonthTx(month).filter(function(t) { return t.type === 'income'; })
    .reduce(function(s, t) { return s + t.amount; }, 0);
}
function monthlyExpense(month) {
  return getMonthTx(month).filter(function(t) { return t.type === 'expense'; })
    .reduce(function(s, t) { return s + t.amount; }, 0);
}
// Pengeluaran aktual minggu ini (Senin–hari ini)
function weeklyExpenseActual() {
  return getWeekTx().reduce(function(s, t) { return s + t.amount; }, 0);
}
// Pengeluaran aktual hari ini
function todayExpenseActual() {
  return getTodayTx().reduce(function(s, t) { return s + t.amount; }, 0);
}
// Alokasi per minggu = budget ÷ 4.33 (rata-rata minggu per bulan)
function weeklyAllocation(budget) {
  return Math.round(budget / 4.33);
}
// Alokasi per hari = budget ÷ jumlah hari dalam bulan ini
function dailyAllocation(budget) {
  const month = currentMonth();
  const daysInMonth = new Date(month.split('-')[0], parseInt(month.split('-')[1]), 0).getDate();
  return Math.round(budget / daysInMonth);
}
// Rata-rata harian pengeluaran aktual bulan ini (hanya hari yang sudah berlalu)
function dailyAvgActual(month) {
  const exp = monthlyExpense(month);
  const now = new Date();
  const daysPassed = now.getDate(); // hari ke-berapa bulan ini
  return daysPassed > 0 ? Math.round(exp / daysPassed) : 0;
}
function catBreakdown(month) {
  const map = {};
  getMonthTx(month).filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// ──────────────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));

  const section = document.getElementById('page' + page);
  if (section) section.classList.remove('hidden');

  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active-nav');

  if (page === 'Tambah')    initForm();
  if (page === 'AI')        updateAIBanner();
  if (page === 'Profil')    updateProfilePage();
  if (page === 'Transaksi') renderFullTxList();
  if (page === 'Dashboard') renderDashboard();
  if (page === 'Riwayat')   renderRiwayat();
}

function openAiChat() {
  navigate('AI');
}

// ──────────────────────────────────────────────────────
// DASHBOARD RENDER
// ──────────────────────────────────────────────────────
function renderDashboard() {
  const month = currentMonth();
  const balance = totalBalance();
  const inc = monthlyIncome(month);
  const exp = monthlyExpense(month);

  // Budget = budget yang di-set manual, atau fallback ke total pemasukan bulan ini
  const budgetAmt = state.budget || inc;

  // Alokasi otomatis dari budget
  const weekAlloc = weeklyAllocation(budgetAmt);
  const dayAlloc = dailyAllocation(budgetAmt);

  // Pengeluaran aktual
  const weekActual = weeklyExpenseActual();
  const dayActual = todayExpenseActual();
  const dayAvgActual = dailyAvgActual(month);

  // Hero card
  const heroEl = document.getElementById('heroBalance');
  heroEl.textContent = fmt(balance);
  heroEl.classList.toggle('text-red-300', balance < 0);
  heroEl.classList.toggle('text-white', balance >= 0);

  document.getElementById('heroIncome').textContent = fmtShort(inc);
  document.getElementById('heroExpense').textContent = fmtShort(exp);

  // Kartu Minggu Ini – tampilkan aktual vs alokasi
  document.getElementById('weeklyExpense').textContent = fmtShort(weekActual);
  const weekRemain = weekAlloc - weekActual;
  const weekEl = document.getElementById('weeklyRemain');
  if (weekEl) {
    weekEl.textContent = budgetAmt > 0
      ? (weekRemain >= 0 ? 'Sisa ' + fmtShort(weekRemain) : 'Lewat ' + fmtShort(-weekRemain))
      : 'dari pengeluaran';
    weekEl.className = weekRemain >= 0 ? 'text-[10px] text-emerald-500 mt-0.5 font-semibold' : 'text-[10px] text-red-400 mt-0.5 font-semibold';
  }
  const weekAllocEl = document.getElementById('weeklyAlloc');
  if (weekAllocEl) {
    weekAllocEl.textContent = budgetAmt > 0 ? 'alokasi ' + fmtShort(weekAlloc) + '/minggu' : 'minggu ini';
  }

  // Kartu Hari Ini – tampilkan aktual vs alokasi harian
  document.getElementById('dailyAvg').textContent = fmtShort(dayActual);
  const dayRemain = dayAlloc - dayActual;
  const dayEl = document.getElementById('dailyRemain');
  if (dayEl) {
    dayEl.textContent = budgetAmt > 0
      ? (dayRemain >= 0 ? 'Sisa ' + fmtShort(dayRemain) : 'Lewat ' + fmtShort(-dayRemain))
      : 'hari ini';
    dayEl.className = dayRemain >= 0 ? 'text-[10px] text-emerald-500 mt-0.5 font-semibold' : 'text-[10px] text-red-400 mt-0.5 font-semibold';
  }
  const dayAllocEl = document.getElementById('dailyAlloc');
  if (dayAllocEl) {
    dayAllocEl.textContent = budgetAmt > 0 ? 'alokasi ' + fmtShort(dayAlloc) + '/hari' : 'hari ini';
  }

  // Month label
  document.getElementById('monthLabel').textContent = monthLabel(month);

  // Budget bar
  const pct = budgetAmt > 0 ? Math.min(100, Math.round((exp / budgetAmt) * 100)) : 0;
  const left = budgetAmt - exp;
  document.getElementById('budgetBar').style.width = pct + '%';
  document.getElementById('budgetPct').textContent = pct + '%';
  document.getElementById('budgetLeft').textContent = fmt(left);
  document.getElementById('budgetTotal').textContent = fmt(budgetAmt);
  // Bar color: danger if > 80%
  const bar = document.getElementById('budgetBar');
  bar.classList.toggle('from-red-500', pct > 80);
  bar.classList.toggle('to-red-400', pct > 80);
  bar.classList.toggle('from-violet-500', pct <= 80);
  bar.classList.toggle('to-indigo-500', pct <= 80);

  // Category breakdown
  renderCategoryBars();

  // Recent transactions (last 5)
  renderRecentTx();

  // AI tip
  renderAiTip(balance, exp, budgetAmt);
}

function renderCategoryBars() {
  const month = currentMonth();
  const breakdown = catBreakdown(month);
  const total = breakdown.reduce((s, c) => s + c.amount, 0);
  const container = document.getElementById('categoryList');

  if (breakdown.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">Belum ada transaksi pengeluaran.</p>';
    return;
  }

  container.innerHTML = breakdown.slice(0, 5).map(({ id, amount }) => {
    const meta = catMeta(id);
    const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
    return `
      <div class="cat-bar">
        <div class="w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center text-sm shrink-0">${meta.icon}</div>
        <div class="flex-1">
          <div class="flex justify-between mb-1">
            <span class="text-xs font-semibold text-gray-600">${id}</span>
            <span class="text-xs font-bold text-gray-700">${fmtShort(amount)}</span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="cat-bar-fill" style="width:${pct}%; background:${meta.bar}"></div>
          </div>
        </div>
        <span class="text-[10px] text-gray-400 w-8 text-right">${pct}%</span>
      </div>`;
  }).join('');
}

function renderRecentTx() {
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const container = document.getElementById('recentTxList');

  if (recent.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">Belum ada transaksi.</p>';
    return;
  }
  container.innerHTML = recent.map(t => txItemHTML(t)).join('');
}

function txItemHTML(t) {
  const meta = catMeta(t.category);
  const isIncome = t.type === 'income';
  const dateStr = new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  return `
    <div class="tx-item group" data-id="${t.id}">
      <div class="tx-icon ${meta.color} text-base">${meta.icon}</div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-800 truncate">${t.note || t.category}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">${dateStr} · ${t.category}</p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-sm font-bold ${isIncome ? 'text-emerald-500' : 'text-red-500'}">
          ${isIncome ? '+' : '-'}${fmtShort(t.amount)}
        </p>
        <button onclick="deleteTx('${t.id}')" class="text-[10px] text-gray-300 hover:text-red-400 transition mt-0.5">hapus</button>
      </div>
    </div>`;
}

function renderAiTip(balance, exp, budget) {
  const pct = budget > 0 ? (exp / budget) * 100 : 0;
  let tip = 'Konsultasikan kondisi keuanganmu ke AI untuk tips hemat ala anak kos!';
  if (balance < 0) tip = '⚠️ Saldo minus! Segera tanya AI cara mengelola keuanganmu.';
  else if (pct > 90) tip = '🚨 Pengeluaran hampir melebihi budget! Minta saran AI sekarang.';
  else if (pct > 70) tip = '😬 Sudah 70% budget habis. Tanya AI tips hemat sisa bulan ini!';
  else if (balance < 50000) tip = '💸 Saldo menipis! AI siap bantu cari cara bertahan hingga akhir bulan.';
  document.getElementById('aiTipText').textContent = tip;
}

// ──────────────────────────────────────────────────────
// FULL TRANSACTION LIST
// ──────────────────────────────────────────────────────
function renderFullTxList() {
  const filter = state.filterTab;
  let txs = [...state.transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filter === 'expense') txs = txs.filter(t => t.type === 'expense');
  else if (filter === 'income') txs = txs.filter(t => t.type === 'income');
  else if (filter !== 'all') txs = txs.filter(t => t.category === filter);

  const container = document.getElementById('fullTxList');
  if (txs.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">Tidak ada transaksi.</p>';
    return;
  }

  // Group by date
  const groups = {};
  txs.forEach(t => {
    const d = t.date;
    if (!groups[d]) groups[d] = [];
    groups[d].push(t);
  });

  container.innerHTML = Object.entries(groups).map(([date, list]) => {
    const dayStr = new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long' });
    const dayTotal = list.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
    return `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1.5 px-1">
          <p class="text-xs font-semibold text-gray-500">${dayStr}</p>
          <p class="text-xs font-bold ${dayTotal >= 0 ? 'text-emerald-500' : 'text-red-500'}">${dayTotal >= 0 ? '+' : ''}${fmtShort(dayTotal)}</p>
        </div>
        <div class="space-y-1.5">${list.map(t => txItemHTML(t)).join('')}</div>
      </div>`;
  }).join('');
}

// Filter tab click
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active-tab'));
    btn.classList.add('active-tab');
    state.filterTab = btn.dataset.filter;
    renderFullTxList();
  });
});

// ──────────────────────────────────────────────────────
// FORM: ADD TRANSACTION
// ──────────────────────────────────────────────────────
function initForm() {
  document.getElementById('fAmount').value = '';
  document.getElementById('fNote').value = '';
  document.getElementById('fDate').value = today();
  document.getElementById('fSetBudget').checked = false;
  const preview = document.getElementById('budgetPreview');
  if (preview) preview.classList.add('hidden');
  setType(state.txType || 'expense');
  buildCategoryGrid();
}

function setType(type) {
  state.txType = type;
  const expBtn = document.getElementById('typeExpense');
  const incBtn = document.getElementById('typeIncome');
  const budgetSec = document.getElementById('budgetSection');

  if (type === 'expense') {
    expBtn.classList.add('bg-white', 'text-red-500', 'shadow-sm');
    expBtn.classList.remove('text-gray-400');
    incBtn.classList.remove('bg-white', 'text-emerald-500', 'shadow-sm');
    incBtn.classList.add('text-gray-400');
    budgetSec.classList.add('hidden');
    state.selectedCat = 'Makanan';
  } else {
    incBtn.classList.add('bg-white', 'text-emerald-500', 'shadow-sm');
    incBtn.classList.remove('text-gray-400');
    expBtn.classList.remove('bg-white', 'text-red-500', 'shadow-sm');
    expBtn.classList.add('text-gray-400');
    budgetSec.classList.remove('hidden');
    state.selectedCat = 'Pemasukan';
  }
  buildCategoryGrid();
}

function buildCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  const cats = state.txType === 'expense'
    ? CATEGORIES.filter(c => c.id !== 'Pemasukan')
    : [{ id: 'Pemasukan', icon: '💰', color: 'bg-emerald-50' }, { id: 'Tabungan', icon: '🐷', color: 'bg-rose-50' }, { id: 'Lainnya', icon: '📦', color: 'bg-gray-50' }];

  grid.innerHTML = cats.map(c => `
    <button type="button" class="cat-btn ${state.selectedCat === c.id ? 'selected' : ''}"
      onclick="selectCat('${c.id}')">
      <span class="text-xl">${c.icon}</span>
      <span class="text-[10px] leading-tight text-center">${c.id}</span>
    </button>`).join('');
}

function selectCat(id) {
  state.selectedCat = id;
  buildCategoryGrid();
}

function addQuickAmt(amount) {
  const input = document.getElementById('fAmount');
  input.value = (parseInt(input.value || '0') + amount).toString();
  updateBudgetPreview();
}

function updateBudgetPreview() {
  const checkbox = document.getElementById('fSetBudget');
  const preview = document.getElementById('budgetPreview');
  const amount = parseInt(document.getElementById('fAmount').value) || 0;

  // Hanya tampilkan kalau tipe income & checkbox dicentang & ada nominal
  if (state.txType !== 'income' || !checkbox || !checkbox.checked || amount <= 0) {
    if (preview) preview.classList.add('hidden');
    return;
  }

  const weekAlloc = Math.round(amount / 4.33);
  const month = currentMonth();
  const daysInMonth = new Date(month.split('-')[0], parseInt(month.split('-')[1]), 0).getDate();
  const dayAlloc = Math.round(amount / daysInMonth);

  document.getElementById('previewWeekly').textContent = fmtShort(weekAlloc);
  document.getElementById('previewDaily').textContent = fmtShort(dayAlloc);
  preview.classList.remove('hidden');
}

function submitTransaction(e) {
  e.preventDefault();
  const amount = parseInt(document.getElementById('fAmount').value);
  const date = document.getElementById('fDate').value;
  const note = document.getElementById('fNote').value.trim();
  const category = state.selectedCat;
  const type = state.txType;
  const setAsBudget = document.getElementById('fSetBudget').checked;

  if (!amount || amount <= 0) {
    showToast('Masukkan jumlah yang valid!', '⚠️');
    return;
  }

  const tx = { id: uid(), type, amount, category, date, note, createdAt: new Date().toISOString() };
  state.transactions.unshift(tx);
  if (type === 'income' && setAsBudget) state.budget = amount;

  saveState();
  showToast(
    `${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${fmt(amount)} berhasil dicatat!`,
    type === 'income' ? '✅' : '🔴'
  );
  navigate('Dashboard');
}

// ──────────────────────────────────────────────────────
// DELETE TRANSACTION
// ──────────────────────────────────────────────────────
function deleteTx(id) {
  showConfirm('Hapus Transaksi', 'Yakin ingin menghapus transaksi ini?', () => {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    renderDashboard();
    renderFullTxList();
    showToast('Transaksi dihapus', '🗑️');
  });
}

// ──────────────────────────────────────────────────────
// AI ADVISOR
// ──────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────
// AI ADVISOR – Smart Context Parser
// ──────────────────────────────────────────────────────

// Ekstrak angka dari teks user (mis. "36k", "50.000", "36rb", "200ribu")
function parseAmountFromMsg(msg) {
  var lower = msg.toLowerCase().replace(/\./g, '').replace(/,/g, '');
  var found = null;

  // Pola: angka + satuan (juta, ribu, rb, k, jt)
  var patterns = [
    { re: /(\d+(?:\.\d+)?)\s*juta/,  mult: 1000000 },
    { re: /(\d+(?:\.\d+)?)\s*jt/,    mult: 1000000 },
    { re: /(\d+(?:\.\d+)?)\s*ribu/,  mult: 1000    },
    { re: /(\d+(?:\.\d+)?)\s*rb/,    mult: 1000    },
    { re: /(\d+(?:\.\d+)?)\s*k\b/,   mult: 1000    },
    { re: /rp\s*(\d+)/,              mult: 1        },
    { re: /(\d{4,})/,                mult: 1        },  // angka panjang >= 4 digit
  ];

  for (var i = 0; i < patterns.length; i++) {
    var m = lower.match(patterns[i].re);
    if (m) {
      found = Math.round(parseFloat(m[1]) * patterns[i].mult);
      break;
    }
  }
  return found;
}

// Ekstrak jumlah hari dari teks user (mis. "3 hari", "seminggu", "7 hari")
function parseDaysFromMsg(msg) {
  var lower = msg.toLowerCase();
  if (/seminggu|1 minggu|satu minggu/.test(lower)) return 7;
  if (/2 minggu|dua minggu/.test(lower)) return 14;
  var m = lower.match(/(\d+)\s*hari/);
  if (m) return parseInt(m[1]);
  return null;
}

function getAIResponse(msg, ctx) {
  var lower  = msg.toLowerCase();

  // Ambil angka & hari yang disebutkan user
  var userAmount = parseAmountFromMsg(msg);
  var userDays   = parseDaysFromMsg(msg);

  // Tentukan saldo yang dipakai: utamakan angka dari user, fallback ke saldo real
  var workingBalance = (userAmount !== null) ? userAmount : ctx.balance;

  // ── Deteksi intent spesifik ──────────────────────────────

  // User menyebut angka kecil + hari → mode survival spesifik
  var isSurvivalMode = userAmount !== null && userAmount < 200000 && userDays !== null;
  var isSurvivalGeneral = userAmount !== null && userAmount < 200000 &&
    (lower.includes('cukup') || lower.includes('tahan') || lower.includes('bertahan') ||
     lower.includes('hemat') || lower.includes('gimana') || lower.includes('bagaimana') ||
     lower.includes('tips') || lower.includes('cara') || lower.includes('makan'));

  if (isSurvivalMode || isSurvivalGeneral) {
    return buildSurvivalPlan(workingBalance, userDays || ctx.daysLeft, msg);
  }

  // Pertanyaan mingguan spesifik
  if (lower.includes('minggu') && (lower.includes('pengeluaran') || lower.includes('berapa') || lower.includes('habis') || lower.includes('total'))) {
    return buildWeeklySummary(ctx);
  }

  // Pertanyaan harian
  if ((lower.includes('hari') || lower.includes('harian') || lower.includes('per hari')) &&
      (lower.includes('berapa') || lower.includes('rata') || lower.includes('pengeluaran'))) {
    return buildDailySummary(ctx);
  }

  // Pertanyaan saldo / keuangan umum
  if (lower.includes('saldo') || lower.includes('uang') && lower.includes('sisa') || lower.includes('masih ada')) {
    return buildBalanceSummary(ctx, userAmount);
  }

  // Intent berbasis keyword lama
  if (lower.includes('makan') || lower.includes('menu') || lower.includes('warteg') || lower.includes('makanan')) {
    if (userAmount !== null) return buildFoodBudgetPlan(userAmount, userDays);
    return buildMenuTips();
  }
  if (lower.includes('evaluasi') || lower.includes('analisis') || lower.includes('rekap')) {
    return buildEvaluasi(ctx);
  }
  if (lower.includes('nabung') || lower.includes('tabungan') || lower.includes('simpan')) {
    return buildNabungTips(ctx);
  }
  if (lower.includes('hemat') || lower.includes('irit') || lower.includes('tips')) {
    return buildHematTips(userAmount);
  }
  if (lower.includes('tanggal tua') || lower.includes('akhir bulan') || lower.includes('tanggal')) {
    return buildSurvivalPlan(workingBalance, ctx.daysLeft, msg);
  }

  // Default: ringkasan keuangan dengan konteks real
  return buildDefaultResponse(ctx, userAmount);
}

// ── Builder Functions ──────────────────────────────────

function buildSurvivalPlan(money, days, originalMsg) {
  var perDay     = days > 0 ? Math.floor(money / days) : money;
  var perMeal    = Math.floor(perDay / 3);
  var moneyLabel = fmt(money);
  var daysLabel  = days + ' hari';

  var plan = '💡 Oke, uang ' + moneyLabel + ' untuk ' + daysLabel + ':\n\n';
  plan += '📊 Alokasi harian: ' + fmt(perDay) + '/hari\n';
  plan += '🍽️ Per makan: ' + fmt(perMeal) + ' (3x sehari)\n\n';

  plan += '🗓️ Rencana makan:\n';
  if (perMeal >= 10000) {
    plan += '• Pagi: Nasi + tempe/tahu warteg (' + fmt(Math.min(perMeal, 8000)) + ')\n';
    plan += '• Siang: Nasi + 1 lauk warteg (' + fmt(Math.min(perMeal, 10000)) + ')\n';
    plan += '• Malam: Mie instan + telur (' + fmt(Math.min(perMeal, 6000)) + ')';
  } else if (perMeal >= 5000) {
    plan += '• Pagi: Nasi putih + kecap + kerupuk (' + fmt(3000) + ')\n';
    plan += '• Siang: Mie instan double (' + fmt(5000) + ')\n';
    plan += '• Malam: Nasi + tempe goreng (' + fmt(5000) + ')';
  } else {
    plan += '• Mode ultra hemat: masak nasi + telur rebus\n';
    plan += '• 1 papan telur isi 10 ≈ Rp15.000 (5 hari)\n';
    plan += '• Beras 1kg ≈ Rp12.000 bisa buat 3-4 hari';
  }

  plan += '\n\n⚠️ Hindari: kopi/snack kekinian, GoFood, jajan impulsif';

  if (days <= 3) {
    plan += '\n\n🆘 Hanya ' + days + ' hari — kalau bisa pinjam teman dulu untuk jaga kondisi!';
  }

  return plan;
}

function buildFoodBudgetPlan(money, days) {
  var d = days || 7;
  return buildSurvivalPlan(money, d, '');
}

function buildMenuTips() {
  return 'Menu hemat anak kos per hari:\n\n🌅 Pagi (Rp5.000-8.000):\n• Nasi + telur ceplok\n• Roti + susu sachet\n\n☀️ Siang (Rp8.000-12.000):\n• Nasi warteg + 1 lauk\n• Mie ayam/bakso pinggir jalan\n\n🌙 Malam (Rp5.000-8.000):\n• Mie instan + telur + sayur\n• Nasi + tempe/tahu goreng\n\nTotal: Rp18.000-28.000/hari\n\n💡 Masak sendiri bisa hemat 50%!';
}

function buildWeeklySummary(ctx) {
  var weekExp   = weeklyExpenseActual();
  var weekAlloc = weeklyAllocation(ctx.budget);
  var sisa      = weekAlloc - weekExp;
  var result = '📅 Rekap minggu ini:\n\n';
  result += '• Pengeluaran: ' + fmt(weekExp) + '\n';
  if (ctx.budget > 0) {
    result += '• Alokasi minggu ini: ' + fmt(weekAlloc) + '\n';
    result += '• ' + (sisa >= 0 ? '✅ Sisa ' + fmt(sisa) + ' — masih aman!' : '⚠️ Lewat ' + fmt(-sisa) + ' dari alokasi!') + '\n';
  }
  result += '• Saldo keseluruhan: ' + fmt(ctx.balance) + '\n\n';
  if (sisa < 0) {
    result += '💡 Tips: Coba kurangi frekuensi jajan dan fokus ke kebutuhan pokok sampai akhir minggu.';
  } else if (sisa < weekAlloc * 0.2) {
    result += '⚡ Hampir habis! Tahan pengeluaran 2-3 hari ke depan ya.';
  } else {
    result += '👍 Keuangan minggu ini sehat, pertahankan!';
  }
  return result;
}

function buildDailySummary(ctx) {
  var dayExp   = todayExpenseActual();
  var dayAlloc = dailyAllocation(ctx.budget);
  var sisa     = dayAlloc - dayExp;
  var result = '📆 Pengeluaran hari ini:\n\n';
  result += '• Sudah keluar: ' + fmt(dayExp) + '\n';
  if (ctx.budget > 0) {
    result += '• Alokasi harian: ' + fmt(dayAlloc) + '\n';
    result += '• ' + (sisa >= 0 ? '✅ Masih sisa ' + fmt(sisa) : '🔴 Lewat ' + fmt(-sisa)) + '\n';
  }
  result += '• Rata-rata harian bulan ini: ' + fmt(dailyAvgActual(currentMonth())) + '\n\n';
  result += sisa >= 0
    ? '👍 Hari ini masih aman. Kalau masih ada kebutuhan, prioritaskan makan dulu!'
    : '⚠️ Pengeluaran hari ini melebihi alokasi. Tahan belanja lainnya sampai besok.';
  return result;
}

function buildBalanceSummary(ctx, userAmount) {
  var bal = userAmount !== null ? userAmount : ctx.balance;
  var result = '💰 Kondisi keuanganmu:\n\n';
  if (userAmount !== null && userAmount !== ctx.balance) {
    result += '• Uang yang kamu sebut: ' + fmt(userAmount) + '\n';
  }
  result += '• Saldo tercatat di app: ' + fmt(ctx.balance) + '\n';
  result += '• Pengeluaran bulan ini: ' + fmt(ctx.exp) + '\n';
  result += '• Sisa hari bulan ini: ' + ctx.daysLeft + ' hari\n\n';
  if (bal > 0 && ctx.daysLeft > 0) {
    result += '📊 Kalau dibagi rata: ' + fmt(Math.floor(bal / ctx.daysLeft)) + '/hari\n\n';
  }
  result += bal < 50000
    ? '🆘 Uang sudah sangat menipis! Hubungi orang tua atau teman jika darurat.'
    : bal < 200000
    ? '⚠️ Mulai hemat sekarang — prioritaskan makan & transport saja.'
    : '✅ Masih cukup, tapi tetap kontrol pengeluaran ya!';
  return result;
}

function buildEvaluasi(ctx) {
  var catLines = ctx.cats.slice(0, 4).map(function(c) {
    var pct = ctx.exp > 0 ? Math.round((c.amount / ctx.exp) * 100) : 0;
    return catMeta(c.id).icon + ' ' + c.id + ': ' + fmt(c.amount) + ' (' + pct + '%)';
  }).join('\n');
  var topCat = ctx.cats[0] ? ctx.cats[0].id : '-';
  var statusMsg = ctx.pct > 80 ? '🚨 Melebihi 80% budget!' : ctx.pct > 50 ? '⚡ Sudah setengah budget.' : '✅ Masih terkontrol.';
  return 'Evaluasi keuangan ' + ctx.monthLabel + ':\n\n' + catLines +
    '\n\nTotal pengeluaran: ' + fmt(ctx.exp) + ' (' + ctx.pct + '% dari budget)\n' + statusMsg +
    '\n\n💡 Kategori terbesar: ' + topCat + '. Coba cek apakah ada yang bisa dikurangi di sana.';
}

function buildNabungTips(ctx) {
  var safeToSave = ctx.balance > 100000 ? Math.floor(ctx.balance * 0.1) : 0;
  return 'Tips nabung anak kos:\n\nMetode 50/30/20:\n• 50% kebutuhan pokok\n• 30% keinginan\n• 20% tabungan\n\n' +
    (safeToSave > 0 ? '💡 Dari saldo ' + fmt(ctx.balance) + ', kamu bisa sisihkan sekitar ' + fmt(safeToSave) + ' sekarang.\n\n' : '') +
    '📌 Cara praktis:\n• Transfer ke rekening terpisah tiap awal bulan\n• Pakai fitur autodebet\n• Target minimal Rp50.000/minggu\n• Manfaatkan cashback e-wallet';
}

function buildHematTips(userAmount) {
  var prefix = userAmount !== null
    ? 'Dengan uang ' + fmt(userAmount) + ', ini tips hematnya:\n\n'
    : 'Tips hemat anak kos:\n\n';
  return prefix +
    '🍜 Makan: warteg Rp8.000-12.000 per porsi\n' +
    '🛒 Belanja: minimarket malam (diskon expiry)\n' +
    '🍳 Masak sendiri: hemat 50-70%\n' +
    '🤝 Patungan bahan makanan bareng teman\n' +
    '📱 Manfaatkan promo GoPay/OVO/Dana\n' +
    '🚶 Jalan kaki kalau jarak < 1km\n\n' +
    '🎯 Aturan 24 jam: tahan beli sesuatu selama 24 jam — kalau masih mau, baru beli.';
}

function buildDefaultResponse(ctx, userAmount) {
  if (userAmount !== null) {
    // User menyebut angka — fokus ke angka itu
    return buildBalanceSummary(ctx, userAmount);
  }
  var tip = ctx.balance < 50000 ? 'Saldo kamu menipis! ' : ctx.pct > 80 ? 'Pengeluaran sudah 80%+ budget! ' : '';
  return 'Hai! ' + tip + 'Kondisi keuanganmu:\n\n' +
    '• Saldo: ' + fmt(ctx.balance) + '\n' +
    '• Pengeluaran bulan ini: ' + fmt(ctx.exp) + ' (' + ctx.pct + '%)\n' +
    '• Sisa hari: ' + ctx.daysLeft + ' hari\n\n' +

    
    'Mau saya bantu apa? Tanya soal tips hemat, evaluasi pengeluaran, atau rencana makan! 😊';
}

function buildAIContext() {
  const month = currentMonth();
  const balance = totalBalance();
  const exp = monthlyExpense(month);
  const inc = monthlyIncome(month);
  const budget = state.budget || inc;
  const pct = budget > 0 ? Math.round((exp / budget) * 100) : 0;
  const cats = catBreakdown(month);
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = lastDay - now.getDate() + 1;
  return { balance, exp, inc, budget, pct, cats, monthLabel: monthLabel(month), daysLeft };
}

function updateAIBanner() {
  const balance = totalBalance();
  const remaining = MAX_FREE_AI - state.aiUsed;
  document.getElementById('aiBannerBalance').textContent = fmt(balance);
  const chip = document.getElementById('aiUsageChip');
  if (state.isPro) {
    chip.textContent = '∞ Pro';
    chip.className = 'text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-600';
  } else {
    const left = Math.max(0, remaining);
    chip.textContent = `${left} sisa`;
    chip.className = `text-xs font-semibold px-2 py-1 rounded-full ${left > 1 ? 'bg-violet-100 text-violet-600' : 'bg-red-100 text-red-500'}`;
  }
}

function sendChat() {
  if (!state.isPro && state.aiUsed >= MAX_FREE_AI) {
    openPaywall('ai_limit');
    return;
  }

  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  appendUserMessage(msg);
  input.value = '';
  autoResize(input);

  state.aiUsed++;
  document.getElementById('statAiUsed').textContent = state.aiUsed;
  updateAIBanner();
  saveState();

  // Show typing indicator
  const typingId = appendTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator(typingId);
    const ctx = buildAIContext();
    const response = getAIResponse(msg, ctx);
    appendAIMessage(response);

    // Check if should trigger paywall after this message
    if (!state.isPro && state.aiUsed >= MAX_FREE_AI) {
      setTimeout(() => {
        appendAIMessage('Kamu telah menggunakan 3 sesi konsultasi gratis 🎁. Upgrade ke **Pro** untuk konsultasi tanpa batas dan fitur eksklusif lainnya! 👑');
        setTimeout(() => openPaywall('ai_limit'), 1500);
      }, 800);
    }
  }, 800 + Math.random() * 600);
}

function sendSuggest(btn) {
  document.getElementById('chatInput').value = btn.textContent.trim();
  sendChat();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

function appendUserMessage(msg) {
  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'chat-user';
  div.innerHTML = `<div><p>${escapeHtml(msg)}</p></div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAIMessage(msg) {
  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'chat-ai';
  div.innerHTML = `
    <div class="chat-ai-avatar">🤖</div>
    <div class="bubble"><p>${formatAIText(msg)}</p></div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingIndicator() {
  const chatBox = document.getElementById('chatBox');
  const id = 'typing-' + uid();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'chat-ai';
  div.innerHTML = `
    <div class="chat-ai-avatar">🤖</div>
    <div class="bubble px-4 py-3">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatAIText(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ──────────────────────────────────────────────────────
// PAYWALL
// ──────────────────────────────────────────────────────
const paywallHeadlines = {
  ai_limit:  'Jatah AI-mu habis! 😭',
  export:    'Fitur Eksklusif Pro! 📊',
  chart:     'Analitik Canggih Menunggumu! 📈',
  profile:   'Upgrade & Kelola Lebih Cerdas! 💡',
  default:   'Dompetmu menjerit di tanggal tua? 😭',
};

function openPaywall(source) {
  const modal = document.getElementById('paywallModal');
  const headline = document.getElementById('paywallHeadline');
  headline.textContent = paywallHeadlines[source] || paywallHeadlines.default;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('paywallSheet').classList.add('open');
    });
  });
}

function closePaywall() {
  const sheet = document.getElementById('paywallSheet');
  const modal = document.getElementById('paywallModal');
  sheet.classList.remove('open');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }, 400);
}

// ─── NOMOR ADMIN (ganti dengan nomor WA pemilik web) ───
const ADMIN_WA = '6282142458538'; // ← GANTI dengan nomor HP admin (format: 628xxx)
// ───────────────────────────────────────────────────────

// Hard lock: cek apakah user boleh akses fitur Pro
function proFeature(featureKey) {
  if (state.isPro) {
    if (featureKey === 'export')  doExportCSV();
    if (featureKey === 'backup')  exportBackup();
    if (featureKey === 'import')  importBackup();
    if (featureKey === 'chart')   showToast('Fitur grafik segera hadir!', '📊');
  } else {
    openPaywall(featureKey);
  }
}

function doExportCSV() {
  if (!state.isPro) { openPaywall('export'); return; }
  var headers = ['Tanggal','Tipe','Kategori','Keterangan','Jumlah'];
  var rows = state.transactions.map(function(t) {
    return [t.date, t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', t.category, t.note || '-', t.amount].join(',');
  });
  var csv = [headers.join(',')].concat(rows).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'indisEconomi_' + currentMonth() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data berhasil diekspor!', '📥');
}

function subscribePro() {
  // Buat pesan WA otomatis yang dikirim user KE admin
  var msg = [
    '🌟 *Halo min, saya mau berlangganan indisEconomi Pro!*',
    '',
    '📋 *Data Saya:*',
    '• Nama       : ' + (state.userName !== 'Pengguna Baru' ? state.userName : '-'),
    '• Universitas: ' + (state.userUniversity || '-'),
    '• Jurusan    : ' + (state.userMajor || '-'),
    '• Angkatan   : ' + (state.userYear || '-'),
    '',
    'Mohon info cara pembayaran dan kode aktivasi Pro.',
    'Terima kasih! 🙏',
  ].join('\n');

  var waUrl = 'https://wa.me/' + ADMIN_WA + '?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');

  closePaywall();
  // Langsung buka modal input kode aktivasi
  setTimeout(openActivationModal, 600);
}

function openActivationModal() {
  var modal = document.getElementById('activationModal');
  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.getElementById('activationSheet').classList.add('ob-open');
    });
  });
}

function closeActivationModal() {
  document.getElementById('activationSheet').classList.remove('ob-open');
  setTimeout(function() {
    document.getElementById('activationModal').classList.remove('ob-visible');
    document.getElementById('activationInput').value = '';
    document.getElementById('activationError').classList.add('hidden');
  }, 350);
}

// ──────────────────────────────────────────────────────
// SISTEM KODE AKTIVASI – Format dengan Expire Date
// ──────────────────────────────────────────────────────
// Format kode: INDIS-[IDENTIFIER]-[DDMMYY]
// Contoh: INDIS-BUDI-021226  → user Budi, expire 02 Des 2026
//         INDIS-ALL-311226   → semua user, expire 31 Des 2026
//         INDISADMIN         → kode abadi admin (tidak expire)
// ──────────────────────────────────────────────────────

function parseActivationCode(code) {
  code = code.trim().toUpperCase().replace(/\s/g, '');

  // 1. Kode admin abadi (PROANAKKOS, INDISADMIN - Selamanya)
  if (code === 'INDISADMIN' || code === 'PROANAKKOS') {
    return { valid: true, expireDate: null, identifier: 'ADMIN', isAdmin: true };
  }

  // 2. Format Bulanan Dinamis (Contoh: INDISPRO1126, INDISVIP1226)
  // Menangkap kata PRO atau VIP, diikuti tepat 4 angka (BulanTahun / MMYY)
  var matchBulanan = code.match(/^INDIS(PRO|VIP)(\d{4})$/);
  if (matchBulanan) {
    var tipe = matchBulanan[1]; // PRO atau VIP
    var dateStr = matchBulanan[2]; // MMYY (misal: 1126)
    var mm = parseInt(dateStr.slice(0, 2)) - 1; // Bulan (0-11 untuk format Date JS)
    var yy = parseInt('20' + dateStr.slice(2, 4)); // Tahun (2026)

    // Set expireDate ke HARI TERAKHIR pada bulan tersebut, jam 23:59:59
    // (Angka 0 di parameter hari akan otomatis mengambil hari terakhir bulan sebelumnya)
    var expireDate = new Date(yy, mm + 1, 0, 23, 59, 59); 

    var now = new Date();
    if (expireDate < now) {
      return {
        valid: false,
        expired: true,
        expireDate: expireDate,
        reason: 'Kode aktivasi untuk bulan tersebut sudah berakhir.'
      };
    }
    return { valid: true, expireDate: expireDate, identifier: tipe, isAdmin: false };
  }

  // 3. Format Spesifik User (INDIS-[NAMA]-[DDMMYY])
  var matchSpesifik = code.match(/^INDIS-([A-Z0-9]+)-(\d{6})$/);
  if (matchSpesifik) {
    var identifier = matchSpesifik[1];
    var dateStr2   = matchSpesifik[2]; // DDMMYY

    var dd2 = parseInt(dateStr2.slice(0, 2));
    var mm2 = parseInt(dateStr2.slice(2, 4)) - 1; 
    var yy2 = parseInt('20' + dateStr2.slice(4, 6));
    var expireDate2 = new Date(yy2, mm2, dd2, 23, 59, 59);

    if (isNaN(expireDate2.getTime())) {
      return { valid: false, reason: 'Tanggal pada kode tidak valid.' };
    }

    var now2 = new Date();
    if (expireDate2 < now2) {
      return {
        valid: false,
        expired: true,
        expireDate: expireDate2,
        reason: 'Kode sudah kedaluwarsa sejak ' + expireDate2.toLocaleDateString('id-ID') + '. Hubungi admin.'
      };
    }

    return { valid: true, expireDate: expireDate2, identifier: identifier, isAdmin: false };
  }

  // Jika kode yang diinput tidak masuk ke format manapun
  return { valid: false, reason: 'Format kode tidak dikenali.' };
}
function checkProExpiry() {
  if (!state.isPro) return;
  if (!state.proExpireDate) return; // kode admin abadi

  var expireDate = new Date(state.proExpireDate);
  var now        = new Date();

  if (expireDate < now) {
    // Langganan habis → logout paksa
    state.isPro          = false;
    state.proCode        = '';
    state.proExpireDate  = null;
    saveState();
    // Tampilkan notifikasi
    showExpiredNotice(expireDate);
    setTimeout(function() { showGate(); }, 3000);
  }
}

function showExpiredNotice(expireDate) {
  var modal = document.getElementById('expiredNoticeModal');
  if (!modal) return;
  var dateLabel = expireDate.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
  var el = document.getElementById('expiredNoticeDate');
  if (el) el.textContent = dateLabel;
  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.getElementById('expiredNoticeSheet').classList.add('ob-open');
    });
  });
}

function closeExpiredNotice() {
  var sheet = document.getElementById('expiredNoticeSheet');
  var modal = document.getElementById('expiredNoticeModal');
  if (sheet) sheet.classList.remove('ob-open');
  setTimeout(function() {
    if (modal) modal.classList.remove('ob-visible');
    showGate();
  }, 350);
}

function submitActivationCode() {
  var code  = document.getElementById('activationInput').value.trim().toUpperCase().replace(/\s/g, '');
  var errEl = document.getElementById('activationError');

  if (!code) {
    errEl.textContent = 'Masukkan kode aktivasi terlebih dahulu.';
    errEl.classList.remove('hidden');
    return;
  }

  var result = parseActivationCode(code);

  if (result.valid) {
    state.isPro         = true;
    state.proCode       = code;
    state.proExpireDate = result.expireDate ? result.expireDate.toISOString() : null;
    saveState();
    closeActivationModal();
    setTimeout(function() { openSetupProfile(); }, 450);
  } else {
    errEl.textContent = result.reason || 'Kode tidak valid.';
    errEl.classList.remove('hidden');
    var input = document.getElementById('activationInput');
    input.classList.add('shake-anim');
    setTimeout(function() { input.classList.remove('shake-anim'); }, 500);
  }
}

// Close paywall on backdrop click
document.getElementById('paywallModal').addEventListener('click', function (e) {
  if (e.target === this) closePaywall();
});

// ──────────────────────────────────────────────────────
// PROFILE PAGE
// ──────────────────────────────────────────────────────
function updateProfilePage() {
  // Nama
  document.getElementById('profileName').textContent = state.userName || 'Pengguna Baru';

  // Info sekolah/kampus di bawah nama
  var infoEl = document.getElementById('profileInfo');
  if (infoEl) {
    var parts = [];
    if (state.userLevel)      parts.push(state.userLevel);
    if (state.userUniversity) parts.push(state.userUniversity);
    if (state.userMajor)      parts.push(state.userMajor);
    if (state.userYear)       parts.push('Angkatan ' + state.userYear);
    infoEl.textContent = parts.length > 0 ? parts.join(' · ') : 'Anggota indisEconomi';
  }

  // Stats
  document.getElementById('statTxCount').textContent = state.transactions.length;
  var joinDate = new Date(state.joinDate);
  var now      = new Date();
  var days     = Math.max(1, Math.floor((now - joinDate) / 86400000));
  document.getElementById('statDaysActive').textContent = days;
  document.getElementById('statAiUsed').textContent     = state.aiUsed;

  // Badge status FREE / PRO
  var badgeEl = document.getElementById('profileBadge');
  if (badgeEl) {
    if (state.isPro) {
      badgeEl.textContent = '👑 PRO';
      badgeEl.className   = 'inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-600';
    } else {
      badgeEl.textContent = 'FREE';
      badgeEl.className   = 'inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500';
    }
  }

  // Sembunyikan banner upgrade kalau sudah Pro
  var upgradeBanner = document.getElementById('upgradeBanner');
  if (upgradeBanner) {
    upgradeBanner.style.display = state.isPro ? 'none' : 'block';
  }
}

function openEditProfile() {
  document.getElementById('epName').value       = state.userName !== 'Pengguna Baru' ? state.userName : '';
  document.getElementById('epUniversity').value = state.userUniversity || '';
  document.getElementById('epMajor').value      = state.userMajor      || '';
  document.getElementById('epYear').value       = state.userYear       || '';

  // Set jenjang yang tersimpan
  var epGrid = document.getElementById('epLevelGrid');
  if (epGrid) {
    epGrid.querySelectorAll('.sp-level-btn').forEach(function(b) {
      b.classList.toggle('selected', b.dataset.level === (state.userLevel || 'Kuliah'));
    });
  }

  var modal = document.getElementById('editProfileModal');
  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.getElementById('editProfileSheet').classList.add('ob-open');
    });
  });
}

function closeEditProfile() {
  document.getElementById('editProfileSheet').classList.remove('ob-open');
  setTimeout(function() {
    document.getElementById('editProfileModal').classList.remove('ob-visible');
  }, 350);
}

function saveProfileData() {
  var name  = document.getElementById('epName').value.trim();
  var univ  = document.getElementById('epUniversity').value.trim();
  var major = document.getElementById('epMajor').value.trim();
  var year  = document.getElementById('epYear').value.trim();
  var levelBtn = document.querySelector('#epLevelGrid .sp-level-btn.selected');
  var level = levelBtn ? levelBtn.dataset.level : (state.userLevel || 'Kuliah');

  if (!name) {
    showToast('Nama tidak boleh kosong!', '⚠️');
    return;
  }

  state.userName       = name;
  state.userLevel      = level;
  state.userUniversity = univ;
  state.userMajor      = major;
  state.userYear       = year;
  saveState();
  closeEditProfile();
  setTimeout(function() {
    updateProfilePage();
    showToast('Data profil berhasil disimpan!', '✅');
  }, 400);
}

// editProfileName tetap ada untuk kompatibilitas tombol lama
function editProfileName() {
  openEditProfile();
}

// ──────────────────────────────────────────────────────
// RESET DATA
// ──────────────────────────────────────────────────────
function resetData() {
  showConfirm(
    'Reset Semua Data',
    'Semua transaksi dan pengaturan akan dihapus. Data profil tetap tersimpan.',
    function() {
      state.transactions = [];
      state.budget = 0;
      state.aiUsed = 0;
      state.isPro = false;
      saveState();
      renderDashboard();
      renderFullTxList();
      updateProfilePage();
      showToast('Data transaksi berhasil direset', '🗑️');
    }
  );
}

// ──────────────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, icon = '✅') {
  const inner = document.getElementById('toastInner');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  inner.classList.remove('hidden');
  inner.classList.add('toast-in');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    inner.classList.add('hidden');
    inner.classList.remove('toast-in');
  }, 3000);
}

// ──────────────────────────────────────────────────────
// CONFIRM DIALOG
// ──────────────────────────────────────────────────────
function showConfirm(title, msg, onOk) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  const modal = document.getElementById('confirmModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';

  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');

  const cleanup = () => {
    modal.style.display = 'none';
    modal.classList.add('hidden');
    okBtn.replaceWith(okBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  };

  document.getElementById('confirmOk').addEventListener('click', () => { cleanup(); onOk(); }, { once: true });
  document.getElementById('confirmCancel').addEventListener('click', cleanup, { once: true });
}

// ──────────────────────────────────────────────────────
// HEADER DATE
// ──────────────────────────────────────────────────────
function setHeaderDate() {
  const now = new Date();
  const str = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  document.getElementById('topBadgeDate').textContent = str;
}

// ──────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────
function init() {
  loadState();

  // Bersihkan otomatis jika ada data sisa dari versi lama (seed demo)
  if (!state.isPro && state.transactions.length > 0) {
    state.transactions = [];
    state.budget = 0;
    state.aiUsed = 0;
    saveState();
  }

  // Cek pergantian bulan → auto-archive kalau bulan berubah
  if (state.isPro) {
    checkMonthRollover();
  }

  setHeaderDate();

  // Cek apakah sudah Pro — kalau belum, tampilkan gerbang aktivasi
  if (!state.isPro) {
    showGate();
    return;
  }

  // Sudah Pro → cek dulu apakah langganan masih berlaku
  checkProExpiry();
  if (!state.isPro) return; // sudah di-logout oleh checkProExpiry

  // Sudah Pro tapi belum isi nama → paksa setup profil
  if (!state.userName || state.userName === 'Pengguna Baru') {
    enterApp();
    setTimeout(openSetupProfile, 300);
    return;
  }

  // Sudah Pro & sudah punya nama → langsung masuk
  enterApp();
}

// ──────────────────────────────────────────────────────
// AUTO-ARCHIVE BULANAN
// ──────────────────────────────────────────────────────
function checkMonthRollover() {
  var current = currentMonth();

  // Pertama kali → simpan bulan aktif
  if (!state.lastActiveMonth) {
    state.lastActiveMonth = current;
    saveState();
    return;
  }

  // Bulan sama → tidak perlu apa-apa
  if (state.lastActiveMonth === current) return;

  // BULAN BERUBAH → archive bulan lama, reset bulan baru
  var oldMonth = state.lastActiveMonth;
  var oldTx    = state.transactions.filter(function(t) { return t.date.startsWith(oldMonth); });

  if (oldTx.length > 0 || state.budget > 0) {
    var totalInc = oldTx.filter(function(t){ return t.type === 'income'; })
                        .reduce(function(s,t){ return s + t.amount; }, 0);
    var totalExp = oldTx.filter(function(t){ return t.type === 'expense'; })
                        .reduce(function(s,t){ return s + t.amount; }, 0);

    if (!state.monthlyArchive) state.monthlyArchive = {};
    state.monthlyArchive[oldMonth] = {
      transactions: oldTx,
      budget:       state.budget,
      totalIncome:  totalInc,
      totalExpense: totalExp,
      saldo:        totalInc - totalExp,
      archivedAt:   new Date().toISOString(),
    };
  }

  // Reset untuk bulan baru (transaksi bulan lama tetap ada, hanya budget di-reset)
  state.budget          = 0;
  state.lastActiveMonth = current;
  saveState();
}

function getArchivedMonths() {
  if (!state.monthlyArchive) return [];
  return Object.keys(state.monthlyArchive).sort().reverse();
}

function showGate() {
  document.getElementById('appWrapper').style.display = 'none';
  document.querySelector('nav').style.display = 'none';
  document.getElementById('gateScreen').style.display = 'flex';
}

// ── Setup Profil Pertama Kali (muncul setelah aktivasi) ──
function openSetupProfile() {
  var modal = document.getElementById('setupProfileModal');
  // Reset form
  document.getElementById('spName').value       = '';
  document.getElementById('spUniversity').value = '';
  document.getElementById('spMajor').value      = '';
  document.getElementById('spYear').value       = '';
  document.getElementById('spError').classList.add('hidden');
  // Default ke Kuliah
  selectLevel(document.querySelector('#spLevelGrid .sp-level-btn'));

  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.getElementById('setupProfileSheet').classList.add('ob-open');
    });
  });
}

function selectLevel(btn) {
  var grid = btn.closest('[id$="LevelGrid"]') || document.getElementById('spLevelGrid');
  grid.querySelectorAll('.sp-level-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
}

function selectLevelEdit(btn) {
  var grid = document.getElementById('epLevelGrid');
  grid.querySelectorAll('.sp-level-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
}

function closeSetupProfile() {
  document.getElementById('setupProfileSheet').classList.remove('ob-open');
  setTimeout(function() {
    document.getElementById('setupProfileModal').classList.remove('ob-visible');
  }, 350);
}

function saveSetupProfile() {
  var name  = document.getElementById('spName').value.trim();
  var univ  = document.getElementById('spUniversity').value.trim();
  var major = document.getElementById('spMajor').value.trim();
  var year  = document.getElementById('spYear').value.trim();
  var levelBtn = document.querySelector('#spLevelGrid .sp-level-btn.selected');
  var level = levelBtn ? levelBtn.dataset.level : 'Kuliah';

  if (!name) {
    var errEl = document.getElementById('spError');
    errEl.textContent = 'Nama tidak boleh kosong!';
    errEl.classList.remove('hidden');
    document.getElementById('spName').focus();
    return;
  }

  state.userName        = name;
  state.userLevel       = level;
  state.userUniversity  = univ;
  state.userMajor       = major;
  state.userYear        = year;
  state.onboardingDone  = false;
  saveState();

  closeSetupProfile();
  setTimeout(function() {
    enterApp();
    setTimeout(function() {
      showToast('🎉 Selamat datang, ' + name + '! Akun Pro aktif 👑', '🎉');
      updateProfilePage();
      updateAIBanner();
    }, 300);
  }, 400);
}

function gateOpenWA() {
  var msg = [
    '🌟 *Halo min, saya mau berlangganan indisEconomi Pro!*',
    '',
    'Mohon info cara pembayaran dan kode aktivasi.',
    'Terima kasih! 🙏',
  ].join('\n');
  var waUrl = 'https://wa.me/' + ADMIN_WA + '?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
  // Buka modal kode aktivasi otomatis setelah buka WA
  setTimeout(openActivationModal, 800);
}

function enterApp() {
  // Masuk ke app normal
  document.getElementById('gateScreen').style.display = 'none';
  document.getElementById('appWrapper').style.display = 'block';
  document.querySelector('nav').style.display = 'flex';

  renderDashboard();
  initForm();

  document.getElementById('btnSemuaTrx').addEventListener('click', function() { navigate('Transaksi'); });
  document.getElementById('btnSemuaKat').addEventListener('click', function() { navigate('Transaksi'); });
  document.getElementById('btnNotif').addEventListener('click', function() {
    showToast('Tidak ada notifikasi baru', '🔔');
  });

  if (!state.onboardingDone) {
    setTimeout(openOnboarding, 400);
  }
}

document.addEventListener('DOMContentLoaded', init);


// ──────────────────────────────────────────────────────
// ONBOARDING
// ──────────────────────────────────────────────────────
const ONBOARDING_SLIDES = [
  {
    emoji: '👋',
    title: 'Selamat datang di\nindisEconomi!',
    desc: 'Aplikasi pencatat keuangan khusus anak kos. Catat pemasukan & pengeluaran, pantau sisa saldo, dan konsultasi ke AI — semua dalam satu tempat.',
    color: 'from-violet-600 to-indigo-600',
    tip: null,
  },
  {
    emoji: '➕',
    title: 'Langkah 1:\nCatat Pemasukan Dulu',
    desc: 'Pertama, tap tombol <strong class="text-white">+</strong> di tengah bawah layar. Pilih <strong class="text-white">🟢 Pemasukan</strong>, masukkan jumlah uang bulananmu (mis. kiriman ortu atau gaji), lalu centang <strong class="text-white">"Jadikan budget bulanan"</strong>.',
    color: 'from-emerald-500 to-teal-500',
    tip: 'Setelah ini, alokasi per minggu dan per hari otomatis terhitung!',
  },
  {
    emoji: '🔴',
    title: 'Langkah 2:\nCatat Pengeluaran',
    desc: 'Setiap kali keluar uang, tap <strong class="text-white">+</strong> lagi. Pilih <strong class="text-white">🔴 Pengeluaran</strong>, pilih kategori (Makanan, Transport, dll), isi nominal, lalu <strong class="text-white">Simpan</strong>. Saldo otomatis berkurang!',
    color: 'from-red-500 to-orange-500',
    tip: 'Biasakan catat langsung setelah bayar — biar tidak lupa!',
  },
  {
    emoji: '📊',
    title: 'Langkah 3:\nPantau Dashboard',
    desc: 'Di halaman <strong class="text-white">Home</strong>, kamu bisa lihat:\n• Sisa saldo keseluruhan\n• Pengeluaran hari ini vs alokasi\n• Pengeluaran minggu ini vs alokasi\n• Rincian per kategori',
    color: 'from-blue-500 to-indigo-500',
    tip: 'Kartu berubah merah kalau pengeluaran melebihi alokasi harian/mingguan.',
  },
  {
    emoji: '🤖',
    title: 'Langkah 4:\nTanya AI Advisor',
    desc: 'Bingung ngatur sisa uang? Tap menu <strong class="text-white">AI Chat</strong> di bawah. Tanya apapun:\n<em>"Uangku Rp50.000, makan apa yang murah?"</em>\n<em>"Evaluasi pengeluaranku dong"</em>\n\nAI akan kasih saran ala anak kos! 🍜',
    color: 'from-fuchsia-500 to-pink-500',
    tip: 'Gratis 3x tanya. Upgrade Pro untuk unlimited!',
  },
];

let currentSlide = 0;

function openOnboarding() {
  currentSlide = 0;
  renderOnboardingSlide(0);
  const modal = document.getElementById('onboardingModal');
  const sheet = document.getElementById('onboardingSheet');
  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      sheet.classList.add('ob-open');
    });
  });
}

function closeOnboarding() {
  const sheet = document.getElementById('onboardingSheet');
  const modal = document.getElementById('onboardingModal');
  sheet.classList.remove('ob-open');
  setTimeout(function() {
    modal.classList.remove('ob-visible');
  }, 400);
  state.onboardingDone = true;
  saveState();
}

function renderOnboardingSlide(idx) {
  const slide = ONBOARDING_SLIDES[idx];
  const total = ONBOARDING_SLIDES.length;

  // Gradient header — pakai style langsung, bukan Tailwind class
  var gradientMap = {
    'from-violet-600 to-indigo-600': 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    'from-emerald-500 to-teal-500':  'linear-gradient(135deg,#10b981,#14b8a6)',
    'from-red-500 to-orange-500':    'linear-gradient(135deg,#ef4444,#f97316)',
    'from-blue-500 to-indigo-500':   'linear-gradient(135deg,#3b82f6,#6366f1)',
    'from-fuchsia-500 to-pink-500':  'linear-gradient(135deg,#d946ef,#ec4899)',
  };
  var gradEl = document.getElementById('obGradient');
  var bg = gradientMap[slide.color] || gradientMap['from-violet-600 to-indigo-600'];
  gradEl.style.background = bg;

  // Emoji
  document.getElementById('obEmoji').textContent = slide.emoji;

  // Title
  document.getElementById('obTitle').innerHTML = slide.title.replace(/\n/g, '<br/>');

  // Desc
  document.getElementById('obDesc').innerHTML = slide.desc.replace(/\n/g, '<br/>');

  // Tip
  var tipEl = document.getElementById('obTip');
  var tipTextEl = document.getElementById('obTipText');
  if (slide.tip) {
    tipTextEl.textContent = '💡 ' + slide.tip;
    tipEl.classList.remove('hidden');
  } else {
    tipEl.classList.add('hidden');
  }

  // Dots
  var dotsEl = document.getElementById('obDots');
  dotsEl.innerHTML = ONBOARDING_SLIDES.map(function(_, i) {
    var w = i === idx ? '24px' : '8px';
    var bg2 = i === idx ? '#6366f1' : '#e2e8f0';
    return '<div style="width:' + w + ';height:8px;border-radius:999px;background:' + bg2 + ';transition:all .3s;"></div>';
  }).join('');

  // Button label — pakai style, tidak overwrite
  var btnNext = document.getElementById('obBtnNext');
  var btnSkip = document.getElementById('obBtnSkip');
  var isLast = idx === total - 1;
  btnNext.textContent = isLast ? '🚀 Mulai Sekarang!' : 'Lanjut →';
  btnSkip.style.display = isLast ? 'none' : 'block';

  // Progress bar
  document.getElementById('obProgress').style.width =
    Math.round(((idx + 1) / total) * 100) + '%';
}

function onboardingNext() {
  const total = ONBOARDING_SLIDES.length;
  if (currentSlide < total - 1) {
    currentSlide++;
    // Slide animation
    const content = document.getElementById('obContent');
    content.classList.add('ob-slide-out');
    setTimeout(function() {
      renderOnboardingSlide(currentSlide);
      content.classList.remove('ob-slide-out');
      content.classList.add('ob-slide-in');
      setTimeout(function() { content.classList.remove('ob-slide-in'); }, 300);
    }, 150);
  } else {
    closeOnboarding();
    showToast('Siap! Mulai catat keuanganmu 🎉', '✅');
  }
}

function onboardingPrev() {
  if (currentSlide > 0) {
    currentSlide--;
    renderOnboardingSlide(currentSlide);
  }
}


// ──────────────────────────────────────────────────────
// HALAMAN RIWAYAT BULANAN
// ──────────────────────────────────────────────────────
function renderRiwayat() {
  var container = document.getElementById('riwayatList');
  if (!container) return;

  var archived = getArchivedMonths();

  if (archived.length === 0) {
    container.innerHTML = '<div class="text-center py-12"><p class="text-4xl mb-3">📭</p><p class="text-sm font-semibold text-gray-500">Belum ada riwayat bulan sebelumnya</p><p class="text-xs text-gray-400 mt-1">Riwayat akan muncul otomatis tiap pergantian bulan</p></div>';
    return;
  }

  container.innerHTML = archived.map(function(month) {
    var data    = state.monthlyArchive[month];
    var inc     = data.totalIncome  || 0;
    var exp     = data.totalExpense || 0;
    var saldo   = data.saldo        || (inc - exp);
    var budget  = data.budget       || 0;
    var txCount = (data.transactions || []).length;
    var pct     = budget > 0 ? Math.min(100, Math.round((exp / budget) * 100)) : 0;
    var saldoPos = saldo >= 0;

    return '<div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">' +
      '<div class="flex items-center justify-between mb-3">' +
        '<div>' +
          '<p class="text-sm font-bold text-gray-800">' + monthLabel(month) + '</p>' +
          '<p class="text-[10px] text-gray-400">' + txCount + ' transaksi</p>' +
        '</div>' +
        '<div class="text-right">' +
          '<p class="text-xs text-gray-400">Saldo akhir</p>' +
          '<p class="text-base font-extrabold ' + (saldoPos ? 'text-emerald-500' : 'text-red-500') + '">' +
            (saldoPos ? '+' : '') + fmtShort(saldo) +
          '</p>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-2 mb-3">' +
        '<div class="bg-emerald-50 rounded-xl p-2.5">' +
          '<p class="text-[10px] text-emerald-600 font-semibold">Pemasukan</p>' +
          '<p class="text-sm font-bold text-emerald-700">' + fmtShort(inc) + '</p>' +
        '</div>' +
        '<div class="bg-red-50 rounded-xl p-2.5">' +
          '<p class="text-[10px] text-red-500 font-semibold">Pengeluaran</p>' +
          '<p class="text-sm font-bold text-red-600">' + fmtShort(exp) + '</p>' +
        '</div>' +
      '</div>' +
      (budget > 0 ? (
        '<div class="mb-2">' +
          '<div class="flex justify-between mb-1"><span class="text-[10px] text-gray-400">Budget terpakai</span><span class="text-[10px] font-bold text-gray-600">' + pct + '%</span></div>' +
          '<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full rounded-full ' + (pct > 80 ? 'bg-red-400' : 'bg-indigo-400') + '" style="width:' + pct + '%"></div></div>' +
        '</div>'
      ) : '') +
      '<button onclick="showArchiveDetail(\'' + month + '\')" class="w-full text-xs text-indigo-500 font-semibold py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition mt-1">Lihat Rincian →</button>' +
    '</div>';
  }).join('');
}

function showArchiveDetail(month) {
  var data = state.monthlyArchive[month];
  if (!data || !data.transactions) return;

  var modal = document.getElementById('archiveDetailModal');
  document.getElementById('archiveDetailTitle').textContent = monthLabel(month);

  var listEl = document.getElementById('archiveDetailList');
  var txs = data.transactions.slice().sort(function(a,b){ return new Date(b.date) - new Date(a.date); });

  if (txs.length === 0) {
    listEl.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">Tidak ada transaksi.</p>';
  } else {
    // Group by date
    var groups = {};
    txs.forEach(function(t) {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    listEl.innerHTML = Object.entries(groups).map(function(entry) {
      var date = entry[0], list = entry[1];
      var dayStr = new Date(date).toLocaleDateString('id-ID', { weekday:'short', day:'2-digit', month:'short' });
      return '<div class="mb-3">' +
        '<p class="text-[10px] text-gray-400 font-semibold px-1 mb-1">' + dayStr + '</p>' +
        '<div class="space-y-1.5">' + list.map(function(t) { return txItemHTML(t); }).join('') + '</div>' +
      '</div>';
    }).join('');
  }

  modal.classList.add('ob-visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.getElementById('archiveDetailSheet').classList.add('ob-open');
    });
  });
}

function closeArchiveDetail() {
  document.getElementById('archiveDetailSheet').classList.remove('ob-open');
  setTimeout(function() {
    document.getElementById('archiveDetailModal').classList.remove('ob-visible');
  }, 350);
}

// ──────────────────────────────────────────────────────
// EXPORT / IMPORT BACKUP
// ──────────────────────────────────────────────────────
function exportBackup() {
  var data = {
    version:  '1.0',
    exportAt: new Date().toISOString(),
    userName: state.userName,
    transactions:    state.transactions,
    monthlyArchive:  state.monthlyArchive,
    budget:          state.budget,
  };
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], { type: 'application/json' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'indisEconomi_backup_' + today() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup berhasil diunduh!', '📥');
}

function importBackup() {
  var input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      try {
        var data = JSON.parse(evt.target.result);
        if (!data.transactions) throw new Error('Format tidak valid');
        showConfirm(
          'Import Backup',
          'Data saat ini akan ditimpa dengan data backup. Lanjutkan?',
          function() {
            state.transactions   = data.transactions   || [];
            state.monthlyArchive = data.monthlyArchive || {};
            state.budget         = data.budget         || 0;
            saveState();
            renderDashboard();
            renderFullTxList();
            renderRiwayat();
            showToast('Backup berhasil diimpor!', '✅');
          }
        );
      } catch(err) {
        showToast('File backup tidak valid!', '❌');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
