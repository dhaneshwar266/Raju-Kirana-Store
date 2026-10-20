import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import PricingOptionsEditor from './PricingOptionsEditor';
import ImageUpload from './ImageUpload';
import ProductCard from '../ProductCard';

export default function ProductFormModal({
  product,
  categories,
  onSave,
  onClose,
  showToast,
  currencySymbol = '₹',
}) {
  const isEditing = !!product;

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pricingType, setPricingType] = useState('weight');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceOptions, setPriceOptions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setBrand(product.brand || '');
      setCategoryId(product.category_id || (categories[0]?.id || ''));
      setPricingType(product.pricing_type || 'weight');
      setImageUrl(product.image_url || '');
      setIsAvailable(product.is_available ?? true);
      setPriceOptions(
        product.price_options?.map((opt) => ({
          ...opt,
          price: parseFloat(opt.price),
        })) || []
      );
    } else {
      setName('');
      setBrand('');
      setCategoryId(categories[0]?.id || '');
      setPricingType('weight');
      setImageUrl('');
      setIsAvailable(true);
      // Default price options for weight-based item
      setPriceOptions([
        { unit_label: '1 पाव (250 ग्राम)', quantity_value: 250, quantity_unit: 'g', price: 20, is_default: false, sort_order: 1 },
        { unit_label: '500 ग्राम (आधा किलो)', quantity_value: 500, quantity_unit: 'g', price: 40, is_default: false, sort_order: 2 },
        { unit_label: '1 किलो (1 kg)', quantity_value: 1000, quantity_unit: 'g', price: 80, is_default: true, sort_order: 3 },
      ]);
    }
  }, [product, categories]);

  const handlePricingTypeChange = (newType) => {
    setPricingType(newType);
    if (!product) {
      if (newType === 'packaged') {
        setPriceOptions([
          { unit_label: '500 ग्राम पैकेट', quantity_value: 500, quantity_unit: 'g', price: 35, is_default: true, sort_order: 1 },
        ]);
      } else if (newType === 'small_quantity') {
        setPriceOptions([
          { unit_label: '50 ग्राम', quantity_value: 50, quantity_unit: 'g', price: 20, is_default: false, sort_order: 1 },
          { unit_label: '100 ग्राम', quantity_value: 100, quantity_unit: 'g', price: 38, is_default: true, sort_order: 2 },
          { unit_label: '250 ग्राम (1 पाव)', quantity_value: 250, quantity_unit: 'g', price: 90, is_default: false, sort_order: 3 },
        ]);
      } else if (newType === 'custom_unit') {
        setPriceOptions([
          { unit_label: '1 पीस (Piece)', quantity_value: 1, quantity_unit: 'piece', price: 10, is_default: true, sort_order: 1 },
        ]);
      } else {
        setPriceOptions([
          { unit_label: '1 पाव (250 ग्राम)', quantity_value: 250, quantity_unit: 'g', price: 20, is_default: false, sort_order: 1 },
          { unit_label: '500 ग्राम (आधा किलो)', quantity_value: 500, quantity_unit: 'g', price: 40, is_default: false, sort_order: 2 },
          { unit_label: '1 किलो (1 kg)', quantity_value: 1000, quantity_unit: 'g', price: 80, is_default: true, sort_order: 3 },
        ]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast({ type: 'error', title: 'सामान का नाम भरें', message: 'कृपया सामान का नाम अवश्य लिखें।' });
      return;
    }

    if (!categoryId) {
      showToast({ type: 'error', title: 'श्रेणी चुनें', message: 'कृपया सामान की श्रेणी चुनें।' });
      return;
    }

    if (!priceOptions || priceOptions.length === 0) {
      showToast({ type: 'error', title: 'भाव दर्ज करें', message: 'कम से कम एक तौल और भाव का होना आवश्यक है।' });
      return;
    }

    for (const opt of priceOptions) {
      if (!opt.unit_label || !opt.unit_label.trim()) {
        showToast({ type: 'error', title: 'माप का नाम भरें', message: 'हर भाव का माप (उदा: 1 किलो, 1 पाव) लिखना आवश्यक है।' });
        return;
      }
      if (opt.price === '' || opt.price < 0 || isNaN(opt.price)) {
        showToast({ type: 'error', title: 'सही भाव भरें', message: `'${opt.unit_label}' का भाव सही संख्या में लिखें।` });
        return;
      }
    }

    const payload = {
      name: name.trim(),
      brand: brand.trim() || null,
      category_id: parseInt(categoryId),
      description: product?.description || null,
      pricing_type: pricingType,
      image_url: imageUrl || null,
      is_available: isAvailable,
      is_featured: product?.is_featured ?? false,
      price_options: priceOptions.map((opt, i) => ({
        unit_label: opt.unit_label.trim(),
        quantity_value: opt.quantity_value !== null && opt.quantity_value !== '' ? parseFloat(opt.quantity_value) : null,
        quantity_unit: opt.quantity_unit?.trim() || null,
        price: parseFloat(opt.price),
        is_default: opt.is_default || i === 0,
        sort_order: i + 1,
      })),
    };

    try {
      setSaving(true);
      await onSave(payload, product?.id);
    } catch (err) {
      // toast handled by parent
    } finally {
      setSaving(false);
    }
  };

  // Virtual product object for live preview
  const previewProduct = {
    id: 9999,
    name: name || 'सामान का नाम (उदा: आटा)',
    brand: brand || null,
    category: categories.find((c) => c.id === parseInt(categoryId)),
    description: null,
    pricing_type: pricingType,
    image_url: imageUrl || null,
    is_available: isAvailable,
    is_featured: false,
    price_options: priceOptions.length > 0 ? priceOptions : [{ unit_label: '1 kg', price: 0, is_default: true }],
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in text-[#F5F0E7]"
    >
      <div className="bg-[#17171C] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#302E31] max-h-[90vh] flex flex-col my-auto">
        {/* Fixed Modal Header */}
        <div className="shrink-0 px-6 py-4 border-b border-[#302E31] flex items-center justify-between bg-[#101014]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F5F0E7]">
              {isEditing ? `सामान और भाव बदलें: ${product.name}` : 'दुकान में नया सामान जोड़ें'}
            </h2>
            <p className="text-xs sm:text-sm text-[#817C77]">
              सामान का नाम, कंपनी, दुकान में मौजूदगी और आज के ताजा भाव यहाँ भरें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 rounded-lg border border-[#302E31] text-xs font-semibold text-[#B0AAA1] hover:text-[#D2AC68] bg-[#17171C] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="कार्ड कैसा दिखेगा, चेक करें"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showPreview ? 'कार्ड छुपाएं' : 'कार्ड देखें'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#202027] rounded-lg transition-colors cursor-pointer"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Container with Scrollable Body and Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Card Preview Dropdown if toggled */}
            {showPreview && (
              <div className="p-4 bg-[#101014] rounded-xl border border-[#302E31] space-y-2">
                <span className="text-xs font-bold text-[#D2AC68] uppercase tracking-wider block">
                  👀 दुकान पर ग्राहक को ऐसा दिखेगा:
                </span>
                <div className="max-w-xs mx-auto">
                  <ProductCard product={previewProduct} onSelect={() => {}} currencySymbol={currencySymbol} />
                </div>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D2AC68]">
                1. सामान की जानकारी (Product Details)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                    सामान का नाम <span className="text-[#F08A83]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा: शरबती गेहूं आटा, अरहर दाल, टाटा नमक"
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                    कंपनी या ब्रांड का नाम (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="उदा: आशीर्वाद, टाटा, फार्च्यून, खुली मण्डी"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                    दुकान की श्रेणी चुनें <span className="text-[#F08A83]">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium cursor-pointer"
                  >
                    <option value="">श्रेणी चुनें</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 sm:pt-6">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-[#101014] px-4 py-2.5 rounded-xl border border-[#302E31] hover:border-[#D2AC68]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 accent-[#D2AC68] rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#F5F0E7]">
                      ✓ दुकान में उपलब्ध है (In Stock)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Product Image */}
            <div className="space-y-2 pt-2 border-t border-[#302E31]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D2AC68]">
                2. सामान की फोटो (Product Photo)
              </h3>
              <ImageUpload
                imageUrl={imageUrl}
                onImageUploaded={setImageUrl}
                showToast={showToast}
              />
            </div>

            {/* Section 3: Pricing System */}
            <div className="space-y-3 pt-2 border-t border-[#302E31]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D2AC68]">
                3. तौल और आज का ताजा भाव (Weights & Rates)
              </h3>

              <PricingOptionsEditor
                pricingType={pricingType}
                onPricingTypeChange={handlePricingTypeChange}
                priceOptions={priceOptions}
                onChangeOptions={setPriceOptions}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>

          {/* Fixed Footer at the bottom */}
          <div className="shrink-0 px-6 py-4 border-t border-[#302E31] bg-[#101014] flex items-center justify-end gap-3 z-10 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027] rounded-xl transition-colors cursor-pointer border border-[#302E31]"
            >
              रद्द करें (Cancel)
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>सुरक्षित हो रहा है...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'बदलाव सुरक्षित करें (Save Changes)' : 'दुकान में जोड़ें (Save Product)'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
