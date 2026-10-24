import React, { useState } from 'react';
import { X, ShieldCheck, Database, CreditCard, Send, Copy, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface GatewayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatewayConfigModal: React.FC<GatewayConfigModalProps> = ({ isOpen, onClose }) => {
  const { showNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'zarinpal' | 'saman' | 'firebase' | 'sms'>('zarinpal');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      showNotification('success', `کد نمونه ${keyName} کپی شد`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 block mb-0.5">
              مستندات و راهنمای فنی اتصال درگاه‌های بانکی و پایگاه داده
            </span>
            <h2 className="text-base font-bold text-slate-900">
              راهنمای راه‌اندازی درگاه پرداخت ایران و Firebase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'zarinpal', label: 'درگاه زرین‌پال (ZarinPal)', icon: CreditCard },
            { id: 'saman', label: 'درگاه سامان کیش (Sep)', icon: CreditCard },
            { id: 'firebase', label: 'پایگاه داده Cloud Firestore', icon: Database },
            { id: 'sms', label: 'سرویس پیامک کاوه‌نگار', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Zarinpal */}
        {activeTab === 'zarinpal' && (
          <div className="space-y-4 leading-relaxed text-slate-700">
            <h3 className="font-bold text-sm text-slate-900">مراحل اتصال به درگاه پرداخت زرین‌پال:</h3>
            <ol className="list-decimal pr-5 space-y-2">
              <li>
                در سایت <a href="https://zarinpal.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">زرین‌پال</a> ثبت‌نام کرده و مراحل احراز هویت پذیرنده تجاری را تکمیل فرمایید.
              </li>
              <li>
                یک درگاه جدید با دامنه اختصاصی فروشگاه تعریف کرده و کد ۳۶ کاراکتری <strong>Merchant ID</strong> را دریافت نمایید.
              </li>
              <li>
                کلید دریافتی را در متغیر محیطی <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700">ZARINPAL_MERCHANT_ID</code> در فایل سرور یا تنظیمات پنل ثبت کنید.
              </li>
            </ol>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left font-mono text-[11px] relative">
              <button
                onClick={() =>
                  copyToClipboard(
                    `// درخواست به درگاه زرین پال\nconst response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    merchant_id: process.env.ZARINPAL_MERCHANT_ID,\n    amount: order.totalAmount * 10, // تبدیل به ریال\n    callback_url: 'https://yourdomain.com/api/payment/callback',\n    description: 'پرداخت سفارش شماره ' + order.orderNumber,\n  })\n});`,
                    'زرین‌پال'
                  )
                }
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-900"
              >
                {copiedKey === 'زرین‌پال' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="overflow-x-auto text-slate-800 dir-ltr">{`// نمونه متد پرداخت زرین‌پال
POST https://payment.zarinpal.com/pg/v4/payment/request.json
{
  "merchant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "amount": 105000000, // ریال
  "callback_url": "https://epasazh.com/api/payment/verify",
  "description": "خرید از فروشگاه ePasazh"
}`}</pre>
            </div>
          </div>
        )}

        {/* Tab Content: Saman */}
        {activeTab === 'saman' && (
          <div className="space-y-4 leading-relaxed text-slate-700">
            <h3 className="font-bold text-sm text-slate-900">مراحل اتصال به درگاه سامان کیش (سپ):</h3>
            <ol className="list-decimal pr-5 space-y-2">
              <li>
                درخواست درگاه اینترنتی IPG را در شرکت پرداخت الکترونیک سامان کیش (SEP) با ارائه نماد اعتماد الکترونیکی (اینماد) ثبت فرمایید.
              </li>
              <li>
                شماره ترمینال (Terminal ID) و رمز پذیرنده (Merchant Password) اختصاصی را تحویل بگیرید.
              </li>
              <li>
                شناسه ترمینال را در متغیر محیطی <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700">SEP_TERMINAL_ID</code> وارد نمایید.
              </li>
            </ol>
          </div>
        )}

        {/* Tab Content: Firebase */}
        {activeTab === 'firebase' && (
          <div className="space-y-4 leading-relaxed text-slate-700">
            <h3 className="font-bold text-sm text-slate-900">راه‌اندازی پایگاه داده Cloud Firestore و احراز هویت:</h3>
            <p>
              ساختار فعلی اپلیکیشن با مدل داده اختصاصی منطبق بر Firestore پیاده‌سازی شده و از طریق شبیه‌ساز ذخیره‌سازی محلی کاملاً فعال است. برای فعال‌سازی محیط کلود گوگل:
            </p>
            <ol className="list-decimal pr-5 space-y-2">
              <li>
                در کنسول Firebase یک پروژه جدید ایجاد کرده و سرویس‌های Firestore Database و Authentication را فعال نمایید.
              </li>
              <li>
                قوانین امنیتی (Security Rules) زیر را در تب Rules پایگاه داده خود اعمال فرمایید تا دسترسی سفارشات فقط به خریدار مربوطه و مدیران محدود باشد:
              </li>
            </ol>

            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-left font-mono text-[11px] relative">
              <button
                onClick={() =>
                  copyToClipboard(
                    `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /products/{id} { allow read: if true; allow write: if request.auth.token.role == 'admin'; }\n    match /orders/{id} { allow read, write: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.token.role == 'admin'); }\n  }\n}`,
                    'قوانین فایربیس'
                  )
                }
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                {copiedKey === 'قوانین فایربیس' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="overflow-x-auto text-indigo-300 dir-ltr">{`// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
      allow create: if request.auth != null;
    }
  }
}`}</pre>
            </div>
          </div>
        )}

        {/* Tab Content: SMS */}
        {activeTab === 'sms' && (
          <div className="space-y-4 leading-relaxed text-slate-700">
            <h3 className="font-bold text-sm text-slate-900">سرویس ارسال پیامک اطلاع‌رسانی:</h3>
            <p>
              برای ارسال پیامک‌های خودکار تأیید ثبت سفارش و ارسال کد رهگیری پستی به شماره همراه خریدار، وب‌سرویس پترن کاوه‌نگار یا فراپیامک پیشنهاد می‌شود.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-1">الگوی پیامک ثبت سفارش:</span>
              <p className="text-slate-600 font-mono">
                «خریدار گرامی، سفارش شما به شماره %orderNumber% در ePasazh با موفقیت ثبت شد و به زودی ارسال می‌گردد.»
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-colors"
          >
            متوجه شدم، بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
