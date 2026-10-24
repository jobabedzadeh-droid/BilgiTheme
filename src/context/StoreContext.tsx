import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  User,
  Address,
  DiscountCode,
  WalletTransaction,
  LoyaltyTransaction,
  SupportTicket,
  Banner,
  Article,
  StoreSettings,
  ShippingMethod,
  Review,
  Question,
  OrderStatus,
  PaymentMethod,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialBanners,
  initialDiscountCodes,
  initialShippingMethods,
  initialArticles,
  defaultStoreSettings,
  sampleCustomerUser,
  sampleAdminUser,
  sampleAddresses,
} from '../data/seedData';
import { calculateClubTier } from '../utils/persian';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  comparison: string[];
  currentUser: User | null;
  addresses: Address[];
  orders: Order[];
  discountCodes: DiscountCode[];
  shippingMethods: ShippingMethod[];
  banners: Banner[];
  articles: Article[];
  reviews: Review[];
  questions: Question[];
  walletTransactions: WalletTransaction[];
  loyaltyTransactions: LoyaltyTransaction[];
  supportTickets: SupportTicket[];
  storeSettings: StoreSettings;
  notifications: ToastNotification[];

  // Cart operations
  addToCart: (productId: string, variantId?: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Wishlist & Comparison
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleComparison: (productId: string) => boolean;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;

  // User Auth & Profiles
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Address
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;

  // Orders & Checkout
  placeOrder: (payload: {
    addressId: string;
    shippingMethodId: string;
    paymentMethod: PaymentMethod;
    discountCode?: string;
    guestInfo?: { name: string; phone: string; email?: string };
  }) => { success: boolean; orderId?: string; orderNumber?: string; error?: string };
  cancelOrder: (orderId: string, reason: string) => boolean;
  requestOrderReturn: (orderId: string, reason: string) => boolean;
  updateOrderStatusByAdmin: (orderId: string, newStatus: OrderStatus, trackingCode?: string, note?: string) => boolean;

  // Discount
  validateDiscount: (code: string, subtotal: number) => { valid: boolean; discountAmount: number; message: string; discountObj?: DiscountCode };

  // Wallet & Loyalty
  topUpWallet: (amount: number) => void;
  convertPointsToWallet: (points: number) => boolean;

  // Support Tickets
  createTicket: (subject: string, department: SupportTicket['department'], priority: SupportTicket['priority'], message: string) => void;
  replyToTicket: (ticketId: string, message: string, asStaff?: boolean) => void;

  // Product reviews & questions
  addReview: (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => void;
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;

  // Admin Catalog & Settings
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  createDiscountCode: (code: DiscountCode) => void;

  // Notifications
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  dismissNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'epasazh_store_v1';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or use initial seed
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories] = useState<Category[]>(initialCategories);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist`);
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  const [comparison, setComparison] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_compare`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : sampleCustomerUser;
    } catch {
      return sampleCustomerUser;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_addresses`);
      return saved ? JSON.parse(saved) : sampleAddresses;
    } catch {
      return sampleAddresses;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      if (saved) return JSON.parse(saved);
      // Seed a realistic completed order
      const seedOrder: Order = {
        id: 'ord-101',
        orderNumber: 'EP-91823',
        userId: sampleCustomerUser.id,
        customerName: sampleCustomerUser.fullName,
        customerPhone: sampleCustomerUser.phone,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'online_gateway',
        gatewayProvider: 'شاپرک (سامان کیش)',
        gatewayRefId: 'SHP-98320141',
        shippingAddress: sampleAddresses[0],
        shippingMethod: initialShippingMethods[0],
        shippingFee: 0,
        itemsSubtotal: 10800000,
        discountAmount: 300000,
        discountCodeApplied: 'PASAZH10',
        taxAmount: 0,
        totalAmount: 10500000,
        trackingCode: '249810294810294',
        shippedAt: '2026-10-12T11:00:00Z',
        createdAt: '2026-10-10T14:20:00Z',
        items: [
          {
            productId: 'prod-4',
            variantId: 'v41',
            title: 'اسپرسوساز دلونگی مدل ددیکا Dedica EC685',
            sku: 'DLN-685-SLV',
            image: initialProducts[3].images[0],
            colorName: 'استیل نقره‌ای',
            unitPrice: 10800000,
            originalPrice: 12500000,
            quantity: 1,
            totalPrice: 10800000,
          },
        ],
        timeline: [
          { status: 'pending_payment', title: 'ایجاد پیش‌فاکتور', description: 'سفارش در سامانه ایجاد شد', timestamp: '2026-10-10T14:20:00Z' },
          { status: 'paid', title: 'پرداخت موفق', description: 'تراکنش ۱۰,۵۰۰,۰۰۰ تومان از درگاه سامان تأیید شد', timestamp: '2026-10-10T14:23:00Z' },
          { status: 'processing', title: 'تأیید و پردازش در انبار', description: 'کالا از انبار مرکزی برداشت و کنترل کیفیت شد', timestamp: '2026-10-11T09:00:00Z' },
          { status: 'shipped', title: 'تحویل به ناوگان ارسال', description: 'مرسوله با کد رهگیری ۲۴۹۸۱۰۲۹۴۸۱۰۲۹۴ ارسال شد', timestamp: '2026-10-11T16:00:00Z' },
          { status: 'delivered', title: 'تحویل مشتری', description: 'سفارش با موفقیت تحویل خریدار گردید', timestamp: '2026-10-12T11:00:00Z' },
        ],
      };
      return [seedOrder];
    } catch {
      return [];
    }
  });

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(initialDiscountCodes);
  const [shippingMethods] = useState<ShippingMethod[]>(initialShippingMethods);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [articles] = useState<Article[]>(initialArticles);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      userId: sampleCustomerUser.id,
      amount: 1000000,
      type: 'deposit',
      description: 'افزایش اعتبار آنلاین از طریق درگاه پرداخت',
      refId: 'WLT-847291',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'tx-2',
      userId: sampleCustomerUser.id,
      amount: 150000,
      type: 'cashback_refund',
      description: 'پاداش نقدی ۵٪ خرید از جشنواره پاییزه',
      refId: 'WLT-847292',
      createdAt: '2026-10-12T12:00:00Z',
    },
  ]);

  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([
    {
      id: 'lt-1',
      userId: sampleCustomerUser.id,
      points: 100,
      type: 'signup_bonus',
      description: 'هدیه خوش‌آمدگویی عضویت در خانواده ePasazh',
      createdAt: '2026-01-10T12:00:00Z',
    },
    {
      id: 'lt-2',
      userId: sampleCustomerUser.id,
      points: 320,
      type: 'earned_purchase',
      description: 'امتیاز خرید سفارش شماره EP-91823',
      createdAt: '2026-10-10T14:25:00Z',
    },
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt-1',
      ticketNumber: 'TCK-4819',
      userId: sampleCustomerUser.id,
      userName: sampleCustomerUser.fullName,
      userPhone: sampleCustomerUser.phone,
      subject: 'استعلام زمان تحویل اکسپرس سفارش در غرب تهران',
      department: 'orders',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2026-10-11T10:00:00Z',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          senderName: sampleCustomerUser.fullName,
          message: 'سلام، سفارش من کی به دستم می‌رسه؟ امروز تحویل داده میشه؟',
          timestamp: '2026-10-11T10:00:00Z',
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'پشتیبانی فنی پاساژ',
          message: 'سلام جناب رضایی عزیز، مرسوله شما تحویل سفیر ارسال شده و تا ساعت ۱۹ عصر امروز خدمتتان تحویل خواهد شد.',
          timestamp: '2026-10-11T10:25:00Z',
        },
      ],
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: 'prod-1',
      userId: 'usr-customer-1',
      userName: 'محمدرضا رضایی',
      rating: 5,
      title: 'فوق‌العاده، بهترین گوشی اندرویدی بازار',
      comment: 'دوربین زوم ۵ برابری و سیستم هوش مصنوعی حذف سوژه از عکس واقعاً جادو می‌کنه. بدنه تیتانیومی هم خیلی خوش‌دسته.',
      pros: ['دوربین فوق‌العاده', 'قلم کاربردی', 'صفحه نمایش بدون بازتاب'],
      cons: ['سرعت شارژ می‌تونست بالاتر باشه'],
      isVerifiedBuyer: true,
      isApproved: true,
      createdAt: '2026-10-14T08:30:00Z',
      storeReply: 'ممنون از اعتماد شما به پاساژ، از کار با این شاهکار لذت ببرید!',
    },
    {
      id: 'rev-2',
      productId: 'prod-4',
      userId: 'usr-customer-1',
      userName: 'محمدرضا رضایی',
      rating: 5,
      title: 'اسپرسوی غلیظ و کرمای رویایی',
      comment: 'عاشق فوم شیر نازل بخارشم. برای یک اسپرسو و لاته صبحگاهی فوق‌العاده است.',
      pros: ['ابعاد باریک و جمع و جور', 'کیفیت ساخت عالی استیل', 'داغ شدن سریع'],
      cons: ['سبد فشرده تک‌جداره نداره توی جعبه'],
      isVerifiedBuyer: true,
      isApproved: true,
      createdAt: '2026-10-13T16:00:00Z',
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      productId: 'prod-1',
      userName: 'سارا امینی',
      question: 'سلام، آیا داخل جعبه این گوشی آداپتور شارژر وجود داره یا باید جدا بخریم؟',
      createdAt: '2026-10-15T12:00:00Z',
      answer: 'سلام، طبق سیاست کارخانه سامسونگ، آداپتور شارژر ۴۵ وات داخل جعبه نیست و باید جداگانه از بخش لوازم جانبی تهیه شود.',
      answeredAt: '2026-10-15T13:30:00Z',
    },
  ]);

  // Persist critical state
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_compare`, JSON.stringify(comparison));
  }, [comparison]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_addresses`, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_user`);
    }
  }, [currentUser]);

  // Notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Cart logic
  const addToCart = (productId: string, variantId?: string, quantity: number = 1): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.inStock) {
      showNotification('error', 'متأسفانه این محصول در حال حاضر موجود نمی‌باشد');
      return false;
    }

    const maxStock = variantId
      ? product.variants.find((v) => v.id === variantId)?.stockQuantity || product.stockQuantity
      : product.stockQuantity;

    const existingIndex = cart.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    const currentQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    if (currentQty + quantity > maxStock) {
      showNotification('error', `حداکثر موجودی قابل سفارش برای این کالا ${maxStock} عدد است`);
      return false;
    }

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { productId, variantId, quantity, addedAt: new Date().toISOString() }]);
    }

    showNotification('success', `«${product.title.substring(0, 32)}...» به سبد خرید اضافه شد`);
    return true;
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
    showNotification('info', 'محصول از سبد خرید حذف شد');
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const maxStock = variantId
      ? product.variants.find((v) => v.id === variantId)?.stockQuantity || product.stockQuantity
      : product.stockQuantity;

    if (quantity > maxStock) {
      showNotification('error', `حداکثر موجودی در انبار ${maxStock} عدد می‌باشد`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return total;
    let price = product.salePrice;
    if (item.variantId) {
      const v = product.variants.find((vr) => vr.id === item.variantId);
      if (v) price = v.price;
    }
    return total + price * item.quantity;
  }, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showNotification('info', 'محصول از لیست علاقه‌مندی‌ها حذف شد');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showNotification('success', 'محصول به علاقه‌مندی‌ها اضافه شد');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Comparison
  const toggleComparison = (productId: string): boolean => {
    if (comparison.includes(productId)) {
      setComparison((prev) => prev.filter((id) => id !== productId));
      showNotification('info', 'از لیست مقایسه حذف شد');
      return true;
    }
    if (comparison.length >= 4) {
      showNotification('error', 'حداکثر می‌توانید ۴ کالا را هم‌زمان مقایسه کنید');
      return false;
    }
    setComparison((prev) => [...prev, productId]);
    showNotification('success', 'به لیست مقایسه کالا افزوده شد');
    return true;
  };

  const isInComparison = (productId: string) => comparison.includes(productId);
  const clearComparison = () => setComparison([]);

  // Auth
  const loginAsCustomer = () => {
    setCurrentUser(sampleCustomerUser);
    showNotification('success', `خوش آمدید، ${sampleCustomerUser.fullName}`);
  };

  const loginAsAdmin = () => {
    setCurrentUser(sampleAdminUser);
    showNotification('success', 'به پنل مدیریت فروشگاه وارد شدید');
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification('info', 'از حساب کاربری خود خارج شدید');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    showNotification('success', 'اطلاعات پروفایل با موفقیت بروزرسانی شد');
  };

  // Addresses
  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
    showNotification('success', 'نشانی جدید با موفقیت ذخیره شد');
  };

  const updateAddress = (id: string, addrData: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...addrData };
        }
        if (addrData.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    showNotification('success', 'نشانی با موفقیت ویرایش شد');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showNotification('info', 'نشانی حذف گردید');
  };

  // Discount validation
  const validateDiscount = (
    code: string,
    subtotal: number
  ): { valid: boolean; discountAmount: number; message: string; discountObj?: DiscountCode } => {
    const cleanCode = code.trim().toUpperCase();
    const found = discountCodes.find((d) => d.code.toUpperCase() === cleanCode && d.isActive);

    if (!found) {
      return { valid: false, discountAmount: 0, message: 'کد تخفیف وارد شده معتبر نمی‌باشد یا منقضی شده است' };
    }

    if (new Date(found.expiresAt) < new Date()) {
      return { valid: false, discountAmount: 0, message: 'مهلت استفاده از این کد تخفیف به پایان رسیده است' };
    }

    if (found.usageCount >= found.maxUsage) {
      return { valid: false, discountAmount: 0, message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است' };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `حداقل مبلغ سفارش برای اعمال این کد تخفیف ${found.minOrderAmount.toLocaleString('fa-IR')} تومان است`,
      };
    }

    let calculatedDiscount = 0;
    if (found.type === 'percent') {
      calculatedDiscount = (subtotal * found.value) / 100;
      if (found.maxDiscount && calculatedDiscount > found.maxDiscount) {
        calculatedDiscount = found.maxDiscount;
      }
    } else {
      calculatedDiscount = found.value;
    }

    return {
      valid: true,
      discountAmount: Math.min(calculatedDiscount, subtotal),
      message: `کد تخفیف «${found.code}» با موفقیت اعمال گردید`,
      discountObj: found,
    };
  };

  // Place order with Server-like snapshotting & stock deduction
  const placeOrder = (payload: {
    addressId: string;
    shippingMethodId: string;
    paymentMethod: PaymentMethod;
    discountCode?: string;
    guestInfo?: { name: string; phone: string; email?: string };
  }): { success: boolean; orderId?: string; orderNumber?: string; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'سبد خرید شما خالی است' };
    }

    const selectedAddress = addresses.find((a) => a.id === payload.addressId);
    if (!selectedAddress) {
      return { success: false, error: 'لطفاً آدرس تحویل سفارش را انتخاب فرمایید' };
    }

    const selectedShipping = shippingMethods.find((s) => s.id === payload.shippingMethodId);
    if (!selectedShipping) {
      return { success: false, error: 'لطفاً شیوه ارسال را انتخاب نمایید' };
    }

    // 1. Recalculate everything strictly from products source of truth
    let calculatedSubtotal = 0;
    const itemsSnapshot = [];
    const stockUpdates: { productId: string; variantId?: string; quantity: number }[] = [];

    for (const item of cart) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || !prod.inStock) {
        return { success: false, error: `کالای «${prod?.title || 'نامشخص'}» ناموجود شده است` };
      }

      let unitPrice = prod.salePrice;
      let originalPrice = prod.originalPrice;
      let sku = prod.sku;
      let colorName: string | undefined;
      let size: string | undefined;

      if (item.variantId) {
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stockQuantity < item.quantity) {
          return { success: false, error: `موجودی تنوع انتخابی کالا کافی نمی‌باشد` };
        }
        unitPrice = variant.price;
        originalPrice = variant.originalPrice;
        sku = variant.sku;
        colorName = variant.colorName;
        size = variant.size;
      } else {
        if (prod.stockQuantity < item.quantity) {
          return { success: false, error: `موجودی کالای «${prod.title}» کافی نمی‌باشد` };
        }
      }

      const lineTotal = unitPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      itemsSnapshot.push({
        productId: prod.id,
        variantId: item.variantId,
        title: prod.title,
        sku,
        image: prod.images[0] || '',
        colorName,
        size,
        unitPrice,
        originalPrice,
        quantity: item.quantity,
        totalPrice: lineTotal,
      });

      stockUpdates.push({
        productId: prod.id,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    }

    // 2. Shipping calculation
    let calculatedShippingFee = selectedShipping.fee;
    if (calculatedSubtotal >= storeSettings.freeShippingThreshold) {
      calculatedShippingFee = 0;
    }

    // 3. Discount calculation
    let calculatedDiscount = 0;
    if (payload.discountCode) {
      const discountCheck = validateDiscount(payload.discountCode, calculatedSubtotal);
      if (discountCheck.valid) {
        calculatedDiscount = discountCheck.discountAmount;
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal + calculatedShippingFee - calculatedDiscount);

    // 4. Wallet check if paying by wallet
    if (payload.paymentMethod === 'card_to_card' && false) {
      // reserved for future
    }

    // 5. Generate unique Order Number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `EP-${randomDigits}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: currentUser?.id || 'guest-user',
      customerName: currentUser?.fullName || payload.guestInfo?.name || selectedAddress.recipientName,
      customerPhone: currentUser?.phone || payload.guestInfo?.phone || selectedAddress.recipientPhone,
      customerEmail: currentUser?.email || payload.guestInfo?.email,
      status: 'paid', // Instant verification in dev/sandbox
      paymentStatus: 'paid',
      paymentMethod: payload.paymentMethod,
      gatewayProvider: payload.paymentMethod === 'online_gateway' ? 'شاپرک (سامان / زرین‌پال)' : 'کارت به کارت',
      gatewayRefId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: itemsSnapshot,
      shippingAddress: selectedAddress,
      shippingMethod: selectedShipping,
      shippingFee: calculatedShippingFee,
      itemsSubtotal: calculatedSubtotal,
      discountAmount: calculatedDiscount,
      discountCodeApplied: payload.discountCode,
      taxAmount: 0,
      totalAmount,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending_payment',
          title: 'ثبت اولیه سفارش',
          description: 'پیش‌فاکتور با موفقیت در پایگاه داده فروشگاه صادر گردید',
          timestamp: new Date().toISOString(),
        },
        {
          status: 'paid',
          title: 'تأییدیه نهایی پرداخت',
          description: `مبلغ ${totalAmount.toLocaleString('fa-IR')} تومان از طریق درگاه الکترونیک با موفقیت پرداخت شد`,
          timestamp: new Date().toISOString(),
        },
        {
          status: 'processing',
          title: 'ارجاع به انبارداری',
          description: 'اقلام سفارش جهت بسته‌بندی ایمن به صف پردازش منتقل شدند',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // 6. Deduct stock safely
    setProducts((prev) =>
      prev.map((p) => {
        const update = stockUpdates.find((u) => u.productId === p.id);
        if (!update) return p;

        if (update.variantId) {
          const updatedVariants = p.variants.map((v) =>
            v.id === update.variantId
              ? { ...v, stockQuantity: Math.max(0, v.stockQuantity - update.quantity) }
              : v
          );
          const totalVariantStock = updatedVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
          return {
            ...p,
            stockQuantity: totalVariantStock,
            inStock: totalVariantStock > 0,
            variants: updatedVariants,
          };
        } else {
          const newQty = Math.max(0, p.stockQuantity - update.quantity);
          return {
            ...p,
            stockQuantity: newQty,
            inStock: newQty > 0,
          };
        }
      })
    );

    // 7. Add loyalty points to customer
    const earnedPoints = Math.floor(totalAmount / 20000);
    if (currentUser && earnedPoints > 0) {
      const newPointsTotal = currentUser.loyaltyPoints + earnedPoints;
      setCurrentUser({
        ...currentUser,
        loyaltyPoints: newPointsTotal,
        clubTier: calculateClubTier(newPointsTotal),
      });
      setLoyaltyTransactions((prev) => [
        {
          id: `lt-${Date.now()}`,
          userId: currentUser.id,
          points: earnedPoints,
          type: 'earned_purchase',
          description: `امتیاز حاصل از خرید سفارش شماره ${orderNumber}`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // 8. Save order & clear cart
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showNotification('success', `سفارش شما با شماره «${orderNumber}» با موفقیت ثبت و تأیید شد`);

    return { success: true, orderId, orderNumber };
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    if (order.status !== 'pending_payment' && order.status !== 'paid') {
      showNotification('error', 'امکان لغو سفارش در وضعیت جاری وجود ندارد');
      return false;
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'cancelled',
            internalNotes: `لغو توسط مشتری با علت: ${reason}`,
            timeline: [
              ...o.timeline,
              {
                status: 'cancelled',
                title: 'لغو سفارش',
                description: `سفارش توسط کاربر لغو گردید (${reason}) و مبالغ به کیف پول بازگردانده می‌شود`,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return o;
      })
    );

    // Refund to wallet if was paid
    if (order.paymentStatus === 'paid' && currentUser) {
      const newBalance = currentUser.walletBalance + order.totalAmount;
      setCurrentUser({ ...currentUser, walletBalance: newBalance });
      setWalletTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          userId: currentUser.id,
          amount: order.totalAmount,
          type: 'cashback_refund',
          orderId: order.id,
          description: `استرداد وجه لغو سفارش شماره ${order.orderNumber}`,
          refId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    showNotification('info', 'سفارش شما با موفقیت لغو و مبلغ آن به کیف پول منظور گردید');
    return true;
  };

  const requestOrderReturn = (orderId: string, reason: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'delivered') {
      showNotification('error', 'درخواست مرجوعی فقط برای سفارش‌های تحویل شده تا ۷ روز امکان‌پذیر است');
      return false;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'returned',
              internalNotes: `درخواست مرجوعی مشتری: ${reason}`,
              timeline: [
                ...o.timeline,
                {
                  status: 'returned',
                  title: 'ثبت درخواست مرجوعی ۷ روزه',
                  description: `علت اعلامی: ${reason} (در حال بررسی توسط کارشناس گارانتی)`,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : o
      )
    );

    showNotification('success', 'درخواست مرجوعی ثبت شد. پشتیبانی ظرف ۲۴ ساعت جهت هماهنگی تماس خواهد گرفت.');
    return true;
  };

  const updateOrderStatusByAdmin = (
    orderId: string,
    newStatus: OrderStatus,
    trackingCode?: string,
    note?: string
  ): boolean => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [...o.timeline];
          let title = 'تغییر وضعیت توسط واحد عملیات';
          let desc = note || 'وضعیت سفارش بروزرسانی شد';

          if (newStatus === 'shipped') {
            title = 'تحویل به اداره پست و صدور بارنامه';
            desc = `کد رهگیری پستی: ${trackingCode || 'ثبت شده در سامانه پست'}`;
          } else if (newStatus === 'delivered') {
            title = 'تحویل نهایی کالا به مشتری';
            desc = 'امضای تحویل مرسوله از گیرنده اخذ شد';
          }

          updatedTimeline.push({
            status: newStatus,
            title,
            description: desc,
            timestamp: new Date().toISOString(),
          });

          return {
            ...o,
            status: newStatus,
            trackingCode: trackingCode || o.trackingCode,
            internalNotes: note ? `${o.internalNotes || ''}\n[${new Date().toLocaleDateString('fa-IR')}]: ${note}` : o.internalNotes,
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
    showNotification('success', 'وضعیت سفارش با موفقیت بروز شد');
    return true;
  };

  // Wallet top up
  const topUpWallet = (amount: number) => {
    if (!currentUser || amount <= 0) return;
    const newBal = currentUser.walletBalance + amount;
    setCurrentUser({ ...currentUser, walletBalance: newBal });
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        amount,
        type: 'deposit',
        description: 'شارژ آنلاین کیف پول از طریق درگاه شتاب',
        refId: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showNotification('success', `کیف پول شما به مبلغ ${amount.toLocaleString('fa-IR')} تومان شارژ شد`);
  };

  const convertPointsToWallet = (points: number): boolean => {
    if (!currentUser || currentUser.loyaltyPoints < points || points < 100) {
      showNotification('error', 'حداقل امتیاز برای تبدیل به اعتبار ۱۰۰ امتیاز می‌باشد');
      return false;
    }
    const cashValue = points * 1000; // Each point = 1,000 Toman
    setCurrentUser({
      ...currentUser,
      loyaltyPoints: currentUser.loyaltyPoints - points,
      walletBalance: currentUser.walletBalance + cashValue,
    });
    setLoyaltyTransactions((prev) => [
      {
        id: `lt-${Date.now()}`,
        userId: currentUser.id,
        points: -points,
        type: 'spent_voucher',
        description: `تبدیل ${points} امتیاز باشگاه مشتریان به اعتبار کیف پول`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showNotification('success', `${cashValue.toLocaleString('fa-IR')} تومان به کیف پول شما واریز گردید`);
    return true;
  };

  // Tickets
  const createTicket = (
    subject: string,
    department: SupportTicket['department'],
    priority: SupportTicket['priority'],
    message: string
  ) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      subject,
      department,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          senderName: currentUser.fullName,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showNotification('success', 'تیکت پشتیبانی جدید با موفقیت ثبت شد');
  };

  const replyToTicket = (ticketId: string, message: string, asStaff: boolean = false) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: asStaff ? 'waiting_user' : 'in_progress',
            messages: [
              ...t.messages,
              {
                id: `m-${Date.now()}`,
                sender: asStaff ? 'support' : 'user',
                senderName: asStaff ? 'پشتیبانی فروشگاه پاساژ' : (currentUser?.fullName || 'کاربر'),
                message,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
    showNotification('success', 'پاسخ شما با موفقیت ثبت گردید');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      isApproved: true, // auto approve in single-vendor showcase
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const newCount = p.reviewCount + 1;
          const newAvg = Number(((p.rating * p.reviewCount + reviewData.rating) / newCount).toFixed(1));
          return { ...p, rating: newAvg, reviewCount: newCount };
        }
        return p;
      })
    );
    showNotification('success', 'نظر ارزشمند شما با موفقیت ثبت و منتشر گردید');
  };

  // Questions
  const addQuestion = (qData: Omit<Question, 'id' | 'createdAt'>) => {
    const newQ: Question = {
      ...qData,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuestions((prev) => [newQ, ...prev]);
    showNotification('success', 'پرسش شما ثبت شد و به زودی توسط کارشناسان پاسخ داده می‌شود');
  };

  // Admin Catalog
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newP: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newP, ...prev]);
    showNotification('success', 'محصول جدید با موفقیت به کاتالوگ فروشگاه اضافه شد');
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prodData } : p)));
    showNotification('success', 'تغییرات محصول ذخیره شد');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('info', 'محصول از کاتالوگ حذف گردید');
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showNotification('success', 'تنظیمات فروشگاه ذخیره گردید');
  };

  const updateBanner = (id: string, bannerData: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...bannerData } : b)));
    showNotification('success', 'بنر بروزرسانی شد');
  };

  const createDiscountCode = (code: DiscountCode) => {
    setDiscountCodes((prev) => [code, ...prev]);
    showNotification('success', `کد تخفیف ${code.code} با موفقیت تعریف شد`);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        comparison,
        currentUser,
        addresses,
        orders,
        discountCodes,
        shippingMethods,
        banners,
        articles,
        reviews,
        questions,
        walletTransactions,
        loyaltyTransactions,
        supportTickets,
        storeSettings,
        notifications,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,

        toggleWishlist,
        isInWishlist,
        toggleComparison,
        isInComparison,
        clearComparison,

        loginAsCustomer,
        loginAsAdmin,
        logout,
        updateUserProfile,

        addAddress,
        updateAddress,
        deleteAddress,

        placeOrder,
        cancelOrder,
        requestOrderReturn,
        updateOrderStatusByAdmin,

        validateDiscount,
        topUpWallet,
        convertPointsToWallet,

        createTicket,
        replyToTicket,

        addReview,
        addQuestion,

        addProduct,
        updateProduct,
        deleteProduct,
        updateStoreSettings,
        updateBanner,
        createDiscountCode,

        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
