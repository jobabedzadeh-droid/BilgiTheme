import React from 'react';
import { Product } from '../../types';
import { formatPrice, toPersianDigits } from '../../utils/persian';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { navigate } = useRouter();
  const { addToCart, isInWishlist, toggleWishlist, isInComparison, toggleComparison } = useStore();

  const inWishlist = isInWishlist(product.id);
  const inComp = isInComparison(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first variant if exists or base
    const defaultVariant = product.variants.length > 0 ? product.variants[0].id : undefined;
    addToCart(product.id, defaultVariant, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComparison(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Top badges and Wishlist button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
              {toPersianDigits(product.discountPercent)}٪ تخفیف
            </span>
          )}
          {product.isSpecialOffer && (
            <span className="bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-md shadow-sm">
              شگفت‌انگیز
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={handleToggleComparison}
            title={inComp ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm backdrop-blur-sm ${
              inComp
                ? 'bg-indigo-600 text-white'
                : 'bg-white/85 text-slate-500 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <span className="text-[11px] font-bold">VS</span>
          </button>
          <button
            onClick={handleToggleWishlist}
            title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm backdrop-blur-sm ${
              inWishlist
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/85 text-slate-500 hover:text-rose-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Slot */}
      <div className="relative w-full pt-[90%] bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              ناموجود در انبار
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Metadata clean text: Brand & Category */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-500">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
            {product.title}
          </h3>

          {/* Color swatches if any */}
          {product.variants.length > 0 && product.variants.some((v) => v.colorCode) && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.variants
                .filter((v) => v.colorCode)
                .slice(0, 4)
                .map((variant) => (
                  <span
                    key={variant.id}
                    title={variant.colorName}
                    style={{ backgroundColor: variant.colorCode }}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs inline-block"
                  />
                ))}
              {product.variants.filter((v) => v.colorCode).length > 4 && (
                <span className="text-[11px] text-slate-400">
                  +{toPersianDigits(product.variants.length - 4)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          {/* Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-700">{toPersianDigits(product.rating)}</span>
              <span className="text-slate-400">({toPersianDigits(product.reviewCount)})</span>
            </div>
            {product.inStock && (
              <span className="text-[11px] text-emerald-600 flex items-center gap-0.5">
                <Check className="w-3 h-3" /> موجود در انبار
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              {product.discountPercent > 0 && (
                <div className="text-xs text-slate-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice, false)}
                </div>
              )}
              <div className="text-base font-bold text-slate-900 tabular-nums">
                {formatPrice(product.salePrice)}
              </div>
            </div>

            {product.inStock && !compact && (
              <button
                onClick={handleAddToCart}
                aria-label="افزودن به سبد خرید"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
