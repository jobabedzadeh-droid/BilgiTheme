import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits } from '../utils/persian';
import { SlidersHorizontal, Trash2, ShoppingBag, X, Plus } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const { comparison, products, toggleComparison, clearComparison, addToCart } = useStore();
  const { navigate } = useRouter();

  const comparedProducts = products.filter((p) => comparison.includes(p.id));

  // Collect all unique spec keys
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => p.specs.map((s) => s.key)))
  );

  if (comparedProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200 my-8">
        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <SlidersHorizontal className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">لیست مقایسه شما خالی است</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          برای مقایسه دقیق ویژگی‌ها، قیمت و مشخصات کالاها، روی دکمه مقایسه (VS) در کارت محصولات کلیک فرمایید.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-colors"
        >
          مشاهده کاتالوگ محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>مقایسه مشخصات کالاها</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
              {toPersianDigits(comparedProducts.length)} از ۴ کالا
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بررسی هم‌زمان مشخصات فنی، قیمت و ویژگی‌های کالاهای منتخب
          </p>
        </div>

        <button
          onClick={clearComparison}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>حذف همه از مقایسه</span>
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-x-auto">
        <table className="w-full text-right text-xs divide-y divide-slate-100 min-w-[650px]">
          {/* Header Row: Products info & actions */}
          <thead className="bg-slate-50/80">
            <tr>
              <th className="p-4 sm:p-5 w-44 font-bold text-slate-500 text-xs">مشخصات کالا</th>
              {comparedProducts.map((p) => (
                <th key={p.id} className="p-4 sm:p-5 align-top min-w-[200px]">
                  <div className="space-y-3 relative">
                    <button
                      onClick={() => toggleComparison(p.id)}
                      title="حذف از مقایسه"
                      className="absolute -top-1 left-0 p-1 text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 object-contain mx-auto bg-white rounded-2xl p-2 border border-slate-200"
                    />
                    <h3
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="font-bold text-slate-800 hover:text-indigo-600 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {p.title}
                    </h3>
                    <div className="text-base font-black text-slate-900 tabular-nums">
                      {formatPrice(p.salePrice)}
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>خرید کالا</span>
                    </button>
                  </div>
                </th>
              ))}
              {comparedProducts.length < 4 && (
                <th className="p-4 sm:p-5 align-middle text-center bg-slate-50/30">
                  <button
                    onClick={() => navigate('/products')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl w-full text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">افزودن کالای دیگر</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Brand */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">برند تجاری</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 font-bold text-indigo-700">
                  {p.brand}
                </td>
              ))}
              {comparedProducts.length < 4 && <td />}
            </tr>

            {/* Warranty */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">گارانتی و اصالت</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 text-slate-700">
                  {p.warranty}
                </td>
              ))}
              {comparedProducts.length < 4 && <td />}
            </tr>

            {/* In stock */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/40">وضعیت موجودی انبار</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4">
                  {p.inStock ? (
                    <span className="text-emerald-600 font-bold">موجود در انبار</span>
                  ) : (
                    <span className="text-rose-600 font-bold">ناموجود</span>
                  )}
                </td>
              ))}
              {comparedProducts.length < 4 && <td />}
            </tr>

            {/* Dynamic Specs */}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/40">{key}</td>
                {comparedProducts.map((p) => {
                  const specObj = p.specs.find((s) => s.key === key);
                  return (
                    <td key={p.id} className="p-4 text-slate-700">
                      {specObj ? specObj.value : '—'}
                    </td>
                  );
                })}
                {comparedProducts.length < 4 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
