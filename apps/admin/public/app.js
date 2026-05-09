const form = document.querySelector('#brand-form');
const saveState = document.querySelector('#save-state');
const colorGrid = document.querySelector('#color-grid');
const featureGrid = document.querySelector('#feature-grid');
const serviceList = document.querySelector('#service-list');
const resetButton = document.querySelector('#reset-button');

const colorLabels = {
  primary: 'Primary', secondary: 'Secondary', accent: 'Accent', background: 'Background', surface: 'Surface',
  textPrimary: 'Text primary', textSecondary: 'Text secondary', success: 'Success', danger: 'Danger', warning: 'Warning',
};
const featureLabels = {
  smartLockers: 'Smart Lockers / البوكسات الذكية', laundryService: 'Laundry / الغسيل', subscriptions: 'Subscriptions / الاشتراكات',
  referralProgram: 'Referrals / الإحالات', loyaltyPoints: 'Loyalty / النقاط', b2bAccounts: 'B2B / الشركات',
  multiLanguage: 'Arabic + English / لغتين', walletPayment: 'Wallet / المحفظة', cashOnDelivery: 'Cash / الدفع عند الاستلام',
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

function loadFromStorage() {
  const saved = localStorage.getItem('rifaq.brandConfigDraft');
  return saved ? JSON.parse(saved) : clone(defaultConfig);
}

function renderControls() {
  colorGrid.innerHTML = Object.entries(config.colors).map(([key, value]) => `
    <label class="color-row">
      <span>${colorLabels[key] ?? key}</span>
      <input type="color" name="colors.${key}" value="${value}" />
    </label>
  `).join('');

  featureGrid.innerHTML = Object.entries(config.features).map(([key, value]) => `
    <label class="feature-row">
      <span>${featureLabels[key] ?? key}</span>
      <input type="checkbox" name="features.${key}" ${value ? 'checked' : ''} />
    </label>
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

function applyPreview() {
  for (const [key, value] of Object.entries(config.colors)) {
    document.documentElement.style.setProperty(`--${cssName(key)}`, value);
  }
  document.querySelector('#preview-name-ar').textContent = config.brandName.ar;
  document.querySelector('#preview-name-en').textContent = config.brandName.en;
  document.querySelector('#preview-tagline-ar').textContent = config.brandTagline.ar;
  document.querySelector('#preview-tagline-en').textContent = config.brandTagline.en;
  document.querySelector('#logo-mark').textContent = config.brandName.ar.slice(0, 1) || 'ر';
  serviceList.innerHTML = config.services.filter((service) => service.active).map((service) => `
    <div class="service-card">
      <div><strong>${service.nameAr}</strong><span>${service.nameEn}</span></div>
      <div class="price">${service.basePrice} ${config.currency.symbolAr}</div>
    </div>
  `).join('');
}

function persistDraft(message = 'تم حفظ المسودة محلياً') {
  localStorage.setItem('rifaq.brandConfigDraft', JSON.stringify(config));
  saveState.textContent = message;
}

function renderAll() {
  renderControls();
  fillForm();
  applyPreview();
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
