/**
 * Persian language and formatting utilities
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function toEnglishDigits(str: string): string {
  if (!str) return '';
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), i.toString());
    result = result.replace(new RegExp(ARABIC_DIGITS[i], 'g'), i.toString());
  }
  return result;
}

export function formatPrice(amount: number, showUnit: boolean = true): string {
  if (isNaN(amount)) return '۰ تومان';
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianStr = toPersianDigits(formatted);
  return showUnit ? `${persianStr} تومان` : persianStr;
}

export function normalizePersianText(text: string): string {
  if (!text) return '';
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u200B-\u200D\uFEFF]/g, ' ')
    .trim()
    .toLowerCase();
}

export function isValidIranPhone(phone: string): boolean {
  const normalized = toEnglishDigits(phone).replace(/\s+/g, '');
  const regex = /^09\d{9}$/;
  return regex.test(normalized);
}

export function isValidPostalCode(code: string): boolean {
  const normalized = toEnglishDigits(code).replace(/\s+/g, '');
  return /^\d{10}$/.test(normalized);
}

/**
 * Approximate Jalali date formatter for clean UI display
 */
export function formatJalaliDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'امروز';

    // Using Intl with Persian calendar
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatter.format(date);
  } catch {
    return 'امروز';
  }
}

export function formatJalaliDateTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return '';

    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return '';
  }
}

export function calculateClubTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (points >= 2500) return 'platinum';
  if (points >= 1000) return 'gold';
  if (points >= 300) return 'silver';
  return 'bronze';
}

export function getTierName(tier: string): string {
  switch (tier) {
    case 'platinum':
      return 'پلاتینیوم (تخفیف همیشگی ۱۵٪)';
    case 'gold':
      return 'طلایی (تخفیف همیشگی ۱۰٪)';
    case 'silver':
      return 'نقره‌ای (تخفیف همیشگی ۵٪)';
    default:
      return 'برنزی (عضو عادی)';
  }
}

export function getOrderStatusBadge(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'pending_payment':
      return { label: 'در انتظار پرداخت', bg: 'bg-amber-50', text: 'text-amber-800' };
    case 'paid':
      return { label: 'پرداخت موفق', bg: 'bg-emerald-50', text: 'text-emerald-800' };
    case 'processing':
      return { label: 'در حال آماده‌سازی', bg: 'bg-blue-50', text: 'text-blue-800' };
    case 'shipped':
      return { label: 'ارسال شده', bg: 'bg-indigo-50', text: 'text-indigo-800' };
    case 'delivered':
      return { label: 'تحویل شده', bg: 'bg-emerald-50', text: 'text-emerald-800' };
    case 'cancelled':
      return { label: 'لغو شده', bg: 'bg-rose-50', text: 'text-rose-800' };
    case 'returned':
      return { label: 'مرجوع شده', bg: 'bg-orange-50', text: 'text-orange-800' };
    default:
      return { label: 'ثبت شده', bg: 'bg-slate-100', text: 'text-slate-800' };
  }
}
