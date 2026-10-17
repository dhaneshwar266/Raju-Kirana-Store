import React, { useState } from 'react';
import { X, Check, AlertCircle, ShoppingBag, Tag, Scale, Package, Layers, Sparkles } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { getPricePerGram, formatGramsToScaleText, calculateGramsForRupees } from '../utils/scaleCalculator';
import { getFullImageUrl } from '../api/client';

export default function ProductDetailModal({ product, onClose, storeSettings }) {
  if (!product) return null;

  const options = product.price_options || [];
  const defaultOption = options.find((o) => o.is_default) || options[0];
  const [selectedOption, setSelectedOption] = useState(defaultOption || null);
  const [calcRupees, setCalcRupees] = useState('15');

  const currency = storeSettings?.currency_symbol || '₹';
  const whatsappNumber = storeSettings?.whatsapp_number;
  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';

  const getPricingTypeBadge = (type) => {
    switch (type) {
      case 'weight':
        return { label: 'खुला वजन (किलो / पाव)', icon: Scale };
      case 'small_quantity':
        return { label: 'मसाले (ग्राम में)', icon: Sparkles };
      case 'packaged':
        return { label: 'कंपनी सीलबंद पैक', icon: Package };
      default:
        return { label: 'इकाई अनुसार', icon: Layers };
    }
  };

  const badgeInfo = getPricingTypeBadge(product.pricing_type);
  const BadgeIcon = badgeInfo.icon;

  // Rupee to Grams scale calculator support
  const gramRateInfo = getPricePerGram(options);
  const calculatedGrams = gramRateInfo ? calculateGramsForRupees(calcRupees, gramRateInfo.pricePerGram) : 0;

  const handleApplyCustomRupeeWeight = () => {
    if (!gramRateInfo || calculatedGrams <= 0) return;
    const customWeightLabel = `${formatGramsToScaleText(calculatedGrams)} (₹${calcRupees} का)`;
    setSelectedOption({
      id: 'custom_scale_weight',
      unit_label: customWeightLabel,
      price: parseFloat(calcRupees),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#17171C] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#302E31] max-h-[92vh] flex flex-col my-auto text-[#F5F0E7]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#302E31] flex items-center justify-between bg-[#101014]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-[#202027] text-[#D2AC68] border border-[rgba(210,172,104,0.22)]">
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badgeInfo.label}</span>
            </span>

            {product.is_available ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-[#101014] text-[#70C69A] border border-[#302E31]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70C69A]" />
                दुकान में उपलब्ध है
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-[#101014] text-[#F08A83] border border-[#302E31]">
                <AlertCircle className="w-3.5 h-3.5" />
                अभी खत्म है
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#202027] transition-colors cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Image / Graphic with Border Frame */}
            <div className="relative aspect-square rounded-xl bg-[#101014] border border-[#302E31] overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={getFullImageUrl(product.image_url)}
                  alt={product.name}
                  className="w-full h-full object-cover brightness-95"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#817C77] p-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#202027] text-[#D2AC68] flex items-center justify-center mb-2 border border-[#302E31]">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#817C77]">राजू किराना</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] font-bold text-[#D2AC68] bg-[#202027] px-2.5 py-0.5 rounded border border-[rgba(210,172,104,0.22)] inline-block">
                  {product.category?.name || 'किराना सामान'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7] mt-1.5 leading-snug">
                  {product.name}
                </h2>
                {product.brand && (
                  <p className="text-xs text-[#B0AAA1] font-medium mt-1">
                    ब्रांड: <span className="font-bold text-[#F5F0E7]">{product.brand}</span>
                  </p>
                )}
              </div>

              {/* Active Selected Price Banner */}
              {selectedOption && (
                <div className="bg-[#101014] text-[#F5F0E7] rounded-xl p-4 border border-[#302E31] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#817C77] font-semibold block">
                      चुना हुआ वजन / पैक
                    </span>
                    <span className="text-base font-bold text-[#F5F0E7] block mt-0.5">
                      {selectedOption.unit_label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#817C77] font-semibold block">
                      काउंटर भाव
                    </span>
                    <span className="text-2xl font-bold text-[#D2AC68] tabular-nums block price-numeral">
                      {currency}{parseFloat(selectedOption.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ⚖️ Rupee to Grams Calculator Box (10 रु / 15 रु / 20 रु का वजन) */}
          {gramRateInfo && (
            <div className="bg-[#17171C] rounded-2xl p-4 sm:p-5 border-2 border-[#D2AC68]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#D2AC68]" />
                  <span className="text-sm font-bold text-[#F5F0E7]">
                    ⚖️ जितने रुपये का चाहिए, उतना वजन निकालें
                  </span>
                </div>
                <span className="text-[10px] bg-[#101014] text-[#70C69A] font-bold px-2 py-0.5 rounded border border-[#302E31]">
                  कांटा कैलकुलेटर
                </span>
              </div>

              <p className="text-xs text-[#817C77]">
                ग्राहक 10 या 15 रुपये का मांगे, तो दिमाग लगाने की ज़रूरत नहीं — बस बटन दबाएं:
              </p>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[5, 10, 15, 20, 25, 30, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcRupees(amt.toString())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      calcRupees === amt.toString()
                        ? 'bg-[#D2AC68] text-[#0A0A0C] border-[#D2AC68] shadow-sm'
                        : 'bg-[#101014] text-[#D2AC68] border-[#302E31] hover:border-[#D2AC68]/40'
                    }`}
                  >
                    ₹{amt} का
                  </button>
                ))}
              </div>

              {/* Custom Rupee Amount Input */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs text-[#817C77]">या अन्य रुपये:</span>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D2AC68]">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={calcRupees}
                    onChange={(e) => setCalcRupees(e.target.value)}
                    placeholder="15"
                    className="w-full pl-6 pr-2 py-1 text-xs font-bold bg-[#101014] text-[#D2AC68] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums"
                  />
                </div>
              </div>

              {/* Big Result Card */}
              {calculatedGrams > 0 && (
                <div className="bg-[#101014] p-3.5 rounded-xl border border-[#D2AC68]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#817C77] block font-semibold">
                      कांटे पर इतना ग्राम तौलें:
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#D2AC68] block mt-0.5 tabular-nums">
                      👉 {formatGramsToScaleText(calculatedGrams)}
                    </span>
                    <span className="text-[11px] text-[#817C77] block mt-0.5">
                      ({currency}{gramRateInfo.basePrice}/{gramRateInfo.baseLabel} के हिसाब से {currency}{calcRupees} में {calculatedGrams}g)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCustomRupeeWeight}
                    className="px-3 py-1.5 bg-[#202027] hover:bg-[#D2AC68] text-[#D2AC68] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-lg text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    ✓ यह तौल चुनें
                  </button>
                </div>
              )}
            </div>
          )}

          {/* All Available Selling Rates Table */}
          <div className="border border-[#302E31] rounded-xl overflow-hidden bg-[#101014]">
            <div className="px-4 py-3 border-b border-[#302E31] flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-[#F5F0E7] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D2AC68]" />
                <span>सभी तौल और भाव सूची (Rates List)</span>
              </h3>
              <span className="text-[11px] text-[#817C77]">
                क्लिक करके चुनें
              </span>
            </div>

            <div className="divide-y divide-[#302E31]/70">
              {options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#202027] border-l-4 border-[#D2AC68]'
                        : 'hover:bg-[#17171C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#D2AC68] bg-[#D2AC68] text-[#0A0A0C]'
                            : 'border-[#302E31]'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-[#0A0A0C] rounded-full" />}
                      </div>
                      <div>
                        <span className="text-sm text-[#F5F0E7] block font-semibold">
                          {opt.unit_label}
                        </span>
                        {opt.is_default && (
                          <span className="text-[10px] text-[#D2AC68] font-bold">
                            (मुख्य भाव)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-[#D2AC68] tabular-nums price-numeral">
                        {currency}{parseFloat(opt.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Accuracy Guarantee */}
          <div className="p-3 bg-[#101014] rounded-xl border border-[#302E31] text-xs text-[#B0AAA1] flex items-center gap-2.5">
            <Check className="w-4 h-4 text-[#70C69A] shrink-0" />
            <span>
              दुकान के प्रमाणित इलेक्ट्रॉनिक कांटे पर तौला जाता है। जो भाव लिखा है, वही काउंटर पर लिया जाएगा।
            </span>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-5 py-4 bg-[#101014] border-t border-[#302E31] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#817C77] text-center sm:text-left">
            व्हाट्सएप पर ऑर्डर भेजें या दुकान पर पधारें।
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027] rounded-xl transition-colors flex-1 sm:flex-initial cursor-pointer border border-[#302E31]"
            >
              बंद करें (Close)
            </button>

            {whatsappNumber && (
              <WhatsAppButton
                whatsappNumber={whatsappNumber}
                storeName={storeName}
                productName={product.name}
                unitLabel={selectedOption?.unit_label}
                price={selectedOption ? parseFloat(selectedOption.price).toFixed(2) : null}
                className="flex-1 sm:flex-initial"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
