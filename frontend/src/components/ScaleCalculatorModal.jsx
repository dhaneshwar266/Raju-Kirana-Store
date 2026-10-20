import React, { useState, useMemo, useEffect } from 'react';
import { X, Scale, Calculator, ArrowRight, Check } from 'lucide-react';
import { getPricePerGram, formatGramsToScaleText, generateQuickRupeeTable } from '../utils/scaleCalculator';
import { getProducts } from '../api/products';

export default function ScaleCalculatorModal({ products = [], onClose, storeSettings }) {
  const [mode, setMode] = useState('product'); // 'product' | 'manual'
  const [itemList, setItemList] = useState(products);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [manualRate, setManualRate] = useState('80'); // e.g. ₹80 per kg
  const [manualUnit, setManualUnit] = useState('kg'); // 'kg' | '100g'
  const [rupees, setRupees] = useState('15');

  // Load products if none were passed
  useEffect(() => {
    if (products && products.length > 0) {
      setItemList(products);
      if (!selectedProductId) setSelectedProductId(products[0]?.id || '');
    } else {
      getProducts({ size: 100 })
        .then((res) => {
          if (res?.items?.length) {
            setItemList(res.items);
            setSelectedProductId(res.items[0].id);
          }
        })
        .catch(() => {});
    }
  }, [products]);

  const currency = storeSettings?.currency_symbol || '₹';

  // Find selected product
  const selectedProduct = itemList.find((p) => p.id === parseInt(selectedProductId)) || itemList[0];

  // Calculate price per gram based on mode
  const pricePerGramInfo = useMemo(() => {
    if (mode === 'product' && selectedProduct) {
      return getPricePerGram(selectedProduct.price_options);
    }
    // Manual mode
    const rate = parseFloat(manualRate);
    if (!isNaN(rate) && rate > 0) {
      const divisor = manualUnit === 'kg' ? 1000 : 100;
      return {
        pricePerGram: rate / divisor,
        basePrice: rate,
        baseGrams: divisor,
        baseLabel: manualUnit === 'kg' ? '1 किलो' : '100 ग्राम',
      };
    }
    return null;
  }, [mode, selectedProduct, manualRate, manualUnit]);

  // Calculated grams for currently entered rupees
  const currentGrams = useMemo(() => {
    const amt = parseFloat(rupees);
    if (isNaN(amt) || amt <= 0 || !pricePerGramInfo || pricePerGramInfo.pricePerGram <= 0) {
      return 0;
    }
    return Math.round(amt / pricePerGramInfo.pricePerGram);
  }, [rupees, pricePerGramInfo]);

  // Quick table for ₹5, ₹10, ₹15, ₹20, ₹25, ₹30, ₹50, ₹100
  const quickTable = useMemo(() => {
    if (!pricePerGramInfo) return [];
    return generateQuickRupeeTable(pricePerGramInfo.pricePerGram, [5, 10, 15, 20, 25, 30, 50, 100]);
  }, [pricePerGramInfo]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in text-[#F5F0E7]"
    >
      <div className="bg-[#17171C] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#302E31] max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-[#302E31] flex items-center justify-between bg-[#101014]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#202027] text-[#D2AC68] border border-[#302E31] flex items-center justify-center">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#F5F0E7] flex items-center gap-2">
                <span>कांटा कैलकुलेटर</span>
                <span className="text-xs bg-[#D2AC68] text-[#0A0A0C] font-bold px-2 py-0.5 rounded">
                  ₹ से वजन
                </span>
              </h2>
              <p className="text-xs text-[#817C77]">
                ग्राहक बोले 10 या 15 रुपये का दो, तो बिना दिमाग लगाए सीधे ग्राम देखें।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#202027] rounded-lg transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#101014] rounded-xl border border-[#302E31]">
            <button
              type="button"
              onClick={() => setMode('product')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'product'
                  ? 'bg-[#202027] text-[#D2AC68] border border-[#D2AC68]/40 shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7]'
              }`}
            >
              1. दुकान का सामान चुनें
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'manual'
                  ? 'bg-[#202027] text-[#D2AC68] border border-[#D2AC68]/40 shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7]'
              }`}
            >
              2. सीधा भाव भरें (₹/kg)
            </button>
          </div>

          {/* Mode 1: Product Selector */}
          {mode === 'product' ? (
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                सामान चुनें (Select Item):
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none font-bold cursor-pointer"
              >
                {itemList.map((p) => {
                  const opts = p.price_options || [];
                  const defaultOpt = opts.find((o) => o.is_default) || opts[0];
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} {defaultOpt ? `(₹${parseFloat(defaultOpt.price).toFixed(0)} / ${defaultOpt.unit_label})` : ''}
                    </option>
                  );
                })}
              </select>

              {pricePerGramInfo && (
                <p className="text-xs text-[#817C77] pt-0.5">
                  वर्तमान भाव:{' '}
                  <span className="font-bold text-[#D2AC68]">
                    {currency}{pricePerGramInfo.basePrice}
                  </span>{' '}
                  प्रति {pricePerGramInfo.baseLabel}
                </p>
              )}
            </div>
          ) : (
            /* Mode 2: Manual Rate Input */
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                  आज का भाव (Rate):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D2AC68]">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    placeholder="80"
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-[#101014] text-[#D2AC68] font-bold rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                  भाव की इकाई:
                </label>
                <select
                  value={manualUnit}
                  onChange={(e) => setManualUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] font-semibold rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none cursor-pointer"
                >
                  <option value="kg">प्रति 1 किलो (1000g)</option>
                  <option value="100g">प्रति 100 ग्राम (मसाले)</option>
                </select>
              </div>
            </div>
          )}

          {/* Customer Requested Rupee Amount */}
          <div className="space-y-2 pt-2 border-t border-[#302E31]">
            <label className="text-xs sm:text-sm font-bold text-[#F5F0E7] block">
              ग्राहक ने कितने रुपये का मांगा? (Select Rupee Amount)
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {[5, 10, 15, 20, 25, 30, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setRupees(amt.toString())}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center ${
                    rupees === amt.toString()
                      ? 'bg-[#D2AC68] text-[#0A0A0C] border-[#D2AC68] shadow-md scale-102'
                      : 'bg-[#101014] text-[#D2AC68] border-[#302E31] hover:border-[#D2AC68]/40'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Custom Rupee Amount Input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#817C77] shrink-0 font-medium">या अन्य रुपये भरें:</span>
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D2AC68]">
                  {currency}
                </span>
                <input
                  type="number"
                  min="1"
                  value={rupees}
                  onChange={(e) => setRupees(e.target.value)}
                  placeholder="रुपये"
                  className="w-full pl-7 pr-3 py-1.5 text-xs sm:text-sm font-bold bg-[#101014] text-[#D2AC68] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Big Clear Result Display for Aged Owner */}
          <div className="bg-[#101014] rounded-2xl p-4 sm:p-5 border-2 border-[#D2AC68] shadow-lg space-y-1 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817C77] block">
              ⚖️ डिजिटल कांटे पर इतना तौलें (Exact Scale Weight):
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D2AC68] py-1 tabular-nums">
              👉 {formatGramsToScaleText(currentGrams)}
            </div>
            {pricePerGramInfo && (
              <p className="text-xs text-[#B0AAA1]">
                {currency}{rupees} में लगभग{' '}
                <span className="font-bold text-[#F5F0E7]">{currentGrams} ग्राम</span> सामान आएगा{' '}
                <span className="text-[#817C77]">
                  ({currency}{pricePerGramInfo.basePrice} / {pricePerGramInfo.baseLabel} के हिसाब से)
                </span>
              </p>
            )}
          </div>

          {/* Quick Reference Conversion Sheet */}
          {quickTable.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#B0AAA1] block">
                📋 त्वरित पर्ची (Quick Rate Chart for this item):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickTable.map((item) => (
                  <div
                    key={item.rupees}
                    onClick={() => setRupees(item.rupees.toString())}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                      rupees === item.rupees.toString()
                        ? 'bg-[#202027] border-[#D2AC68]'
                        : 'bg-[#101014] border-[#302E31] hover:border-[#D2AC68]/40'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#D2AC68] block">
                      ₹{item.rupees} का =
                    </span>
                    <span className="text-xs font-semibold text-[#F5F0E7] block mt-0.5">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 px-6 py-3 border-t border-[#302E31] bg-[#101014] flex items-center justify-between">
          <span className="text-xs text-[#817C77]">
            इलेक्ट्रॉनिक कांटे के लिए प्रमाणित गणना
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
          >
            समझ आ गया (बंद करें)
          </button>
        </div>
      </div>
    </div>
  );
}
