import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice, toPersianDigits, normalizePersianText } from '../../utils/persian';
import { CartDrawer } from '../common/CartDrawer';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Phone,
  Truck,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Activity,
  BookOpen,
  ArrowLeft,
  SlidersHorizontal,
  Package,
  Wallet,
  Award,
  LifeBuoy,
  LogOut,
  Settings,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { navigate, currentPath } = useRouter();
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    wishlist,
    comparison,
    currentUser,
    categories,
    products,
    storeSettings,
    loginAsCustomer,
    loginAsAdmin,
    logout,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Filter products for instant auto-suggest
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = normalizePersianText(searchQuery);
          return (
            normalizePersianText(p.title).includes(q) ||
            normalizePersianText(p.brand).includes(q) ||
            normalizePersianText(p.categoryName).includes(q) ||
            (p.englishTitle && p.englishTitle.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4 text-rose-500" />;
      case 'Home':
        return <Home className="w-4 h-4 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-violet-500" />;
      default:
        return <Package className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Truck className="w-3.5 h-3.5" />
              ارسال رایگان سفارش‌های بالای {formatPrice(storeSettings.freeShippingThreshold)}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              ضمانت ۱۰۰٪ اصالت کالا و بازگشت ۷ روزه
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="tel:02188990011"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>پشتیبانی: {toPersianDigits(storeSettings.storePhone)}</span>
            </a>
            <button
              onClick={() => navigate('/track-order')}
              className="hover:text-white transition-colors font-medium text-slate-300"
            >
              پیگیری سفارش
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-[11px] bg-indigo-950 text-indigo-300 hover:text-white px-2 py-0.5 rounded border border-indigo-800 transition-colors"
            >
              پنل مدیریت فروشگاه
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Mobile menu hamburger & Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="منوی موبایل"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div
                onClick={() => navigate('/')}
                className="cursor-pointer flex items-center gap-2 select-none group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <span className="font-extrabold text-xl tracking-tighter text-indigo-400">eP</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tight text-slate-900 leading-tight">
                    ePasazh
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium -mt-0.5">
                    پاساژ اینترنتی اختصاصی
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Search Bar */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="جستجوی نام کالا، برند، مشخصات یا دسته‌بندی..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl pr-10 pl-16 py-2.5 border border-transparent focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white hover:bg-indigo-600 rounded-lg text-xs font-medium transition-colors"
                >
                  جستجو
                </button>
              </form>

              {/* Instant Search Dropdown Results */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 animate-fade-in">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5">
                    پیشنهادهای مرتبط با «{searchQuery}»:
                  </div>
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                          navigate(`/product/${prod.slug}`);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-contain bg-slate-100 p-1 rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">
                            {prod.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">{prod.brand}</span>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            {formatPrice(prod.salePrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 px-2 border-t border-slate-100 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold py-1 w-full"
                    >
                      مشاهده تمام نتایج جستجو ({toPersianDigits(searchResults.length)}+)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Comparison, Wishlist, User, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Comparison */}
              <button
                onClick={() => navigate('/compare')}
                title="مقایسه کالاها"
                className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {comparison.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {toPersianDigits(comparison.length)}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                title="علاقه‌مندی‌ها"
                className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {toPersianDigits(wishlist.length)}
                  </span>
                )}
              </button>

              {/* Customer Account Dropdown */}
              <div ref={userMenuRef} className="relative">
                {currentUser ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="hidden lg:flex flex-col text-right leading-tight">
                      <span className="text-xs font-bold text-slate-800">
                        {currentUser.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        اعتبار: {formatPrice(currentUser.walletBalance)}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                ) : (
                  <button
                    onClick={loginAsCustomer}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>ورود / ثبت‌نام</span>
                  </button>
                )}

                {/* Account Menu Popup */}
                {isUserMenuOpen && currentUser && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 animate-fade-in">
                    <div className="p-3 bg-slate-50 rounded-xl mb-2">
                      <div className="font-bold text-xs text-slate-900 mb-0.5">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">{currentUser.phone}</div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">سطح باشگاه:</span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {currentUser.clubTier === 'platinum' ? 'پلاتینیوم' : currentUser.clubTier === 'gold' ? 'طلایی' : 'نقره‌ای'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-right"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>داشبورد حساب کاربری</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account/orders');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-right"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>سفارش‌های من</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account/wallet');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-right"
                      >
                        <Wallet className="w-4 h-4 text-slate-500" />
                        <span>کیف پول و گردش حساب</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account/club');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-right"
                      >
                        <Award className="w-4 h-4 text-slate-500" />
                        <span>باشگاه مشتریان و امتیازها</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account/tickets');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-right"
                      >
                        <LifeBuoy className="w-4 h-4 text-slate-500" />
                        <span>تیکت‌های پشتیبانی</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-right"
                        >
                          <Settings className="w-4 h-4 text-indigo-600" />
                          <span>پنل مدیریت فروشگاه</span>
                        </button>
                      )}

                      <div className="pt-1 border-t border-slate-100">
                        {currentUser.role !== 'admin' ? (
                          <button
                            onClick={() => {
                              loginAsAdmin();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-right text-[11px] text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                          >
                            تغییر نقش به مدیر (Admin)
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              loginAsCustomer();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-right text-[11px] text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded transition-colors"
                          >
                            تغییر نقش به مشتری
                          </button>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>خروج از حساب</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-colors"
                aria-label="سبد خرید"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-indigo-700" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {toPersianDigits(cartTotalCount)}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-right leading-tight">
                  <span className="text-[10px] text-indigo-700 font-medium">سبد خرید</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {cartSubtotal > 0 ? formatPrice(cartSubtotal) : '۰ تومان'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="جستجو در تمام محصولات ePasazh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 text-xs rounded-xl pr-9 pl-4 py-2 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>

        {/* 3. Categories MegaMenu and Navigation Bar */}
        <div className="hidden lg:block border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-6">
              {/* MegaMenu Trigger */}
              <div
                className="relative py-3 cursor-pointer"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="flex items-center gap-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  <span>دسته‌بندی کالاها</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* MegaMenu Dropdown */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full right-0 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-6 grid grid-cols-3 gap-6 animate-fade-in">
                    {categories.map((cat) => (
                      <div key={cat.id} className="space-y-2">
                        <div
                          onClick={() => {
                            setIsMegaMenuOpen(false);
                            navigate(`/products?category=${cat.slug}`);
                          }}
                          className="flex items-center gap-2 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {getCategoryIcon(cat.iconName)}
                          <span>{cat.name}</span>
                        </div>
                        <ul className="space-y-1 text-slate-500 text-xs pr-6">
                          {cat.subCategories?.map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() => {
                                  setIsMegaMenuOpen(false);
                                  navigate(`/products?category=${cat.slug}&sub=${sub.slug}`);
                                }}
                                className="hover:text-indigo-600 transition-colors py-0.5 text-right w-full"
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-slate-200" />

              {/* Navigation Links */}
              <nav className="flex items-center gap-5 text-slate-600">
                <button
                  onClick={() => navigate('/')}
                  className={`py-3 hover:text-slate-900 transition-colors ${
                    currentPath === '/' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  صفحه اصلی
                </button>
                <button
                  onClick={() => navigate('/products?special=true')}
                  className="py-3 text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>شگفت‌انگیزها</span>
                </button>
                <button
                  onClick={() => navigate('/products?bestseller=true')}
                  className="py-3 hover:text-slate-900 transition-colors"
                >
                  پرفروش‌ترین کالاها
                </button>
                <button
                  onClick={() => navigate('/products?new=true')}
                  className="py-3 hover:text-slate-900 transition-colors"
                >
                  جدیدترین محصولات
                </button>
                <button
                  onClick={() => navigate('/blog')}
                  className="py-3 hover:text-slate-900 transition-colors"
                >
                  مجله و راهنمای خرید
                </button>
                <button
                  onClick={() => navigate('/faq')}
                  className="py-3 hover:text-slate-900 transition-colors"
                >
                  سؤالات متداول
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <button
                onClick={() => navigate('/contact')}
                className="hover:text-slate-800 transition-colors"
              >
                تماس با ما
              </button>
              <button
                onClick={() => navigate('/about')}
                className="hover:text-slate-800 transition-colors"
              >
                درباره ما
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-xs bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 font-black flex items-center justify-center text-sm">
                    eP
                  </div>
                  <span className="font-black text-slate-900">ePasazh</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile categories */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  دسته‌بندی‌های کاتالوگ
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate(`/products?category=${cat.slug}`);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-right text-xs font-semibold text-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.iconName)}
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {toPersianDigits(cat.itemCount)} کالا
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile links */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/products?special=true');
                  }}
                  className="w-full text-right p-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  تخفیف‌ها و پیشنهادهای شگفت‌انگیز
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/compare');
                  }}
                  className="w-full text-right p-2.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  مقایسه کالاها ({toPersianDigits(comparison.length)})
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/wishlist');
                  }}
                  className="w-full text-right p-2.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  لیست علاقه‌مندی‌ها ({toPersianDigits(wishlist.length)})
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/track-order');
                  }}
                  className="w-full text-right p-2.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  پیگیری وضعیت سفارش
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/blog');
                  }}
                  className="w-full text-right p-2.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  مجله تخصصی پاساژ
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full text-right p-2.5 text-xs text-indigo-700 font-bold bg-indigo-50 rounded-xl"
                >
                  ورود به پنل مدیریت فروشگاه
                </button>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
              تلفن تماس: {toPersianDigits(storeSettings.storePhone)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
