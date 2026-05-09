import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, 'public');
const port = Number(process.env.PORT ?? 3000);

const brandConfig = {
  brandName: { ar: 'رفاق', en: 'Rifaq' },
  brandTagline: {
    ar: 'خدمات ضيافة وتنظيف ذكية بضغطة زر',
    en: 'Smart hospitality and cleaning services at your fingertips',
  },
  legalName: 'Rifaq Smart Services LLC',
  commercialRegister: '1010000000',
  vatNumber: '300000000000003',
  logoLight: 'https://assets.rifaq.example/brand/logo-light.svg',
  logoDark: 'https://assets.rifaq.example/brand/logo-dark.svg',
  logoIcon: 'https://assets.rifaq.example/brand/icon.png',
  splashScreen: 'https://assets.rifaq.example/brand/splash.png',
  colors: {
    primary: '#1F4358',
    secondary: '#356B91',
    accent: '#7EBDB0',
    background: '#FFFFFF',
    surface: '#F5F9FA',
    textPrimary: '#1A1A1A',
    textSecondary: '#5C5C5C',
    success: '#27AE60',
    danger: '#C0392B',
    warning: '#C9A961',
  },
  fonts: { arabic: 'IBM Plex Arabic', english: 'Inter' },
  currency: { code: 'SAR', symbol: 'SAR', symbolAr: 'ر.س' },
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'en'],
  contact: {
    phone: '+966920000000',
    whatsapp: '+966500000000',
    email: 'support@rifaq.example',
    address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    workingHours: { ar: 'يومياً من 8 صباحاً حتى 10 مساءً', en: 'Daily, 8 AM to 10 PM' },
    socialMedia: {
      instagram: 'https://instagram.com/rifaq',
      twitter: 'https://x.com/rifaq',
      tiktok: 'https://tiktok.com/@rifaq',
      snapchat: 'https://snapchat.com/add/rifaq',
    },
  },
  services: [
    { id: 'home-cleaning', category: 'cleaning', nameAr: 'تنظيف منزلي', nameEn: 'Home Cleaning', basePrice: 149, duration: 120, active: true },
    { id: 'laundry', category: 'laundry', nameAr: 'غسيل وكي', nameEn: 'Laundry & Ironing', basePrice: 25, duration: 1440, active: true },
    { id: 'locker', category: 'locker', nameAr: 'بوكس ذكي', nameEn: 'Smart Locker', basePrice: 15, duration: 30, active: true },
  ],
  features: {
    smartLockers: true,
    laundryService: true,
    subscriptions: true,
    referralProgram: true,
    loyaltyPoints: true,
    b2bAccounts: true,
    multiLanguage: true,
    walletPayment: true,
    cashOnDelivery: true,
  },
};

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

async function serveStatic(request, response) {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host}`);
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const safePath = normalize(pathname).replace(/^([/\\])+/, '');
  const filePath = join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, { 'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
    response.end(file);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

const server = createServer(async (request, response) => {
  if (request.url?.startsWith('/api/brand-config')) {
    sendJson(response, 200, brandConfig);
    return;
  }

  await serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`Rifaq Brand Settings Hub is running: http://localhost:${port}`);
  console.log('Press Ctrl+C to stop.');
});
