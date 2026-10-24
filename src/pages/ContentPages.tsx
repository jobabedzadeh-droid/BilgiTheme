import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/persian';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  ChevronDown,
  Send,
  CheckCircle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { storeSettings } = useStore();
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs text-xs sm:text-sm text-slate-700 leading-loose">
      <div className="border-b border-slate-100 pb-4 text-right">
        <span className="text-indigo-600 font-bold text-xs uppercase block mb-1">درباره فروشگاه</span>
        <h1 className="text-2xl font-black text-slate-900">داستان پیدایش و رسالت ePasazh</h1>
      </div>

      <div className="space-y-4 text-justify">
        <p>
          فروشگاه اینترنتی <strong>ePasazh (پاساژ اختصاصی)</strong> بر مبنای یک دغدغه بنیادین شکل گرفت: پایان دادن به سردرگمی خریداران در بازارهای آشفته چندفروشندگی و ایجاد یک مرجع واحد، شفاف، مسئولیت‌پذیر و ۱۰۰٪ تک‌فروشنده.
        </p>
        <p>
          برخلاف مارکت‌پلیس‌هایی که هزاران فروشنده متفرقه در آن کالا می‌فروشند و خریدار در صورت مواجهه با کالای غیراصل یا تأخیر ارسال دچار بلاتکلیفی می‌شود، در ePasazh تمامی کالاها مستقیماً توسط تیم بازرگانی ما خریداری شده، در انبارهای مجهز اختصاصی نگهداری و پس از کنترل کیفیت چندمرحله‌ای ارسال می‌گردند.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">اصالت بی‌قید و شرط</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            تنها کالاهایی در ویترین ما قرار می‌گیرند که اسناد گمرکی، بچ‌کد اصالت و گارانتی معتبر شرکتی داشته باشند.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
          <Truck className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">ارسال متمرکز و سریع</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            به دلیل عدم وابستگی به انبار دیگران، مرسولات تهران ظرف چند ساعت و شهرستان ظرف ۴۸ ساعت تحویل می‌گردند.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
          <RotateCcw className="w-6 h-6 text-amber-600" />
          <h3 className="font-bold text-slate-900 text-sm">۷ روز ضمانت بازگشت</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            حق بازگشت کالا بدون دردسر، با احترام کامل به حقوق مصرف‌کننده و بازگشت آنی وجه به حساب خریدار.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { storeSettings, showNotification } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !msg.trim()) {
      showNotification('error', 'لطفاً تمام فیلدها را پر کنید');
      return;
    }
    setSent(true);
    showNotification('success', 'پیام شما ثبت شد. کارشناسان به زودی با شما تماس خواهند گرفت.');
    setName('');
    setPhone('');
    setMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900">ارتباط مستقیم با مدیریت و پشتیبانی</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          ما مشتاقانه آماده شنیدن نظرات، پیشنهادات و پاسخگویی به سؤالات شما هستیم.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 text-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            راه‌های ارتباط رسمی با فروشگاه ePasazh:
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">آدرس دفتر مرکزی و انبار:</span>
                <p className="text-slate-600 leading-relaxed">{storeSettings.storeAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">خط ویژه پشتیبانی مشتریان:</span>
                <a
                  href={`tel:${storeSettings.storePhone}`}
                  className="font-bold text-slate-900 text-sm hover:text-indigo-600"
                >
                  {toPersianDigits(storeSettings.storePhone)}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">پست الکترونیک رسمی:</span>
                <span className="text-slate-700 font-mono">{storeSettings.storeEmail}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">ساعات پاسخگویی تیم پشتیبانی:</span>
                <p className="text-slate-600">{storeSettings.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            ارسال پیام یا انتقاد و پیشنهاد
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">نام و نام خانوادگی:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">شماره تماس:</label>
              <input
                type="tel"
                required
                placeholder="09121234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">متن پیام شما:</label>
              <textarea
                required
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors shadow-xs"
            >
              ارسال پیام به واحد پشتیبانی
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'آیا محصولات موجود در ePasazh اصل و دارای گارانتی هستند؟',
      a: 'بله، تمامی محصولات عرضه شده در فروشگاه تک‌فروشنده ما دارای گارانتی معتبر رسمی شرکتی و ۱۰۰٪ ضمانت اصالت فیزیکی هستند. در صورت وجود هرگونه مغایرت، کالا ظرف ۷ روز بدون قید و شرط تعویض یا مرجوع می‌شود.',
    },
    {
      q: 'سفارش‌ها چگونه و در چه بازه زمانی ارسال می‌شوند؟',
      a: 'برای مشتریان شهر تهران، امکان ارسال فوری اکسپرس ظرف چند ساعت همان روز فراهم است. برای سراسر کشور نیز مرسولات از طریق پست پیشتاز و تیپاکس ارسال شده و ظرف ۲۴ الی ۷۲ ساعت تحویل خریدار می‌گردند.',
    },
    {
      q: 'آیا برای سفارش بالای مبلغ مشخصی ارسال رایگان است؟',
      a: 'بله، برای تمامی سفارش‌های با مبلغ بالای ۱,۵۰۰,۰۰۰ تومان، هزینه ارسال کاملاً رایگان محاسبه شده و مهمان ePasazh هستید.',
    },
    {
      q: 'چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟',
      a: 'با مراجعه به بخش «پیگیری سفارش» در هدر سایت و وارد کردن شماره سفارش (مانند EP-91823) یا شماره تماس، وضعیت لحظه‌ای پردازش در انبار یا کد رهگیری پستی مرسوله را مشاهده فرمایید.',
    },
    {
      q: 'شرایط و فرایند مرجوعی کالا چگونه است؟',
      a: 'تا ۷ روز پس از دریافت سفارش، در صورت وجود نقص فنی، مغایرت ظاهری یا سایز نادرست (در صورتی که پلمب کالا سالم باشد)، می‌توانید از طریق پنل کاربری بخش سفارش‌ها، گزینه «درخواست مرجوعی» را ثبت کنید تا هماهنگی دریافت انجام شود.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">پرسش‌های پرتکرار مشتریان (FAQ)</h1>
        <p className="text-xs text-slate-500">پاسخ سریع به متداول‌ترین سؤالات درباره خرید، ارسال و ضمانت</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all text-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-right font-bold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ShippingTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-loose">
      <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4">
        رویه‌ها و شیوه‌های ارسال سفارش در ePasazh
      </h1>
      <p>
        هدف ما تحویل ایمن و در سریع‌ترین زمان ممکن است. بسته‌بندی تمامی کالاها مجهز به ضربه‌گیرهای چندلایه حباب‌دار و کارتن‌های مقاوم شرکتی می‌باشد تا کوچک‌ترین آسیبی به کالای خریداری شده وارد نگردد.
      </p>
      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-slate-900 text-sm">روش‌های ارسال فعال:</h3>
        <ul className="list-disc pr-5 space-y-2">
          <li>
            <strong>پیک اکسپرس تهران:</strong> تحویل ظرف ۳ الی ۵ ساعت کاری برای سفارش‌های ثبت‌شده تا ساعت ۱۷ روزهای کاری.
          </li>
          <li>
            <strong>پست پیشتاز سراسری:</strong> ارسال به تمامی شهرها و روستاهای کشور، زمان تحویل ۲ الی ۳ روز کاری.
          </li>
          <li>
            <strong>تیپاکس:</strong> تحویل درب به درب در سراسر کشور ظرف ۲۴ الی ۴۸ ساعت همراه با بیمه کامل ارزش ریالی کالا.
          </li>
        </ul>
      </div>
    </div>
  );
};

export const ReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-loose">
      <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4">
        شرایط و رویه ۷ روز ضمانت بازگشت کالا
      </h1>
      <p>
        رضایت کامل شما اولویت اول ماست. برای آسودگی خیال خریداران گرامی، امکان مرجوعی کالا تا ۷ روز پس از تاریخ تحویل با شرایط زیر فراهم است:
      </p>
      <div className="space-y-3 pt-2">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900">۱. مغایرت ظاهری یا فنی با مشخصات سایت</h4>
          <p className="text-xs text-slate-600">
            در صورتی که کالای دریافت شده از نظر رنگ، مدل، حجم یا مشخصات با فاکتور یا توضیحات سایت مغایرت داشته باشد، بدون هیچ هزینه‌ای پس گرفته می‌شود.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900">۲. نقص فنی و سلامت اولیه</h4>
          <p className="text-xs text-slate-600">
            کلیه کالاهای دیجیتال و برقی دارای مهلت تست سلامت بوده و در صورت هرگونه نقص کارخانه‌ای، بلافاصله تعویض می‌گردند.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-loose">
      <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4">
        قوانین و مقررات خرید از فروشگاه تک‌فروشنده ePasazh
      </h1>
      <p>
        استفاده از خدمات ePasazh و ثبت هرگونه سفارش به منزله پذیرش آگاهانه کلیه شرایط و قوانین مندرج در این صفحه می‌باشد.
      </p>
      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-slate-900">اصول کلیدی فروشگاه:</h3>
        <ul className="list-disc pr-5 space-y-2">
          <li>تمامی قیمت‌ها به تومان بوده و در لحظه نهایی کردن خرید قطعی و غیرقابل تغییر است.</li>
          <li>تمامی اطلاعات شخصی و تماس مشتریان محرمانه تلقی شده و به هیچ شخص ثالثی واگذار نمی‌شود.</li>
          <li>فروشگاه متعهد به ارائه فاکتور رسمی همراه با کد رهگیری پستی و هولوگرام اصالت کالا می‌باشد.</li>
        </ul>
      </div>
    </div>
  );
};
