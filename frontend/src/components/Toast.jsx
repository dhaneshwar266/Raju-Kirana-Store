import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-fade-in p-2">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium ${
          isSuccess
            ? 'bg-[#17171C] text-[#F5F0E7] border-[#70C69A]/40'
            : isError
            ? 'bg-[#17171C] text-[#F5F0E7] border-[#F08A83]/40'
            : 'bg-[#17171C] text-[#F5F0E7] border-[#D2AC68]/40'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#70C69A] shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-4 h-4 text-[#F08A83] shrink-0 mt-0.5" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-[#D2AC68] shrink-0 mt-0.5" />}

        <div className="flex-1">
          {toast.title && <p className="font-bold text-[#F5F0E7]">{toast.title}</p>}
          <p className="text-xs text-[#B0AAA1] mt-0.5">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-[#817C77] hover:text-[#F5F0E7] transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
