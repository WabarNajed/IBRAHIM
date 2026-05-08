export type Language = 'ar' | 'en';
export type ServiceCategory = 'cleaning' | 'laundry' | 'locker' | 'custom';
export type PricingType = 'fixed' | 'hourly' | 'per_item' | 'custom_quote';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface ServiceOption {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  active: boolean;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconUrl: string;
  basePrice: number;
  pricingType: PricingType;
  duration: number;
  active: boolean;
  options: ServiceOption[];
}

export interface BrandConfig {
  brandName: LocalizedText;
  brandTagline: LocalizedText;
  legalName: string;
  commercialRegister: string;
  vatNumber: string;
  logoLight: string;
  logoDark: string;
  logoIcon: string;
  splashScreen: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    danger: string;
    warning: string;
  };
  fonts: {
    arabic: string;
    english: string;
  };
  currency: { code: string; symbol: string; symbolAr: string };
  defaultLanguage: Language;
  supportedLanguages: Language[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: LocalizedText;
    workingHours: LocalizedText;
    socialMedia: {
      instagram?: string | undefined;
      twitter?: string | undefined;
      tiktok?: string | undefined;
      snapchat?: string | undefined;
    };
  };
  services: Service[];
  serviceAreas: { name: string; coordinates: [number, number]; radius: number }[];
  financial: {
    vatRate: number;
    minOrderValue: number;
    deliveryFee: number;
    freeDeliveryThreshold: number;
  };
  features: {
    smartLockers: boolean;
    laundryService: boolean;
    subscriptions: boolean;
    referralProgram: boolean;
    loyaltyPoints: boolean;
    b2bAccounts: boolean;
    multiLanguage: boolean;
    walletPayment: boolean;
    cashOnDelivery: boolean;
  };
}

export interface Schema<T> {
  parse(value: unknown): T;
  safeParse(value: unknown): { success: true; data: T } | { success: false; error: Error };
}

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const languages = ['ar', 'en'] as const;
const serviceCategories = ['cleaning', 'laundry', 'locker', 'custom'] as const;
const pricingTypes = ['fixed', 'hourly', 'per_item', 'custom_quote'] as const;

function fail(path: string, message: string): never {
  throw new Error(`${path}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringAt(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.length === 0) fail(path, 'expected a non-empty string');
  return value;
}

function numberAt(value: unknown, path: string, options: { min?: number; max?: number; integer?: boolean } = {}): number {
  if (typeof value !== 'number' || Number.isNaN(value)) fail(path, 'expected a number');
  if (options.integer && !Number.isInteger(value)) fail(path, 'expected an integer');
  if (options.min !== undefined && value < options.min) fail(path, `expected >= ${options.min}`);
  if (options.max !== undefined && value > options.max) fail(path, `expected <= ${options.max}`);
  return value;
}

function booleanAt(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') fail(path, 'expected a boolean');
  return value;
}

function enumAt<T extends readonly string[]>(value: unknown, path: string, allowed: T): T[number] {
  const text = stringAt(value, path);
  if (!allowed.includes(text)) fail(path, `expected one of ${allowed.join(', ')}`);
  return text as T[number];
}

function urlAt(value: unknown, path: string): string {
  const text = stringAt(value, path);
  try {
    new URL(text);
  } catch {
    fail(path, 'expected a valid URL');
  }
  return text;
}

function hexAt(value: unknown, path: string): string {
  const text = stringAt(value, path);
  if (!hexColorPattern.test(text)) fail(path, 'expected a 6-digit HEX color');
  return text;
}

function localizedTextAt(value: unknown, path: string): LocalizedText {
  if (!isRecord(value)) fail(path, 'expected an object');
  return { ar: stringAt(value.ar, `${path}.ar`), en: stringAt(value.en, `${path}.en`) };
}

function optionalUrlAt(source: Record<string, unknown>, key: string, path: string): string | undefined {
  const value = source[key];
  return value === undefined ? undefined : urlAt(value, `${path}.${key}`);
}

function serviceOptionAt(value: unknown, path: string): ServiceOption {
  if (!isRecord(value)) fail(path, 'expected an object');
  const id = stringAt(value.id, `${path}.id`);
  if (!uuidPattern.test(id)) fail(`${path}.id`, 'expected a UUID');
  return {
    id,
    nameAr: stringAt(value.nameAr, `${path}.nameAr`),
    nameEn: stringAt(value.nameEn, `${path}.nameEn`),
    price: numberAt(value.price, `${path}.price`, { min: 0 }),
    active: booleanAt(value.active, `${path}.active`),
  };
}

function serviceAt(value: unknown, path: string): Service {
  if (!isRecord(value)) fail(path, 'expected an object');
  const id = stringAt(value.id, `${path}.id`);
  if (!uuidPattern.test(id)) fail(`${path}.id`, 'expected a UUID');
  if (!Array.isArray(value.options)) fail(`${path}.options`, 'expected an array');
  return {
    id,
    category: enumAt(value.category, `${path}.category`, serviceCategories),
    nameAr: stringAt(value.nameAr, `${path}.nameAr`),
    nameEn: stringAt(value.nameEn, `${path}.nameEn`),
    descriptionAr: stringAt(value.descriptionAr, `${path}.descriptionAr`),
    descriptionEn: stringAt(value.descriptionEn, `${path}.descriptionEn`),
    iconUrl: urlAt(value.iconUrl, `${path}.iconUrl`),
    basePrice: numberAt(value.basePrice, `${path}.basePrice`, { min: 0 }),
    pricingType: enumAt(value.pricingType, `${path}.pricingType`, pricingTypes),
    duration: numberAt(value.duration, `${path}.duration`, { min: 1, integer: true }),
    active: booleanAt(value.active, `${path}.active`),
    options: value.options.map((option, index) => serviceOptionAt(option, `${path}.options.${index}`)),
  };
}

export const brandConfigSchema: Schema<BrandConfig> = {
  parse(value: unknown): BrandConfig {
    if (!isRecord(value)) fail('BrandConfig', 'expected an object');
    if (!isRecord(value.colors)) fail('colors', 'expected an object');
    if (!isRecord(value.fonts)) fail('fonts', 'expected an object');
    if (!isRecord(value.currency)) fail('currency', 'expected an object');
    if (!isRecord(value.contact)) fail('contact', 'expected an object');
    if (!isRecord(value.contact.socialMedia)) fail('contact.socialMedia', 'expected an object');
    if (!isRecord(value.financial)) fail('financial', 'expected an object');
    if (!isRecord(value.features)) fail('features', 'expected an object');
    if (!Array.isArray(value.supportedLanguages)) fail('supportedLanguages', 'expected an array');
    if (!Array.isArray(value.services)) fail('services', 'expected an array');
    if (!Array.isArray(value.serviceAreas)) fail('serviceAreas', 'expected an array');

    const supportedLanguages = value.supportedLanguages.map((language, index) =>
      enumAt(language, `supportedLanguages.${index}`, languages),
    );

    return {
      brandName: localizedTextAt(value.brandName, 'brandName'),
      brandTagline: localizedTextAt(value.brandTagline, 'brandTagline'),
      legalName: stringAt(value.legalName, 'legalName'),
      commercialRegister: stringAt(value.commercialRegister, 'commercialRegister'),
      vatNumber: stringAt(value.vatNumber, 'vatNumber'),
      logoLight: urlAt(value.logoLight, 'logoLight'),
      logoDark: urlAt(value.logoDark, 'logoDark'),
      logoIcon: urlAt(value.logoIcon, 'logoIcon'),
      splashScreen: urlAt(value.splashScreen, 'splashScreen'),
      colors: {
        primary: hexAt(value.colors.primary, 'colors.primary'),
        secondary: hexAt(value.colors.secondary, 'colors.secondary'),
        accent: hexAt(value.colors.accent, 'colors.accent'),
        background: hexAt(value.colors.background, 'colors.background'),
        surface: hexAt(value.colors.surface, 'colors.surface'),
        textPrimary: hexAt(value.colors.textPrimary, 'colors.textPrimary'),
        textSecondary: hexAt(value.colors.textSecondary, 'colors.textSecondary'),
        success: hexAt(value.colors.success, 'colors.success'),
        danger: hexAt(value.colors.danger, 'colors.danger'),
        warning: hexAt(value.colors.warning, 'colors.warning'),
      },
      fonts: {
        arabic: stringAt(value.fonts.arabic, 'fonts.arabic'),
        english: stringAt(value.fonts.english, 'fonts.english'),
      },
      currency: {
        code: stringAt(value.currency.code, 'currency.code'),
        symbol: stringAt(value.currency.symbol, 'currency.symbol'),
        symbolAr: stringAt(value.currency.symbolAr, 'currency.symbolAr'),
      },
      defaultLanguage: enumAt(value.defaultLanguage, 'defaultLanguage', languages),
      supportedLanguages,
      contact: {
        phone: stringAt(value.contact.phone, 'contact.phone'),
        whatsapp: stringAt(value.contact.whatsapp, 'contact.whatsapp'),
        email: stringAt(value.contact.email, 'contact.email'),
        address: localizedTextAt(value.contact.address, 'contact.address'),
        workingHours: localizedTextAt(value.contact.workingHours, 'contact.workingHours'),
        socialMedia: {
          ...(optionalUrlAt(value.contact.socialMedia, 'instagram', 'contact.socialMedia') && {
            instagram: optionalUrlAt(value.contact.socialMedia, 'instagram', 'contact.socialMedia'),
          }),
          ...(optionalUrlAt(value.contact.socialMedia, 'twitter', 'contact.socialMedia') && {
            twitter: optionalUrlAt(value.contact.socialMedia, 'twitter', 'contact.socialMedia'),
          }),
          ...(optionalUrlAt(value.contact.socialMedia, 'tiktok', 'contact.socialMedia') && {
            tiktok: optionalUrlAt(value.contact.socialMedia, 'tiktok', 'contact.socialMedia'),
          }),
          ...(optionalUrlAt(value.contact.socialMedia, 'snapchat', 'contact.socialMedia') && {
            snapchat: optionalUrlAt(value.contact.socialMedia, 'snapchat', 'contact.socialMedia'),
          }),
        },
      },
      services: value.services.map((service, index) => serviceAt(service, `services.${index}`)),
      serviceAreas: value.serviceAreas.map((area, index) => {
        if (!isRecord(area)) fail(`serviceAreas.${index}`, 'expected an object');
        if (!Array.isArray(area.coordinates) || area.coordinates.length !== 2) {
          fail(`serviceAreas.${index}.coordinates`, 'expected [latitude, longitude]');
        }
        return {
          name: stringAt(area.name, `serviceAreas.${index}.name`),
          coordinates: [
            numberAt(area.coordinates[0], `serviceAreas.${index}.coordinates.0`),
            numberAt(area.coordinates[1], `serviceAreas.${index}.coordinates.1`),
          ],
          radius: numberAt(area.radius, `serviceAreas.${index}.radius`, { min: 1 }),
        };
      }),
      financial: {
        vatRate: numberAt(value.financial.vatRate, 'financial.vatRate', { min: 0, max: 1 }),
        minOrderValue: numberAt(value.financial.minOrderValue, 'financial.minOrderValue', { min: 0 }),
        deliveryFee: numberAt(value.financial.deliveryFee, 'financial.deliveryFee', { min: 0 }),
        freeDeliveryThreshold: numberAt(value.financial.freeDeliveryThreshold, 'financial.freeDeliveryThreshold', { min: 0 }),
      },
      features: {
        smartLockers: booleanAt(value.features.smartLockers, 'features.smartLockers'),
        laundryService: booleanAt(value.features.laundryService, 'features.laundryService'),
        subscriptions: booleanAt(value.features.subscriptions, 'features.subscriptions'),
        referralProgram: booleanAt(value.features.referralProgram, 'features.referralProgram'),
        loyaltyPoints: booleanAt(value.features.loyaltyPoints, 'features.loyaltyPoints'),
        b2bAccounts: booleanAt(value.features.b2bAccounts, 'features.b2bAccounts'),
        multiLanguage: booleanAt(value.features.multiLanguage, 'features.multiLanguage'),
        walletPayment: booleanAt(value.features.walletPayment, 'features.walletPayment'),
        cashOnDelivery: booleanAt(value.features.cashOnDelivery, 'features.cashOnDelivery'),
      },
    };
  },
  safeParse(value: unknown) {
    try {
      return { success: true, data: this.parse(value) };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
  },
};

export function parseBrandConfig(config: unknown): BrandConfig {
  return brandConfigSchema.parse(config);
}
