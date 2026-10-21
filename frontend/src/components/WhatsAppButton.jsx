import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({
  whatsappNumber,
  storeName = 'राजू किराना स्टोर',
  productName = null,
  unitLabel = null,
  price = null,
  floating = false,
  className = '',
}) {
  if (!whatsappNumber || whatsappNumber.trim() === '') {
    return null;
  }

  // Sanitize phone number (strip spaces, dashes, plus)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber) {
    return null;
  }
  const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  // Create message text in Hindi
  let message = `नमस्ते ${storeName}! मुझे राशन का सामान मंगाना है। कृपया जानकारी दें।`;
  if (productName) {
    message = `नमस्ते ${storeName}! मुझे *${productName}*`;
    if (unitLabel && price) {
      message += ` (${unitLabel} भाव ₹${price})`;
    }
    message += ` चाहिए। क्या यह दुकान में उपलब्ध है?`;
  }

  const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;

  if (floating) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="राजू किराना स्टोर को व्हाट्सएप पर मैसेज करें"
        className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 sm:gap-2.5 bg-[#17171C] hover:bg-[#202027] text-[#70C69A] hover:text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl border border-[#302E31] hover:border-[#70C69A]/50 transition-all duration-200 group text-xs font-bold max-w-[calc(100vw-2rem)]"
      >
        <MessageCircle className="w-5 h-5 text-[#70C69A] shrink-0 group-hover:scale-110 transition-transform" />
        <span>व्हाट्सएप पर ऑर्डर करें</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#17171C] hover:bg-[#202027] text-[#70C69A] hover:text-[#70C69A] font-bold px-4 py-2.5 rounded-xl border border-[#302E31] hover:border-[#70C69A]/50 transition-all duration-150 text-xs sm:text-sm ${className}`}
    >
      <MessageCircle className="w-4 h-4 text-[#70C69A] shrink-0" />
      <span>व्हाट्सएप पर ऑर्डर भेजें</span>
    </a>
  );
}
