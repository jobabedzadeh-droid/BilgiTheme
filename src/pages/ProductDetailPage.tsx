import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatPrice, toPersianDigits, formatJalaliDate } from '../utils/persian';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  SlidersHorizontal,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  X,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    products,
    categories,
    reviews,
    questions,
    addToCart,
    isInWishlist,
    toggleWishlist,
    isInComparison,
    toggleComparison,
    addReview,
    addQuestion,
    currentUser,
    showNotification,
  } = useStore();
  const { navigate } = useRouter();

  // Find product by slug
  const product = products.find((p) => p.slug === slug);

  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0].id : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews' | 'questions'>('specs');

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPro, setReviewPro] = useState('');
  const [reviewCon, setReviewCon] = useState('');

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">محصول مورد نظر یافت نشد</h2>
        <p className="text-xs text-slate-500 mb-6">
          ممکن است این محصول حذف شده باشد یا آدرس وارد شده نادرست باشد.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          بازگشت به کاتالوگ
        </button>
      </div>
    );
  }

  // Active variant resolution
  const activeVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : undefined;

  const currentPrice = activeVariant ? activeVariant.price : product.salePrice;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : product.originalPrice;
  const currentStock = activeVariant ? activeVariant.stockQuantity : product.stockQuantity;
  const currentSku = activeVariant ? activeVariant.sku : product.sku;

  const inWishlist = isInWishlist(product.id);
  const inComp = isInComparison(product.id);

  // Filter reviews and questions for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const productQuestions = questions.filter((q) => q.productId === product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariantId, quantity);
  };

  const handleFastBuy = () => {
    const success = addToCart(product.id, selectedVariantId, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification('success', 'لینک صفحه کالا در کلیپ‌بورد کپی شد');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      showNotification('error', 'لطفاً عنوان و متن نظر خود را تکمیل فرمایید');
      return;
    }
    addReview({
      productId: product.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.fullName || 'خریدار مهمان',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      pros: reviewPro.trim() ? [reviewPro.trim()] : [],
      cons: reviewCon.trim() ? [reviewCon.trim()] : [],
      isVerifiedBuyer: true,
    });
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewPro('');
    setReviewCon('');
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      showNotification('error', 'لطفاً متن پرسش خود را بنویسید');
      return;
    }
    addQuestion({
      productId: product.id,
      userName: currentUser?.fullName || 'کاربر مهمان',
      question: questionText.trim(),
    });
    setIsQuestionModalOpen(false);
    setQuestionText('');
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => navigate('/')} className="hover:text-slate-700">
          خانه
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/products?category=${product.categoryId}`)}
          className="hover:text-slate-700"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-xs">{product.title}</span>
      </div>

      {/* 2. Top Product Contiguous Purchase Module */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Images (Desktop: col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onClick={() => setIsZoomModalOpen(true)}
            className="relative w-full pt-[90%] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden cursor-zoom-in group"
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {toPersianDigits(product.discountPercent)}٪ تخفیف ویژه
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl bg-slate-50 border-2 overflow-hidden p-1 transition-all ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Action buttons (Share, Wishlist, Compare) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center gap-1.5 transition-colors ${
                inWishlist ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
              <span>{inWishlist ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}</span>
            </button>

            <button
              onClick={() => toggleComparison(product.id)}
              className={`flex items-center gap-1.5 transition-colors ${
                inComp ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{inComp ? 'در لیست مقایسه' : 'مقایسه این کالا'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>اشتراک‌گذاری</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Specs, Variants & Purchase Box (Desktop: col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              {product.brand}
            </span>
            <span className="tabular-nums">کد کالا (SKU): {currentSku}</span>
          </div>

          {/* Titles */}
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
              {product.title}
            </h1>
            {product.englishTitle && (
              <p className="text-xs text-slate-400 mt-1 font-mono tracking-tight dir-ltr text-right">
                {product.englishTitle}
              </p>
            )}
          </div>

          {/* Ratings & reviews summary */}
          <div className="flex items-center gap-4 text-xs pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold">{toPersianDigits(product.rating)}</span>
              <span className="text-slate-400">از ۵</span>
            </div>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {toPersianDigits(product.reviewCount)} دیدگاه خریداران
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setActiveTab('questions')}
              className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {toPersianDigits(productQuestions.length)} پرسش و پاسخ
            </button>
          </div>

          {/* Variants Selector: Color / Size */}
          {product.variants.length > 0 && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>انتخاب تنوع / رنگ و سایز:</span>
                {activeVariant && (
                  <span className="text-indigo-600">
                    {activeVariant.colorName || activeVariant.size}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-white text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {variant.colorCode && (
                        <span
                          style={{ backgroundColor: variant.colorCode }}
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                        />
                      )}
                      <span>{variant.colorName || variant.title || variant.size}</span>
                      {variant.size && !variant.colorName && <span>({variant.size})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Highlights & Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{product.warranty}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>ارسال ظرف {toPersianDigits(product.shippingDays)} روز کاری</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>۷ روز مهلت تعویض و بازگشت</span>
            </div>
          </div>

          {/* Pricing & Stock Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">قیمت نهایی فروشنده:</span>
                <div className="text-2xl font-black tabular-nums text-white">
                  {formatPrice(currentPrice)}
                </div>
                {currentOriginalPrice > currentPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      {formatPrice(currentOriginalPrice, false)}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      (سود شما: {formatPrice(currentOriginalPrice - currentPrice)})
                    </span>
                  </div>
                )}
              </div>

              <div className="text-left">
                {currentStock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>موجود در انبار ({toPersianDigits(currentStock)} عدد)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800">
                    اتمام موجودی در انبار
                  </span>
                )}
              </div>
            </div>

            {/* Stepper & Buy Buttons */}
            {currentStock > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                {/* Stepper */}
                <div className="flex items-center justify-between border border-slate-700 rounded-xl bg-slate-800 px-2 py-1 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm tabular-nums text-white">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </button>

                {/* Fast Buy (Direct Checkout) */}
                <button
                  onClick={handleFastBuy}
                  className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>خرید سریع</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Tabbed Content: Specs, Description, Reviews, Q&A */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-2 px-4 rounded-xl transition-colors shrink-0 ${
              activeTab === 'specs'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            مشخصات فنی و ویژگی‌ها
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-2 px-4 rounded-xl transition-colors shrink-0 ${
              activeTab === 'desc'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            نقد و بررسی تخصصی
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-4 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>نظرات خریداران</span>
            <span className="text-[11px] opacity-80">({toPersianDigits(productReviews.length)})</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-4 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>پرسش و پاسخ</span>
            <span className="text-[11px] opacity-80">({toPersianDigits(productQuestions.length)})</span>
          </button>
        </div>

        {/* Tab 1: Technical Specs */}
        {activeTab === 'specs' && (
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              مشخصات و ویژگی‌های فنی «{product.title}»:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                >
                  <span className="text-slate-500 font-medium">{spec.key}</span>
                  <span className="text-slate-900 font-bold text-left">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Full Description */}
        {activeTab === 'desc' && (
          <div className="pt-6 space-y-4 max-w-4xl text-right leading-loose text-slate-700 text-xs sm:text-sm">
            <h3 className="text-base font-bold text-slate-900">معرفی و نقد اجمالی</h3>
            <p className="text-justify">{product.description}</p>
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-indigo-950 mt-4">
              <h4 className="font-bold text-xs mb-1">گارانتی اصالت و کیفیت فروشگاه ePasazh:</h4>
              <p className="text-xs leading-relaxed text-indigo-900">
                این کالا مستقیماً توسط کارشناسان واحد کنترل کیفیت بازبینی شده و ۱۰۰٪ پلمب اصلی کارخانه سازنده با کد ریجستری فعال و مدارک گمرکی تقدیم خریدار می‌گردد.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">نظرات و تجربیات ثبت‌شده</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  شما هم می‌توانید تجربه استفاده از این محصول را با دیگران به اشتراک بگذارید.
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                ثبت دیدگاه جدید
              </button>
            </div>

            {productReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                هنوز دیدگاهی برای این کالا ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
              </p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rev.userName}</span>
                        {rev.isVerifiedBuyer && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            <CheckCircle2 className="w-3 h-3" /> خریدار تأییدشده
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {formatJalaliDate(rev.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{rev.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>

                    {/* Pros and Cons */}
                    {rev.pros.length > 0 && (
                      <div className="text-emerald-700 text-[11px] flex items-center gap-1 font-medium">
                        <span className="text-emerald-600 font-bold">+ نقاط قوت:</span>
                        <span>{rev.pros.join('، ')}</span>
                      </div>
                    )}
                    {rev.cons.length > 0 && (
                      <div className="text-rose-700 text-[11px] flex items-center gap-1 font-medium">
                        <span className="text-rose-600 font-bold">- نقاط ضعف:</span>
                        <span>{rev.cons.join('، ')}</span>
                      </div>
                    )}

                    {rev.storeReply && (
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-xs mt-2 border-r-2 border-indigo-600">
                        <span className="font-bold text-indigo-700 block mb-1">
                          پاسخ رسمی پشتیبانی ePasazh:
                        </span>
                        <p>{rev.storeReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Questions & Answers */}
        {activeTab === 'questions' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">پرسش‌ها درباره این کالا</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  سؤالی درباره مشخصات، لوازم جانبی یا گارانتی دارید؟ از کارشناسان بپرسید.
                </p>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                طرح پرسش جدید
              </button>
            </div>

            {productQuestions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                هنوز پرسشی برای این کالا ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {productQuestions.map((q) => (
                  <div key={q.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{q.question}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] block pr-6">
                      توسط {q.userName} در {formatJalaliDate(q.createdAt)}
                    </span>

                    {q.answer && (
                      <div className="mr-6 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-slate-800 text-xs mt-2">
                        <span className="font-bold text-indigo-700 block mb-0.5">
                          پاسخ کارشناس تخصصی پاساژ:
                        </span>
                        <p className="leading-relaxed">{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">محصولات مشابه و مرتبط</h2>
              <p className="text-xs text-slate-500">کالاهایی که ممکن است بپسندید</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 left-6 text-white hover:text-slate-300 p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-2xl max-h-[80vh] w-full bg-white rounded-3xl p-6 shadow-2xl flex items-center justify-center">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">ثبت دیدگاه درباره کالا</h3>
              <button onClick={() => setIsReviewModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">امتیاز شما:</label>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">عنوان دیدگاه:</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: کیفیت ساخت بالا و عملکرد عالی"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">متن نظر:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="تجربه خود را از عملکرد، طراحی، باتری یا کیفیت بیان فرمایید..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-700 font-semibold mb-1">نقطه قوت:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: شارژدهی فوق‌العاده"
                    value={reviewPro}
                    onChange={(e) => setReviewPro(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-rose-700 font-semibold mb-1">نقطه ضعف:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: نداشتن شارژر در جعبه"
                    value={reviewCon}
                    onChange={(e) => setReviewCon(e.target.value)}
                    className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  ثبت دیدگاه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">طرح پرسش درباره کالا</h3>
              <button onClick={() => setIsQuestionModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">متن پرسش شما:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="پرسش خود را درباره اصالت، رنگ، گارانتی یا مشخصات بنویسید..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold transition-colors"
                >
                  ارسال پرسش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
