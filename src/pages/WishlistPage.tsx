import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/common/ProductCard';
import { toPersianDigits } from '../utils/persian';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();
  const { navigate } = useRouter();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>لیست علاقه‌مندی‌ها</span>
          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-lg">
            {toPersianDigits(favoriteProducts.length)} کالا
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          کالاهایی که برای خرید در آینده یا اطلاع از تخفیف نشان کرده‌اید.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
          <p className="text-xs text-slate-500 mb-6">
            شما هنوز کالایی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-colors"
          >
            مشاهده کاتالوگ فروشگاه
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
