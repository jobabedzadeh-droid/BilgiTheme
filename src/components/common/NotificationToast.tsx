import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            n.type === 'success'
              ? 'bg-emerald-950/90 text-white border-emerald-800'
              : n.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-800'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
          </div>
          <p className="text-sm font-medium leading-relaxed flex-1">{n.message}</p>
          <button
            onClick={() => dismissNotification(n.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5 -mr-1"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
