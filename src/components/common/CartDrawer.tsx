import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, toPersianDigits } from '../../utils/persian';
import { X, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, products, updateCartQuantity, removeFromCart, cartSubtotal, storeSettings } = useStore();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const threshold = storeSettings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, threshold - cartSubtotal);
  const freeShippingPercentage = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10 sm:pl-0">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">سبد خرید شما</h2>
              <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
                {toPersianDigits(cart.reduce((s, i) => s + i.quantity, 0))} کالا
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Alert Bar */}
          {cart.length > 0 && (
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                {remainingForFreeShipping > 0 ? (
                  <span className="text-slate-600">
                    تنها <strong className="text-indigo-600 font-bold">{formatPrice(remainingForFreeShipping)}</strong> تا ارسال رایگان
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold">
                    تبریک! سفارش شما مشمول ارسال رایگان شد
                  </span>
                )}
                <span className="text-slate-400 tabular-nums">{toPersianDigits(freeShippingPercentage)}٪</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${freeShippingPercentage}%` }}
                  className={`h-full transition-all duration-500 rounded-full ${
                    freeShippingPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-1">سبد خرید شما خالی است</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  می‌توانید برای مشاهده محصولات شگفت‌انگیز و جدید به فروشگاه سر بزنید.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/products');
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors"
                >
                  مشاهده کاتالوگ محصولات
                </button>
              </div>
            ) : (
              cart.map((item) => {
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
                  <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight mb-1">
                          {prod.title}
                        </h4>
                        {variantName && (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {variantName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-r-lg transition-colors"
                            aria-label="افزایش تعداد"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800 tabular-nums">
                            {toPersianDigits(item.quantity)}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-l-lg transition-colors"
                            aria-label="کاهش تعداد"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900 tabular-nums">
                            {formatPrice(price * item.quantity)}
                          </div>
                          {originalPrice > price && (
                            <div className="text-[10px] text-slate-400 line-through tabular-nums">
                              {formatPrice(originalPrice * item.quantity, false)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals and action buttons */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>جمع اقلام سبد:</span>
                <span className="font-bold text-slate-800 text-sm tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold transition-colors text-center"
                >
                  مشاهده سبد خرید
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>ثبت سفارش</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
