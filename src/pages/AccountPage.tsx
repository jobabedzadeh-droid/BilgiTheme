import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import {
  formatPrice,
  toPersianDigits,
  formatJalaliDate,
  formatJalaliDateTime,
  getOrderStatusBadge,
  getTierName,
} from '../utils/persian';
import { SupportTicket } from '../types';
import {
  User,
  Package,
  MapPin,
  Wallet,
  Award,
  LifeBuoy,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  Send,
  X,
  CreditCard,
} from 'lucide-react';

interface AccountPageProps {
  initialTab?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'overview' }) => {
  const {
    currentUser,
    orders,
    addresses,
    walletTransactions,
    loyaltyTransactions,
    supportTickets,
    loginAsCustomer,
    logout,
    updateUserProfile,
    addAddress,
    deleteAddress,
    cancelOrder,
    requestOrderReturn,
    topUpWallet,
    convertPointsToWallet,
    createTicket,
    replyToTicket,
    showNotification,
  } = useStore();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile edit state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [nationalCode, setNationalCode] = useState(currentUser?.nationalCode || '');

  // Wallet topup modal
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500000);

  // Convert points modal
  const [isConvertPointsModalOpen, setIsConvertPointsModalOpen] = useState(false);
  const [pointsToConvert, setPointsToConvert] = useState<number>(100);

  // New ticket modal
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDept, setTicketDept] = useState<SupportTicket['department']>('orders');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [ticketMessage, setTicketMessage] = useState('');

  // Active ticket conversation
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Cancel order modal
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('تغییر نظر خریدار');

  // Return order modal
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('مغایرت کالا با مشخصات درج‌شده در سایت');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-slate-200/90 shadow-xs my-10">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">ورود به حساب کاربری</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          برای دسترسی به سفارش‌ها، کیف پول و باشگاه مشتریان، لطفاً وارد حساب خود شوید.
        </p>
        <button
          onClick={loginAsCustomer}
          className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
        >
          ورود سریع با حساب نمونه (محمدرضا رضایی)
        </button>
      </div>
    );
  }

  // Filter orders for this user
  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ fullName, email, nationalCode });
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    topUpWallet(topUpAmount);
    setIsTopUpModalOpen(false);
  };

  const handleConvertPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = convertPointsToWallet(pointsToConvert);
    if (success) {
      setIsConvertPointsModalOpen(false);
    }
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showNotification('error', 'لطفاً موضوع و متن تیکت را کامل فرمایید');
      return;
    }
    createTicket(ticketSubject, ticketDept, ticketPriority, ticketMessage);
    setIsNewTicketModalOpen(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyMessage.trim()) return;
    replyToTicket(ticketId, replyMessage.trim());
    setReplyMessage('');
  };

  const handleConfirmCancelOrder = () => {
    if (!cancellingOrderId) return;
    cancelOrder(cancellingOrderId, cancelReason);
    setCancellingOrderId(null);
  };

  const handleConfirmReturnOrder = () => {
    if (!returningOrderId) return;
    requestOrderReturn(returningOrderId, returnReason);
    setReturningOrderId(null);
  };

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="space-y-8">
      {/* 1. Header with Avatar & Tier */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-2xl flex items-center justify-center border-2 border-indigo-200">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">{currentUser.fullName}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">{toPersianDigits(currentUser.phone)}</span>
              <span>·</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                {getTierName(currentUser.clubTier)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">موجودی کیف پول:</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">
              {formatPrice(currentUser.walletBalance)}
            </span>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
          >
            افزایش اعتبار
          </button>
        </div>
      </div>

      {/* 2. Main Tabbed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (col-span-3) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-1 text-xs font-bold sticky top-24">
          {[
            { id: 'overview', label: 'داشبورد خلاصه', icon: User },
            { id: 'orders', label: 'سفارش‌های من', icon: Package, badge: userOrders.length },
            { id: 'addresses', label: 'مدیریت نشانی‌ها', icon: MapPin },
            { id: 'wallet', label: 'کیف پول و گردش حساب', icon: Wallet },
            { id: 'club', label: 'باشگاه مشتریان و امتیازها', icon: Award },
            { id: 'tickets', label: 'تیکت‌های پشتیبانی', icon: LifeBuoy, badge: supportTickets.length },
            { id: 'settings', label: 'تنظیمات مشخصات فردی', icon: Edit2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedTicketId(null);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors text-right ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {toPersianDigits(tab.badge)}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-colors text-right"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </aside>

        {/* Content Panel (col-span-9) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-right">
                  <span className="text-xs text-slate-400 block mb-1">کل سفارش‌ها</span>
                  <span className="text-xl font-black text-slate-900 tabular-nums">
                    {toPersianDigits(userOrders.length)}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-right">
                  <span className="text-xs text-slate-400 block mb-1">امتیازهای فعال</span>
                  <span className="text-xl font-black text-amber-600 tabular-nums">
                    {toPersianDigits(currentUser.loyaltyPoints)}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-right">
                  <span className="text-xs text-slate-400 block mb-1">نشانی‌های ثبت‌شده</span>
                  <span className="text-xl font-black text-indigo-600 tabular-nums">
                    {toPersianDigits(addresses.length)}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-right">
                  <span className="text-xs text-slate-400 block mb-1">تیکت‌های پاسخ‌داده</span>
                  <span className="text-xl font-black text-emerald-600 tabular-nums">
                    {toPersianDigits(supportTickets.length)}
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">آخرین سفارش‌های شما</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    مشاهده تمام سفارش‌ها
                  </button>
                </div>

                {userOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">سفارشی ثبت نشده است.</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.slice(0, 2).map((order) => {
                      const badge = getOrderStatusBadge(order.status);
                      return (
                        <div
                          key={order.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              {formatJalaliDate(order.createdAt)} · {toPersianDigits(order.items.length)} قلم کالا
                            </span>
                          </div>

                          <div className="text-left w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between">
                            <span className="font-bold text-slate-900 tabular-nums text-sm">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <button
                              onClick={() => navigate(`/order-success/${order.id}`)}
                              className="text-xs text-indigo-600 font-bold hover:underline"
                            >
                              مشاهده فاکتور
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Orders List with Cancel & Return Actions */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">تاریخچه سفارش‌های شما</h2>
              {userOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">تاکنون سفارشی از فروشگاه ثبت نکرده‌اید.</p>
                </div>
              ) : (
                userOrders.map((order) => {
                  const badge = getOrderStatusBadge(order.status);
                  const canCancel = order.status === 'pending_payment' || order.status === 'paid';
                  const canReturn = order.status === 'delivered';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-indigo-600" />
                          <div>
                            <span className="font-mono font-black text-sm text-slate-900">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs text-slate-400 block">
                              ثبت شده در: {formatJalaliDateTime(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                          >
                            <img
                              src={item.image}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-contain bg-white rounded p-1"
                            />
                            <div className="truncate flex-1">
                              <h5 className="font-bold text-slate-800 truncate">{item.title}</h5>
                              <span className="text-[11px] text-slate-500">
                                {toPersianDigits(item.quantity)} عدد · {formatPrice(item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="text-slate-500 text-[11px]">
                          ارسال با: <strong>{order.shippingMethod.name}</strong>
                          {order.trackingCode && ` (کد رهگیری: ${order.trackingCode})`}
                        </div>

                        <div className="flex items-center gap-2">
                          {canCancel && (
                            <button
                              onClick={() => setCancellingOrderId(order.id)}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                            >
                              لغو سفارش
                            </button>
                          )}
                          {canReturn && (
                            <button
                              onClick={() => setReturningOrderId(order.id)}
                              className="px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 font-bold transition-colors"
                            >
                              درخواست مرجوعی ۷ روزه
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/order-success/${order.id}`)}
                            className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors"
                          >
                            مشاهده فاکتور
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">نشانی‌های ثبت‌شده</h2>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  افزودن نشانی جدید
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                          نشانی پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {addr.province}، {addr.city} - {addr.address}
                      {addr.plaque && `، پلاک ${toPersianDigits(addr.plaque)}`}
                      {addr.unit && `، ${addr.unit}`}
                    </p>
                    <div className="text-slate-500 text-[11px] space-y-0.5">
                      <div>کد پستی: {toPersianDigits(addr.postalCode)}</div>
                      <div>گیرنده: {addr.recipientName} ({toPersianDigits(addr.recipientPhone)})</div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Wallet */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-l from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs text-indigo-300 block mb-1">موجودی نقدی کیف پول:</span>
                  <div className="text-2xl sm:text-3xl font-black tabular-nums">
                    {formatPrice(currentUser.walletBalance)}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    قابل استفاده در خرید آنی تمامی محصولات بدون نیاز به اتصال به درگاه بانکی.
                  </p>
                </div>
                <button
                  onClick={() => setIsTopUpModalOpen(true)}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-colors shadow-lg"
                >
                  شارژ آنلاین کیف پول
                </button>
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  دفتر کل گردش حساب و تراکنش‌های کیف پول
                </h3>
                <div className="space-y-3">
                  {walletTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{tx.description}</span>
                        <div className="text-[11px] text-slate-400 space-x-2 space-x-reverse font-mono">
                          <span>شناسه: {tx.refId}</span>
                          <span>·</span>
                          <span>{formatJalaliDate(tx.createdAt)}</span>
                        </div>
                      </div>

                      <div className="text-left font-bold tabular-nums">
                        {tx.type === 'deposit' || tx.type === 'cashback_refund' ? (
                          <span className="text-emerald-600">+ {formatPrice(tx.amount)}</span>
                        ) : (
                          <span className="text-rose-600">- {formatPrice(tx.amount)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Loyalty Club */}
          {activeTab === 'club' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-l from-amber-600 via-amber-700 to-yellow-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs text-amber-200 block mb-1">امتیازهای فعال باشگاه:</span>
                  <div className="text-2xl sm:text-3xl font-black tabular-nums">
                    {toPersianDigits(currentUser.loyaltyPoints)} امتیاز
                  </div>
                  <span className="inline-block mt-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold">
                    سطح فعلی: {getTierName(currentUser.clubTier)}
                  </span>
                </div>
                <button
                  onClick={() => setIsConvertPointsModalOpen(true)}
                  className="px-5 py-3 bg-white text-amber-900 hover:bg-amber-50 rounded-2xl text-xs font-bold transition-colors shadow-lg"
                >
                  تبدیل امتیاز به اعتبار خرید
                </button>
              </div>

              {/* Loyalty History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  تاریخچه امتیازات کسب‌شده
                </h3>
                <div className="space-y-3">
                  {loyaltyTransactions.map((lt) => (
                    <div
                      key={lt.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{lt.description}</span>
                        <span className="text-[11px] text-slate-400">
                          {formatJalaliDate(lt.createdAt)}
                        </span>
                      </div>
                      <span className="font-bold text-amber-600 tabular-nums">
                        {lt.points > 0 ? `+${toPersianDigits(lt.points)}` : toPersianDigits(lt.points)} امتیاز
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Support Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">تیکت‌های پشتیبانی</h2>
                <button
                  onClick={() => setIsNewTicketModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  ارسال تیکت جدید
                </button>
              </div>

              {selectedTicket ? (
                /* Ticket conversation view */
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="text-xs text-indigo-600 font-bold mb-1 hover:underline"
                      >
                        ← بازگشت به فهرست تیکت‌ها
                      </button>
                      <h3 className="text-sm font-bold text-slate-900">
                        {selectedTicket.subject} ({selectedTicket.ticketNumber})
                      </h3>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                      {selectedTicket.status === 'resolved' ? 'پاسخ داده شده' : 'در حال بررسی'}
                    </span>
                  </div>

                  {/* Messages Thread */}
                  <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl text-xs max-w-xl space-y-1 ${
                          m.sender === 'user'
                            ? 'mr-auto bg-slate-100 text-slate-800'
                            : 'ml-auto bg-indigo-50 text-indigo-950 border border-indigo-100'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] text-slate-500">
                          <span>{m.senderName}</span>
                          <span>{formatJalaliDateTime(m.timestamp)}</span>
                        </div>
                        <p className="leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="پاسخ خود را بنویسید..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply(selectedTicket.id)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSendReply(selectedTicket.id)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                    >
                      ارسال پاسخ
                    </button>
                  </div>
                </div>
              ) : (
                /* Tickets List */
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-400 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">
                            {ticket.ticketNumber}
                          </span>
                          <h4 className="font-bold text-slate-900">{ticket.subject}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 block">
                          ثبت در: {formatJalaliDate(ticket.createdAt)} · آخرین پیام:{' '}
                          {ticket.messages[ticket.messages.length - 1]?.senderName}
                        </span>
                      </div>

                      <span className="text-xs text-indigo-600 font-bold hover:underline">
                        مشاهده گفتگو ({toPersianDigits(ticket.messages.length)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Profile Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                مشخصات حساب کاربری
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره تلفن همراه (غیرقابل تغییر):</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.phone}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl p-2.5 font-mono dir-ltr text-right cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">آدرس ایمیل:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">کد ملی (جهت صدور فاکتور رسمی):</label>
                  <input
                    type="text"
                    placeholder="0012345678"
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 dir-ltr text-right font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors"
                >
                  ذخیره تغییرات مشخصات
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Top Up Wallet Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">افزایش اعتبار کیف پول</h3>
              <button onClick={() => setIsTopUpModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">مبلغ مورد نظر (تومان):</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[200000, 500000, 1000000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-2 rounded-xl border text-center font-bold ${
                        topUpAmount === amt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {formatPrice(amt)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="50000"
                  step="10000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-bold tabular-nums"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  پرداخت و شارژ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Points Modal */}
      {isConvertPointsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">تبدیل امتیاز باشگاه به اعتبار</h3>
              <button onClick={() => setIsConvertPointsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleConvertPointsSubmit} className="space-y-4 text-xs">
              <p className="text-slate-500 leading-relaxed">
                هر ۱ امتیاز باشگاه معادل ۱,۰۰۰ تومان اعتبار نقدی در کیف پول شما خواهد بود.
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  تعداد امتیاز برای تبدیل (موجود: {toPersianDigits(currentUser.loyaltyPoints)}):
                </label>
                <input
                  type="number"
                  min="100"
                  max={currentUser.loyaltyPoints}
                  step="50"
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold"
                />
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  معادل ارزش نقدی: {formatPrice(pointsToConvert * 1000)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConvertPointsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors"
                >
                  تبدیل به کیف پول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">ارسال تیکت پشتیبانی جدید</h3>
              <button onClick={() => setIsNewTicketModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">موضوع تیکت:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: مغایرت در رنگ کالای تحویل‌شده"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">دپارتمان مربوطه:</label>
                  <select
                    value={ticketDept}
                    onChange={(e) => setTicketDept(e.target.value as SupportTicket['department'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="orders">پیگیری سفارشات و ارسال</option>
                    <option value="returns">مرجوعی و بازگشت وجه</option>
                    <option value="warranty">گارانتی و خدمات پس از فروش</option>
                    <option value="finance">امور مالی و فاکتور</option>
                    <option value="general">سایر موارد عمومی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">اولویت رسیدگی:</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">شرح دقیق درخواست یا مشکل:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="جزئیات درخواست خود را با ذکر شماره سفارش در صورت لزوم شرح دهید..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  ارسال تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900">لغو سفارش</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              با لغو سفارش، مبلغ پرداخت شده بلافاصله به کیف پول حساب شما بازگردانده می‌شود.
            </p>
            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">علت لغو:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
              >
                <option value="تغییر نظر خریدار">تغییر نظر خریدار</option>
                <option value="نیاز به تغییر آدرس تحویل">نیاز به تغییر آدرس تحویل</option>
                <option value="خرید اشتباه کالا">خرید اشتباه کالا</option>
                <option value="سایر موارد">سایر موارد</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2 text-xs">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                تأیید لغو سفارش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returningOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900">درخواست مرجوعی ۷ روزه</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              کارشناسان گارانتی ePasazh پس از بررسی علت، جهت دریافت کالا با شما تماس خواهند گرفت.
            </p>
            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">دلیل مرجوعی:</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
              >
                <option value="مغایرت کالا با مشخصات درج‌شده در سایت">مغایرت کالا با مشخصات درج‌شده در سایت</option>
                <option value="ایراد یا آسیب فیزیکی هنگام تحویل">ایراد یا آسیب فیزیکی هنگام تحویل</option>
                <option value="عدم رضایت از کیفیت">عدم رضایت از کیفیت</option>
                <option value="سایز یا رنگ نامناسب">سایز یا رنگ نامناسب</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2 text-xs">
              <button
                onClick={() => setReturningOrderId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmReturnOrder}
                className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
              >
                ثبت مرجوعی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
