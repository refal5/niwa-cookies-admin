/* Niwa Cookies – لوحة إدارة المشروع
   كل البيانات محفوظة في جهازك (localStorage) – والنسخ الاحتياطي بملف JSON */
(() => {
'use strict';

const STORE_KEY = 'niwa-cookies:data';
const APP_ID = 'niwa-cookies-admin';
const DATA_VERSION = 1;

const STATUSES = {
  new:       { label: 'جديد',        tone: 'info' },
  preparing: { label: 'قيد التجهيز', tone: 'warn' },
  ready:     { label: 'جاهز',        tone: 'accent' },
  delivered: { label: 'تم التسليم',  tone: 'good' },
  cancelled: { label: 'ملغي',        tone: 'muted' },
};
const STATUS_ORDER = ['new', 'preparing', 'ready', 'delivered', 'cancelled'];
const PAY_METHODS = ['كاش', 'تحويل بنكي', 'مدى', 'Apple Pay', 'STC Pay'];
const EXPENSE_CATS = [
  { id: 'ingredients', label: 'مواد خام',        emoji: '🧈' },
  { id: 'packaging',   label: 'تغليف وعلب',      emoji: '📦' },
  { id: 'delivery',    label: 'توصيل',           emoji: '🚗' },
  { id: 'marketing',   label: 'تسويق وإعلانات',  emoji: '📣' },
  { id: 'equipment',   label: 'أدوات ومعدات',    emoji: '🍳' },
  { id: 'other',       label: 'أخرى',            emoji: '🧾' },
];
const COLORS = ['#654C3D', '#CDB298', '#8A8A77', '#A39A8D', '#8C705A', '#D8C6B6', '#9FAAAA', '#5F6466'];
// تحويل ألوان المنتجات القديمة للألوان المحايدة الجديدة
const OLD_COLORS = {
  '#7A4A2A': '#654C3D', '#E07B39': '#CDB298', '#6E9A3A': '#8A8A77', '#D45D8C': '#A39A8D', '#7D5BA6': '#8C705A', '#3C7DBF': '#5F6466', '#C9A227': '#D8C6B6', '#B23A3A': '#9FAAAA',
  '#C9A189': '#654C3D', '#F2B488': '#CDB298', '#A8C98F': '#8A8A77', '#F1A9C2': '#A39A8D', '#BBA8E3': '#8C705A', '#9EC5E8': '#5F6466', '#EBCD80': '#D8C6B6', '#E7A0A0': '#9FAAAA',
};
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const PERIODS = { month: 'هذا الشهر', last: 'الشهر الماضي', year: 'هذي السنة', all: 'الكل' };
const ORDER_FILTERS = { active: 'الحالية', unpaid: 'غير مدفوعة', delivered: 'تم التسليم', cancelled: 'ملغية', all: 'الكل' };
const ROUTES = {
  home:     { label: 'الرئيسية',  icon: 'home' },
  orders:   { label: 'الطلبات',   icon: 'bag' },
  products: { label: 'المنتجات',  icon: 'cookie' },
  expenses: { label: 'الميزانية', icon: 'wallet' },
  settings: { label: 'الإعدادات', icon: 'sliders' },
};
const FAB = {
  home:     ['new-order', 'طلب جديد'],
  orders:   ['new-order', 'طلب جديد'],
  products: ['new-batch', 'سويت دفعة'],
  expenses: ['new-expense', 'مصروف جديد'],
};

/* ---------- أيقونات ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  bag: '<path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cookie: '<circle cx="12" cy="12" r="9"/><circle class="fill" cx="8.5" cy="9" r="1.3"/><circle class="fill" cx="14.5" cy="8.5" r="1.1"/><circle class="fill" cx="10" cy="14.5" r="1.2"/><circle class="fill" cx="15.5" cy="14" r="1.3"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M16 15h2"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15.5 6 9"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.4A8.5 8.5 0 1 1 20.5 12z"/>',
  next: '<path d="m15 6-6 6 6 6"/>',
  prev: '<path d="m9 6 6 6-6 6"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  alert: '<path d="M12 3.5 2.5 20h19L12 3.5z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  tray: '<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7.5 7c0-1 1-1.5 1-2.5M12 7c0-1 1-1.5 1-2.5M16.5 7c0-1 1-1.5 1-2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3z"/><path d="m9 12 2 2 4-4"/>',
};
function icon(name, size = 20) {
  return `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ---------- أدوات ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toEn = s => String(s ?? '')
  .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const num = v => { const n = parseFloat(toEn(v).replace(/[٫,]/g, '.').replace(/[^\d.\-]/g, '')); return Number.isFinite(n) ? n : 0; };
const int = v => Math.max(0, Math.round(num(v)));
const round2 = n => Math.round(n * 100) / 100;
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
const fmtNum = n => round2(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const money = n => `<span class="num">${fmtNum(n)}</span> ${esc(state.settings.currency)}`;
const moneyText = n => `${fmtNum(n)} ${state.settings.currency}`;
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => ymd(new Date());
const addDays = (s, k) => { const d = parseDate(s); d.setDate(d.getDate() + k); return ymd(d); };
const fmtDate = s => { if (!s) return ''; const d = parseDate(s); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const relDay = s => {
  if (!s) return '';
  const t = today();
  if (s === t) return 'اليوم';
  if (s === addDays(t, 1)) return 'بكرة';
  if (s === addDays(t, -1)) return 'أمس';
  return fmtDate(s);
};
const monthLabel = ym => { const [y, m] = ym.split('-').map(Number); return `${MONTHS[m - 1]} ${y}`; };
const ymOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

/* ---------- البيانات ---------- */
function defaultState() {
  const size = (name, price, low, packs = []) => ({ id: uid(), name, price, cost: 0, stock: 0, low, packs });
  const product = (name, description, color, mini, regular, packs) => ({
    id: uid(), name, description, color, active: true, createdAt: Date.now(),
    sizes: [size('ميني', mini, 20), size('عادي', regular, 10, packs)],
  });
  return {
    app: APP_ID,
    version: DATA_VERSION,
    settings: { name: 'Niwa Cookies', currency: 'ر.س', notify: false, monthlyBudget: 0, backupDays: 7, theme: 'light' },
    meta: { nextOrderNo: 1, lastBackup: null, createdAt: Date.now() },
    products: [
      product('كلاسيك بلجيكي', 'كوكيز بالشوكولاتة البلجيكية', '#654C3D', 1.5, 5, [{ qty: 4, price: 17 }, { qty: 8, price: 31 }]),
      product('كندر', 'كوكيز بالشوكولاتة البلجيكية وكندر', '#CDB298', 2.5, 6, [{ qty: 4, price: 21 }, { qty: 8, price: 39 }]),
      product('ماتشا', 'كوكيز بالشوكولاتة البلجيكية وماتشا', '#8A8A77', 2.5, 6, [{ qty: 4, price: 21 }, { qty: 8, price: 39 }]),
    ],
    orders: [],
    expenses: [],
    batches: [],
  };
}

function normalize(d) {
  const def = defaultState();
  const s = { ...def, ...d };
  s.settings = { ...def.settings, ...(d.settings || {}) };
  s.meta = { ...def.meta, ...(d.meta || {}) };
  for (const k of ['products', 'orders', 'expenses', 'batches']) if (!Array.isArray(s[k])) s[k] = [];
  // التصميم الجديد فاتح افتراضيًا
  if (!s.meta.pastel) { if (s.settings.theme === 'auto') s.settings.theme = 'light'; s.meta.pastel = true; }
  for (const p of s.products) {
    if (OLD_COLORS[p.color]) p.color = OLD_COLORS[p.color];
    p.sizes = Array.isArray(p.sizes) ? p.sizes : [];
    for (const z of p.sizes) { z.packs = Array.isArray(z.packs) ? z.packs : []; z.stock = Number(z.stock) || 0; z.low = Number(z.low) || 0; }
  }
  for (const o of s.orders) o.items = Array.isArray(o.items) ? o.items : [];
  s.app = APP_ID;
  s.version = DATA_VERSION;
  return s;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) { console.warn('load failed', e); }
  return defaultState();
}

let state = load();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch (e) { toast('ما قدرت أحفظ البيانات! سوّ نسخة احتياطية الحين', 'bad', 6000); }
}

/* ---------- حسابات ---------- */
const findProduct = id => state.products.find(p => p.id === id);
const findSize = (pid, sid) => findProduct(pid)?.sizes.find(s => s.id === sid);
const isOpen = o => o.status === 'new' || o.status === 'preparing' || o.status === 'ready';
const byDelivery = (a, b) => (a.deliveryDate || '9999').localeCompare(b.deliveryDate || '9999') || a.no - b.no;

// أرخص سعر لعدد معيّن من الحبات باستخدام عروض الكمية (برمجة ديناميكية)
function bestPrice(qty, unit, packs) {
  qty = Math.max(0, Math.floor(qty));
  if (!qty) return { total: 0, parts: [] };
  const opts = [...(packs || []).filter(p => p.qty > 1 && p.price > 0).sort((a, b) => b.qty - a.qty), { qty: 1, price: unit }];
  const cost = new Array(qty + 1).fill(Infinity);
  const pick = new Array(qty + 1).fill(-1);
  cost[0] = 0;
  for (let n = 1; n <= qty; n++) {
    for (let i = 0; i < opts.length; i++) {
      const o = opts[i];
      if (o.qty <= n && cost[n - o.qty] + o.price < cost[n] - 1e-9) { cost[n] = cost[n - o.qty] + o.price; pick[n] = i; }
    }
  }
  const counts = new Map();
  for (let n = qty; n > 0; n -= opts[pick[n]].qty) counts.set(pick[n], (counts.get(pick[n]) || 0) + 1);
  const parts = [...counts].sort((a, b) => opts[b[0]].qty - opts[a[0]].qty).map(([i, c]) => ({ qty: opts[i].qty, count: c }));
  return { total: round2(cost[qty]), parts };
}
const partsText = parts => parts.map(p => p.qty === 1 ? `${p.count} حبة` : `${p.count > 1 ? p.count + '× ' : ''}بوكس ${p.qty}`).join(' + ');
// pricing: 'packs' = بالعروض (4 و 8) | 'unit' = بسعر الحبة
const lineTotal = (it, o) => o?.pricing === 'unit' ? round2(it.qty * it.price) : bestPrice(it.qty, it.price, it.packs).total;
const orderSubtotal = o => sum(o.items, i => lineTotal(i, o));
const orderTotal = o => round2(Math.max(0, orderSubtotal(o) - (o.discount || 0) + (o.deliveryFee || 0)) + (o.tip || 0));
const orderPieces = o => sum(o.items, i => i.qty);
const itemsSummary = o => o.items.map(i => `${i.qty} ${i.name} ${i.size}`).join(' · ');

function stockLevel(s) { return s.stock <= 0 ? 'out' : s.stock <= s.low ? 'low' : 'ok'; }
const LEVEL_LABEL = { ok: 'متوفر', low: 'قارب يخلص', out: 'نفد' };
function lowStockList() {
  const out = [];
  for (const p of state.products) {
    if (!p.active) continue;
    for (const s of p.sizes) { const lv = stockLevel(s); if (lv !== 'ok') out.push({ p, s, lv }); }
  }
  return out.sort((a, b) => a.s.stock - b.s.stock);
}

function applyOrderStock(order, sign) {
  if (!order || order.status === 'cancelled') return;
  for (const it of order.items) { const s = findSize(it.productId, it.sizeId); if (s) s.stock += sign * it.qty; }
}
function snapshotStock() {
  const m = new Map();
  for (const p of state.products) for (const s of p.sizes) m.set(s.id, s.stock);
  return m;
}
function reportStockChanges(before) {
  const rank = { ok: 0, low: 1, out: 2 };
  const hits = [];
  for (const p of state.products) {
    if (!p.active) continue;
    for (const s of p.sizes) {
      const b = before.get(s.id);
      if (b === undefined) continue;
      const lvB = stockLevel({ stock: b, low: s.low });
      const lvA = stockLevel(s);
      if (rank[lvA] > rank[lvB]) hits.push({ p, s, lv: lvA });
    }
  }
  if (hits.length) notifyLow(hits);
  updateBell();
}
function notifyLow(hits) {
  const first = hits[0];
  const msg = hits.length === 1
    ? `${first.lv === 'out' ? 'نفد' : `قارب يخلص (باقي ${first.s.stock})`}: ${first.p.name} ${first.s.name}`
    : `${hits.length} أصناف قاربت تخلص`;
  toast(msg, 'warn', 5000, 'alert');
  if (!state.settings.notify || !('Notification' in window) || Notification.permission !== 'granted') return;
  const title = 'تنبيه المخزون 🍪';
  const opts = {
    body: hits.map(h => `${h.p.name} ${h.s.name}: ${h.lv === 'out' ? 'نفد' : 'باقي ' + h.s.stock}`).join('\n'),
    icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'low-stock', lang: 'ar', dir: 'rtl',
  };
  const fallback = () => { try { new Notification(title, opts); } catch (e) { /* غير مدعوم */ } };
  if (navigator.serviceWorker?.controller) navigator.serviceWorker.ready.then(r => r.showNotification(title, opts)).catch(fallback);
  else fallback();
}

function periodRange(p) {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth();
  if (p === 'month') return [ymd(new Date(y, m, 1)), ymd(new Date(y, m + 1, 0))];
  if (p === 'last') return [ymd(new Date(y, m - 1, 1)), ymd(new Date(y, m, 0))];
  if (p === 'year') return [`${y}-01-01`, `${y}-12-31`];
  return ['0000-00-00', '9999-99-99'];
}
const inRange = (s, [a, b]) => !!s && s >= a && s <= b;

function uniqueCustomers() {
  const m = new Map();
  for (const o of [...state.orders].sort((a, b) => a.createdAt - b.createdAt)) {
    const n = (o.customer || '').trim();
    if (n) m.set(n, o.phone || m.get(n) || '');
  }
  return m;
}
function waNumber(p) {
  let d = toEn(p).replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('05') && d.length === 10) d = '966' + d.slice(1);
  else if (d.startsWith('5') && d.length === 9) d = '966' + d;
  return d;
}
function waLink(o) {
  const n = waNumber(o.phone);
  if (!n) return '';
  const lines = [
    `هلا ${o.customer || ''} 🍪`,
    `تفاصيل طلبك رقم #${o.no}:`,
    ...o.items.map(i => `• ${i.qty} ${i.name} ${i.size}`),
    `الإجمالي: ${moneyText(orderTotal(o) - (o.tip || 0))}`,
  ];
  return `https://wa.me/${n}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/* ---------- واجهة: حالة ---------- */
const ui = { period: 'month', orderFilter: 'active', orderSearch: '', expMonth: ymOf(new Date()) };
let route = 'home';
let draft = null;       // مسودة الطلب أو الدفعة المفتوحة
let installEvt = null;

/* ---------- Toast / Dialog / Sheet ---------- */
function toast(msg, tone = '', ms = 2600, ic = '') {
  const el = document.createElement('div');
  el.className = `toast ${tone}`;
  el.innerHTML = `${ic ? icon(ic, 18) : ''}<span>${esc(msg)}</span>`;
  $('#toasts').append(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, ms);
}

function confirmDialog({ title, message = '', ok = 'تأكيد', danger = false }) {
  return new Promise(resolve => {
    const d = $('#dialog');
    d.innerHTML = `<div class="dialog-backdrop" data-r="0"></div>
      <div class="dialog-panel" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t">
        <h3 id="dlg-t">${esc(title)}</h3>${message ? `<p>${esc(message)}</p>` : ''}
        <div class="dialog-actions">
          <button class="btn ghost" data-r="0">إلغاء</button>
          <button class="btn ${danger ? 'danger-solid' : 'primary'}" data-r="1">${esc(ok)}</button>
        </div></div>`;
    d.hidden = false;
    const done = v => { d.hidden = true; d.onclick = null; document.removeEventListener('keydown', onKey, true); resolve(v); };
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
    document.addEventListener('keydown', onKey, true);
    d.onclick = e => { const b = e.target.closest('[data-r]'); if (b) done(b.dataset.r === '1'); };
    d.querySelector('[data-r="1"]').focus();
  });
}

let sheetOpen = false;
let ignorePop = false;
function openSheet(title, body, foot = '') {
  $('#sheet-title').textContent = title;
  $('#sheet-body').innerHTML = body;
  $('#sheet-foot').innerHTML = foot;
  $('#sheet-body').scrollTop = 0;
  if (!sheetOpen) {
    $('#sheet').hidden = false;
    document.body.classList.add('locked');
    history.pushState({ sheet: true }, '');
    sheetOpen = true;
  }
}
function hideSheet() {
  sheetOpen = false;
  draft = null;
  $('#sheet').hidden = true;
  document.body.classList.remove('locked');
}
function closeSheet() {
  if (!sheetOpen) return;
  hideSheet();
  if (history.state?.sheet) { ignorePop = true; history.back(); }
}
window.addEventListener('popstate', () => {
  if (ignorePop) { ignorePop = false; return; }
  if (sheetOpen) hideSheet();
});

/* ---------- الهيكل ---------- */
function currentRoute() { const h = location.hash.replace('#', ''); return ROUTES[h] ? h : 'home'; }

function renderNav() {
  $('#nav').innerHTML = Object.entries(ROUTES).map(([k, r]) =>
    `<a href="#${k}" data-route="${k}">${icon(r.icon, 22)}<span>${r.label}</span></a>`).join('');
}
function applyTheme() {
  const t = state.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}
function updateBell() {
  const n = lowStockList().length;
  const b = $('#bell-badge');
  b.hidden = !n;
  b.textContent = n;
  $('#bell').setAttribute('aria-label', n ? `تنبيهات المخزون: ${n}` : 'تنبيهات المخزون');
}
function updateFab() {
  const f = FAB[route];
  const el = $('#fab');
  el.hidden = !f;
  if (f) { el.dataset.action = f[0]; el.innerHTML = `${icon('plus', 22)}<span>${f[1]}</span>`; }
}

const VIEWS = { home: viewHome, orders: viewOrders, products: viewProducts, expenses: viewExpenses, settings: viewSettings };
function render() {
  route = currentRoute();
  $('#brand-name').textContent = state.settings.name || 'مشروعي';
  document.title = `${ROUTES[route].label} · ${state.settings.name || 'مشروعي'}`;
  $$('#nav a').forEach(a => {
    const on = a.dataset.route === route;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  $('#view').innerHTML = VIEWS[route]();
  updateFab();
  updateBell();
  if (route === 'home') drawMonthChart($('#chart-months'));
}

/* ---------- الرئيسية ---------- */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'صباح الخير ☀️' : 'مساء الخير 🌙';
}
function backupDue() {
  const days = Number(state.settings.backupDays);
  if (!days || (!state.orders.length && !state.expenses.length)) return false;
  const last = state.meta.lastBackup;
  return !last || Date.now() - last > days * 864e5;
}
function backupBanner() {
  if (!backupDue()) return '';
  const last = state.meta.lastBackup;
  const txt = last ? `صار لك ${Math.floor((Date.now() - last) / 864e5)} يوم بدون نسخة احتياطية` : 'ما سويت نسخة احتياطية لبياناتك للحين';
  return `<div class="banner">${icon('shield')}<p>${txt}</p><button class="btn sm primary" data-action="backup-now">سوّها الحين</button></div>`;
}

function viewHome() {
  const r = periodRange(ui.period);
  const orders = state.orders.filter(o => o.status !== 'cancelled' && inRange(o.date, r));
  const sales = sum(orders, orderTotal);
  const exps = sum(state.expenses.filter(e => inRange(e.date, r)), e => e.amount);
  const profit = sales - exps;
  const pieces = sum(orders, orderPieces);
  const tips = sum(orders, o => o.tip || 0);
  const unpaid = state.orders.filter(o => o.status !== 'cancelled' && !o.paid);
  const unpaidSum = sum(unpaid, orderTotal);
  const low = lowStockList();
  const upcoming = state.orders.filter(isOpen).sort(byDelivery).slice(0, 6);
  const fresh = !state.orders.length && state.products.every(p => p.sizes.every(s => !s.stock));

  return `
  <div class="page-head"><div><h1>${greeting()}</h1><p class="muted">${fmtDate(today())} ${new Date().getFullYear()}</p></div></div>
  ${backupBanner()}
  ${fresh ? `<div class="welcome"><h2>أهلًا فيك 🍪</h2><p class="muted">عشان تبدأ:</p>
    <ol class="steps"><li>روح لـ <a href="#products">المنتجات</a> وحدّث الكميات المتوفرة عندك</li>
    <li>أضف تكلفة الحبة لكل منتج عشان تعرف ربحك</li><li>سجّل أول طلب من زر <b>طلب جديد</b></li></ol></div>` : ''}
  <div class="seg" role="group" aria-label="الفترة">${Object.entries(PERIODS).map(([k, v]) =>
    `<button class="${ui.period === k ? 'on' : ''}" data-action="period" data-p="${k}" aria-pressed="${ui.period === k}">${v}</button>`).join('')}</div>
  <section class="kpis">
    <div class="kpi hero ${profit < 0 ? 'neg' : ''}"><span class="kpi-label">صافي الربح</span><span class="kpi-value">${money(profit)}</span><span class="kpi-sub">المبيعات − المصاريف</span></div>
    <div class="kpi"><span class="kpi-label">المبيعات</span><span class="kpi-value">${money(sales)}</span>${tips ? `<span class="kpi-sub">منها إكراميات ${moneyText(tips)} 🎁</span>` : ''}</div>
    <div class="kpi"><span class="kpi-label">المصاريف</span><span class="kpi-value">${money(exps)}</span></div>
    <div class="kpi"><span class="kpi-label">الطلبات</span><span class="kpi-value"><span class="num">${orders.length}</span></span><span class="kpi-sub">${pieces} حبة</span></div>
    <button class="kpi tap" data-action="goto-unpaid"><span class="kpi-label">مبالغ ما انحصلت</span><span class="kpi-value ${unpaidSum ? 't-warn' : ''}">${money(unpaidSum)}</span><span class="kpi-sub">${unpaid.length} طلب</span></button>
  </section>

  <section class="card">
    <div class="card-head"><h2>تنبيهات المخزون</h2>${low.length ? `<span class="badge tone-warn">${icon('alert')}${low.length}</span>` : ''}</div>
    ${low.length ? `<div class="rows">${low.slice(0, 6).map(lowRow).join('')}</div>` : `<p class="empty-sm">كل المنتجات متوفرة 👌</p>`}
  </section>

  <section class="card">
    <div class="card-head"><h2>الطلبات الجاية</h2><a class="link sm" href="#orders">كل الطلبات</a></div>
    ${upcoming.length ? `<div class="rows">${upcoming.map(upcomingRow).join('')}</div>` : `<p class="empty-sm">ما فيه طلبات مفتوحة حاليًا</p>`}
  </section>

  <section class="card">
    <div class="card-head"><h2>المبيعات آخر ٦ شهور</h2></div>
    <div class="chart" id="chart-months"></div>
  </section>

  <section class="card">
    <div class="card-head"><h2>الأكثر مبيعًا</h2><span class="muted sm">${PERIODS[ui.period]}</span></div>
    ${bestSellers(orders)}
  </section>`;
}

function lowRow({ p, s, lv }) {
  return `<div class="row"><span class="dot" style="--pc:${p.color}"></span>
    <div class="row-main"><strong>${esc(p.name)} · ${esc(s.name)}</strong><span>${lv === 'out' ? 'نفد المخزون' : `باقي ${s.stock} حبة`}</span></div>
    <span class="badge ${lv === 'out' ? 'tone-bad' : 'tone-warn'}">${icon('alert')}${LEVEL_LABEL[lv]}</span>
    <button class="btn sm ghost" data-action="stock-sheet" data-pid="${p.id}" data-sid="${s.id}">${icon('plus', 16)} أضف</button></div>`;
}
function dueBadge(o) {
  if (!o.deliveryDate) return '';
  const t = today();
  if (isOpen(o) && o.deliveryDate < t) return `<span class="badge tone-bad">${icon('alert')}متأخر · ${fmtDate(o.deliveryDate)}</span>`;
  const tone = o.deliveryDate === t && isOpen(o) ? 'tone-warn' : '';
  return `<span class="badge ${tone}">${icon('calendar')}${relDay(o.deliveryDate)}</span>`;
}
function upcomingRow(o) {
  return `<button class="row" data-action="edit-order" data-id="${o.id}">
    <div class="row-main"><strong>#${o.no} · ${esc(o.customer || 'بدون اسم')}</strong><span>${esc(itemsSummary(o))}</span></div>
    <div class="row-end">${dueBadge(o)}<span class="sm muted">${STATUSES[o.status].label}</span></div></button>`;
}
function bestSellers(orders) {
  const m = new Map();
  for (const o of orders) for (const i of o.items) {
    const cur = m.get(i.productId) || { name: i.name, qty: 0, sales: 0 };
    cur.qty += i.qty; cur.sales += lineTotal(i, o);
    m.set(i.productId, cur);
  }
  const rows = [...m].sort((a, b) => b[1].qty - a[1].qty).slice(0, 6);
  if (!rows.length) return `<p class="empty-sm">لما تسجل طلبات بيطلع لك هنا أكثر الأصناف طلبًا</p>`;
  const max = rows[0][1].qty;
  return `<div class="hbars">${rows.map(([pid, r]) => `<div>
    <div class="hbar-top"><span>${esc(r.name)}</span><span><b>${r.qty}</b> حبة · ${money(r.sales)}</span></div>
    <div class="hbar-track"><div class="hbar-fill" style="width:${(r.qty / max) * 100}%;--pc:${findProduct(pid)?.color || 'var(--brand)'}"></div></div></div>`).join('')}</div>`;
}

function monthSeries(n) {
  const now = new Date();
  const out = [];
  for (let k = n - 1; k >= 0; k--) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
    const key = ymOf(d);
    const sales = sum(state.orders.filter(o => o.status !== 'cancelled' && o.date?.startsWith(key)), orderTotal);
    const exp = sum(state.expenses.filter(e => e.date?.startsWith(key)), e => e.amount);
    out.push({ key, label: MONTHS[d.getMonth()], full: monthLabel(key), sales, exp, profit: sales - exp });
  }
  return out;
}
function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}
function drawMonthChart(el) {
  if (!el) return;
  const data = monthSeries(6);
  const W = Math.max(280, el.clientWidth), H = 200, top = 24, bottom = 28, side = 4;
  const plotH = H - top - bottom;
  const max = niceMax(Math.max(1, ...data.map(d => d.sales)));
  const n = data.length, colW = (W - side * 2) / n, bw = Math.min(34, colW * 0.5);
  const y = v => top + plotH - (v / max) * plotH;
  const cx = i => W - side - colW * (i + 0.5); // من اليمين لليسار: الأقدم يمين
  let svg = '';
  [0, 0.5, 1].forEach(f => {
    const gy = y(max * f);
    svg += `<line class="grid${f === 0 ? ' base' : ''}" x1="${side}" x2="${W - side}" y1="${gy}" y2="${gy}"/>`;
    if (f > 0) svg += `<text class="axis" x="${side}" y="${gy - 5}" text-anchor="start">${fmtNum(max * f)}</text>`;
  });
  data.forEach((d, i) => {
    const h = (d.sales / max) * plotH;
    const x = cx(i) - bw / 2, by = top + plotH - h;
    if (h > 0.5) {
      const r = Math.min(4, h);
      svg += `<path class="bar" data-i="${i}" d="M${x},${top + plotH} V${by + r} Q${x},${by} ${x + r},${by} H${x + bw - r} Q${x + bw},${by} ${x + bw},${by + r} V${top + plotH} Z"/>`;
    }
    if (i === n - 1 && d.sales > 0) svg += `<text class="val" x="${cx(i)}" y="${by - 7}" text-anchor="middle">${fmtNum(d.sales)}</text>`;
    svg += `<text class="axis" x="${cx(i)}" y="${H - 8}" text-anchor="middle">${d.label}</text>`;
    svg += `<rect class="hit" data-i="${i}" x="${cx(i) - colW / 2}" y="0" width="${colW}" height="${H}"/>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="المبيعات الشهرية لآخر ٦ شهور" style="direction:ltr">${svg}</svg><div class="tip" hidden></div>`;
  const tip = el.querySelector('.tip');
  const show = i => {
    const d = data[i];
    el.classList.add('hovering');
    el.querySelectorAll('.bar').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    tip.innerHTML = `<strong>${d.full}</strong><div><span>المبيعات</span><b>${moneyText(d.sales)}</b></div>
      <div><span>المصاريف</span><b>${moneyText(d.exp)}</b></div><div><span>صافي الربح</span><b>${moneyText(d.profit)}</b></div>`;
    tip.hidden = false;
    const tw = tip.offsetWidth;
    const left = Math.min(Math.max(0, cx(i) - tw / 2), W - tw);
    tip.style.left = `${left}px`;
    tip.style.top = `-8px`;
  };
  const hide = () => { el.classList.remove('hovering'); tip.hidden = true; };
  el.querySelectorAll('.hit').forEach(h => {
    h.addEventListener('pointerenter', () => show(+h.dataset.i));
    h.addEventListener('click', () => show(+h.dataset.i));
  });
  el.querySelector('svg').addEventListener('pointerleave', hide);
}

/* ---------- الطلبات ---------- */
function filterOrders(f) {
  return state.orders.filter(o =>
    f === 'all' ? true :
    f === 'active' ? isOpen(o) :
    f === 'unpaid' ? o.status !== 'cancelled' && !o.paid :
    o.status === f);
}
function viewOrders() {
  return `
  <div class="page-head"><div><h1>الطلبات</h1><p class="muted">${filterOrders('active').length} طلب مفتوح</p></div></div>
  <label class="search">${icon('search')}<input id="order-search" type="search" placeholder="ابحث بالاسم أو الجوال أو رقم الطلب" value="${esc(ui.orderSearch)}" aria-label="بحث في الطلبات"></label>
  <div class="seg" role="group" aria-label="تصفية الطلبات">${Object.entries(ORDER_FILTERS).map(([k, v]) =>
    `<button class="${ui.orderFilter === k ? 'on' : ''}" data-action="order-filter" data-f="${k}" aria-pressed="${ui.orderFilter === k}">${v} <span class="count">${filterOrders(k).length}</span></button>`).join('')}</div>
  <div id="orders-list">${ordersListHTML()}</div>`;
}
function ordersListHTML() {
  const q = toEn(ui.orderSearch.trim()).toLowerCase();
  let list = filterOrders(ui.orderFilter);
  if (q) list = list.filter(o => (o.customer || '').toLowerCase().includes(q) || toEn(o.phone || '').includes(q) || String(o.no) === q.replace('#', ''));
  list.sort(ui.orderFilter === 'active' ? byDelivery : (a, b) => (b.date || '').localeCompare(a.date || '') || b.no - a.no);
  if (!list.length) {
    return `<div class="empty"><span class="big">🍪</span>${state.orders.length ? 'ما فيه طلبات هنا' : 'ما سجلت طلبات للحين — اضغط <b>طلب جديد</b>'}</div>`;
  }
  return `<div class="order-list">${list.map(orderCard).join('')}</div>`;
}
function orderCard(o) {
  const st = STATUSES[o.status];
  const wa = waLink(o);
  const done = o.status === 'delivered' || o.status === 'cancelled';
  return `<article class="order-card ${done ? 'done' : ''}">
    <div class="oc-head"><span class="oc-no">#${o.no}</span><span class="oc-name">${esc(o.customer || 'بدون اسم')}</span><span class="badge tone-${st.tone}">${st.label}</span></div>
    <div class="oc-items">${esc(itemsSummary(o))}</div>
    ${o.notes ? `<div class="oc-note">${esc(o.notes)}</div>` : ''}
    <div class="oc-meta">${dueBadge(o)}
      ${o.status !== 'cancelled' ? (o.paid ? `<span class="badge tone-good">${icon('check')}مدفوع${o.payMethod ? ' · ' + esc(o.payMethod) : ''}</span>` : `<span class="badge tone-warn">غير مدفوع</span>`) : ''}
      ${o.pricing === 'unit' ? `<span class="badge">بسعر الحبة</span>` : ''}
      ${o.tip ? `<span class="badge tone-good">🎁 إكرامية ${fmtNum(o.tip)}</span>` : ''}
      <span class="oc-total">${money(orderTotal(o))}</span></div>
    <div class="oc-actions">
      <select class="status-select" data-change="order-status" data-id="${o.id}" aria-label="حالة الطلب">${STATUS_ORDER.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${STATUSES[s].label}</option>`).join('')}</select>
      ${o.status !== 'cancelled' ? `<button class="btn sm ghost" data-action="toggle-paid" data-id="${o.id}">${o.paid ? 'إلغاء الدفع' : `${icon('check', 16)} تم الدفع`}</button>` : ''}
      <span class="spacer"></span>
      ${wa ? `<a class="icon-btn" href="${wa}" target="_blank" rel="noopener" aria-label="مراسلة العميل واتساب">${icon('chat')}</a>` : ''}
      <button class="icon-btn" data-action="edit-order" data-id="${o.id}" aria-label="تعديل الطلب">${icon('edit')}</button>
    </div></article>`;
}

function openOrderSheet(id) {
  const o = id ? state.orders.find(x => x.id === id) : null;
  draft = { kind: 'order', id, items: new Map(), orig: new Map(), pricing: o?.pricing || 'packs' };
  if (o) for (const it of o.items) {
    const k = `${it.productId}:${it.sizeId}`;
    draft.items.set(k, { ...it, packs: it.packs || [] });
    if (o.status !== 'cancelled') draft.orig.set(k, it.qty);
  }
  const v = o || { customer: '', phone: '', date: today(), deliveryDate: today(), status: 'new', paid: false, payMethod: PAY_METHODS[0], discount: 0, deliveryFee: 0, tip: 0, notes: '' };
  const customers = uniqueCustomers();
  const body = `<form id="order-form" class="form" data-submit="save-order" autocomplete="off">
    <div class="field-row">
      <label class="field"><span>اسم العميل</span><input name="customer" list="customers-dl" value="${esc(v.customer)}" placeholder="مثال: أم محمد"></label>
      <label class="field"><span>رقم الجوال</span><input name="phone" type="tel" inputmode="tel" dir="ltr" value="${esc(v.phone)}" placeholder="05xxxxxxxx"></label>
    </div>
    <datalist id="customers-dl">${[...customers.keys()].map(c => `<option value="${esc(c)}">`).join('')}</datalist>
    <div class="field"><span>طريقة الحساب</span><div class="chips">
      <label class="chip"><input type="radio" name="pricing" value="packs" data-change="pricing" ${draft.pricing !== 'unit' ? 'checked' : ''}><span>بالعروض (بوكس 4 و 8)</span></label>
      <label class="chip"><input type="radio" name="pricing" value="unit" data-change="pricing" ${draft.pricing === 'unit' ? 'checked' : ''}><span>بسعر الحبة</span></label>
    </div></div>
    <fieldset class="field"><legend>وش طلب؟</legend>${pickerHTML('order')}</fieldset>
    <div class="field-row three">
      <label class="field"><span>خصم</span><input name="discount" inputmode="decimal" value="${v.discount || ''}" placeholder="0" data-totals></label>
      <label class="field"><span>التوصيل</span><input name="deliveryFee" inputmode="decimal" value="${v.deliveryFee || ''}" placeholder="0" data-totals></label>
      <label class="field"><span>إكرامية 🎁</span><input name="tip" inputmode="decimal" value="${v.tip || ''}" placeholder="0" data-totals></label>
    </div>
    <div class="totals" id="order-totals"></div>
    <div class="field-row">
      <label class="field"><span>تاريخ الطلب</span><input type="date" name="date" value="${v.date || today()}"></label>
      <label class="field"><span>موعد التسليم</span><input type="date" name="deliveryDate" value="${v.deliveryDate || ''}"></label>
    </div>
    <div class="field"><span>حالة الطلب</span><div class="chips">${STATUS_ORDER.map(s =>
      `<label class="chip"><input type="radio" name="status" value="${s}" ${v.status === s ? 'checked' : ''}><span>${STATUSES[s].label}</span></label>`).join('')}</div></div>
    <div class="field-row">
      <label class="switch-field"><input type="checkbox" name="paid" ${v.paid ? 'checked' : ''}><span class="switch"></span><span>تم الدفع</span></label>
      <label class="field"><span>طريقة الدفع</span><select name="payMethod">${PAY_METHODS.map(m => `<option ${v.payMethod === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
    </div>
    <label class="field"><span>ملاحظات</span><textarea name="notes" rows="2" placeholder="مثال: تغليف هدية، التوصيل بعد العصر…">${esc(v.notes)}</textarea></label>
  </form>`;
  const foot = `${id ? `<button class="btn ghost danger" data-action="delete-order" data-id="${id}">${icon('trash', 18)} حذف</button>` : ''}
    <button class="btn primary grow" data-action="save-order">${icon('check')} ${id ? 'حفظ التعديل' : 'إضافة الطلب'}</button>`;
  openSheet(id ? `تعديل طلب #${o.no}` : 'طلب جديد', body, foot);
  updateOrderTotals();
}

// قائمة اختيار المنتجات (للطلب أو للدفعة)
function pickerHTML(scope) {
  const blocks = [];
  const used = new Set();
  for (const p of state.products) {
    const inDraft = p.sizes.some(s => draft.items.has(`${p.id}:${s.id}`));
    if (!p.active && !inDraft) continue;
    const rows = p.sizes.map(s => {
      const k = `${p.id}:${s.id}`;
      used.add(k);
      return pickRow(scope, k, p, s);
    }).join('');
    if (rows) blocks.push(`<div class="pick-product"><div class="pick-title"><span class="dot" style="--pc:${p.color}"></span>${esc(p.name)}</div>${rows}</div>`);
  }
  // عناصر لمنتجات انحذفت
  const orphans = [...draft.items].filter(([k]) => !used.has(k));
  if (orphans.length) blocks.push(`<div class="pick-product"><div class="pick-title">منتجات محذوفة</div>${orphans.map(([k, it]) => pickRow(scope, k, null, null, it)).join('')}</div>`);
  if (!blocks.length) return `<p class="empty-sm">ما عندك منتجات فعّالة — أضفها من صفحة المنتجات</p>`;
  return `<div class="picker">${blocks.join('')}</div>`;
}
function pickRow(scope, k, p, s, orphan) {
  const it = draft.items.get(k);
  const qty = it?.qty || 0;
  let meta = '';
  if (scope === 'order') {
    const price = it?.price ?? s?.price ?? 0;
    const packs = it?.packs ?? s?.packs ?? [];
    const avail = s ? s.stock + (draft.orig.get(k) || 0) : null;
    const packTxt = packs.length ? ' · ' + packs.map(pk => `${pk.qty} بـ${fmtNum(pk.price)}`).join(' · ') : '';
    meta = `<span class="meta">الحبة ${fmtNum(price)}${packTxt}${avail !== null ? ` · <span class="stock-hint ${qty > avail ? 'over' : ''}" data-avail="${avail}">متوفر ${avail}</span>` : ''}</span>
      <span class="calc" data-calc="${k}">${qty ? calcText(it) : ''}</span>`;
  } else {
    meta = `<span class="meta">المتوفر الحين ${s.stock}</span>`;
  }
  const name = s ? esc(s.name) : `${esc(orphan.name)} ${esc(orphan.size)}`;
  return `<div class="pick-row ${qty ? 'on' : ''}" data-key="${k}">
    <div class="pick-info"><span class="nm">${name}</span>${meta}</div>
    <div class="stepper">
      <button type="button" class="step-btn" data-action="step" data-key="${k}" data-d="-1" aria-label="أنقص">${icon('minus', 18)}</button>
      <input class="qty" data-key="${k}" value="${qty || ''}" inputmode="numeric" placeholder="0" aria-label="الكمية">
      <button type="button" class="step-btn" data-action="step" data-key="${k}" data-d="1" aria-label="زد">${icon('plus', 18)}</button>
    </div></div>`;
}
function calcText(it) {
  if (draft?.pricing === 'unit') return `${it.qty} × ${fmtNum(it.price)} = ${moneyText(it.qty * it.price)}`;
  const r = bestPrice(it.qty, it.price, it.packs);
  const usesPack = r.parts.some(p => p.qty > 1);
  return `${usesPack ? partsText(r.parts) + ' = ' : ''}${moneyText(r.total)}`;
}
function setDraftQty(k, q, fromInput) {
  if (!draft) return;
  q = Math.max(0, Math.round(q));
  let it = draft.items.get(k);
  if (!it) {
    const [pid, sid] = k.split(':');
    const p = findProduct(pid), s = findSize(pid, sid);
    if (!p || !s) return;
    it = { productId: pid, sizeId: sid, name: p.name, size: s.name, price: s.price, cost: s.cost || 0, packs: (s.packs || []).map(x => ({ ...x })), qty: 0 };
    draft.items.set(k, it);
  }
  it.qty = q;
  const row = $(`.pick-row[data-key="${k}"]`);
  if (row) {
    row.classList.toggle('on', q > 0);
    const inp = row.querySelector('.qty');
    if (!fromInput) inp.value = q || '';
    const hint = row.querySelector('.stock-hint');
    if (hint) hint.classList.toggle('over', q > Number(hint.dataset.avail));
    const calc = row.querySelector('[data-calc]');
    if (calc) calc.textContent = q ? calcText(it) : '';
  }
  if (draft.kind === 'order') updateOrderTotals();
  if (draft.kind === 'batch') updateBatchTotal();
}
function updateOrderTotals() {
  const f = $('#order-form');
  if (!f || !draft) return;
  const items = [...draft.items.values()].filter(i => i.qty > 0);
  const sub = sum(items, i => lineTotal(i, draft));
  const disc = num(f.discount.value), fee = num(f.deliveryFee.value), tip = num(f.tip.value);
  const over = items.some(i => { const s = findSize(i.productId, i.sizeId); return s && i.qty > s.stock + (draft.orig.get(`${i.productId}:${i.sizeId}`) || 0); });
  $('#order-totals').innerHTML = `
    <div><span>عدد الحبات</span><b>${sum(items, i => i.qty)}</b></div>
    <div><span>المجموع</span><b>${money(sub)}</b></div>
    ${disc ? `<div><span>الخصم</span><b>− ${money(disc)}</b></div>` : ''}
    ${fee ? `<div><span>التوصيل</span><b>+ ${money(fee)}</b></div>` : ''}
    ${tip ? `<div><span>إكرامية 🎁</span><b>+ ${money(tip)}</b></div>` : ''}
    <div class="grand"><span>الإجمالي</span><b>${money(Math.max(0, sub - disc + fee) + tip)}</b></div>
    ${over ? `<div class="warnline">⚠️ بعض الكميات أكثر من المتوفر — المخزون بيصير بالسالب لين تضيف دفعة</div>` : ''}`;
}
function saveOrder() {
  const f = $('#order-form');
  if (!f || !draft) return;
  const items = [...draft.items.values()].filter(i => i.qty > 0).map(i => ({ ...i }));
  if (!items.length) return toast('اختر منتج واحد على الأقل', 'bad');
  const fields = {
    customer: f.customer.value.trim(),
    phone: f.phone.value.trim(),
    date: f.date.value || today(),
    deliveryDate: f.deliveryDate.value,
    status: f.status.value || 'new',
    paid: f.paid.checked,
    payMethod: f.payMethod.value,
    discount: num(f.discount.value),
    deliveryFee: num(f.deliveryFee.value),
    pricing: draft.pricing,
    tip: num(f.tip.value),
    notes: f.notes.value.trim(),
    items,
  };
  const before = snapshotStock();
  const id = draft.id;
  if (id) {
    const o = state.orders.find(x => x.id === id);
    applyOrderStock(o, +1);
    Object.assign(o, fields, { updatedAt: Date.now() });
    applyOrderStock(o, -1);
  } else {
    const o = { id: uid(), no: state.meta.nextOrderNo++, createdAt: Date.now(), ...fields };
    state.orders.push(o);
    applyOrderStock(o, -1);
  }
  save();
  closeSheet();
  render();
  toast(id ? 'تم حفظ التعديل' : 'تمت إضافة الطلب ✅', 'good');
  reportStockChanges(before);
}
async function deleteOrder(id) {
  const o = state.orders.find(x => x.id === id);
  if (!o) return;
  const ok = await confirmDialog({ title: `حذف طلب #${o.no}؟`, message: 'الكميات بترجع للمخزون. ما تقدر تتراجع بعد الحذف.', ok: 'حذف', danger: true });
  if (!ok) return;
  applyOrderStock(o, +1);
  state.orders = state.orders.filter(x => x.id !== id);
  save(); closeSheet(); render();
  toast('تم حذف الطلب');
}
function setOrderStatus(id, status) {
  const o = state.orders.find(x => x.id === id);
  if (!o || o.status === status) return;
  const before = snapshotStock();
  applyOrderStock(o, +1);
  o.status = status;
  applyOrderStock(o, -1);
  save(); render();
  toast(`الطلب #${o.no}: ${STATUSES[status].label}`);
  reportStockChanges(before);
}

/* ---------- المنتجات والمخزون ---------- */
function viewProducts() {
  const active = state.products.filter(p => p.active);
  const paused = state.products.filter(p => !p.active);
  const total = sum(active, p => sum(p.sizes, s => Math.max(0, s.stock)));
  const low = lowStockList().length;
  return `
  <div class="page-head"><div><h1>المنتجات والمخزون</h1>
    <p class="muted">${total} حبة متوفرة${low ? ` · <span class="t-warn">${low} قاربت تخلص</span>` : ''}</p></div>
    <button class="btn ghost" data-action="new-product">${icon('plus')} منتج جديد</button></div>
  ${active.length ? `<div class="product-grid">${active.map(productCard).join('')}</div>` : `<div class="empty"><span class="big">🍪</span>ما فيه منتجات — أضف أول منتج</div>`}
  ${paused.length ? `<h2 class="section-title">منتجات موقوفة (ما تطلع في الطلبات)</h2><div class="product-grid paused">${paused.map(productCard).join('')}</div>` : ''}
  <h2 class="section-title">سجل الإنتاج</h2>
  <section class="card">${batchLog()}</section>`;
}
function productCard(p) {
  const sizes = p.sizes.map(s => {
    const lv = stockLevel(s);
    const margin = s.cost > 0 ? s.price - s.cost : null;
    const packs = (s.packs || []).length ? `<span class="packs">${s.packs.map(pk => `${pk.qty} حبات بـ${fmtNum(pk.price)}`).join(' · ')}</span>` : '';
    return `<div class="size-row lv-${lv}">
      <div class="size-info"><strong>${esc(s.name)}</strong><span class="price">الحبة ${money(s.price)}</span>${packs}
        <span class="sm muted">${margin !== null ? `تكلفة ${fmtNum(s.cost)} · ربح الحبة <b class="${margin < 0 ? 't-bad' : 't-good'}">${fmtNum(margin)}</b>` : `<button class="link" data-action="edit-product" data-id="${p.id}">أضف تكلفة الحبة</button>`}</span></div>
      <div class="stock-ctl">
        <button class="step-btn" data-action="stock-dec" data-pid="${p.id}" data-sid="${s.id}" aria-label="نقّص حبة من ${esc(p.name)} ${esc(s.name)}">${icon('minus', 18)}</button>
        <button class="stock-num" data-action="stock-sheet" data-pid="${p.id}" data-sid="${s.id}" aria-label="تعديل مخزون ${esc(p.name)} ${esc(s.name)}"><b>${s.stock}</b><span>${LEVEL_LABEL[lv]}</span></button>
        <button class="step-btn" data-action="stock-inc" data-pid="${p.id}" data-sid="${s.id}" aria-label="زد حبة لـ ${esc(p.name)} ${esc(s.name)}">${icon('plus', 18)}</button>
      </div></div>`;
  }).join('');
  return `<article class="product-card" style="--pc:${p.color}">
    <div class="pc-head"><span class="dot"></span><h3>${esc(p.name)}</h3>
      <button class="icon-btn" data-action="edit-product" data-id="${p.id}" aria-label="تعديل ${esc(p.name)}">${icon('edit')}</button></div>
    ${p.description ? `<p class="pc-desc">${esc(p.description)}</p>` : ''}
    ${sizes}</article>`;
}
function batchLog() {
  const list = [...state.batches].sort((a, b) => b.at - a.at).slice(0, 25);
  if (!list.length) return `<p class="empty-sm">لما تسوي دفعة جديدة وتضيفها للمخزون بتطلع هنا</p>`;
  return `<ul class="log">${list.map(b => `<li><span class="log-qty ${b.qty < 0 ? 'neg' : ''}">${b.qty > 0 ? '+' : ''}${b.qty}</span>
    <span>${esc(b.name)} · ${esc(b.size)}</span><span class="muted sm">${b.type === 'adjust' ? 'تعديل' : 'دفعة'} · ${relDay(b.date)}</span></li>`).join('')}</ul>`;
}
function logBatch(p, s, qty, type) {
  if (!qty) return;
  state.batches.push({ id: uid(), at: Date.now(), date: today(), productId: p.id, sizeId: s.id, name: p.name, size: s.name, qty, type });
  if (state.batches.length > 500) state.batches = state.batches.slice(-500);
}
function bumpStock(pid, sid, d) {
  const p = findProduct(pid), s = findSize(pid, sid);
  if (!s) return;
  const before = snapshotStock();
  s.stock += d;
  save(); render();
  reportStockChanges(before);
}

function openStockSheet(pid, sid) {
  const p = findProduct(pid), s = findSize(pid, sid);
  if (!s) return;
  draft = { kind: 'stock', pid, sid, mode: 'add' };
  const body = `<form id="stock-form" class="form" data-submit="save-stock">
    <p class="muted">المتوفر الحين: <b class="num">${s.stock}</b> حبة · ينبهك لما يوصل <b class="num">${s.low}</b></p>
    <div class="chips" role="radiogroup">
      <label class="chip"><input type="radio" name="mode" value="add" checked data-change="stock-mode"><span>${icon('tray', 16)} سويت دفعة (أضف)</span></label>
      <label class="chip"><input type="radio" name="mode" value="set" data-change="stock-mode"><span>${icon('edit', 16)} عدّل العدد الفعلي</span></label>
    </div>
    <label class="field"><span id="stock-q-label">كم حبة سويت؟</span><input class="big-input" name="q" inputmode="numeric" placeholder="0" autofocus></label>
    <div class="chips" id="quick-add">${[6, 12, 24, 48].map(n => `<button type="button" class="btn sm ghost" data-action="quick-q" data-n="${n}">+${n}</button>`).join('')}</div>
  </form>`;
  openSheet(`${p.name} · ${s.name}`, body, `<button class="btn primary grow" data-action="save-stock">${icon('check')} حفظ</button>`);
  setTimeout(() => $('#stock-form [name=q]')?.focus(), 250);
}
function saveStock() {
  const f = $('#stock-form');
  if (!f || draft?.kind !== 'stock') return;
  const p = findProduct(draft.pid), s = findSize(draft.pid, draft.sid);
  const raw = f.q.value.trim();
  if (!raw) return toast('اكتب الكمية', 'bad');
  const q = int(raw);
  const before = snapshotStock();
  if (f.mode.value === 'add') {
    if (!q) return toast('اكتب الكمية', 'bad');
    s.stock += q; logBatch(p, s, q, 'batch');
    toast(`أضفت ${q} حبة ${p.name} ${s.name} 🍪`, 'good');
  } else {
    const delta = q - s.stock;
    s.stock = q; logBatch(p, s, delta, 'adjust');
    toast('تم تعديل المخزون', 'good');
  }
  save(); closeSheet(); render();
  reportStockChanges(before);
}

function openBatchSheet() {
  draft = { kind: 'batch', items: new Map(), orig: new Map() };
  const body = `<form id="batch-form" class="form" data-submit="save-batch">
    <p class="muted">سجّل كم حبة سويت من كل صنف، وبتنضاف للمخزون مباشرة.</p>
    ${pickerHTML('batch')}
    <div class="totals"><div class="grand"><span>المجموع</span><b id="batch-total">0 حبة</b></div></div>
  </form>`;
  openSheet('دفعة جديدة 🍪', body, `<button class="btn primary grow" data-action="save-batch">${icon('check')} أضف للمخزون</button>`);
}
function updateBatchTotal() {
  const el = $('#batch-total');
  if (el && draft) el.textContent = `${sum([...draft.items.values()], i => i.qty)} حبة`;
}
function saveBatch() {
  if (draft?.kind !== 'batch') return;
  const items = [...draft.items.values()].filter(i => i.qty > 0);
  if (!items.length) return toast('حدد الكميات اللي سويتها', 'bad');
  const before = snapshotStock();
  let total = 0;
  for (const it of items) {
    const p = findProduct(it.productId), s = findSize(it.productId, it.sizeId);
    if (!s) continue;
    s.stock += it.qty; total += it.qty;
    logBatch(p, s, it.qty, 'batch');
  }
  save(); closeSheet(); render();
  toast(`أضفت ${total} حبة للمخزون 🍪`, 'good');
  reportStockChanges(before);
}

function packRowHTML(pk = { qty: '', price: '' }) {
  return `<div class="pack-row"><input name="pqty" inputmode="numeric" value="${pk.qty}" placeholder="4" aria-label="عدد الحبات"><span>حبات بسعر</span>
    <input name="pprice" inputmode="decimal" value="${pk.price}" placeholder="17" aria-label="سعر البوكس"><span>${esc(state.settings.currency)}</span>
    <button type="button" class="icon-btn" data-action="remove-pack" aria-label="حذف العرض">${icon('x', 18)}</button></div>`;
}
function sizeEditHTML(s) {
  return `<div class="size-edit" data-sid="${s.id || ''}">
    <div class="size-edit-head"><input class="input" name="sname" value="${esc(s.name)}" placeholder="اسم الحجم (مثال: ميني)" aria-label="اسم الحجم">
      <button type="button" class="icon-btn" data-action="remove-size" aria-label="حذف الحجم">${icon('trash', 18)}</button></div>
    <div class="grid4">
      <label class="field sm"><span>سعر الحبة</span><input name="sprice" inputmode="decimal" value="${s.price ?? ''}" placeholder="0"></label>
      <label class="field sm"><span>تكلفة الحبة</span><input name="scost" inputmode="decimal" value="${s.cost || ''}" placeholder="اختياري"></label>
      <label class="field sm"><span>المتوفر</span><input name="sstock" inputmode="numeric" value="${s.stock ?? 0}"></label>
      <label class="field sm"><span>نبهني لما يوصل</span><input name="slow" inputmode="numeric" value="${s.low ?? 10}"></label>
    </div>
    <div class="field sm"><span>عروض الكمية (بوكسات)</span>
      <div class="packs-edit">${(s.packs || []).map(packRowHTML).join('')}</div>
      <button type="button" class="link sm" data-action="add-pack" style="align-self:flex-start">+ أضف عرض</button></div>
  </div>`;
}
function openProductSheet(id) {
  const p = id ? findProduct(id) : {
    name: '', description: '', color: COLORS[state.products.length % COLORS.length], active: true,
    sizes: [{ name: 'ميني', price: '', cost: 0, stock: 0, low: 20, packs: [] }, { name: 'عادي', price: '', cost: 0, stock: 0, low: 10, packs: [] }],
  };
  draft = { kind: 'product', id };
  const body = `<form id="product-form" class="form" data-submit="save-product">
    <label class="field"><span>اسم المنتج</span><input name="name" value="${esc(p.name)}" placeholder="مثال: ريد فلفت" required></label>
    <label class="field"><span>الوصف</span><input name="description" value="${esc(p.description)}" placeholder="اختياري"></label>
    <div class="field"><span>اللون</span><div class="swatches">${COLORS.map(c =>
      `<label class="swatch" style="--c:${c}"><input type="radio" name="color" value="${c}" ${p.color === c ? 'checked' : ''} aria-label="لون"><span></span></label>`).join('')}</div></div>
    <div class="field"><span>الأحجام والأسعار</span><div class="sizes-editor" id="sizes-editor">${p.sizes.map(sizeEditHTML).join('')}</div>
      <button type="button" class="btn ghost sm" data-action="add-size" style="align-self:flex-start">${icon('plus', 16)} أضف حجم</button>
      <span class="hint">تكلفة الحبة = كم تكلفك الحبة الوحدة مواد وتغليف، عشان نحسب لك الربح.</span></div>
    ${id ? `<label class="switch-field"><input type="checkbox" name="active" ${p.active ? 'checked' : ''}><span class="switch"></span><span>المنتج متاح للطلب</span></label>` : ''}
  </form>`;
  const foot = `${id ? `<button class="btn ghost danger" data-action="delete-product" data-id="${id}">${icon('trash', 18)} حذف</button>` : ''}
    <button class="btn primary grow" data-action="save-product">${icon('check')} ${id ? 'حفظ' : 'إضافة المنتج'}</button>`;
  openSheet(id ? `تعديل ${p.name}` : 'منتج جديد', body, foot);
}
function saveProduct() {
  const f = $('#product-form');
  if (!f || draft?.kind !== 'product') return;
  const name = f.name.value.trim();
  if (!name) return toast('اكتب اسم المنتج', 'bad');
  const sizes = [];
  for (const row of $$('.size-edit', f)) {
    const sname = row.querySelector('[name=sname]').value.trim();
    if (!sname) continue;
    const packs = $$('.pack-row', row).map(r => ({ qty: int(r.querySelector('[name=pqty]').value), price: num(r.querySelector('[name=pprice]').value) }))
      .filter(pk => pk.qty > 1 && pk.price > 0).sort((a, b) => a.qty - b.qty);
    sizes.push({
      id: row.dataset.sid || uid(),
      name: sname,
      price: num(row.querySelector('[name=sprice]').value),
      cost: num(row.querySelector('[name=scost]').value),
      stock: Math.round(num(row.querySelector('[name=sstock]').value)),
      low: int(row.querySelector('[name=slow]').value),
      packs,
    });
  }
  if (!sizes.length) return toast('أضف حجم واحد على الأقل', 'bad');
  const before = snapshotStock();
  const data = { name, description: f.description.value.trim(), color: f.color.value || COLORS[0], sizes };
  if (draft.id) {
    const p = findProduct(draft.id);
    Object.assign(p, data, { active: f.active ? f.active.checked : true });
  } else {
    state.products.push({ id: uid(), active: true, createdAt: Date.now(), ...data });
  }
  const isNew = !draft.id;
  save(); closeSheet(); render();
  toast(isNew ? 'تمت إضافة المنتج 🍪' : 'تم حفظ المنتج', 'good');
  reportStockChanges(before);
}
async function deleteProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  const ok = await confirmDialog({ title: `حذف ${p.name}؟`, message: 'الطلبات القديمة بتبقى محفوظة بأسعارها.\nلو تبي توقفه مؤقتًا بس، اقفل خيار "المنتج متاح للطلب" بدل الحذف.', ok: 'حذف', danger: true });
  if (!ok) return;
  state.products = state.products.filter(x => x.id !== id);
  save(); closeSheet(); render();
  toast('تم حذف المنتج');
}

function openAlertsSheet() {
  const low = lowStockList();
  const body = low.length
    ? `<div class="rows">${low.map(lowRow).join('')}</div>`
    : `<div class="empty"><span class="big">👌</span>كل المنتجات متوفرة</div>`;
  openSheet('تنبيهات المخزون', body,
    low.length ? `<button class="btn primary grow" data-action="new-batch">${icon('tray')} سجّل دفعة جديدة</button>` : '');
}

/* ---------- الميزانية والمصاريف ---------- */
function viewExpenses() {
  const ym = ui.expMonth;
  const list = state.expenses.filter(e => e.date?.startsWith(ym)).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const total = sum(list, e => e.amount);
  const sales = sum(state.orders.filter(o => o.status !== 'cancelled' && o.date?.startsWith(ym)), orderTotal);
  const profit = sales - total;
  const budget = Number(state.settings.monthlyBudget) || 0;
  const isCurrent = ym === ymOf(new Date());

  let budgetCard;
  if (budget > 0) {
    const pct = total / budget;
    const cls = pct > 1 ? 'bad' : pct >= 0.8 ? 'warn' : '';
    budgetCard = `<section class="card"><div class="card-head"><h2>ميزانية المصاريف</h2><button class="link sm" data-action="edit-budget">تعديل</button></div>
      <p>صرفت <b>${money(total)}</b> من <b>${money(budget)}</b></p>
      <div class="progress ${cls}" role="progressbar" aria-valuenow="${Math.round(pct * 100)}" aria-valuemin="0" aria-valuemax="100"><div style="width:${Math.min(100, pct * 100)}%"></div></div>
      <p class="sm ${pct > 1 ? 't-bad' : 'muted'}">${pct > 1 ? `⚠️ تجاوزت الميزانية بـ ${moneyText(total - budget)}` : `باقي لك ${moneyText(budget - total)} (${Math.round(pct * 100)}٪ مصروف)`}</p></section>`;
  } else {
    budgetCard = `<div class="banner info">${icon('wallet')}<p>حدد ميزانية شهرية للمصاريف عشان تتابع صرفك وما تتجاوزها</p><button class="btn sm primary" data-action="edit-budget">حدد</button></div>`;
  }

  const byCat = EXPENSE_CATS.map(c => ({ ...c, total: sum(list.filter(e => e.category === c.id), e => e.amount) })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const maxCat = byCat[0]?.total || 1;

  return `
  <div class="page-head"><div><h1>الميزانية والمصاريف</h1></div></div>
  <div class="month-switch">
    <button class="icon-btn" data-action="exp-month" data-d="-1" aria-label="الشهر السابق">${icon('prev')}</button>
    <strong>${monthLabel(ym)}</strong>
    <button class="icon-btn" data-action="exp-month" data-d="1" aria-label="الشهر التالي" ${isCurrent ? 'disabled style="opacity:.3"' : ''}>${icon('next')}</button>
  </div>
  <section class="card"><div class="mini-kpis">
    <div><span>المبيعات</span><b>${money(sales)}</b></div>
    <div><span>المصاريف</span><b>${money(total)}</b></div>
    <div><span>صافي الربح</span><b class="${profit < 0 ? 't-bad' : 't-good'}">${money(profit)}</b></div>
  </div></section>
  ${budgetCard}
  ${byCat.length ? `<section class="card"><div class="card-head"><h2>وين راحت الفلوس؟</h2></div><div class="hbars">${byCat.map(c => `<div>
    <div class="hbar-top"><span>${c.emoji} ${c.label}</span><span><b>${money(c.total)}</b> · ${Math.round((c.total / total) * 100)}٪</span></div>
    <div class="hbar-track"><div class="hbar-fill" style="width:${(c.total / maxCat) * 100}%"></div></div></div>`).join('')}</div></section>` : ''}
  <h2 class="section-title">المصاريف (${list.length})</h2>
  <section class="card">${list.length ? `<div class="rows">${list.map(e => {
    const c = EXPENSE_CATS.find(x => x.id === e.category) || EXPENSE_CATS[EXPENSE_CATS.length - 1];
    return `<button class="row" data-action="edit-expense" data-id="${e.id}"><span class="cat-emoji">${c.emoji}</span>
      <div class="row-main"><strong>${esc(e.note || c.label)}</strong><span>${c.label} · ${relDay(e.date)}</span></div>
      <div class="row-end"><b>${money(e.amount)}</b></div></button>`;
  }).join('')}</div>` : `<p class="empty-sm">ما فيه مصاريف مسجلة في ${monthLabel(ym)}</p>`}</section>`;
}
function openExpenseSheet(id) {
  const e = id ? state.expenses.find(x => x.id === id) : { amount: '', category: 'ingredients', date: today(), note: '' };
  draft = { kind: 'expense', id };
  const body = `<form id="expense-form" class="form" data-submit="save-expense">
    <label class="field"><span>المبلغ (${esc(state.settings.currency)})</span><input class="big-input" name="amount" inputmode="decimal" value="${e.amount || ''}" placeholder="0"></label>
    <div class="field"><span>التصنيف</span><div class="chips">${EXPENSE_CATS.map(c =>
      `<label class="chip"><input type="radio" name="category" value="${c.id}" ${e.category === c.id ? 'checked' : ''}><span>${c.emoji} ${c.label}</span></label>`).join('')}</div></div>
    <label class="field"><span>وش اشتريت؟</span><input name="note" value="${esc(e.note)}" placeholder="مثال: شوكولاتة بلجيكية ٢ كيلو"></label>
    <label class="field"><span>التاريخ</span><input type="date" name="date" value="${e.date}"></label>
  </form>`;
  const foot = `${id ? `<button class="btn ghost danger" data-action="delete-expense" data-id="${id}">${icon('trash', 18)} حذف</button>` : ''}
    <button class="btn primary grow" data-action="save-expense">${icon('check')} ${id ? 'حفظ' : 'إضافة المصروف'}</button>`;
  openSheet(id ? 'تعديل مصروف' : 'مصروف جديد', body, foot);
  if (!id) setTimeout(() => $('#expense-form [name=amount]')?.focus(), 250);
}
function saveExpense() {
  const f = $('#expense-form');
  if (!f || draft?.kind !== 'expense') return;
  const amount = num(f.amount.value);
  if (amount <= 0) return toast('اكتب المبلغ', 'bad');
  const data = { amount, category: f.category.value || 'other', note: f.note.value.trim(), date: f.date.value || today() };
  if (draft.id) Object.assign(state.expenses.find(x => x.id === draft.id), data);
  else state.expenses.push({ id: uid(), createdAt: Date.now(), ...data });
  ui.expMonth = data.date.slice(0, 7);
  const isNew = !draft.id;
  save(); closeSheet(); render();
  toast(isNew ? 'تمت إضافة المصروف' : 'تم الحفظ', 'good');
}
async function deleteExpense(id) {
  const ok = await confirmDialog({ title: 'حذف المصروف؟', ok: 'حذف', danger: true });
  if (!ok) return;
  state.expenses = state.expenses.filter(x => x.id !== id);
  save(); closeSheet(); render();
}
function openBudgetSheet() {
  draft = { kind: 'budget' };
  openSheet('الميزانية الشهرية', `<form id="budget-form" class="form" data-submit="save-budget">
    <label class="field"><span>كم تبي حد المصاريف في الشهر؟ (${esc(state.settings.currency)})</span>
    <input class="big-input" name="budget" inputmode="decimal" value="${state.settings.monthlyBudget || ''}" placeholder="0"></label>
    <span class="hint">خلها صفر إذا ما تبي ميزانية.</span></form>`,
    `<button class="btn primary grow" data-action="save-budget">${icon('check')} حفظ</button>`);
}

/* ---------- الإعدادات والنسخ الاحتياطي ---------- */
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function viewSettings() {
  const s = state.settings;
  const last = state.meta.lastBackup;
  const notifSupported = 'Notification' in window;
  const canShare = !!navigator.canShare;
  return `
  <div class="page-head"><div><h1>الإعدادات</h1></div></div>

  <h2 class="section-title">النسخ الاحتياطي</h2>
  <section class="card">
    <p class="muted sm">بياناتك محفوظة في هذا الجهاز بس. سوّ نسخة احتياطية (ملف) واحفظها في الملفات أو أرسلها لنفسك واتساب، وتقدر ترجعها في أي جهاز.</p>
    <p class="sm" style="margin-top:8px">آخر نسخة: <b>${last ? `${relDay(ymd(new Date(last)))} ${new Date(last).getFullYear()}` : 'ما فيه'}</b></p>
    <div class="btn-row">
      ${canShare ? `<button class="btn primary" data-action="share-backup">${icon('share', 18)} مشاركة / حفظ نسخة</button>` : ''}
      <button class="btn ${canShare ? 'ghost' : 'primary'}" data-action="download-backup">${icon('download', 18)} تنزيل ملف النسخة</button>
      <button class="btn ghost" data-action="import-backup">${icon('upload', 18)} استيراد نسخة</button>
    </div>
    <div class="set-row" style="margin-top:12px">
      <div class="row-main"><strong>ذكّرني أسوي نسخة كل</strong></div>
      <select class="status-select" data-change="setting" data-key="backupDays" aria-label="مدة التذكير">
        ${[[3, '٣ أيام'], [7, 'أسبوع'], [14, 'أسبوعين'], [30, 'شهر'], [0, 'لا تذكرني']].map(([v, l]) => `<option value="${v}" ${Number(s.backupDays) === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select></div>
  </section>

  <h2 class="section-title">التنبيهات</h2>
  <section class="card">
    <div class="set-row">
      <div class="row-main"><strong>إشعارات المخزون</strong><span>${notifSupported ? 'يجيك إشعار على الجهاز لما صنف يقارب يخلص' : 'جهازك ما يدعم إشعارات المتصفح، بتظهر لك التنبيهات داخل الموقع'}</span></div>
      <label class="switch-field"><input type="checkbox" data-change="notify" ${s.notify && notifSupported && Notification.permission === 'granted' ? 'checked' : ''} ${notifSupported ? '' : 'disabled'} aria-label="إشعارات المخزون"><span class="switch"></span></label>
    </div>
    ${isIOS() && !isStandalone() ? `<p class="hint">في الآيفون: الإشعارات تشتغل بس بعد ما تضيف الموقع للشاشة الرئيسية (تحت).</p>` : ''}
    <p class="hint">حد التنبيه لكل صنف تعدّله من صفحة المنتجات (نبهني لما يوصل).</p>
  </section>

  ${!isStandalone() ? `<h2 class="section-title">ثبّت الموقع كتطبيق</h2>
  <section class="card">
    ${installEvt ? `<button class="btn primary" data-action="install">${icon('phone', 18)} ثبّت التطبيق</button>` :
      isIOS() ? `<ol class="steps"><li>افتح الموقع من <b>Safari</b></li><li>اضغط زر المشاركة <b>⬆️</b></li><li>اختر <b>إضافة إلى الشاشة الرئيسية</b></li></ol>
        <p class="hint" style="margin-top:6px">مهم في الآيفون: إذا ما ثبّته، Safari ممكن يمسح بيانات المواقع اللي ما تنفتح لفترة طويلة.</p>`
      : `<p class="muted sm">من قائمة المتصفح (⋮) اختر <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.</p>`}
  </section>` : ''}

  <h2 class="section-title">المشروع</h2>
  <section class="card form">
    <label class="field"><span>اسم المشروع</span><input data-change="setting" data-key="name" value="${esc(s.name)}"></label>
    <label class="field"><span>العملة</span><input data-change="setting" data-key="currency" value="${esc(s.currency)}"></label>
    <div class="field"><span>المظهر</span><div class="chips">${[['auto', 'تلقائي'], ['light', 'فاتح'], ['dark', 'داكن']].map(([v, l]) =>
      `<label class="chip"><input type="radio" name="theme" value="${v}" ${s.theme === v ? 'checked' : ''} data-change="setting" data-key="theme"><span>${l}</span></label>`).join('')}</div></div>
  </section>

  <h2 class="section-title">البيانات</h2>
  <section class="card">
    <p class="muted sm">${state.orders.length} طلب · ${state.products.length} منتج · ${state.expenses.length} مصروف</p>
    <div class="btn-row"><button class="btn ghost danger" data-action="reset-all">${icon('trash', 18)} مسح كل البيانات</button></div>
  </section>`;
}

function backupBlob() {
  return new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
}
const backupName = () => `niwa-backup-${today()}.json`;
function markBackup() { state.meta.lastBackup = Date.now(); save(); render(); }
function downloadBackup() {
  const url = URL.createObjectURL(backupBlob());
  const a = document.createElement('a');
  a.href = url; a.download = backupName();
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  markBackup();
  toast('تم تنزيل ملف النسخة الاحتياطية ✅', 'good');
}
async function shareBackup() {
  const file = new File([backupBlob()], backupName(), { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'نسخة احتياطية' });
      markBackup();
      toast('تم حفظ النسخة ✅', 'good');
    } catch (e) {
      if (e.name !== 'AbortError') downloadBackup();
    }
  } else downloadBackup();
}
function backupNow() { (navigator.canShare && isIOS()) ? shareBackup() : downloadBackup(); }

async function importBackup(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { return toast('الملف هذا مو نسخة احتياطية صحيحة', 'bad'); }
  if (!data || (data.app !== APP_ID && !(Array.isArray(data.products) && Array.isArray(data.orders)))) return toast('الملف هذا مو نسخة احتياطية من الموقع', 'bad');
  const when = data.exportedAt ? new Date(data.exportedAt) : null;
  const ok = await confirmDialog({
    title: 'استيراد النسخة؟',
    message: `النسخة فيها ${data.orders?.length || 0} طلب و${data.products?.length || 0} منتج و${data.expenses?.length || 0} مصروف${when ? `\nتاريخها: ${fmtDate(ymd(when))} ${when.getFullYear()}` : ''}\n\nبتستبدل البيانات الحالية في هذا الجهاز.`,
    ok: 'استيراد',
  });
  if (!ok) return;
  state = normalize(data);
  save(); applyTheme(); render();
  toast('تم استيراد البيانات ✅', 'good');
}

async function toggleNotify(on, el) {
  if (!on) { state.settings.notify = false; save(); return; }
  if (!('Notification' in window)) { el.checked = false; return; }
  const perm = await Notification.requestPermission();
  state.settings.notify = perm === 'granted';
  save();
  if (perm === 'granted') toast('تم تفعيل الإشعارات 🔔', 'good');
  else { el.checked = false; toast('ما تم السماح بالإشعارات من المتصفح', 'warn'); }
}
async function resetAll() {
  const ok = await confirmDialog({ title: 'مسح كل البيانات؟', message: 'بتنمسح كل الطلبات والمنتجات والمصاريف من هذا الجهاز.\nننصحك تسوي نسخة احتياطية قبل.', ok: 'امسح الكل', danger: true });
  if (!ok) return;
  state = defaultState();
  save(); applyTheme(); render();
  toast('تم مسح البيانات');
}

/* ---------- الأحداث ---------- */
const ACTIONS = {
  'close-sheet': () => closeSheet(),
  'alerts': () => openAlertsSheet(),
  'period': t => { ui.period = t.dataset.p; render(); },
  'goto-unpaid': () => { ui.orderFilter = 'unpaid'; location.hash = '#orders'; },
  'backup-now': () => backupNow(),
  'new-order': () => openOrderSheet(null),
  'edit-order': t => openOrderSheet(t.dataset.id),
  'save-order': () => saveOrder(),
  'delete-order': t => deleteOrder(t.dataset.id),
  'order-filter': t => { ui.orderFilter = t.dataset.f; render(); },
  'toggle-paid': t => {
    const o = state.orders.find(x => x.id === t.dataset.id);
    if (!o) return;
    o.paid = !o.paid; save(); render();
    toast(o.paid ? `#${o.no} مدفوع ✅` : `#${o.no} غير مدفوع`);
  },
  'step': t => {
    const k = t.dataset.key;
    const cur = draft?.items.get(k)?.qty || 0;
    setDraftQty(k, cur + Number(t.dataset.d));
  },
  'new-batch': () => openBatchSheet(),
  'save-batch': () => saveBatch(),
  'stock-inc': t => bumpStock(t.dataset.pid, t.dataset.sid, 1),
  'stock-dec': t => bumpStock(t.dataset.pid, t.dataset.sid, -1),
  'stock-sheet': t => openStockSheet(t.dataset.pid, t.dataset.sid),
  'save-stock': () => saveStock(),
  'quick-q': t => {
    const f = $('#stock-form');
    f.q.value = int(f.q.value) + Number(t.dataset.n);
  },
  'new-product': () => openProductSheet(null),
  'edit-product': t => openProductSheet(t.dataset.id),
  'save-product': () => saveProduct(),
  'delete-product': t => deleteProduct(t.dataset.id),
  'add-size': () => {
    $('#sizes-editor').insertAdjacentHTML('beforeend', sizeEditHTML({ name: '', price: '', cost: 0, stock: 0, low: 10, packs: [] }));
    $('#sizes-editor .size-edit:last-child [name=sname]').focus();
  },
  'remove-size': t => t.closest('.size-edit').remove(),
  'add-pack': t => t.closest('.field').querySelector('.packs-edit').insertAdjacentHTML('beforeend', packRowHTML()),
  'remove-pack': t => t.closest('.pack-row').remove(),
  'new-expense': () => openExpenseSheet(null),
  'edit-expense': t => openExpenseSheet(t.dataset.id),
  'save-expense': () => saveExpense(),
  'delete-expense': t => deleteExpense(t.dataset.id),
  'exp-month': t => {
    const [y, m] = ui.expMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + Number(t.dataset.d), 1);
    if (ymOf(d) > ymOf(new Date())) return;
    ui.expMonth = ymOf(d); render();
  },
  'edit-budget': () => openBudgetSheet(),
  'save-budget': () => {
    state.settings.monthlyBudget = Math.max(0, num($('#budget-form').budget.value));
    save(); closeSheet(); render();
    toast('تم حفظ الميزانية', 'good');
  },
  'share-backup': () => shareBackup(),
  'download-backup': () => downloadBackup(),
  'import-backup': () => { const i = $('#import-file'); i.value = ''; i.click(); },
  'install': async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); },
  'reset-all': () => resetAll(),
};

document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]');
  if (!t || t.disabled) return;
  const fn = ACTIONS[t.dataset.action];
  if (!fn) return;
  if (t.tagName !== 'A') e.preventDefault();
  fn(t, e);
});

document.addEventListener('change', e => {
  const t = e.target;
  const kind = t.dataset.change;
  if (kind === 'order-status') setOrderStatus(t.dataset.id, t.value);
  else if (kind === 'pricing' && draft?.kind === 'order') {
    draft.pricing = t.value;
    for (const [k, it] of draft.items) { const c = $(`[data-calc="${k}"]`); if (c) c.textContent = it.qty ? calcText(it) : ''; }
    updateOrderTotals();
  }
  else if (kind === 'setting') {
    const k = t.dataset.key;
    state.settings[k] = k === 'backupDays' ? Number(t.value) : t.value;
    if (k === 'name' && !t.value.trim()) state.settings.name = 'مشروعي';
    save(); applyTheme();
    $('#brand-name').textContent = state.settings.name;
    if (k === 'theme' || k === 'currency') render();
  }
  else if (kind === 'notify') toggleNotify(t.checked, t);
  else if (kind === 'stock-mode') {
    const add = t.value === 'add';
    $('#stock-q-label').textContent = add ? 'كم حبة سويت؟' : 'كم العدد المتوفر فعليًا الحين؟';
    $('#quick-add').hidden = !add;
    $('#stock-form [name=q]').focus();
  }
  else if (t.id === 'import-file' && t.files[0]) importBackup(t.files[0]);
  else if (t.name === 'customer' && t.form?.id === 'order-form') {
    const phone = uniqueCustomers().get(t.value.trim());
    if (phone && !t.form.phone.value) t.form.phone.value = phone;
  }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.classList.contains('qty') && t.dataset.key) setDraftQty(t.dataset.key, int(t.value), true);
  else if (t.hasAttribute('data-totals')) updateOrderTotals();
  else if (t.id === 'order-search') { ui.orderSearch = t.value; $('#orders-list').innerHTML = ordersListHTML(); }
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const fn = ACTIONS[e.target.dataset.submit];
  if (fn) fn(e.target);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sheetOpen && $('#dialog').hidden) closeSheet();
});

window.addEventListener('hashchange', () => { if (sheetOpen) hideSheet(); render(); window.scrollTo(0, 0); });

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => { if (route === 'home') drawMonthChart($('#chart-months')); }, 150);
});

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (route === 'settings') render(); });

// مزامنة لو انفتح الموقع في أكثر من تبويب
window.addEventListener('storage', e => { if (e.key === STORE_KEY && e.newValue) { state = normalize(JSON.parse(e.newValue)); render(); } });

/* ---------- تشغيل ---------- */
$('#sheet-close').innerHTML = icon('x', 22);
$('#bell .ic-slot').outerHTML = icon('bell', 22);
renderNav();
applyTheme();
render();
save();

if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
const lowNow = lowStockList().length;
if (lowNow && state.orders.length) setTimeout(() => toast(`عندك ${lowNow} أصناف قاربت تخلص`, 'warn', 3500, 'alert'), 600);
})();
