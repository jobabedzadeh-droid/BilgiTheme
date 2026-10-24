import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice, toPersianDigits, formatJalaliDateTime, getOrderStatusBadge } from '../utils/persian';
import { Product, OrderStatus, DiscountCode } from '../types';
import { GatewayConfigModal } from '../components/common/GatewayConfigModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  LifeBuoy,
  Settings,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  Search,
  Filter,
  DollarSign,
  Users,
  Eye,
  X,
  CreditCard,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    discountCodes,
    supportTickets,
    storeSettings,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatusByAdmin,
    createDiscountCode,
    replyToTicket,
    updateStoreSettings,
    showNotification,
  } = useStore();
  const { navigate } = useRouter();

  // Navigation tab in admin
  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'discounts' | 'tickets' | 'settings'>('kpi');

  // Gateway documentation modal
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

  // Product Add / Edit modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState(categories[0]?.id || 'digital');
  const [pSku, setPSku] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(1000000);
  const [pSalePrice, setPSalePrice] = useState<number>(900000);
  const [pStock, setPStock] = useState<number>(10);
  const [pLowStock, setPLowStock] = useState<number>(3);
  const [pImage, setPImage] = useState('');
  const [pWarranty, setPWarranty] = useState('۱۸ ماه گارانتی رسمی');
  const [pDesc, setPDesc] = useState('');

  // Order status update modal
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('shipped');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [staffNoteInput, setStaffNoteInput] = useState('');

  // Discount create modal
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [dCode, setDCode] = useState('');
  const [dType, setDType] = useState<'percent' | 'fixed'>('percent');
  const [dValue, setDValue] = useState<number>(10);
  const [dMinAmount, setDMinAmount] = useState<number>(500000);
  const [dMaxDiscount, setDMaxDiscount] = useState<number>(200000);

  // Ticket reply in admin
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [staffReplyText, setStaffReplyText] = useState('');

  // Order filter in admin
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Calculations for KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'processing' || o.status === 'paid' || o.status === 'pending_payment'
  );

  const lowStockProducts = products.filter((p) => p.inStock && p.stockQuantity <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => !p.inStock || p.stockQuantity <= 0);

  // Handle open add product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setPTitle('');
    setPBrand('');
    setPCategory(categories[0]?.id || 'digital');
    setPSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setPOriginalPrice(1500000);
    setPSalePrice(1350000);
    setPStock(15);
    setPLowStock(3);
    setPImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
    setPWarranty('۱۸ ماه گارانتی رسمی پاساژ');
    setPDesc('توضیحات و مشخصات کالای جدید...');
    setIsProductModalOpen(true);
  };

  // Handle open edit product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPTitle(prod.title);
    setPBrand(prod.brand);
    setPCategory(prod.categoryId);
    setPSku(prod.sku);
    setPOriginalPrice(prod.originalPrice);
    setPSalePrice(prod.salePrice);
    setPStock(prod.stockQuantity);
    setPLowStock(prod.lowStockThreshold);
    setPImage(prod.images[0] || '');
    setPWarranty(prod.warranty);
    setPDesc(prod.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === pCategory);
    const discountPercent =
      pOriginalPrice > pSalePrice
        ? Math.round(((pOriginalPrice - pSalePrice) / pOriginalPrice) * 100)
        : 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: pTitle,
        brand: pBrand,
        categoryId: pCategory,
        categoryName: cat ? cat.name : 'عمومی',
        sku: pSku,
        originalPrice: pOriginalPrice,
        salePrice: pSalePrice,
        discountPercent,
        stockQuantity: pStock,
        inStock: pStock > 0,
        lowStockThreshold: pLowStock,
        images: [pImage],
        warranty: pPWarrantyClean(),
        description: pDesc,
      });
    } else {
      const slug = pTitle.toLowerCase().trim().replace(/\s+/g, '-').slice(0, 40);
      addProduct({
        slug: `${slug}-${Date.now()}`,
        title: pTitle,
        sku: pSku,
        categoryId: pCategory,
        categoryName: cat ? cat.name : 'عمومی',
        brand: pBrand,
        rating: 5.0,
        reviewCount: 0,
        images: [pImage],
        originalPrice: pOriginalPrice,
        salePrice: pSalePrice,
        discountPercent,
        inStock: pStock > 0,
        stockQuantity: pStock,
        lowStockThreshold: pLowStock,
        isFeatured: false,
        isSpecialOffer: false,
        isBestSeller: false,
        isNew: true,
        warranty: pPWarrantyClean(),
        shippingDays: 1,
        shortDescription: pTitle,
        description: pDesc,
        specs: [{ key: 'برند سازنده', value: pBrand }],
        variants: [],
        tags: [pBrand, cat?.name || 'کالا'],
      });
    }
    setIsProductModalOpen(false);
  };

  const pPWarrantyClean = () => pWarranty || 'ضمانت اصالت و سلامت فیزیکی';

  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;
    updateOrderStatusByAdmin(selectedOrderForStatus, newStatus, trackingCodeInput, staffNoteInput);
    setSelectedOrderForStatus(null);
    setTrackingCodeInput('');
    setStaffNoteInput('');
  };

  const handleCreateDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dCode.trim()) return;
    const newCoupon: DiscountCode = {
      code: dCode.trim().toUpperCase(),
      type: dType,
      value: dValue,
      minOrderAmount: dMinAmount,
      maxDiscount: dType === 'percent' ? dMaxDiscount : undefined,
      expiresAt: '2027-01-01T23:59:59Z',
      usageCount: 0,
      maxUsage: 100,
      isActive: true,
      description: `${dType === 'percent' ? `${toPersianDigits(dValue)}٪` : formatPrice(dValue)} تخفیف ویژه فروشگاه`,
    };
    createDiscountCode(newCoupon);
    setIsDiscountModalOpen(false);
    setDCode('');
  };

  const handleStaffReply = (ticketId: string) => {
    if (!staffReplyText.trim()) return;
    replyToTicket(ticketId, staffReplyText.trim(), true);
    setReplyTicketId(null);
    setStaffReplyText('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    return true;
  });

  const filteredCatalogProducts = products.filter((p) => {
    if (productSearch.trim()) {
      return (
        p.title.includes(productSearch.trim()) ||
        p.brand.includes(productSearch.trim()) ||
        p.sku.includes(productSearch.trim())
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/30 text-indigo-300 font-bold px-2.5 py-0.5 rounded-lg border border-indigo-400/30">
              سامانه متمرکز فروشگاه تک‌فروشنده
            </span>
            <span className="text-xs text-slate-400">نسخه ۱.۰</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            پنل فرماندهی و مدیریت مرکزی ePasazh
          </h1>
          <p className="text-xs text-slate-400">
            مدیریت کاتالوگ، انبارداری متمرکز، پردازش سفارش‌ها و تنظیمات اختصاصی
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsGatewayModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            <span>راهنمای اتصال درگاه و Firebase</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            مشاهده ویترین فروشگاه
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'kpi', label: 'داشبورد و آمار تحلیلی', icon: LayoutDashboard },
          { id: 'products', label: 'مدیریت محصولات و قیمت‌ها', icon: Package, badge: products.length },
          { id: 'orders', label: 'مدیریت و ارسال سفارش‌ها', icon: ShoppingBag, badge: pendingOrders.length },
          { id: 'discounts', label: 'کدهای تخفیف و جشنواره‌ها', icon: Tag },
          { id: 'tickets', label: 'تیکت‌های مشتریان (CRM)', icon: LifeBuoy, badge: supportTickets.length },
          { id: 'settings', label: 'تنظیمات کلی فروشگاه', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {toPersianDigits(tab.badge)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI & Overview */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs text-right space-y-1">
              <span className="text-xs text-slate-400 block font-semibold">مجموع فروش محقق‌شده</span>
              <div className="text-xl font-black text-slate-900 tabular-nums">
                {formatPrice(totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> از {toPersianDigits(orders.length)} تراکنش موفق
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs text-right space-y-1">
              <span className="text-xs text-slate-400 block font-semibold">سفارش‌های در انتظار ارسال</span>
              <div className="text-xl font-black text-amber-600 tabular-nums">
                {toPersianDigits(pendingOrders.length)} سفارش
              </div>
              <span className="text-[11px] text-slate-500">نیاز به بسته‌بندی و تحویل به پست</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs text-right space-y-1">
              <span className="text-xs text-slate-400 block font-semibold">تعداد کل کالاها در کاتالوگ</span>
              <div className="text-xl font-black text-indigo-600 tabular-nums">
                {toPersianDigits(products.length)} محصول
              </div>
              <span className="text-[11px] text-slate-500">در {toPersianDigits(categories.length)} گروه کالایی</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs text-right space-y-1">
              <span className="text-xs text-slate-400 block font-semibold">هشدار کمبود موجودی انبار</span>
              <div className="text-xl font-black text-rose-600 tabular-nums">
                {toPersianDigits(lowStockProducts.length + outOfStockProducts.length)} قلم
              </div>
              <span className="text-[11px] text-rose-500 font-medium">نیاز به ثبت سفارش شارژ انبار</span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>اقلام کم‌موجود یا ناموجود نیازمند اقدام فوری انبار:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-2xl border border-amber-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="truncate flex-1">
                      <span className="font-bold text-slate-800 block truncate">{p.title}</span>
                      <span className="text-slate-400 text-[11px]">کد SKU: {p.sku}</span>
                    </div>
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-lg ${
                        p.stockQuantity <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.stockQuantity <= 0 ? 'ناموجود' : `${toPersianDigits(p.stockQuantity)} عدد`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">آخرین سفارش‌های ثبت‌شده</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                مشاهده همه
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-400 font-medium pb-2">
                    <th className="py-2">شماره سفارش</th>
                    <th className="py-2">نام مشتری</th>
                    <th className="py-2">مبلغ فاکتور</th>
                    <th className="py-2">وضعیت</th>
                    <th className="py-2">تاریخ</th>
                    <th className="py-2">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => {
                    const badge = getOrderStatusBadge(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-slate-800">{ord.orderNumber}</td>
                        <td className="py-3 text-slate-700">{ord.customerName}</td>
                        <td className="py-3 font-bold tabular-nums text-slate-900">
                          {formatPrice(ord.totalAmount)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-[11px]">
                          {formatJalaliDateTime(ord.createdAt)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedOrderForStatus(ord.id);
                              setNewStatus(ord.status);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                          >
                            مدیریت وضعیت
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products Catalog Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="جستجو بر اساس نام کالا، برند یا SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن محصول جدید به کاتالوگ</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs divide-y divide-slate-100">
                <thead className="bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="p-4">کالا و مشخصات</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">قیمت فروش</th>
                    <th className="p-4">موجودی انبار</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCatalogProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <h4 className="font-bold text-slate-900 truncate">{p.title}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.brand} · SKU: {p.sku}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{p.categoryName}</td>
                      <td className="p-4 font-bold tabular-nums text-slate-900">
                        {formatPrice(p.salePrice)}
                        {p.discountPercent > 0 && (
                          <span className="text-[10px] text-rose-600 block">
                            {toPersianDigits(p.discountPercent)}٪ تخفیف
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold tabular-nums text-slate-800">
                          {toPersianDigits(p.stockQuantity)} عدد
                        </span>
                      </td>
                      <td className="p-4">
                        {p.inStock ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                            فعال / موجود
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-bold">
                            ناموجود
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Fulfillment Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">فیلتر وضعیت:</span>
            {[
              { id: 'all', label: 'همه سفارش‌ها' },
              { id: 'pending_payment', label: 'در انتظار پرداخت' },
              { id: 'paid', label: 'پرداخت شده' },
              { id: 'processing', label: 'در حال آماده‌سازی' },
              { id: 'shipped', label: 'ارسال شده' },
              { id: 'delivered', label: 'تحویل شده' },
              { id: 'returned', label: 'مرجوعی' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
                  orderStatusFilter === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const badge = getOrderStatusBadge(ord.status);
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">
                        خریدار: <strong>{ord.customerName}</strong> ({toPersianDigits(ord.customerPhone)})
                      </span>
                      <span className="font-black text-slate-900 tabular-nums text-sm">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="text-slate-600 bg-slate-50 p-3 rounded-xl">
                    مقصد: {ord.shippingAddress.province}، {ord.shippingAddress.city} - {ord.shippingAddress.address}
                  </div>

                  {/* Items snapshot */}
                  <div className="flex flex-wrap gap-2">
                    {ord.items.map((it, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">
                        {it.title} ({toPersianDigits(it.quantity)} عدد)
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-slate-400 text-[11px]">
                      {ord.trackingCode && `کد رهگیری پستی: ${ord.trackingCode}`}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrderForStatus(ord.id);
                        setNewStatus(ord.status);
                        setTrackingCodeInput(ord.trackingCode || '');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
                    >
                      تغییر وضعیت و ثبت کد رهگیری
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Discounts Management */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">مدیریت کوپن‌ها و کدهای تخفیف</h2>
            <button
              onClick={() => setIsDiscountModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4" />
              <span>تعریف کد تخفیف جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {discountCodes.map((d) => (
              <div
                key={d.code}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {d.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">فعال</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{d.description}</p>
                <div className="text-slate-500 text-[11px] pt-2 border-t border-slate-100 space-y-1">
                  <div>تعداد دفعات استفاده: {toPersianDigits(d.usageCount)} از {toPersianDigits(d.maxUsage)}</div>
                  <div>حداقل سفارش: {formatPrice(d.minOrderAmount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Support Tickets CRM */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">تیکت‌های مشتریان و رسیدگی پشتیبانی</h2>
          {supportTickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 text-sm">{t.subject}</span>
                  <span className="text-slate-400 block mt-0.5">
                    توسط {t.userName} ({toPersianDigits(t.userPhone)})
                  </span>
                </div>
                <span className="font-mono text-slate-400">{t.ticketNumber}</span>
              </div>

              {/* Chat thread */}
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 p-3 rounded-2xl">
                {t.messages.map((m) => (
                  <div key={m.id} className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-700">{m.senderName}:</span>
                    <p className="text-slate-600">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Staff quick reply */}
              {replyTicketId === t.id ? (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="پاسخ رسمی پشتیبانی را وارد کنید..."
                    value={staffReplyText}
                    onChange={(e) => setStaffReplyText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplyTicketId(null)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => handleStaffReply(t.id)}
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold"
                    >
                      ارسال پاسخ به خریدار
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setReplyTicketId(t.id)}
                    className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    پاسخ به تیکت
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-xs max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            تنظیمات عمومی فروشگاه مرکزی
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">نام فروشگاه:</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">حداقل مبلغ خرید برای ارسال رایگان (تومان):</label>
              <input
                type="number"
                value={storeSettings.freeShippingThreshold}
                onChange={(e) => updateStoreSettings({ freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none tabular-nums font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">تلفن پشتیبانی مرکزی:</label>
              <input
                type="text"
                value={storeSettings.storePhone}
                onChange={(e) => updateStoreSettings({ storePhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">آدرس انبار و دفتر مرکزی:</label>
              <textarea
                rows={2}
                value={storeSettings.storeAddress}
                onChange={(e) => updateStoreSettings({ storeAddress: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProductId ? 'ویرایش اطلاعات کالا' : 'افزودن محصول جدید به کاتالوگ'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">عنوان کالا:</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">برند سازنده:</label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">دسته‌بندی:</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">قیمت اصلی (تومان):</label>
                  <input
                    type="number"
                    required
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">قیمت فروش با تخفیف:</label>
                  <input
                    type="number"
                    required
                    value={pSalePrice}
                    onChange={(e) => setPSalePrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">موجودی انبار:</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">آدرس تصویر کالا (URL):</label>
                <input
                  type="url"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">توضیحات و نقد محصول:</label>
                <textarea
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
                >
                  ذخیره محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">بروزرسانی وضعیت سفارش</h3>
            <form onSubmit={handleUpdateOrderStatus} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">وضعیت جدید:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="pending_payment">در انتظار پرداخت</option>
                  <option value="paid">پرداخت شده</option>
                  <option value="processing">در حال آماده‌سازی و پردازش در انبار</option>
                  <option value="shipped">ارسال شده (تحویل به پست/پیک)</option>
                  <option value="delivered">تحویل شده به مشتری</option>
                  <option value="cancelled">لغو شده</option>
                  <option value="returned">مرجوع شده</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">کد رهگیری پستی مرسوله:</label>
                <input
                  type="text"
                  placeholder="مثلاً: 249810294810294"
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">یادداشت داخلی اپراتور:</label>
                <input
                  type="text"
                  placeholder="توضیحاتی برای ثبت در لاگ سفارش..."
                  value={staffNoteInput}
                  onChange={(e) => setStaffNoteInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-slate-900 text-white rounded-xl font-bold"
                >
                  ثبت تغییر وضعیت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">تعریف کد تخفیف جدید</h3>
            <form onSubmit={handleCreateDiscountSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">کد تخفیف (لاتین):</label>
                <input
                  type="text"
                  required
                  placeholder="SUMMER20"
                  value={dCode}
                  onChange={(e) => setDCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع تخفیف:</label>
                  <select
                    value={dType}
                    onChange={(e) => setDType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                  >
                    <option value="percent">درصدی (٪)</option>
                    <option value="fixed">مبلغ ثابت (تومان)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مقدار تخفیف:</label>
                  <input
                    type="number"
                    required
                    value={dValue}
                    onChange={(e) => setDValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">حداقل مبلغ سفارش (تومان):</label>
                <input
                  type="number"
                  value={dMinAmount}
                  onChange={(e) => setDMinAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 tabular-nums"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  ایجاد کوپن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gateway & Firebase Configuration Guide Modal */}
      <GatewayConfigModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
      />
    </div>
  );
};
