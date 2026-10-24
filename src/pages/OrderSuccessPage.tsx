import React from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits, formatJalaliDateTime } from '../utils/persian';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowLeft,
  Truck,
  MapPin,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

interface OrderSuccessPageProps {
  orderId: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const { orders } = useStore();
  const { navigate } = useRouter();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">سفارش مورد نظر یافت نشد</h2>
        <p className="text-xs text-slate-500 mb-6">
          ممکن است شماره سفارش نادرست باشد یا به تازگی لغو شده باشد.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Celebratory Success Banner */}
      <div className="bg-gradient-to-l from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black">
          سفارش شما با موفقیت ثبت و پرداخت گردید!
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          از اعتماد شما به فروشگاه اختصاصی ePasazh سپاسگزاریم. فاکتور سفارش صادر شده و جهت آماده‌سازی بسته‌بندی به انبار ارسال شد.
        </p>

        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs sm:text-sm font-bold">
          <span>شماره سفارش:</span>
          <strong className="text-amber-300 tracking-wider font-mono">{order.orderNumber}</strong>
        </div>
      </div>

      {/* 2. Order Details & Snapshot Invoice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>پیش‌فاکتور و مشخصات سفارش</span>
            </h2>
            <span className="text-xs text-slate-400 mt-0.5 block">
              تاریخ ثبت: {formatJalaliDateTime(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ فاکتور</span>
            </button>
            <button
              onClick={() => navigate('/track-order')}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <span>پیگیری وضعیت مرسوله</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Transaction Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 block mb-0.5">وضعیت پرداخت:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md inline-block">
              پرداخت موفقیت‌آمیز
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">درگاه و شناسه تراکنش:</span>
            <span className="font-bold text-slate-800">{order.gatewayProvider}</span>
            <span className="text-[11px] text-slate-500 block font-mono">{order.gatewayRefId}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">روش ارسال:</span>
            <span className="font-bold text-slate-800">{order.shippingMethod.name}</span>
          </div>
        </div>

        {/* Delivery Address Snapshot */}
        <div className="text-xs space-y-1 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>نشانی تحویل گیرنده:</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {order.shippingAddress.province}، {order.shippingAddress.city} - {order.shippingAddress.address}
            {order.shippingAddress.plaque && `، پلاک ${toPersianDigits(order.shippingAddress.plaque)}`}
            {order.shippingAddress.unit && `، ${order.shippingAddress.unit}`}
          </p>
          <div className="text-slate-500 text-[11px] pt-1">
            تحویل‌گیرنده: <strong>{order.shippingAddress.recipientName}</strong> | تلفن تماس: {toPersianDigits(order.shippingAddress.recipientPhone)} | کد پستی: {toPersianDigits(order.shippingAddress.postalCode)}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800">اقلام فاکتور شده (Snapshot):</h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <div className="text-[11px] text-slate-400 space-x-2 space-x-reverse">
                      <span>کد SKU: {item.sku}</span>
                      {item.colorName && <span>· رنگ: {item.colorName}</span>}
                      {item.size && <span>· سایز: {item.size}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[11px] text-slate-500 block">
                    {toPersianDigits(item.quantity)} × {formatPrice(item.unitPrice)}
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="space-y-2 text-xs max-w-xs mr-auto pt-2">
          <div className="flex items-center justify-between text-slate-600">
            <span>جمع اقلام سفارش:</span>
            <span className="font-bold tabular-nums">{formatPrice(order.itemsSubtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-600 font-bold">
              <span>تخفیف ({order.discountCodeApplied || 'کد تخفیف'}):</span>
              <span className="tabular-nums">- {formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-600">
            <span>هزینه حمل و ارسال:</span>
            <span className="font-bold tabular-nums">
              {order.shippingFee === 0 ? 'رایگان' : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
            <span>مبلغ نهایی پرداخت شده:</span>
            <span className="tabular-nums text-base">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Timeline Machine */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-800">مراحل و گردش کار سفارش:</h3>
          <div className="relative border-r-2 border-indigo-200 mr-2 space-y-4 pr-4">
            {order.timeline.map((step, sIdx) => (
              <div key={sIdx} className="relative">
                <span className="absolute -right-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{step.title}</span>
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
    </div>
  );
};
