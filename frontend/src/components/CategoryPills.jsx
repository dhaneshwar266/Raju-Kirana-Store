import React from 'react';
import { Layers } from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
      {/* All Items Pill */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all duration-200 border cursor-pointer ${
          selectedCategory === null
            ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm'
            : 'bg-[#17171C] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
            selectedCategory === null ? 'bg-[#D2AC68] text-[#0A0A0C]' : 'bg-[#202027] text-[#817C77]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span>सभी सामान (All)</span>
      </button>

      {/* Category List */}
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'bg-[#202027] text-[#D2AC68] border-[#D2AC68] shadow-sm'
                : 'bg-[#17171C] text-[#B0AAA1] border-[#302E31] hover:border-[#D2AC68]/40 hover:text-[#F5F0E7]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                isSelected ? 'bg-[#D2AC68] text-[#0A0A0C]' : 'bg-[#202027] text-[#817C77]'
              }`}
            >
              {getCategoryIcon(cat.icon_name, 'w-3.5 h-3.5 stroke-[2.2]')}
            </div>
            <span>{cat.name}</span>
            {cat.product_count !== undefined && cat.product_count > 0 && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  isSelected
                    ? 'bg-[#D2AC68]/20 text-[#E8CA91]'
                    : 'bg-[#101014] text-[#817C77]'
                }`}
              >
                {cat.product_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
