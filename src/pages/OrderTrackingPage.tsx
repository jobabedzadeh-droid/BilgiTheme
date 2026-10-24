import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits, formatJalaliDateTime, getOrderStatusBadge } from '../utils/persian';
import { Search, Package, MapPin, Truck, AlertCircle, ArrowLeft } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const { navigate } = useRouter();

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  const cleanQuery = query.trim().toUpperCase();
  const matchedOrders = orders.filter(
    (o) =>
      o.orderNumber.toUpperCase().includes(cleanQuery) ||
      o.customerPhone.includes(cleanQuery) ||
      (o.trackingCode && o.trackingCode.includes(cleanQuery))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          سامانه هوشمند پیگیری سفارش
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          برای استعلام آنلاین وضعیت بسته‌بندی، شماره بارنامه پستی یا زمان ارسال، شماره سفارش (مانند EP-91823) یا شماره موبایل خود را وارد نمایید.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="شماره سفارش (مثلاً: EP-91823) یا شماره موبایل..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-xs sm:text-sm font-bold transition-colors shrink-0 shadow-sm"
          >
            استعلام وضعیت
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-slate-400 text-[11px]">
          <span>نمونه شماره‌های آماده در سیستم جهت تست:</span>
          <button
            onClick={() => {
              setQuery('EP-91823');
              setSearched(true);
            }}
            className="text-indigo-600 hover:underline font-bold font-mono"
          >
            EP-91823
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-6">
          {matchedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">هیچ سفارشی با این مشخصات یافت نشد</h3>
              <p className="text-xs text-slate-500 mt-1">
                لطفاً صحت شماره سفارش یا شماره تماس خود را بررسی کرده و مجدداً امتحان کنید.
              </p>
            </div>
          ) : (
            matchedOrders.map((order) => {
              const badge = getOrderStatusBadge(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        <span className="text-base font-black text-slate-900 font-mono">
                          {order.orderNumber}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        ثبت شده در: {formatJalaliDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-slate-400 block">مبلغ کل:</span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Postal code & Tracking if shipped */}
                  {order.trackingCode && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-indigo-900 block mb-0.5">
                          کد رهگیری پستی مرسوله:
                        </span>
                        <span className="font-mono text-sm font-bold text-indigo-700 tracking-wider">
                          {order.trackingCode}
                        </span>
                      </div>
                      <a
                        href={`https://tracking.post.ir/?id=${order.trackingCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        رهگیری در سامانه پست
                      </a>
                    </div>
                  )}

                  {/* Shipping info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block mb-0.5">مقصد تحویل:</span>
                        <span className="text-slate-800 font-medium">
                          {order.shippingAddress.province}، {order.shippingAddress.city} - {order.shippingAddress.address}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          گیرنده: {order.shippingAddress.recipientName} ({toPersianDigits(order.shippingAddress.recipientPhone)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block mb-0.5">روش ارسال انتخابی:</span>
                        <span className="text-slate-800 font-medium">{order.shippingMethod.name}</span>
                        <span className="text-[11px] text-emerald-600 block mt-0.5">
                          {order.shippingMethod.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">اقلام سفارش:</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
                        >
                          <img
                            src={item.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 object-contain rounded"
                          />
                          <span className="font-semibold text-slate-800">{item.title}</span>
                          <span className="text-slate-400">({toPersianDigits(item.quantity)} عدد)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Machine */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block mb-3">
                      تاریخچه تغییرات وضعیت:
                    </span>
                    <div className="relative border-r-2 border-slate-200 mr-2 space-y-4 pr-4">
                      {order.timeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -right-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{step.title}</span>
                            <span className="text-[11px] text-slate-400">
                              {formatJalaliDateTime(step.timestamp)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
