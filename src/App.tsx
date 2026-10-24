import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { NotificationToast } from './components/common/NotificationToast';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { WishlistPage } from './pages/WishlistPage';
import {
  AboutPage,
  ContactPage,
  FAQPage,
  ShippingTermsPage,
  ReturnsPage,
  TermsPage,
} from './pages/ContentPages';
import { BlogPage } from './pages/BlogPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AlertCircle } from 'lucide-react';

const RouteRenderer: React.FC = () => {
  const { currentPath, navigate } = useRouter();

  // Route matching
  if (currentPath === '/' || currentPath === '') {
    return <HomePage />;
  }

  if (currentPath === '/products') {
    return <CatalogPage />;
  }

  if (currentPath.startsWith('/product/')) {
    const slug = currentPath.replace('/product/', '').split('?')[0];
    return <ProductDetailPage slug={slug} />;
  }

  if (currentPath === '/cart') {
    return <CartPage />;
  }

  if (currentPath === '/checkout') {
    return <CheckoutPage />;
  }

  if (currentPath.startsWith('/order-success/')) {
    const orderId = currentPath.replace('/order-success/', '').split('?')[0];
    return <OrderSuccessPage orderId={orderId} />;
  }

  if (currentPath === '/track-order') {
    return <OrderTrackingPage />;
  }

  if (currentPath === '/account' || currentPath.startsWith('/account/')) {
    let initialTab = 'overview';
    if (currentPath === '/account/orders') initialTab = 'orders';
    if (currentPath === '/account/wallet') initialTab = 'wallet';
    if (currentPath === '/account/club') initialTab = 'club';
    if (currentPath === '/account/tickets') initialTab = 'tickets';
    if (currentPath === '/account/addresses') initialTab = 'addresses';
    return <AccountPage initialTab={initialTab} />;
  }

  if (currentPath === '/compare') {
    return <ComparisonPage />;
  }

  if (currentPath === '/wishlist') {
    return <WishlistPage />;
  }

  if (currentPath === '/about') {
    return <AboutPage />;
  }

  if (currentPath === '/contact') {
    return <ContactPage />;
  }

  if (currentPath === '/faq') {
    return <FAQPage />;
  }

  if (currentPath === '/shipping') {
    return <ShippingTermsPage />;
  }

  if (currentPath === '/returns') {
    return <ReturnsPage />;
  }

  if (currentPath === '/terms') {
    return <TermsPage />;
  }

  if (currentPath === '/blog') {
    return <BlogPage />;
  }

  if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace('/blog/', '').split('?')[0];
    return <BlogPage slug={slug} />;
  }

  if (currentPath === '/admin') {
    return <AdminDashboard />;
  }

  // 404 Not Found Page
  return (
    <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200/90 shadow-xs my-12">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">صفحه مورد نظر یافت نشد (خطای ۴۰۴)</h2>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        صفحه‌ای که به دنبال آن بودید ممکن است جابه‌جا شده باشد یا آدرس وارد شده دارای اشتباه تایپی باشد.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-colors"
      >
        بازگشت به صفحه اصلی فروشگاه
      </button>
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
          {/* Header */}
          <Header />

          {/* Main content viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-0">
            <RouteRenderer />
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Bottom Dock Bar */}
          <MobileBottomNav />

          {/* Global Notification Toast */}
          <NotificationToast />
        </div>
      </StoreProvider>
    </RouterProvider>
  );
}
