import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { toPersianDigits } from '../../utils/persian';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { storeSettings, showNotification } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      showNotification('success', 'ایمیل شما با موفقیت در خبرنامه تخفیف‌های ویژه ePasazh ثبت شد');
      setNewsletterEmail('');
    } else {
      showNotification('error', 'لطفاً یک آدرس ایمیل معتبر وارد فرمایید');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      {/* 1. Value Proposition Strip */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-slate-200 font-bold text-xs mb-1">ارسال سریع و اکسپرس</h4>
            <p className="text-[11px] text-slate-500">تحویل فوری روز در تهران و پیشتاز سراسری</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-slate-200 font-bold text-xs mb-1">ضمانت ۱۰۰٪ اصالت</h4>
            <p className="text-[11px] text-slate-500">تمامی کالاها با گارانتی معتبر شرکتی</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-slate-200 font-bold text-xs mb-1">۷ روز ضمانت بازگشت</h4>
            <p className="text-[11px] text-slate-500">امکان مرجوعی کالا در صورت مغایرت</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-slate-200 font-bold text-xs mb-1">پشتیبانی تلفنی و تیکت</h4>
            <p className="text-[11px] text-slate-500">پاسخگویی سریع در تمامی روزهای هفته</p>
          </div>

          <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-slate-200 font-bold text-xs mb-1">پرداخت امن شاپرک</h4>
            <p className="text-[11px] text-slate-500">اتصال به درگاه‌های معتبر بانکی شتاب</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & About */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Store Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                eP
              </div>
              <span className="text-lg font-black text-white">ePasazh | پاساژ اختصاصی</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              فروشگاه اینترنتی تک‌فروشنده ePasazh با هدف تجربه خریدی لوکس، شفاف، سریع و بدون واسطه از برترین برندهای دیجیتال، مد و پوشاک، خانه و آشپزخانه و سلامت پایه‌گذاری شده است. انبارداری متمرکز، تضمین سلامت فیزیکی و پشتیبانی دلسوزانه تعهد ما به شماست.
            </p>

            <div className="space-y-2 pt-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{storeSettings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شماره تماس: {toPersianDigits(storeSettings.storePhone)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ایمیل پشتیبانی: {storeSettings.storeEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Customer Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-white transition-colors"
                >
                  پرسش‌های متداول (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping')}
                  className="hover:text-white transition-colors"
                >
                  رویه‌های ارسال و هزینه
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/returns')}
                  className="hover:text-white transition-colors"
                >
                  شرایط و روش مرجوعی کالا
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/track-order')}
                  className="hover:text-white transition-colors"
                >
                  پیگیری آنلاین وضعیت سفارش
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account/tickets')}
                  className="hover:text-white transition-colors"
                >
                  ثبت تیکت پشتیبانی
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Pages */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">راهنمای خرید و قوانین</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  درباره فروشگاه ePasazh
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  تماس با مدیریت و پشتیبانی
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors"
                >
                  قوانین و مقررات سایت
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account/club')}
                  className="hover:text-white transition-colors"
                >
                  باشگاه مشتریان و امتیازها
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-white transition-colors"
                >
                  مجله و مقالات تخصصی
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Trust badges */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">عضویت در خبرنامه تخفیف‌ها</h4>
            <p className="text-[11px] text-slate-400">
              از اولین نفراتی باشید که از حراج‌های فصلی و کدهای تخفیف باخبر می‌شوند.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                placeholder="آدرس ایمیل شما..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-3 pl-10 py-2.5 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors"
                aria-label="عضویت در خبرنامه"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {newsletterSubscribed && (
              <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> عضویت شما فعال شد.
              </p>
            )}

            {/* Electronic trust symbols placeholders */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 block mb-2">نمادهای اعتماد الکترونیک:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 mb-1" />
                  <span>اینماد ۲ ستاره</span>
                </div>
                <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
                  <span>ساماندهی</span>
                </div>
                <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center">
                  <CreditCard className="w-5 h-5 text-amber-400 mb-1" />
                  <span>عضو اتحادیه</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom bar & Return to top */}
      <div className="bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-slate-500 text-center sm:text-right">
            تمامی حقوق مادی و معنوی این وب‌سایت متعلق به فروشگاه مرکزی تک‌فروشنده ePasazh می‌باشد. (۱۴۰۵ - ۲۰۲۶)
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <span>بازگشت به بالا</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
