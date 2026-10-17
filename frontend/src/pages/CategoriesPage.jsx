import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function CategoriesPage({ categories = [], onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#0A0A0C] text-[#F5F0E7]">
      <div>
        <span className="text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31] inline-block">
          दुकान के विभाग • STORE CATEGORIES
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F0E7] mt-2 tracking-tight">
          सामान की श्रेणियाँ (Departments)
        </h1>
        <p className="text-xs sm:text-sm text-[#817C77] mt-1 max-w-2xl font-normal">
          आटा, दालें, मसाले, तेल, साबुन व घरेलू उपयोग का सामान श्रेणी अनुसार देखें।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group bg-[#17171C] rounded-2xl border border-[#302E31] p-6 midnight-card-shadow hover:border-[#D2AC68]/50 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#202027] text-[#D2AC68] flex items-center justify-center border border-[#302E31] group-hover:border-[#D2AC68]/60 transition-colors">
                  {getCategoryIcon(cat.icon_name, 'w-6 h-6 stroke-[1.75] text-[#D2AC68]')}
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-md bg-[#202027] text-[#B0AAA1] border border-[#302E31] tabular-nums">
                  {cat.product_count || 0} सामान
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F5F0E7] group-hover:text-[#E8CA91] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-[#817C77] mt-1.5 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#302E31] flex items-center justify-between text-xs font-bold text-[#D2AC68] group-hover:text-[#E8CA91]">
              <span>इस श्रेणी के भाव देखें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
