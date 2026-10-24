import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits } from '../utils/persian';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    storeSettings,
    validateDiscount,
    showNotification,
  } = useStore();
  const { navigate } = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    amount: number;
    message: string;
  } | null>(null);

  const threshold = storeSettings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, threshold - cartSubtotal);
  const freeShippingPercentage = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = validateDiscount(couponInput.trim(), cartSubtotal);
    if (res.valid) {
      setAppliedCoupon({
        code: couponInput.trim().toUpperCase(),
        amount: res.discountAmount,
        message: res.message,
      });
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showNotification('info', 'کد تخفیف حذف گردید');
  };

  const discountVal = appliedCoupon ? appliedCoupon.amount : 0;
  const estimatedShipping = cartSubtotal >= threshold ? 0 : storeSettings.shippingFeeStandard;
  const finalPayable = Math.max(0, cartSubtotal + estimatedShipping - discountVal);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200/90 shadow-xs my-8">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">سبد خرید شما خالی است</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          شما در حال حاضر هیچ کالایی به سبد خرید اضافه نکرده‌اید. با گشت و گذار در کاتالوگ فروشگاه، محصولات دلخواه خود را بیابید.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-colors"
        >
          شروع خرید از کاتالوگ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title & steps indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>سبد خرید شما</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">
              {toPersianDigits(cartTotalCount)} قلم کالا
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            اقلام موجود در سبد خرید با گارانتی اصالت فروشگاه ePasazh تأمین می‌شوند.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>خالی کردن سبد خرید</span>
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          {remainingForFreeShipping > 0 ? (
            <span className="text-slate-600">
              تنها <strong className="text-indigo-600 font-bold">{formatPrice(remainingForFreeShipping)}</strong> دیگر خرید کنید تا سفارشتان مشمول ارسال رایگان شود!
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              سفارش شما مشمول ارسال رایگان پاساژ اکسپرس شد!
            </span>
          )}
          <span className="text-slate-400 tabular-nums">{toPersianDigits(freeShippingPercentage)}٪</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${freeShippingPercentage}%` }}
            className={`h-full transition-all duration-500 rounded-full ${
              freeShippingPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
          />
        </div>
      </div>

      {/* Main Grid: Items Table & Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
          {cart.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            if (!prod) return null;

            let price = prod.salePrice;
            let originalPrice = prod.originalPrice;
            let variantName: string | undefined;

            if (item.variantId) {
              const vr = prod.variants.find((v) => v.id === item.variantId);
              if (vr) {
                price = vr.price;
                originalPrice = vr.originalPrice;
                variantName = vr.colorName ? `${vr.colorName} ${vr.size ? `- ${vr.size}` : ''}` : vr.size;
              }
            }

            return (
              <div key={`${item.productId}-${item.variantId || 'b'}`} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0"
                  />

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">{prod.brand}</span>
                    <h3
                      onClick={() => navigate(`/product/${prod.slug}`)}
                      className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {prod.title}
                    </h3>
                    {variantName && (
                      <span className="inline-block text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        تنوع: {variantName}
                      </span>
                    )}
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{prod.warranty}</span>
                    </div>
                  </div>
                </div>

                {/* Stepper & Price */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                      {toPersianDigits(item.quantity)}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                      {formatPrice(price * item.quantity)}
                    </div>
                    {originalPrice > price && (
                      <div className="text-xs text-slate-400 line-through tabular-nums">
                        {formatPrice(originalPrice * item.quantity, false)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Summary (col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Discount code box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>کد تخفیف دارید؟</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    مبلغ {formatPrice(appliedCoupon.amount)} کسر شد
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                >
                  حذف
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثلاً: NOWRUZ یا PASAZH10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  اعمال
                </button>
              </form>
            )}

            <div className="text-[11px] text-slate-400">
              کدهای تخفیف آزمایشی: <strong className="text-slate-600">NOWRUZ</strong> و <strong className="text-slate-600">PASAZH10</strong>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              فاکتور و خلاصه سفارش
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>قیمت کل کالاها ({toPersianDigits(cartTotalCount)} قلم):</span>
                <span className="font-bold text-slate-800 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountVal > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>تخفیف اعمال‌شده:</span>
                  <span className="tabular-nums">- {formatPrice(discountVal)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>هزینه تخمینی ارسال:</span>
                </span>
                <span className="font-bold tabular-nums">
                  {estimatedShipping === 0 ? (
                    <span className="text-emerald-600">رایگان</span>
                  ) : (
                    formatPrice(estimatedShipping)
                  )}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">مبلغ قابل پرداخت:</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">
                {formatPrice(finalPayable)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <span>ادامه جهت انتخاب آدرس و پرداخت</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              بازگشت و افزودن کالاهای بیشتر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
