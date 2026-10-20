import React from 'react';
import { Package, Layers, CheckCircle2, AlertCircle, Plus, Edit2, ArrowRight } from 'lucide-react';
import { getFullImageUrl } from '../../api/client';

export default function DashboardOverview({
  overviewData,
  onAddNewProduct,
  onEditProduct,
  onNavigateTab,
  currencySymbol = '₹',
}) {
  const stats = [
    {
      label: 'दुकान में कुल सामान',
      english: 'Total Products',
      value: overviewData?.total_products || 0,
      icon: Package,
      color: 'bg-[#202027] text-[#D2AC68] border-[#302E31]',
    },
    {
      label: 'दुकान में उपलब्ध सामान',
      english: 'In Stock Items',
      value: overviewData?.in_stock_products || 0,
      icon: CheckCircle2,
      color: 'bg-[#202027] text-[#70C69A] border-[#302E31]',
    },
    {
      label: 'अभी खत्म हुआ सामान',
      english: 'Out of Stock',
      value: overviewData?.out_of_stock_products || 0,
      icon: AlertCircle,
      color: 'bg-[#202027] text-[#F08A83] border-[#302E31]',
    },
    {
      label: 'सामान की श्रेणियां',
      english: 'Categories',
      value: overviewData?.total_categories || 0,
      icon: Layers,
      color: 'bg-[#202027] text-[#E8CA91] border-[#302E31]',
    },
  ];

  const recent = overviewData?.recent_products || [];

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-[#F5F0E7]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#302E31]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7]">दुकान का आज का हाल (Overview)</h2>
          <p className="text-xs sm:text-sm text-[#817C77] mt-0.5">
            दुकान में कितना सामान है और कौन सा सामान खत्म हो गया है, यहाँ देखें।
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-5 py-3 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#17171C] rounded-2xl border border-[#302E31] p-5 midnight-card-shadow flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#B0AAA1] block">{s.label}</span>
                <span className="text-[11px] text-[#817C77] block">{s.english}</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#D2AC68] mt-1 block tabular-nums">
                  {s.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Updated Products Table */}
      <div className="bg-[#17171C] rounded-2xl border border-[#302E31] overflow-hidden midnight-card-shadow space-y-3">
        <div className="px-6 py-4 border-b border-[#302E31] flex items-center justify-between bg-[#101014]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#F5F0E7]">हाल ही में बदले गए भाव</h3>
            <p className="text-xs text-[#817C77]">जिन सामानों के रेट हाल में अपडेट किए गए हैं</p>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs sm:text-sm font-bold text-[#D2AC68] hover:text-[#E8CA91] flex items-center gap-1 cursor-pointer"
          >
            <span>सभी सामान देखें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101014] border-b border-[#302E31] text-[#817C77] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">सामान का नाम</th>
                <th className="py-3.5 px-4">श्रेणी</th>
                <th className="py-3.5 px-4">तौल का तरीका</th>
                <th className="py-3.5 px-4">वर्तमान भाव</th>
                <th className="py-3.5 px-4">दुकान में है?</th>
                <th className="py-3.5 px-6 text-right">भाव बदलें</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#302E31]/70">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#817C77] text-sm">
                    अभी कोई सामान नहीं है। ऊपर दिए गए '+ नया सामान जोड़ें' बटन पर क्लिक करें।
                  </td>
                </tr>
              ) : (
                recent.map((product) => {
                  const opts = product.price_options || [];
                  const defaultOpt = opts.find((o) => o.is_default) || opts[0];
                  return (
                    <tr key={product.id} className="hover:bg-[#202027]/50 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#F5F0E7]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#101014] border border-[#302E31] overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image_url ? (
                              <img src={getFullImageUrl(product.image_url)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-[#817C77]" />
                            )}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-[#F5F0E7]">{product.name}</span>
                            {product.brand && (
                              <span className="text-[11px] text-[#D2AC68] block font-normal">{product.brand}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#B0AAA1] font-medium text-xs">
                        {product.category?.name || '—'}
                      </td>

                      <td className="py-3.5 px-4 capitalize text-[#817C77] text-xs">
                        {product.pricing_type === 'weight' ? 'खुला वजन' : product.pricing_type === 'small_quantity' ? 'मसाले' : 'पैकेट'}
                      </td>

                      <td className="py-3.5 px-4">
                        {defaultOpt ? (
                          <div className="font-bold text-[#D2AC68] tabular-nums text-sm">
                            {currencySymbol}{parseFloat(defaultOpt.price).toFixed(2)}
                            <span className="text-[#817C77] font-normal text-xs ml-1">/ {defaultOpt.unit_label}</span>
                          </div>
                        ) : (
                          <span className="text-[#817C77] italic">तय नहीं</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {product.is_available ? (
                          <span className="px-2.5 py-1 rounded-md bg-[#101014] text-[#70C69A] border border-[#70C69A]/30 font-bold text-xs">
                            ✓ उपलब्ध है
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-[#101014] text-[#F08A83] border border-[#F08A83]/30 font-bold text-xs">
                            खत्म है
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="px-3 py-1.5 bg-[#202027] hover:bg-[#D2AC68] text-[#D2AC68] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>भाव बदलें</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
