import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatPrice, toPersianDigits } from '../utils/persian';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowLeft,
  Award,
  Clock,
  ShieldCheck,
  TrendingUp,
  Tag,
  BookOpen,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, banners, articles } = useStore();
  const { navigate } = useRouter();

  // Slider state
  const sliderBanners = banners.filter((b) => b.placement === 'main_slider' && b.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Countdown timer for special offers (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto advance slide
  useEffect(() => {
    if (sliderBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderBanners.length]);

  const specialOffers = products.filter((p) => p.isSpecialOffer);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNew);
  const middleBanners = banners.filter((b) => b.placement === 'middle_two' && b.isActive);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. Main Hero Carousel */}
      {sliderBanners.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900">
          <div className="relative h-[280px] sm:h-[400px] md:h-[460px] w-full">
            {sliderBanners.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-end p-6 sm:p-12">
                  <div className="max-w-2xl text-right text-white space-y-2 sm:space-y-3">
                    {slide.badge && (
                      <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                        {slide.badge}
                      </span>
                    )}
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate(slide.link)}
                        className="px-5 py-2.5 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-lg"
                      >
                        <span>مشاهده جشنواره و خرید</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          {sliderBanners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + sliderBanners.length) % sliderBanners.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center transition-colors"
                aria-label="اسلاید قبلی"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderBanners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center transition-colors"
                aria-label="اسلاید بعدی"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {sliderBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? 'w-6 bg-indigo-500' : 'w-2 bg-white/50'
                    }`}
                    aria-label={`اسلاید ${toPersianDigits(idx + 1)}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* 2. Category Circular Showcase */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">دسته‌بندی‌های برگزیده</h2>
            <p className="text-xs text-slate-500 mt-0.5">کاوش در بیش از ۶ گروه کالایی منتخب ePasazh</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه دسته‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-2.5 p-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {toPersianDigits(cat.itemCount)} کالا
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Special Offers Strip (شگفت‌انگیزهای روز) */}
      {specialOffers.length > 0 && (
        <section className="bg-gradient-to-l from-rose-600 via-rose-700 to-red-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Promo banner info & countdown */}
            <div className="lg:w-64 shrink-0 flex flex-col justify-between text-right space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold mb-3">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>پیشنهاد شگفت‌انگیز</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                  تخفیف‌های ویژه و محدود پاساژ
                </h3>
                <p className="text-xs text-rose-100 mt-2 leading-relaxed">
                  تخفیف‌های اختصاصی روی منتخب کالاهای پرطرفدار به مدت محدود با ارسال رایگان.
                </p>
              </div>

              {/* Countdown clock */}
              <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                <div className="text-[11px] text-rose-200 mb-2 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>زمان باقی‌مانده تا پایان پیشنهاد:</span>
                </div>
                <div className="flex items-center justify-center gap-2 dir-ltr">
                  <div className="bg-white/20 rounded-xl px-2.5 py-1.5 text-center min-w-[42px]">
                    <span className="text-base font-black tabular-nums">
                      {toPersianDigits(timeLeft.seconds.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[9px] block text-rose-200">ثانیه</span>
                  </div>
                  <span className="text-lg font-bold">:</span>
                  <div className="bg-white/20 rounded-xl px-2.5 py-1.5 text-center min-w-[42px]">
                    <span className="text-base font-black tabular-nums">
                      {toPersianDigits(timeLeft.minutes.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[9px] block text-rose-200">دقیقه</span>
                  </div>
                  <span className="text-lg font-bold">:</span>
                  <div className="bg-white/20 rounded-xl px-2.5 py-1.5 text-center min-w-[42px]">
                    <span className="text-base font-black tabular-nums">
                      {toPersianDigits(timeLeft.hours.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[9px] block text-rose-200">ساعت</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/products?special=true')}
                className="w-full py-2.5 px-4 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors text-center shadow-md flex items-center justify-center gap-2"
              >
                <span>مشاهده تمام شگفت‌انگیزها</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Carousel / Grid of special offer cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {specialOffers.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Dual Middle Promotional Banners */}
      {middleBanners.length >= 2 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {middleBanners.slice(0, 2).map((banner) => (
            <div
              key={banner.id}
              onClick={() => navigate(banner.link)}
              className="group relative rounded-3xl overflow-hidden h-48 sm:h-60 border border-slate-200/80 cursor-pointer shadow-sm"
            >
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white text-right">
                {banner.badge && (
                  <span className="self-start bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2">
                    {banner.badge}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-bold leading-snug">{banner.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 5. Best Sellers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">پرفروش‌ترین‌های فروشگاه</h2>
              <p className="text-xs text-slate-500">انتخاب اول خریداران حرفه‌ای ePasazh</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/products?bestseller=true')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Single-Vendor Store Perks & Guarantees Bar */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
          <span className="text-indigo-400 text-xs font-bold tracking-wider uppercase">
            تعهد به اصالت و شفافیت
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            چرا خرید مستقیم از فروشگاه تک‌فروشنده ePasazh؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            در این فروشگاه خبری از واسطه‌ها، تأمین‌کنندگان غیرمعتبر یا فروشندگان متفرقه نیست. تمامی کالاها مستقیماً در انبارهای مرکزی ما کنترل کیفیت، تست و با گارانتی شرکتی بسته‌بندی می‌شوند.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 text-right">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-200 mb-1">گارانتی یکپارچه شرکتی</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              هر کالا دارای کد رهگیری، هولوگرام اصالت و ضمانت رسمی ۱۸ الی ۲۴ ماهه است.
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-200 mb-1">باشگاه مشتریان و وفاداری</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              با هر خرید امتیاز نقد شونده کسب کنید و به سطوح نقره‌ای و طلایی با تخفیف دائمی برسید.
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-200 mb-1">ارسال فوری بدون اتلاف وقت</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              چون کالاها در انبار خودمان است، سفارش شما ظرف چند ساعت آماده و تحویل پست یا پیک می‌گردد.
            </p>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">جدیدترین محصولات افزوده شده</h2>
              <p className="text-xs text-slate-500">تازه واردها با آخرین تکنولوژی و ترند روز</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/products?new=true')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Magazine / Articles Highlights */}
      {articles.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">مجله و راهنمای تخصصی خرید</h2>
                <p className="text-xs text-slate-500">بررسی‌های تحلیلی، مقایسه‌ها و ترفندهای کاربردی</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/blog')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>مشاهده مجله</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art) => (
              <div
                key={art.id}
                onClick={() => navigate(`/blog/${art.slug}`)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative pt-[56%] rounded-2xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={art.image}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-indigo-600 font-semibold">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{toPersianDigits(art.readTime)} دقیقه زمان مطالعه</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
