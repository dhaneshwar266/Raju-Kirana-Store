import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { deleteProduct, updateProduct } from '../../api/products';
import { getFullImageUrl } from '../../api/client';

export default function ProductList({
  products,
  totalProducts,
  categories,
  onAddNewProduct,
  onEditProduct,
  onRefresh,
  showToast,
  currencySymbol = '₹',
}) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Pricing type friendly Hindi label map
  const getPricingTypeName = (type) => {
    switch (type) {
      case 'weight':
        return '⚖️ वजन (किलो/पाव)';
      case 'small_quantity':
        return '✨ मसाले (ग्राम)';
      case 'packaged':
        return '📦 पैकेट';
      case 'custom_unit':
        return '🏷️ पीस/बोतल';
      default:
        return type;
    }
  };

  // Client-side filtering on admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = !selectedCat || p.category_id === parseInt(selectedCat);

    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'in_stock' && p.is_available) ||
      (statusFilter === 'out_of_stock' && !p.is_available);

    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginated = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStock = async (product) => {
    const nextStatus = !product.is_available;
    try {
      await updateProduct(product.id, {
        is_available: nextStatus,
      });
      showToast({
        type: 'success',
        title: nextStatus ? 'दुकान में उपलब्ध' : 'सामान खत्म दर्ज',
        message: `${product.name} अब ${nextStatus ? 'उपलब्ध (In Stock)' : 'खत्म (Out of Stock)'} सेट हो गया है।`,
      });
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: err.message || 'स्टॉक स्थिति अपडेट नहीं हो सकी।' });
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`क्या आप "${product.name}" को दुकान की लिस्ट से सचमुच हटाना चाहते हैं?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      showToast({ type: 'success', title: 'सामान हटाया गया', message: `"${product.name}" दुकान की लिस्ट से हटा दिया गया है।` });
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: err.message || 'सामान हटाया नहीं जा सका।' });
    }
  };

  return (
    <div className="space-y-6 bg-[#0A0A0C] text-[#F5F0E7]">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#302E31]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7]">
            दुकान का सामान और भाव <span className="text-xs font-normal text-[#817C77]">(Products & Rates)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B0AAA1] mt-1">
            यहाँ से नया सामान जोड़ें, आज के भाव बदलें, या सामान खत्म होने पर बटन दबाकर बंद करें।
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-5 py-3 btn-gold-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>+ नया सामान जोड़ें (Add Product)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#17171C] p-4 rounded-xl border border-[#302E31] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817C77]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="सामान या ब्रांड का नाम खोजें (उदा: आटा, दाल, जीरा, तेल)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => {
            setSelectedCat(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-52 px-3 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#B0AAA1] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium cursor-pointer"
        >
          <option value="">सभी श्रेणियां (All Categories)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-48 px-3 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#B0AAA1] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium cursor-pointer"
        >
          <option value="">सभी स्थिति (All)</option>
          <option value="in_stock">✅ उपलब्ध सामान (In Stock)</option>
          <option value="out_of_stock">❌ खत्म सामान (Out of Stock)</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-[#17171C] rounded-2xl border border-[#302E31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#101014] border-b border-[#302E31] text-[#817C77] font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">सामान (Product)</th>
                <th className="py-3 px-3">श्रेणी (Category)</th>
                <th className="py-3 px-3">तरीका (Type)</th>
                <th className="py-3 px-3">आज के भाव (Rates)</th>
                <th className="py-3 px-3">दुकान में है या खत्म?</th>
                <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#302E31]/70">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#817C77]">
                    कोई सामान नहीं मिला। आप ऊपर दिए गए पीले बटन से नया सामान जोड़ सकते हैं।
                  </td>
                </tr>
              ) : (
                paginated.map((product) => {
                  const opts = product.price_options || [];

                  return (
                    <tr key={product.id} className="hover:bg-[#202027]/50 transition-colors">
                      {/* Product Name & Brand */}
                      <td className="py-3.5 px-4 font-medium text-[#F5F0E7]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#101014] border border-[#302E31] overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image_url ? (
                              <img src={getFullImageUrl(product.image_url)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-[#817C77]" />
                            )}
                          </div>
                          <div>
                            <span className="block font-bold text-[#F5F0E7] text-sm sm:text-base leading-snug">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.brand && (
                                <span className="text-xs text-[#D2AC68] font-medium">{product.brand}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-[#B0AAA1] font-medium">
                        {product.category?.name || '—'}
                      </td>

                      {/* Pricing Type */}
                      <td className="py-3.5 px-3 text-[#817C77] text-xs">
                        {getPricingTypeName(product.pricing_type)}
                      </td>

                      {/* Rates list */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          {opts.slice(0, 3).map((opt) => (
                            <div key={opt.id} className="text-xs text-[#B0AAA1]">
                              <span className="font-bold text-[#D2AC68] tabular-nums text-sm">
                                {currencySymbol}{parseFloat(opt.price).toFixed(2)}
                              </span>{' '}
                              <span className="text-[#817C77]">/ {opt.unit_label}</span>
                              {opt.is_default && (
                                <span className="text-[10px] text-[#D2AC68] ml-1 font-bold">★ मुख्य</span>
                              )}
                            </div>
                          ))}
                          {opts.length > 3 && (
                            <span className="text-[11px] text-[#817C77] italic block">
                              +{opts.length - 3} अन्य भाव
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 1-Click Availability Toggle */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                            product.is_available
                              ? 'bg-[#101014] text-[#70C69A] border-[#70C69A]/40 hover:bg-[#70C69A]/10'
                              : 'bg-[#101014] text-[#F08A83] border-[#F08A83]/40 hover:bg-[#F08A83]/10'
                          }`}
                          title="क्लिक करके स्थिति बदलें (उपलब्ध / खत्म)"
                        >
                          {product.is_available ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#70C69A]" />
                              <span>उपलब्ध है</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-[#F08A83]" />
                              <span>खत्म है</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Edit & Delete Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="px-2.5 py-1.5 bg-[#202027] hover:bg-[#D2AC68] text-[#F5F0E7] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                            title="भाव और जानकारी बदलें"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">भाव बदलें</span>
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 bg-[#202027] hover:bg-[#F08A83] text-[#817C77] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#F08A83] rounded-lg transition-colors cursor-pointer"
                            title="सामान हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#302E31] flex items-center justify-between text-xs sm:text-sm text-[#817C77] bg-[#101014]">
            <div>
              पेज <span className="font-bold text-[#F5F0E7] tabular-nums">{currentPage}</span> / कुल{' '}
              <span className="font-bold text-[#F5F0E7] tabular-nums">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg border border-[#302E31] bg-[#17171C] text-[#B0AAA1] hover:text-[#F5F0E7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg border border-[#302E31] bg-[#17171C] text-[#B0AAA1] hover:text-[#F5F0E7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
