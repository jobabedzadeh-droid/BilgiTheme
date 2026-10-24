import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatJalaliDate, toPersianDigits } from '../utils/persian';
import { BookOpen, Clock, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface BlogPageProps {
  slug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ slug }) => {
  const { articles, products } = useStore();
  const { navigate } = useRouter();

  // If viewing a single article
  if (slug) {
    const article = articles.find((a) => a.slug === slug);
    if (!article) {
      return (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">مقاله یافت نشد</h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            بازگشت به مجله
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/blog')}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به تمام مقالات مجله</span>
        </button>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
              {article.category}
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {toPersianDigits(article.readTime)} دقیقه زمان مطالعه
              </span>
              <span>·</span>
              <span>{formatJalaliDate(article.publishedAt)}</span>
            </div>
          </div>

          <div className="relative pt-[50%] rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-loose space-y-4 text-justify pt-4 border-t border-slate-100">
            <p className="font-semibold text-slate-800 text-sm leading-relaxed">
              {article.excerpt}
            </p>
            <p>{article.content}</p>
            <p>
              در فروشگاه ePasazh همواره بر این باور بوده‌ایم که یک خرید موفق با آگاهی و شناخت آغاز می‌شود. کارشناسان ما به صورت هفتگی جدیدترین دستاوردهای تکنولوژی، مقایسه‌های تخصصی و تجارب عملی استفاده از محصولات را در قالب مقالات خواندنی به اشتراک می‌گذارند.
            </p>
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">برچسب‌ها:</span>
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
              >
                #{t}
              </span>
            ))}
          </div>
        </article>
      </div>
    );
  }

  // Articles catalog list
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <span>مجله و راهنمای خرید تخصصی ePasazh</span>
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          نقد و بررسی‌های بی‌طرفانه، مقایسه‌های فنی و آموزش‌های کاربردی برای خریدی هوشمندانه
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            onClick={() => navigate(`/blog/${art.slug}`)}
            className="group bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-400 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative pt-[60%] rounded-2xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {art.category}
                </span>
                <span>·</span>
                <span>{toPersianDigits(art.readTime)} دقیقه مطالعه</span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
                {art.title}
              </h2>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400">{formatJalaliDate(art.publishedAt)}</span>
              <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                <span>مطالعه مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
