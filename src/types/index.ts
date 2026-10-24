export type UserRole = 'customer' | 'admin' | 'store_manager' | 'order_staff' | 'support';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  nationalCode?: string;
  role: UserRole;
  walletBalance: number;
  loyaltyPoints: number;
  clubTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  avatar?: string;
  registeredAt: string;
}

export interface Address {
  id: string;
  title: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  plaque?: string;
  unit?: string;
  recipientName: string;
  recipientPhone: string;
  isDefault: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  title?: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  englishTitle?: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  rating: number;
  reviewCount: number;
  images: string[];
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isSpecialOffer: boolean;
  specialOfferExpiresAt?: string;
  isBestSeller: boolean;
  isNew: boolean;
  warranty: string;
  shippingDays: number;
  description: string;
  shortDescription: string;
  specs: { key: string; value: string }[];
  variants: ProductVariant[];
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  image: string;
  parentId?: string;
  subCategories?: { id: string; name: string; slug: string }[];
  itemCount: number;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  isVerifiedBuyer: boolean;
  isApproved: boolean;
  createdAt: string;
  storeReply?: string;
}

export interface Question {
  id: string;
  productId: string;
  userName: string;
  question: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';

export type PaymentMethod = 'online_gateway' | 'card_to_card' | 'cod';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  fee: number;
  estimatedDelivery: string;
  iconName: string;
}

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  image: string;
  colorName?: string;
  size?: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  gatewayProvider: string;
  gatewayRefId?: string;
  items: OrderItemSnapshot[];
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  itemsSubtotal: number;
  discountAmount: number;
  discountCodeApplied?: string;
  taxAmount: number;
  totalAmount: number;
  trackingCode?: string;
  shippedAt?: string;
  createdAt: string;
  internalNotes?: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
}

export interface DiscountCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
  description: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'order_payment' | 'cashback_refund';
  orderId?: string;
  description: string;
  refId: string;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'earned_purchase' | 'spent_voucher' | 'signup_bonus' | 'review_reward';
  description: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  department: 'orders' | 'returns' | 'warranty' | 'general' | 'finance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  createdAt: string;
  messages: {
    id: string;
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  badge?: string;
  placement: 'main_slider' | 'middle_two' | 'wide_bottom' | 'side_banner';
  isActive: boolean;
  priority: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  image: string;
  publishedAt: string;
  tags: string[];
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  workingHours: string;
  freeShippingThreshold: number;
  shippingFeeStandard: number;
  shippingFeeExpress: number;
  gatewayMode: 'sandbox' | 'live';
  zarinpalMerchantId: string;
  smsApiKey: string;
  allowGuestCheckout: boolean;
}
