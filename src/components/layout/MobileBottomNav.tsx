import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { toPersianDigits } from '../../utils/persian';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { cartTotalCount, wishlist, currentUser } = useStore();

  const navItems = [
    { label: 'خانه', path: '/', icon: Home },
    { label: 'محصولات', path: '/products', icon: Grid },
    {
      label: 'سبد خرید',
      path: '/cart',
      icon: ShoppingBag,
      badge: cartTotalCount > 0 ? toPersianDigits(cartTotalCount) : null,
    },
    {
      label: 'علاقه‌مندی',
      path: '/wishlist',
      icon: Heart,
      badge: wishlist.length > 0 ? toPersianDigits(wishlist.length) : null,
    },
    {
      label: currentUser ? 'حساب من' : 'ورود',
      path: currentUser ? '/account' : '/account',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path !== '/' && currentPath.startsWith(item.path));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
