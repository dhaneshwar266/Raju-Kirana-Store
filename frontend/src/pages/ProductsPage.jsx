import React from 'react';
import { PackageX, RotateCcw, ChevronLeft, ChevronRight, Sparkles, MapPin, Phone, Scale, Navigation } from 'lucide-react';
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
  onOpenCalculator,
}) {
  const currency = storeSettings?.currency_symbol || '₹';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const phone = storeSettings?.contact_phone || '6266444862';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 bg-[#0A0A0C] text-[#F5F0E7]">
      {/* Top Banner: Store Info & Daily Rates Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#302E31]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31]">
              <Sparkles className="w-3 h-3 text-[#D2AC68]" />
              पक्की भाव सूची • TODAY'S LIVE RATES
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#70C69A] bg-[#101014] px-2.5 py-0.5 rounded border border-[#70C69A]/30">
              दुकान का ताजा काउंटर भाव
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F0E7] tracking-tight">
            दुकान का पूरा सामान एवं आज के ताजा भाव
          </h1>

          <p className="text-xs sm:text-sm text-[#817C77] max-w-2xl font-normal">
            घर का आटा, बिना पॉलिश दालें, शुद्ध तेल और ग्राम में खुले मसालों के सही रेट यहाँ देखें।
          </p>

          {/* Quick Info & Action Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#17171C] hover:bg-[#202027] text-[#B0AAA1] hover:text-[#D2AC68] px-3 py-1.5 rounded-lg border border-[#302E31] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D2AC68]" />
              <span>{address}</span>
              <Navigation className="w-3 h-3 text-[#D2AC68] ml-1" />
            </a>

            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1.5 bg-[#17171C] hover:bg-[#202027] text-[#B0AAA1] hover:text-[#70C69A] px-3 py-1.5 rounded-lg border border-[#302E31] transition-colors font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#70C69A]" />
                <span className="tabular-nums">कॉल करें: {phone}</span>
              </a>
            )}

            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-1.5 bg-[#D2AC68]/15 hover:bg-[#D2AC68]/25 text-[#E8CA91] px-3 py-1.5 rounded-lg border border-[#D2AC68]/40 transition-colors font-bold cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#D2AC68]" />
                <span>₹10 / ₹15 कांटा कैलकुलेटर</span>
              </button>
            )}
          </div>
        </div>

        {/* Total Count Badge */}
        <div className="text-xs sm:text-sm text-[#B0AAA1] font-semibold bg-[#17171C] px-4 py-2.5 rounded-xl border border-[#302E31] self-start lg:self-end tabular-nums shrink-0 shadow-xs">
          दुकान में कुल सामान: <span className="font-bold text-[#D2AC68] text-base">{totalProducts}</span>
        </div>
      </div>

      {/* Category Filter Horizontal Pills */}
      <div className="bg-[#17171C] p-3 sm:p-4 rounded-2xl border border-[#302E31] midnight-card-shadow">
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
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
        <div className="bg-[#17171C] rounded-2xl border border-[#302E31] p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 my-8 midnight-card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-[#202027] text-[#D2AC68] flex items-center justify-center mx-auto border border-[#302E31]">
            <PackageX className="w-8 h-8 stroke-[1.5]" />
          </div>
          {searchQuery || selectedCategory ? (
            <>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F0E7]">कोई सामान नहीं मिला</h3>
              <p className="text-xs text-[#817C77] leading-relaxed">
                इस नाम या श्रेणी में कोई सामान नहीं मिला। कृपया दूसरा नाम लिखकर देखें या सभी सामान देखें।
              </p>
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold-primary rounded-xl text-xs font-bold cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पूरा सामान देखें</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F0E7]">दुकान का नया सामान जल्द आ रहा है</h3>
              <p className="text-xs text-[#817C77] leading-relaxed">
                दुकानदार द्वारा सामान और आज के ताजा भाव जोड़े जा रहे हैं।
              </p>
              <p className="text-xs text-[#D2AC68] font-medium pt-1">
                अगर आप दुकान के मालिक हैं, तो एडमिन पैनल में जाकर <strong>+ नया सामान जोड़ें</strong> पर क्लिक करें।
              </p>
            </>
          )}
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
