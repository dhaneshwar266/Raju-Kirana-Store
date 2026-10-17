import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Scale, Package, ChevronRight, AlertCircle } from 'lucide-react';
import { getFullImageUrl } from '../api/client';

export default function ProductCard({ product, onSelect, currencySymbol = '₹' }) {
  const options = product.price_options || [];
  const defaultOption = options.find((o) => o.is_default) || options[0];

  // Local active option selection for instant price preview on the card
  const [selectedOpt, setSelectedOpt] = useState(defaultOption || null);

  const isAvailable = product.is_available;
  const activePrice = selectedOpt ? parseFloat(selectedOpt.price) : 0;

  // Determine pricing badge type
  const getTypeBadge = (type) => {
    switch (type) {
      case 'weight':
        return { label: 'खुला वजन', icon: Scale };
      case 'small_quantity':
        return { label: 'मसाले', icon: Sparkles };
      case 'packaged':
        return { label: 'कंपनी पैक', icon: Package };
      default:
        return { label: 'इकाई', icon: ShoppingBag };
    }
  };

  const badge = getTypeBadge(product.pricing_type);
  const BadgeIcon = badge.icon;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group bg-[#17171C] rounded-2xl border border-[#302E31] hover:border-[#D2AC68]/60 midnight-card-shadow transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#101014]/90 text-[#B0AAA1] border border-[#302E31]">
          <BadgeIcon className="w-3 h-3 text-[#D2AC68]" />
          <span>{badge.label}</span>
        </span>

        {isAvailable ? (
          <span className="inline-flex items-center gap-1 bg-[#101014]/95 text-[#70C69A] text-xs font-bold px-2 py-0.5 rounded border border-[#302E31]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#70C69A]" />
            उपलब्ध है
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-[#101014]/95 text-[#F08A83] text-xs font-bold px-2 py-0.5 rounded border border-[#302E31]">
            <AlertCircle className="w-3 h-3 text-[#F08A83]" />
            खत्म है
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-4/3 bg-[#101014] overflow-hidden flex items-center justify-center border-b border-[#302E31]">
        {product.image_url ? (
          <img
            src={getFullImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        <div className={`flex flex-col items-center justify-center p-6 text-[#817C77] ${product.image_url ? 'hidden' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-[#202027] text-[#D2AC68] flex items-center justify-center mb-1.5 border border-[#302E31]">
            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-xs font-bold text-[#817C77]">राजू किराना</span>
        </div>

        {/* Subtle Dark Vignette at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#17171C] to-transparent pointer-events-none" />
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-1.5 text-xs text-[#817C77] mb-1 font-medium">
            {product.brand ? (
              <span className="font-semibold text-[#D2AC68] bg-[#202027] px-2 py-0.5 rounded text-[11px] border border-[rgba(210,172,104,0.18)]">
                {product.brand}
              </span>
            ) : null}
            {product.category && (
              <span className="text-[#817C77] truncate text-xs">{product.category.name}</span>
            )}
          </div>

          {/* Product Name in Large, Legible Font */}
          <h3 className="font-bold text-[#F5F0E7] text-base leading-snug line-clamp-2 group-hover:text-[#E8CA91] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Quick Interactive Unit Chips */}
        {options.length > 1 && (
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-[#817C77] block mb-1.5">
              तौल / पैक चुनें:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {options.slice(0, 3).map((opt) => {
                const isActive = selectedOpt?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpt(opt);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-xs'
                        : 'bg-[#101014] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
                    }`}
                  >
                    {opt.unit_label}
                  </button>
                );
              })}
              {options.length > 3 && (
                <span className="text-[11px] text-[#817C77] bg-[#101014] border border-[#302E31] px-1.5 py-1 rounded-md font-medium self-center">
                  +{options.length - 3} और
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#302E31] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[#D2AC68] tabular-nums tracking-tight price-numeral">
                {currencySymbol}{activePrice.toFixed(2)}
              </span>
              <span className="text-xs text-[#B0AAA1] font-medium truncate max-w-28 sm:max-w-36">
                / {selectedOpt?.unit_label || 'इकाई'}
              </span>
            </div>
            <span className="text-[10px] text-[#817C77] block">
              दुकान का पक्का भाव
            </span>
          </div>

          <button
            type="button"
            className="px-3.5 py-1.5 bg-[#202027] hover:bg-[#D2AC68] text-[#D2AC68] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-xl transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
            title="पूरे भाव देखें"
          >
            <span>भाव देखें</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
