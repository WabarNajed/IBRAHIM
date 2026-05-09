const form = document.querySelector('#brand-form');
const saveState = document.querySelector('#save-state');
const colorGrid = document.querySelector('#color-grid');
const featureGrid = document.querySelector('#feature-grid');
const serviceList = document.querySelector('#service-list');
const resetButton = document.querySelector('#reset-button');

const mockOrders = [
  { id: 'RF-1048', customer: 'سارة العتيبي', phone: '+966 55 123 9988', service: 'تنظيف منزلي', technician: 'محمد', status: 'قيد التنفيذ', total: 188 },
  { id: 'RF-1047', customer: 'Abdullah Khan', phone: '+966 50 444 2211', service: 'غسيل وكي', technician: 'Nora', status: 'تم التأكيد', total: 75 },
  { id: 'RF-1046', customer: 'نورة الحربي', phone: '+966 56 887 1200', service: 'بوكس ذكي', technician: 'Locker A12', status: 'بانتظار الاستلام', total: 30 },
  { id: 'RF-1045', customer: 'Fahad Al Salem', phone: '+966 54 991 3312', service: 'تنظيف منزلي', technician: 'خالد', status: 'مكتمل', total: 149 },
];

const mockCustomers = [
  { name: 'سارة العتيبي', segment: 'VIP', orders: 18, ltv: 4210, last: 'اليوم' },
  { name: 'Abdullah Khan', segment: 'Regular', orders: 7, ltv: 980, last: 'أمس' },
  { name: 'نورة الحربي', segment: 'New', orders: 2, ltv: 210, last: 'قبل يومين' },
  { name: 'Fahad Al Salem', segment: 'Regular', orders: 11, ltv: 1670, last: 'هذا الأسبوع' },
];

const colorLabels = {
  primary: 'Primary', secondary: 'Secondary', accent: 'Accent', background: 'Background', surface: 'Surface',
  textPrimary: 'Text primary', textSecondary: 'Text secondary', success: 'Success', danger: 'Danger', warning: 'Warning',
};
const featureLabels = {
  smartLockers: 'Smart Lockers / البوكسات الذكية', laundryService: 'Laundry / الغسيل', subscriptions: 'Subscriptions / الاشتراكات',
  referralProgram: 'Referrals / الإحالات', loyaltyPoints: 'Loyalty / النقاط', b2bAccounts: 'B2B / الشركات',
  multiLanguage: 'Arabic + English / لغتين', walletPayment: 'Wallet / المحفظة', cashOnDelivery: 'Cash / الدفع عند الاستلام',
};
const pageTitles = {
  dashboard: 'لوحة التحكم', orders: 'إدارة الطلبات', services: 'إدارة الخدمات', customers: 'CRM العملاء', brand: 'إعدادات البراند', reports: 'التقارير',
};

let defaultConfig;
let config;

function getPath(object, path) { return path.split('.').reduce((target, key) => target?.[key], object); }
function setPath(object, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((current, key) => current[key], object);
  target[last] = value;
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function cssName(key) { return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`); }
function money(value) { return `${value.toLocaleString('ar-SA')} ${config.currency.symbolAr}`; }
function statusClass(status) { return status === 'مكتمل' ? 'success' : status.includes('انتظار') ? 'warning' : 'info'; }

function loadFromStorage() {
  const saved = localStorage.getItem('rifaq.brandConfigDraft');
  return saved ? JSON.parse(saved) : clone(defaultConfig);
}

function renderNavigation(pageName) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('is-active', item.dataset.page === pageName));
  document.querySelectorAll('.page').forEach((page) => page.classList.toggle('is-active', page.id === `${pageName}-page`));
  document.querySelector('#page-title').textContent = pageTitles[pageName];
}

function renderControls() {
  colorGrid.innerHTML = Object.entries(config.colors).map(([key, value]) => `
    <label class="color-row"><span>${colorLabels[key] ?? key}</span><input type="color" name="colors.${key}" value="${value}" /></label>
  `).join('');
  featureGrid.innerHTML = Object.entries(config.features).map(([key, value]) => `
    <label class="feature-row"><span>${featureLabels[key] ?? key}</span><input type="checkbox" name="features.${key}" ${value ? 'checked' : ''} /></label>
  `).join('');
}

function fillForm() {
  for (const element of form.elements) {
    if (!element.name) continue;
    const value = getPath(config, element.name);
    if (element.type === 'checkbox') element.checked = Boolean(value);
    else element.value = value ?? '';
  }
}

function applyBrandTokens() {
  for (const [key, value] of Object.entries(config.colors)) document.documentElement.style.setProperty(`--${cssName(key)}`, value);
  document.querySelector('#sidebar-name').textContent = config.brandName.ar;
  document.querySelector('#sidebar-mark').textContent = config.brandName.ar.slice(0, 1) || 'ر';
  document.querySelector('#hero-brand-name').textContent = `${config.brandName.ar} / ${config.brandName.en}`;
}

function applyPreview() {
  applyBrandTokens();
  document.querySelector('#preview-name-ar').textContent = config.brandName.ar;
  document.querySelector('#preview-name-en').textContent = config.brandName.en;
  document.querySelector('#preview-tagline-ar').textContent = config.brandTagline.ar;
  document.querySelector('#preview-tagline-en').textContent = config.brandTagline.en;
  document.querySelector('#logo-mark').textContent = config.brandName.ar.slice(0, 1) || 'ر';
  serviceList.innerHTML = config.services.filter((service) => service.active).map((service) => `
    <div class="service-card"><div><strong>${service.nameAr}</strong><span>${service.nameEn}</span></div><div class="price">${money(service.basePrice)}</div></div>
  `).join('');
  renderAdminData();
}

function persistDraft(message = 'تم حفظ المسودة محلياً') {
  localStorage.setItem('rifaq.brandConfigDraft', JSON.stringify(config));
  saveState.textContent = message;
}

function renderMetrics() {
  const revenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = mockOrders.filter((order) => order.status !== 'مكتمل').length;
  const metrics = [
    ['طلبات اليوم', mockOrders.length, '+18%'], ['إيراد اليوم', money(revenue), '+12%'], ['طلبات نشطة', activeOrders, 'مباشر'], ['عملاء VIP', 23, '+4'],
  ];
  document.querySelector('#metric-grid').innerHTML = metrics.map(([label, value, delta]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${delta}</small></article>`).join('');
  document.querySelector('#reports-grid').innerHTML = [
    ['إيراد الشهر', money(48320), '+22%'], ['متوسط الطلب', money(137), '+6%'], ['الاحتفاظ', '68%', '+9%'], ['NPS', '74', 'جيد'],
  ].map(([label, value, delta]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${delta}</small></article>`).join('');
}

function renderOrders() {
  const rows = mockOrders.map((order) => `<tr><td>${order.id}</td><td>${order.customer}</td><td dir="ltr">${order.phone}</td><td>${order.service}</td><td>${order.technician}</td><td><span class="pill ${statusClass(order.status)}">${order.status}</span></td><td>${money(order.total)}</td></tr>`).join('');
  document.querySelector('#dashboard-orders').innerHTML = rows;
  document.querySelector('#orders-table').innerHTML = rows;
}

function renderServices() {
  document.querySelector('#top-services').innerHTML = config.services.map((service) => `<div class="list-row"><div><strong>${service.nameAr}</strong><span>${service.nameEn}</span></div><b>${money(service.basePrice)}</b></div>`).join('');
  document.querySelector('#services-grid').innerHTML = config.services.map((service) => `
    <article class="admin-card"><span class="category">${service.category}</span><h3>${service.nameAr}</h3><p>${service.descriptionAr ?? service.nameEn}</p><div class="card-footer"><b>${money(service.basePrice)}</b><span>${service.duration} دقيقة</span></div></article>
  `).join('');
}

function renderCustomers() {
  document.querySelector('#customers-table').innerHTML = mockCustomers.map((customer) => `<tr><td>${customer.name}</td><td><span class="pill info">${customer.segment}</span></td><td>${customer.orders}</td><td>${money(customer.ltv)}</td><td>${customer.last}</td></tr>`).join('');
}

function renderReports() {
  const values = [8, 14, 11, 18, 24, 20, 29];
  document.querySelector('#revenue-bars').innerHTML = values.map((value, index) => `<div class="bar-item"><div class="bar" style="height:${value * 6}px"></div><span>${['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'][index]}</span></div>`).join('');
}

function renderAdminData() {
  renderMetrics();
  renderOrders();
  renderServices();
  renderCustomers();
  renderReports();
}

function renderAll() {
  renderControls();
  fillForm();
  applyPreview();
}

for (const item of document.querySelectorAll('[data-page], [data-page-jump]')) {
  item.addEventListener('click', () => renderNavigation(item.dataset.page ?? item.dataset.pageJump));
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('is-active'));
    document.querySelectorAll('.tab-page').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.getElementById(tab.dataset.tab).classList.add('is-active');
  });
}

form.addEventListener('input', (event) => {
  const element = event.target;
  if (!element.name) return;
  setPath(config, element.name, element.type === 'checkbox' ? element.checked : element.value);
  applyPreview();
  persistDraft('تم حفظ المسودة تلقائياً');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  persistDraft(`تم النشر التجريبي في ${new Date().toLocaleTimeString('ar-SA')}`);
});

resetButton.addEventListener('click', () => {
  config = clone(defaultConfig);
  localStorage.removeItem('rifaq.brandConfigDraft');
  renderAll();
  saveState.textContent = 'تمت استعادة إعدادات Rifaq الافتراضية';
});

const response = await fetch('/api/brand-config');
defaultConfig = await response.json();
config = loadFromStorage();
renderAll();
