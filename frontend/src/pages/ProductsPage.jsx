import React from 'react';
import { Search, SlidersHorizontal, PackageX, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryPills from '../components/CategoryPills';

export default function ProductsPage({
  products,
  totalProducts,
  categories,
  loading,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  inStockOnly,
  onToggleInStockOnly,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  onSelectProduct,
  storeSettings,
  onResetFilters,
}) {
  const currency = storeSettings?.currency_symbol || '₹';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#0A0A0C] text-[#F5F0E7]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#302E31]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31]">
            <Sparkles className="w-3 h-3 text-[#D2AC68]" />
            पक्की भाव सूची • COUNTER RATES
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F0E7] mt-2 tracking-tight">
            दुकान का पूरा सामान एवं आज के भाव
          </h1>
          <p className="text-xs sm:text-sm text-[#817C77] mt-1 max-w-2xl font-normal">
            सभी सामान के सही तौल, पैकेट साइज और ताज़ा काउंटर भाव यहाँ देखें।
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs sm:text-sm text-[#B0AAA1] font-semibold bg-[#17171C] px-4 py-2 rounded-xl border border-[#302E31] self-start md:self-auto tabular-nums">
          कुल सामान: <span className="font-bold text-[#D2AC68]">{totalProducts}</span> में से{' '}
          <span className="font-bold text-[#F5F0E7]">{products.length}</span> दिखाए जा रहे हैं
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#17171C] p-4 sm:p-5 rounded-2xl border border-[#302E31] midnight-card-shadow space-y-4">
        {/* Row 1: Search, Sort & In-Stock */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D2AC68]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="नाम या ब्रांड से खोजें (जैसे आटा, दाल, जीरा, तेल, चीनी)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#817C77] hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#B0AAA1] rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none font-bold cursor-pointer"
            >
              <option value="newest">क्रम: नया सामान पहले</option>
              <option value="name_asc">क्रम: नाम (A से Z)</option>
              <option value="name_desc">क्रम: नाम (Z से A)</option>
              <option value="price_asc">क्रम: कम भाव पहले (Low to High)</option>
              <option value="price_desc">क्रम: ज्यादा भाव पहले (High to Low)</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#101014] hover:bg-[#202027] border border-[#302E31] text-xs font-bold text-[#B0AAA1] hover:text-[#F5F0E7] cursor-pointer select-none shrink-0 w-full sm:w-auto justify-center transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#D2AC68] rounded cursor-pointer"
            />
            <span>केवल उपलब्ध सामान (In Stock)</span>
          </label>
        </div>

        {/* Row 2: Category Filter Horizontal Pills */}
        <div className="pt-2 border-t border-[#302E31]">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>

      {/* Active filters summary */}
      {(searchQuery || selectedCategory !== null || inStockOnly) && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#B0AAA1] bg-[#17171C] p-3 rounded-xl border border-[#302E31]">
          <span className="font-bold text-[#D2AC68]">चुने हुए फिल्टर:</span>
          {searchQuery && (
            <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#302E31] text-[#F5F0E7] font-semibold">
              खोज: "{searchQuery}"
            </span>
          )}
          {selectedCategory && (
            <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#302E31] text-[#F5F0E7] font-semibold">
              श्रेणी: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
            </span>
          )}
          {inStockOnly && (
            <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#302E31] text-[#70C69A] font-bold">
              ✓ केवल उपलब्ध
            </span>
          )}
          <button
            onClick={onResetFilters}
            className="ml-auto text-[#D2AC68] hover:text-[#E8CA91] font-bold underline cursor-pointer flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>सभी फिल्टर हटाएं (Show All)</span>
          </button>
        </div>
      )}

      {/* Product Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#17171C] rounded-2xl border border-[#302E31] p-4 space-y-4 animate-pulse">
              <div className="aspect-4/3 bg-[#202027] rounded-xl" />
              <div className="h-4 bg-[#202027] rounded w-3/4" />
              <div className="h-3 bg-[#202027] rounded w-1/2" />
              <div className="h-6 bg-[#202027] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#17171C] rounded-2xl border border-[#302E31] p-12 text-center max-w-lg mx-auto space-y-4 my-8 midnight-card-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#202027] text-[#D2AC68] flex items-center justify-center mx-auto border border-[#302E31]">
            <PackageX className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#F5F0E7]">कोई सामान नहीं मिला</h3>
          <p className="text-xs text-[#817C77] leading-relaxed">
            इस नाम या श्रेणी में कोई सामान नहीं मिला। कृपया दूसरा नाम लिखकर देखें या सभी फिल्टर हटाकर पूरा सामान देखें।
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold-primary rounded-xl text-xs font-bold cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>पूरा सामान देखें</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              currencySymbol={currency}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2.5 rounded-xl border border-[#302E31] bg-[#17171C] text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="पिछला पेज"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                  isCurrent
                    ? 'bg-[#D2AC68] text-[#0A0A0C] shadow-md'
                    : 'bg-[#17171C] border border-[#302E31] text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2.5 rounded-xl border border-[#302E31] bg-[#17171C] text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#202027] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="अगला पेज"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
