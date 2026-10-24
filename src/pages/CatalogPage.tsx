import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatPrice, toPersianDigits, normalizePersianText } from '../utils/persian';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  Filter,
  Check,
  Star,
  ChevronDown,
} from 'lucide-react';

type SortOption = 'newest' | 'bestselling' | 'price_asc' | 'price_desc' | 'discount';

export const CatalogPage: React.FC = () => {
  const { products, categories } = useStore();
  const { queryParams, setQueryParam, navigate } = useRouter();

  // Query param states
  const categoryParam = queryParams.get('category') || 'all';
  const searchParam = queryParams.get('search') || '';
  const specialParam = queryParams.get('special') === 'true';
  const bestSellerParam = queryParams.get('bestseller') === 'true';
  const newParam = queryParams.get('new') === 'true';

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(specialParam);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available unique brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet);
  }, [products]);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchParam) {
        const q = normalizePersianText(searchParam);
        const matchesTitle = normalizePersianText(p.title).includes(q);
        const matchesBrand = normalizePersianText(p.brand).includes(q);
        const matchesCategory = normalizePersianText(p.categoryName).includes(q);
        const matchesEnglish = p.englishTitle ? p.englishTitle.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesEnglish) {
          return false;
        }
      }
      // Brands filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Stock filter
      if (onlyInStock && !p.inStock) {
        return false;
      }
      // Discount filter
      if (onlyDiscounted && p.discountPercent <= 0) {
        return false;
      }
      // Special flag
      if (specialParam && !p.isSpecialOffer) {
        return false;
      }
      // Best seller flag
      if (bestSellerParam && !p.isBestSeller) {
        return false;
      }
      // New flag
      if (newParam && !p.isNew) {
        return false;
      }
      // Price range
      if (p.salePrice < minPrice || p.salePrice > maxPrice) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchParam,
    selectedBrands,
    onlyInStock,
    onlyDiscounted,
    specialParam,
    bestSellerParam,
    newParam,
    minPrice,
    maxPrice,
    minRating,
  ]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'newest':
        return list.reverse();
      case 'bestselling':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'price_asc':
        return list.sort((a, b) => a.salePrice - b.salePrice);
      case 'price_desc':
        return list.sort((a, b) => b.salePrice - a.salePrice);
      case 'discount':
        return list.sort((a, b) => b.discountPercent - a.discountPercent);
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands((prev) => prev.filter((b) => b !== brand));
    } else {
      setSelectedBrands((prev) => [...prev, brand]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setMinPrice(0);
    setMaxPrice(100000000);
    setMinRating(0);
    setSortBy('newest');
    if (searchParam) setQueryParam('search', null);
    if (categoryParam !== 'all') setQueryParam('category', null);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (onlyInStock ? 1 : 0) +
    (onlyDiscounted ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchParam ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button onClick={() => navigate('/')} className="hover:text-slate-700">
              خانه
            </button>
            <span>/</span>
            <span className="text-slate-600 font-medium">فهرست محصولات</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-indigo-600 font-bold">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {searchParam
              ? `نتایج جستجو برای: «${searchParam}»`
              : selectedCategory !== 'all'
              ? categories.find((c) => c.slug === selectedCategory)?.name
              : 'کاتالوگ جامع محصولات ePasazh'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            نمایش <strong className="text-slate-900 font-bold tabular-nums">{toPersianDigits(sortedProducts.length)}</strong> کالا
          </span>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            <Filter className="w-4 h-4" />
            <span>فیلترها ({toPersianDigits(activeFiltersCount)})</span>
          </button>
        </div>
      </div>

      {/* 2. Sorting Strip (Desktop) */}
      <div className="hidden lg:flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">مرتب‌سازی بر اساس:</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'newest', label: 'جدیدترین' },
              { id: 'bestselling', label: 'پرفروش‌ترین' },
              { id: 'price_asc', label: 'ارزان‌ترین' },
              { id: 'price_desc', label: 'گران‌ترین' },
              { id: 'discount', label: 'بیشترین تخفیف' },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => setSortBy(sort.id as SortOption)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  sortBy === sort.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاک کردن فیلترها</span>
          </button>
        )}
      </div>

      {/* Active filter badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">فیلترهای فعال:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              دسته: {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}>
                <X className="w-3.5 h-3.5 text-indigo-500 hover:text-indigo-900" />
              </button>
            </span>
          )}
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200"
            >
              برند: {b}
              <button onClick={() => toggleBrand(b)}>
                <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-900" />
              </button>
            </span>
          ))}
          {onlyInStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              فقط کالاهای موجود
              <button onClick={() => setOnlyInStock(false)}>
                <X className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-900" />
              </button>
            </span>
          )}
          {onlyDiscounted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-medium border border-rose-200">
              فقط تخفیف‌دار
              <button onClick={() => setOnlyDiscounted(false)}>
                <X className="w-3.5 h-3.5 text-rose-500 hover:text-rose-900" />
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium border border-amber-200">
              جستجو: {searchParam}
              <button onClick={() => setQueryParam('search', null)}>
                <X className="w-3.5 h-3.5 text-amber-500 hover:text-amber-900" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 3. Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-5 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>فیلترهای پیشرفته</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800"
              >
                حذف همه
              </button>
            )}
          </div>

          {/* Category Tree */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800">دسته‌بندی کالا</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-right p-2 rounded-xl transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                همه دسته‌ها ({toPersianDigits(products.length)})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-right p-2 rounded-xl transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {toPersianDigits(c.itemCount)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Quick Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
              <span>فقط کالاهای موجود در انبار</span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
              <span>فقط محصولات دارای تخفیف</span>
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </label>
          </div>

          <hr className="border-slate-100" />

          {/* Brands list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800">برندهای تجاری</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
                >
                  <span className="truncate">{brand}</span>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Rating Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800">امتیاز خریداران</h4>
            <div className="flex items-center gap-1.5">
              {[0, 3, 4, 4.8].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors ${
                    minRating === stars
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {stars === 0 ? 'همه' : `+${toPersianDigits(stars)} ستاره`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                هیچ کالایی با فیلترهای انتخابی یافت نشد
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                لطفاً ترکیب فیلترها را تغییر دهید یا از کلمات کلیدی دیگری در جستجو استفاده نمایید.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors"
              >
                پاک کردن تمام فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">فیلترهای کاتالوگ</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2">دسته‌بندی کالا</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-right p-2 rounded-lg ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    همه دسته‌ها
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-right p-2 rounded-lg ${
                        selectedCategory === c.slug
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>فقط کالاهای موجود در انبار</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>فقط تخفیف‌دار</span>
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                </label>
              </div>

              {/* Sorting */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-2">مرتب‌سازی</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'newest', label: 'جدیدترین' },
                    { id: 'bestselling', label: 'پرفروش‌ترین' },
                    { id: 'price_asc', label: 'ارزان‌ترین' },
                    { id: 'price_desc', label: 'گران‌ترین' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id as SortOption)}
                      className={`p-2 rounded-lg text-center font-medium border ${
                        sortBy === s.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                پاک کردن
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                مشاهده نتایج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
