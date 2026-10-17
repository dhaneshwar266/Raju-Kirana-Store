import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryPills from '../components/CategoryPills';
import ProductCard from '../components/ProductCard';

export default function HomePage({
  storeSettings,
  categories,
  featuredProducts,
  recentProducts,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onNavigate,
  onSearchSubmit,
}) {
  const currency = storeSettings?.currency_symbol || '₹';

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-[#0A0A0C] text-[#F5F0E7]">
      {/* 1. Simple Hero Section */}
      <Hero
        storeSettings={storeSettings}
        onBrowseProducts={() => onNavigate('products')}
        categories={categories}
        onSelectCategory={(catId) => onNavigate('products', { category_id: catId })}
        onSearchSubmit={onSearchSubmit}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 2. Category Quick Selection */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-[#302E31]">
            <div>
              <span className="text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31] inline-block">
                श्रेणियाँ • CATEGORIES
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7] tracking-tight mt-1">
                सामान की श्रेणी चुनें
              </h2>
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs font-bold text-[#D2AC68] hover:text-[#E8CA91] flex items-center gap-1 group cursor-pointer self-start sm:self-auto"
            >
              <span>सभी श्रेणियां देखें</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              if (catId) {
                onNavigate('products', { category_id: catId });
              } else {
                onNavigate('products');
              }
            }}
          />
        </section>

        {/* 3. Featured Staples & Daily Rates */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#302E31]">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31]">
                  <Sparkles className="w-3 h-3 text-[#D2AC68]" />
                  दैनिक मुख्य राशन • DAILY STAPLES
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-[#F5F0E7] tracking-tight mt-1">
                  दुकान के खास सामान और आज के भाव
                </h2>
                <p className="text-xs sm:text-sm text-[#817C77] mt-0.5">
                  छना हुआ आटा, बिना पॉलिश दालें और ग्राम में खुले मसाले।
                </p>
              </div>

              <button
                onClick={() => onNavigate('products')}
                className="text-xs sm:text-sm font-bold text-[#D2AC68] hover:text-[#E8CA91] flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>पूरी भाव सूची देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  currencySymbol={currency}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
