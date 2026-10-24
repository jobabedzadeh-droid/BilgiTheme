import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits, isValidIranPhone, isValidPostalCode } from '../utils/persian';
import { PaymentMethod } from '../types';
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  Zap,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    addresses,
    shippingMethods,
    cartSubtotal,
    cartTotalCount,
    storeSettings,
    currentUser,
    addAddress,
    placeOrder,
    showNotification,
  } = useStore();
  const { navigate } = useRouter();

  // Selection states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.length > 0 ? (addresses.find((a) => a.isDefault)?.id || addresses[0].id) : ''
  );
  const [selectedShippingId, setSelectedShippingId] = useState<string>(shippingMethods[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_gateway');
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [guestName, setGuestName] = useState(currentUser?.fullName || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');

  // New Address modal state
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [newProvince, setNewProvince] = useState('تهران');
  const [newCity, setNewCity] = useState('تهران');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [newPlaque, setNewPlaque] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newRecipientName, setNewRecipientName] = useState(currentUser?.fullName || '');
  const [newRecipientPhone, setNewRecipientPhone] = useState(currentUser?.phone || '');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Shipping calculation
  const selectedShipping = shippingMethods.find((s) => s.id === selectedShippingId) || shippingMethods[0];
  const shippingFee = cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : selectedShipping.fee;
  const totalAmount = cartSubtotal + shippingFee;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim() || !newPostalCode.trim() || !newRecipientName.trim() || !newRecipientPhone.trim()) {
      showNotification('error', 'لطفاً تمامی فیلدهای الزامی نشانی را تکمیل فرمایید');
      return;
    }
    if (!isValidPostalCode(newPostalCode)) {
      showNotification('error', 'کد پستی باید دقیقاً ۱۰ رقم عددی باشد');
      return;
    }
    if (!isValidIranPhone(newRecipientPhone)) {
      showNotification('error', 'شماره موبایل تحویل‌گیرنده معتبر نمی‌باشد (مثال: 09121234567)');
      return;
    }

    addAddress({
      title: `${newCity} - ${newAddressText.substring(0, 16)}...`,
      province: newProvince,
      city: newCity,
      postalCode: newPostalCode,
      address: newAddressText,
      plaque: newPlaque,
      unit: newUnit,
      recipientName: newRecipientName,
      recipientPhone: newRecipientPhone,
      isDefault: addresses.length === 0,
    });

    setIsAddAddressModalOpen(false);
    setNewAddressText('');
    setNewPostalCode('');
    setNewPlaque('');
    setNewUnit('');
  };

  const handleFinalOrderSubmit = () => {
    if (!selectedAddressId) {
      showNotification('error', 'لطفاً یک آدرس جهت تحویل سفارش انتخاب نمایید');
      return;
    }

    if (!currentUser && (!guestName.trim() || !guestPhone.trim())) {
      showNotification('error', 'لطفاً نام و شماره همراه تحویل‌گیرنده را وارد فرمایید');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = placeOrder({
        addressId: selectedAddressId,
        shippingMethodId: selectedShippingId,
        paymentMethod,
        discountCode: discountCodeInput.trim() || undefined,
        guestInfo: !currentUser ? { name: guestName, phone: guestPhone } : undefined,
      });

      setIsSubmitting(false);

      if (res.success && res.orderId) {
        navigate(`/order-success/${res.orderId}`);
      } else {
        showNotification('error', res.error || 'خطا در ثبت سفارش');
      }
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          تکمیل اطلاعات و ثبت نهایی سفارش
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          مراحل نهایی خرید از فروشگاه مرکزی ePasazh
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address, Shipping, Payment (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Contact Info if Guest */}
          {!currentUser && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                  ۱
                </span>
                <span>اطلاعات تماس خریدار مهمان</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نام و نام‌خانوادگی:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: علی احمدی"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره تلفن همراه:</label>
                  <input
                    type="tel"
                    required
                    placeholder="09121234567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 dir-ltr text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                  {!currentUser ? '۲' : '۱'}
                </span>
                <span>انتخاب نشانی تحویل سفارش</span>
              </h2>

              <button
                onClick={() => setIsAddAddressModalOpen(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن نشانی جدید</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500 mb-3">هنوز هیچ آدرسی ثبت نکرده‌اید.</p>
                <button
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  ثبت نشانی تحویل
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-xs ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isSelected ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block mb-1">
                              {addr.province}، {addr.city} - {addr.address}
                              {addr.plaque && `، پلاک ${toPersianDigits(addr.plaque)}`}
                              {addr.unit && `، ${addr.unit}`}
                            </span>
                            <div className="text-slate-500 space-x-3 space-x-reverse text-[11px]">
                              <span>کد پستی: <strong className="tabular-nums text-slate-700">{toPersianDigits(addr.postalCode)}</strong></span>
                              <span>تحویل‌گیرنده: <strong className="text-slate-700">{addr.recipientName}</strong> ({toPersianDigits(addr.recipientPhone)})</span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Shipping Method */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                {!currentUser ? '۳' : '۲'}
              </span>
              <span>شیوه ارسال سفارش</span>
            </h2>

            <div className="space-y-3">
              {shippingMethods.map((ship) => {
                const isSelected = ship.id === selectedShippingId;
                const isFree = cartSubtotal >= storeSettings.freeShippingThreshold;
                const cost = isFree ? 0 : ship.fee;

                return (
                  <div
                    key={ship.id}
                    onClick={() => setSelectedShippingId(ship.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{ship.name}</h4>
                        <p className="text-[11px] text-slate-500">{ship.description}</p>
                        <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                          زمان تحویل تقریبی: {ship.estimatedDelivery}
                        </span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      {isFree ? (
                        <span className="text-emerald-600 font-bold">ارسال رایگان</span>
                      ) : (
                        <span className="font-bold text-slate-800 tabular-nums">
                          {formatPrice(cost)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Payment Method Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                {!currentUser ? '۴' : '۳'}
              </span>
              <span>شیوه پرداخت</span>
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('online_gateway')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs ${
                  paymentMethod === 'online_gateway'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      پرداخت اینترنتی شاپرک (درگاه سامان کیش / زرین‌پال)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      با تمامی کارت‌های عضو شبکه شتاب با شبیه‌ساز پرداخت ایمن و آنی
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online_gateway'}
                  onChange={() => setPaymentMethod('online_gateway')}
                  className="w-4 h-4 text-indigo-600"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('card_to_card')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs ${
                  paymentMethod === 'card_to_card'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      کارت به کارت و ثبت شماره پیگیری
                    </span>
                    <span className="text-[11px] text-slate-500">
                      انتقال وجه به شماره کارت رسمی فروشگاه و تأیید توسط حسابداری
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card_to_card'}
                  onChange={() => setPaymentMethod('card_to_card')}
                  className="w-4 h-4 text-indigo-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Invoice & Place Order (col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>خلاصه فاکتور پرداخت</span>
              <span className="text-xs text-slate-400 font-normal">
                {toPersianDigits(cartTotalCount)} قلم کالا
              </span>
            </h3>

            {/* Items mini list */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 divide-y divide-slate-100 pr-1">
              {cart.map((item) => {
                const p = products.find((pr) => pr.id === item.productId);
                if (!p) return null;
                let price = p.salePrice;
                if (item.variantId) {
                  const vr = p.variants.find((v) => v.id === item.variantId);
                  if (vr) price = vr.price;
                }
                return (
                  <div key={`${item.productId}-${item.variantId}`} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[200px]">
                      <span className="w-5 text-center font-bold text-slate-400 tabular-nums">
                        {toPersianDigits(item.quantity)}×
                      </span>
                      <span className="truncate text-slate-700">{p.title}</span>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums shrink-0">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>جمع اقلام:</span>
                <span className="font-bold text-slate-800 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>هزینه ارسال:</span>
                <span className="font-bold tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600">رایگان</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">مبلغ کل قابل پرداخت:</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleFinalOrderSubmit}
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>در حال انتقال به درگاه بانکی...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>تأیید و پرداخت نهایی ({formatPrice(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              با ثبت سفارش، قوانین و مقررات حفظ حریم خصوصی و خرید از ePasazh را می‌پذیرید.
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">افزودن نشانی جدید تحویل سفارش</h3>
              <button onClick={() => setIsAddAddressModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">استان:</label>
                  <input
                    type="text"
                    required
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شهر:</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">نشانی پستی دقیق:</label>
                <textarea
                  required
                  rows={2}
                  placeholder="خیابان اصلی، کوچه، بن‌بست..."
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">پلاک:</label>
                  <input
                    type="text"
                    required
                    placeholder="۱۲"
                    value={newPlaque}
                    onChange={(e) => setNewPlaque(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">واحد:</label>
                  <input
                    type="text"
                    placeholder="واحد ۴"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">کد پستی (۱۰ رقم):</label>
                  <input
                    type="text"
                    required
                    placeholder="1987654321"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نام تحویل‌گیرنده:</label>
                  <input
                    type="text"
                    required
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تلفن همراه تحویل‌گیرنده:</label>
                  <input
                    type="tel"
                    required
                    placeholder="09121234567"
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  ذخیره نشانی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
