import React from 'react';
import { Plus, Trash2, Scale, Package, Layers, Sparkles } from 'lucide-react';

export default function PricingOptionsEditor({
  pricingType,
  onPricingTypeChange,
  priceOptions,
  onChangeOptions,
  currencySymbol = '₹',
}) {
  const handleAddOption = (unit_label, quantity_value = null, quantity_unit = null, price = '') => {
    const newOption = {
      unit_label,
      quantity_value: quantity_value !== null ? parseFloat(quantity_value) : null,
      quantity_unit,
      price: price !== '' ? parseFloat(price) : '',
      is_default: priceOptions.length === 0,
      sort_order: priceOptions.length + 1,
    };
    onChangeOptions([...priceOptions, newOption]);
  };

  const handleUpdateOption = (index, field, value) => {
    const updated = [...priceOptions];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' || field === 'quantity_value' ? (value === '' ? '' : parseFloat(value) || 0) : value,
    };
    onChangeOptions(updated);
  };

  const handleSetDefault = (index) => {
    const updated = priceOptions.map((opt, i) => ({
      ...opt,
      is_default: i === index,
    }));
    onChangeOptions(updated);
  };

  const handleRemoveOption = (index) => {
    if (priceOptions.length <= 1) {
      alert('कम से कम एक भाव की लाइन होना ज़रूरी है।');
      return;
    }
    const updated = priceOptions.filter((_, i) => i !== index);
    if (!updated.some((o) => o.is_default)) {
      updated[0].is_default = true;
    }
    onChangeOptions(updated);
  };

  // Preset quick buttons in Hindi
  const renderPresets = () => {
    if (pricingType === 'weight') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[#817C77] mr-1">त्वरित वजन जोड़ें:</span>
          <button
            type="button"
            onClick={() => handleAddOption('1 पाव (250 ग्राम)', 250, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 पाव (250g)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('500 ग्राम (आधा किलो)', 500, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + आधा किलो (500g)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('750 ग्राम', 750, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 750 ग्राम
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 किलो (1 kg)', 1000, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 किलो (1 kg)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('5 किलो कट्टा', 5000, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 5 किलो कट्टा
          </button>
        </div>
      );
    }

    if (pricingType === 'small_quantity') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[#817C77] mr-1">मसाले के माप:</span>
          <button
            type="button"
            onClick={() => handleAddOption('10 ग्राम', 10, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 10 ग्राम
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('20 ग्राम', 20, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 20 ग्राम
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('50 ग्राम', 50, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 50 ग्राम
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('100 ग्राम', 100, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 100 ग्राम
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 पाव (250 ग्राम)', 250, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 पाव (250g)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 किलो', 1000, 'g')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 किलो
          </button>
        </div>
      );
    }

    if (pricingType === 'custom_unit') {
      return (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[#817C77] mr-1">इकाई माप:</span>
          <button
            type="button"
            onClick={() => handleAddOption('1 पीस (1 Piece)', 1, 'piece')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 पीस
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('आधा दर्जन (6 पीस)', 6, 'piece')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + आधा दर्जन (6)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 दर्जन (12 पीस)', 12, 'piece')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 दर्जन (12)
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 बोतल (Bottle)', 1, 'bottle')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 बोतल
          </button>
          <button
            type="button"
            onClick={() => handleAddOption('1 लीटर पाउच', 1, 'litre')}
            className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
          >
            + 1 लीटर पाउच
          </button>
        </div>
      );
    }

    // Packaged
    return (
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-[#817C77] mr-1">पैकेट माप:</span>
        <button
          type="button"
          onClick={() => handleAddOption('200 ग्राम पैकेट', 200, 'g')}
          className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
        >
          + 200g पैकेट
        </button>
        <button
          type="button"
          onClick={() => handleAddOption('500 ग्राम पैकेट', 500, 'g')}
          className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
        >
          + 500g पैकेट
        </button>
        <button
          type="button"
          onClick={() => handleAddOption('1 किलो पैकेट', 1000, 'g')}
          className="px-3 py-1.5 text-xs bg-[#202027] hover:bg-[#101014] text-[#D2AC68] hover:text-[#E8CA91] font-semibold rounded-lg border border-[#302E31] hover:border-[#D2AC68]/40 cursor-pointer"
        >
          + 1 किलो पैकेट
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4 bg-[#17171C] p-4 sm:p-5 rounded-2xl border border-[#302E31] text-[#F5F0E7]">
      {/* Pricing Type Selector */}
      <div>
        <label className="text-xs sm:text-sm font-bold text-[#F5F0E7] block mb-2">
          सामान बेचने का तरीका चुनें <span className="text-[#F08A83]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onPricingTypeChange('weight')}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              pricingType === 'weight'
                ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm ring-1 ring-[#D2AC68]'
                : 'bg-[#101014] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
            }`}
          >
            <Scale className={`w-5 h-5 mb-2 ${pricingType === 'weight' ? 'text-[#D2AC68]' : 'text-[#817C77]'}`} />
            <div>
              <span className="text-xs sm:text-sm font-bold block">1. वजन के अनुसार</span>
              <span className={`text-[11px] block mt-0.5 ${pricingType === 'weight' ? 'text-[#E8CA91]' : 'text-[#817C77]'}`}>
                दाल, चीनी, आटा, चावल
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPricingTypeChange('small_quantity')}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              pricingType === 'small_quantity'
                ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm ring-1 ring-[#D2AC68]'
                : 'bg-[#101014] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-2 ${pricingType === 'small_quantity' ? 'text-[#D2AC68]' : 'text-[#817C77]'}`} />
            <div>
              <span className="text-xs sm:text-sm font-bold block">2. छोटे मसाले</span>
              <span className={`text-[11px] block mt-0.5 ${pricingType === 'small_quantity' ? 'text-[#E8CA91]' : 'text-[#817C77]'}`}>
                जीरा, राई, सौंफ (10g-100g)
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPricingTypeChange('packaged')}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              pricingType === 'packaged'
                ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm ring-1 ring-[#D2AC68]'
                : 'bg-[#101014] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
            }`}
          >
            <Package className={`w-5 h-5 mb-2 ${pricingType === 'packaged' ? 'text-[#D2AC68]' : 'text-[#817C77]'}`} />
            <div>
              <span className="text-xs sm:text-sm font-bold block">3. तैयार पैकेट</span>
              <span className={`text-[11px] block mt-0.5 ${pricingType === 'packaged' ? 'text-[#E8CA91]' : 'text-[#817C77]'}`}>
                चाय, पोहा, बिस्किट, तेल थैली
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPricingTypeChange('custom_unit')}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              pricingType === 'custom_unit'
                ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm ring-1 ring-[#D2AC68]'
                : 'bg-[#101014] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
            }`}
          >
            <Layers className={`w-5 h-5 mb-2 ${pricingType === 'custom_unit' ? 'text-[#D2AC68]' : 'text-[#817C77]'}`} />
            <div>
              <span className="text-xs sm:text-sm font-bold block">4. पीस या बोतल</span>
              <span className={`text-[11px] block mt-0.5 ${pricingType === 'custom_unit' ? 'text-[#E8CA91]' : 'text-[#817C77]'}`}>
                साबुन, बोतल, 1 पीस, दर्जन
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Preset helpers */}
      {renderPresets()}

      {/* Pricing options list */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-[#F5F0E7]">
            तौल / माप और आज का भाव ({priceOptions.length}) <span className="text-[#F08A83]">*</span>
          </label>

          <button
            type="button"
            onClick={() => handleAddOption('नया माप', null, null, '')}
            className="text-xs font-bold text-[#D2AC68] hover:text-[#E8CA91] flex items-center gap-1 cursor-pointer bg-[#202027] px-3 py-1.5 rounded-lg border border-[#302E31]"
          >
            <Plus className="w-4 h-4" />
            <span>+ अलग लाइन जोड़ें</span>
          </button>
        </div>

        <p className="text-xs text-[#817C77]">
          💡 जिस तौल पर गोल टिक लगा होगा, वही मुख्य भाव दुकान पर सबसे बड़ा दिखाई देगा।
        </p>

        <div className="space-y-2.5">
          {priceOptions.map((opt, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all bg-[#101014] flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                opt.is_default ? 'border-[#D2AC68] ring-1 ring-[#D2AC68]/40' : 'border-[#302E31]'
              }`}
            >
              {/* Radio default */}
              <label
                className="flex items-center gap-2 cursor-pointer shrink-0"
                title="इसे मुख्य भाव बनाएं (वेबसाइट पर सबसे पहले दिखेगा)"
              >
                <input
                  type="radio"
                  name="default_price_option"
                  checked={opt.is_default}
                  onChange={() => handleSetDefault(idx)}
                  className="w-4 h-4 accent-[#D2AC68] cursor-pointer"
                />
                <span className={`text-xs font-bold ${opt.is_default ? 'text-[#D2AC68]' : 'text-[#817C77]'}`}>
                  मुख्य भाव
                </span>
              </label>

              {/* Unit Label (Left Column) */}
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={opt.unit_label}
                  onChange={(e) => handleUpdateOption(idx, 'unit_label', e.target.value)}
                  placeholder="उदा: 1 पाव (250g), 1 किलो, 500g पैकेट"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#17171C] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
                />
              </div>

              {/* Quantity Value & Unit (Optional normalized) */}
              <div className="flex items-center gap-1.5 w-full sm:w-40">
                <input
                  type="number"
                  step="any"
                  value={opt.quantity_value !== null ? opt.quantity_value : ''}
                  onChange={(e) => handleUpdateOption(idx, 'quantity_value', e.target.value)}
                  placeholder="माप (250)"
                  className="w-24 px-2.5 py-2 text-xs sm:text-sm bg-[#17171C] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums"
                />
                <input
                  type="text"
                  value={opt.quantity_unit || ''}
                  onChange={(e) => handleUpdateOption(idx, 'quantity_unit', e.target.value)}
                  placeholder="इकाई (g)"
                  className="w-16 px-2 py-2 text-xs sm:text-sm bg-[#17171C] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
                />
              </div>

              {/* Price input (Right Column) with bold currency symbol */}
              <div className="flex items-center gap-1 w-full sm:w-40">
                <span className="text-sm font-bold text-[#D2AC68]">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={opt.price}
                  onChange={(e) => handleUpdateOption(idx, 'price', e.target.value)}
                  placeholder="भाव (₹)"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#17171C] font-bold text-[#D2AC68] tabular-nums rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveOption(idx)}
                className="p-2 text-[#817C77] hover:text-[#F08A83] rounded-lg transition-colors cursor-pointer shrink-0 ml-auto"
                title="यह भाव हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
