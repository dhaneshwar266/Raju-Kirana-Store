import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, FolderPlus } from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { createCategory, updateCategory, deleteCategory } from '../../api/categories';

const AVAILABLE_ICONS = [
  'ShoppingBag',
  'Wheat',
  'Boxes',
  'Droplets',
  'Sparkles',
  'Cookie',
  'Package',
  'Coffee',
  'CupSoda',
  'Heart',
  'Sparkle',
  'Milk',
  'Layers',
];

export default function CategoryManager({ categories = [], onRefresh, showToast }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('ShoppingBag');
  const [sortOrder, setSortOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIconName('ShoppingBag');
    setSortOrder(0);
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIconName(cat.icon_name || 'ShoppingBag');
    setSortOrder(cat.sort_order || 0);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({ type: 'error', title: 'त्रुटि', message: 'श्रेणी का नाम लिखना आवश्यक है।' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        icon_name: iconName,
        sort_order: parseInt(sortOrder) || 0,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        showToast({ type: 'success', title: 'अपडेट सफल', message: `'${name}' श्रेणी की जानकारी सुरक्षित हो गई।` });
      } else {
        await createCategory(payload);
        showToast({ type: 'success', title: 'नई श्रेणी बनी', message: `'${name}' श्रेणी दुकान में जुड़ गई।` });
      }

      resetForm();
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: err.message || 'कार्रवाई पूरी नहीं हो सकी।' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.product_count > 0) {
      showToast({
        type: 'error',
        title: 'श्रेणी नहीं हटाई जा सकती',
        message: `'${cat.name}' में अभी ${cat.product_count} सामान मौजूद हैं। पहले उन सामानों को दूसरी श्रेणी में बदलें या हटाएं।`,
      });
      return;
    }

    if (!window.confirm(`क्या आप खाली श्रेणी '${cat.name}' को हटाना चाहते हैं?`)) {
      return;
    }

    try {
      await deleteCategory(cat.id);
      showToast({ type: 'success', title: 'श्रेणी हटाई गई', message: `'${cat.name}' श्रेणी हटा दी गई है।` });
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: err.message || 'श्रेणी हटाई नहीं जा सकी।' });
    }
  };

  return (
    <div className="space-y-6 bg-[#0A0A0C] text-[#F5F0E7]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#302E31]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7]">
            दुकान की श्रेणियां <span className="text-xs font-normal text-[#817C77]">(Store Categories)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B0AAA1] mt-1">
            यहाँ से दुकान के विभाग (जैसे आटा, दाल, मसाले, तेल, बिस्किट) नए बना सकते हैं या नाम बदल सकते हैं।
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="px-5 py-3 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>+ नई श्रेणी जोड़ें (Add Category)</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#17171C] border border-[#302E31] p-5 sm:p-6 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#302E31]">
            <h3 className="text-sm sm:text-base font-bold text-[#D2AC68] flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#D2AC68]" />
              <span>{editingCategory ? `श्रेणी बदलें: ${editingCategory.name}` : 'नई श्रेणी जोड़ें'}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-[#817C77] hover:text-[#F5F0E7] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                श्रेणी का नाम <span className="text-[#F08A83]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा: सूखे मेवे और ड्राई फ्रूट्स"
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">चिन्ह (Icon)</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none cursor-pointer"
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">विवरण (वैकल्पिक)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="इस श्रेणी में क्या सामान मिलता है"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">क्रम संख्या (Sort Order)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#302E31]">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-[#17171C] rounded-2xl border border-[#302E31] overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#101014] border-b border-[#302E31] text-[#817C77] font-semibold text-xs">
            <tr>
              <th className="py-3 px-5">श्रेणी का नाम (Category)</th>
              <th className="py-3 px-4 hidden sm:table-cell">कोड (Slug)</th>
              <th className="py-3 px-4">कुल सामान (Items)</th>
              <th className="py-3 px-5 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#302E31]/70">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#202027]/50 transition-colors">
                <td className="py-3.5 px-5 font-medium text-[#F5F0E7] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#202027] text-[#D2AC68] border border-[#302E31] flex items-center justify-center shrink-0">
                    {getCategoryIcon(cat.icon_name, 'w-4 h-4')}
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{cat.name}</span>
                    {cat.description && (
                      <span className="text-xs text-[#817C77] block font-normal mt-0.5">{cat.description}</span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[#817C77] font-mono hidden sm:table-cell text-xs">
                  {cat.slug}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded font-bold text-xs tabular-nums border ${
                      cat.product_count > 0
                        ? 'bg-[#101014] text-[#D2AC68] border-[rgba(210,172,104,0.3)]'
                        : 'bg-[#101014] text-[#817C77] border-[#302E31]'
                    }`}
                  >
                    {cat.product_count || 0} सामान
                  </span>
                </td>

                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#B0AAA1] hover:text-[#D2AC68] bg-[#202027] hover:bg-[#101014] border border-[#302E31] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      title="नाम बदलें"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">बदलें</span>
                    </button>

                    <button
                      onClick={() => handleDelete(cat)}
                      className={`p-1.5 rounded-lg border border-[#302E31] transition-colors cursor-pointer ${
                        cat.product_count > 0
                          ? 'text-[#817C77]/40 cursor-not-allowed'
                          : 'text-[#817C77] hover:text-[#F08A83] bg-[#202027] hover:bg-[#101014]'
                      }`}
                      title={cat.product_count > 0 ? 'सामान मौजूद है, खाली करके ही हटा सकते हैं' : 'श्रेणी हटाएं'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
