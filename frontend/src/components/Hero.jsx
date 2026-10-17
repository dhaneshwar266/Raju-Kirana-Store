import React from 'react';
import { ArrowRight, Scale, ShieldCheck, Tag, Search, Clock, CheckCircle } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function Hero({
  storeSettings,
  onBrowseProducts,
  categories = [],
  onSelectCategory,
  onSearchSubmit,
}) {
  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const whatsappNumber = storeSettings?.whatsapp_number;
  const currency = storeSettings?.currency_symbol || '₹';

  return (
    <section className="relative overflow-hidden bg-[#0A0A0C] text-[#F5F0E7] border-b border-[#302E31]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy - Simple, Clear & Hindi-friendly */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Store Status Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17171C] border border-[#302E31] text-[#D2AC68] text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#70C69A] animate-pulse inline-block" />
              <span>दुकान खुली है • {hours}</span>
            </div>

            {/* Clear, bold Hindi Headline */}
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F0E7] leading-tight">
              घर का शुद्ध राशन,{' '}
              <span className="text-[#D2AC68]">
                सही तौल और पक्के भाव
              </span>
            </h1>

            {/* Simple Subhead */}
            <p className="text-[#B0AAA1] text-sm sm:text-base max-w-xl leading-relaxed font-normal">
              {storeName} पर गेहूं का आटा, बिना पॉलिश दालें, ग्राम में खुले मसाले, शुद्ध तेल और रोज़मर्रा की घरेलू चीजें सही वजन और काउंटर के पक्के भाव पर उपलब्ध हैं।
            </p>

            {/* Simple Search Box */}
            <div className="pt-1 max-w-xl mx-auto lg:mx-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = e.currentTarget.search.value;
                  if (val) onSearchSubmit(val);
                }}
                className="relative flex items-center bg-[#17171C] rounded-2xl shadow-lg p-1.5 border border-[#302E31] focus-within:border-[#D2AC68] transition-all"
              >
                <Search className="w-5 h-5 text-[#817C77] ml-3 shrink-0" />
                <input
                  name="search"
                  type="text"
                  placeholder="सामान खोजें (जैसे आटा, दाल, जीरा, चीनी)..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-[#F5F0E7] placeholder-[#817C77] bg-transparent outline-none font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-gold-primary rounded-xl text-xs sm:text-sm font-bold cursor-pointer shrink-0 shadow-sm"
                >
                  खोजें
                </button>
              </form>
            </div>

            {/* Simple, Large CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onBrowseProducts}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl btn-gold-primary text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group cursor-pointer shadow-lg"
              >
                <span>दुकान का पूरा सामान और भाव देखें</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {whatsappNumber && (
                <WhatsAppButton
                  whatsappNumber={whatsappNumber}
                  storeName={storeName}
                  className="w-full sm:w-auto py-3.5"
                />
              )}
            </div>

            {/* Trust Highlights in Simple Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
              <div className="bg-[#17171C] border border-[#302E31] p-3 rounded-xl flex items-center gap-3">
                <Scale className="w-5 h-5 text-[#D2AC68] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E7] block">100% सही तौल</span>
                  <span className="text-[11px] text-[#817C77]">1 पाव, आधा किलो या किलो में</span>
                </div>
              </div>

              <div className="bg-[#17171C] border border-[#302E31] p-3 rounded-xl flex items-center gap-3">
                <Tag className="w-5 h-5 text-[#D2AC68] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E7] block">सच्चे काउंटर भाव</span>
                  <span className="text-[11px] text-[#817C77]">कोई अतिरिक्त शुल्क नहीं</span>
                </div>
              </div>

              <div className="bg-[#17171C] border border-[#302E31] p-3 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D2AC68] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E7] block">साफ-सुथरा राशन</span>
                  <span className="text-[11px] text-[#817C77]">कंकड़ रहित छना हुआ अनाज</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Daily Rate Board - Simple & High Legibility */}
          <div className="lg:col-span-5">
            <div className="bg-[#17171C] border border-[#302E31] p-6 rounded-2xl midnight-card-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#302E31]">
                <div>
                  <span className="text-sm font-bold text-[#F5F0E7] block">
                    आज के खास सामान और भाव
                  </span>
                  <span className="text-[11px] text-[#817C77]">दुकान काउंटर पर प्रमाणित</span>
                </div>
                <span className="text-[11px] bg-[#202027] text-[#D2AC68] font-bold px-2 py-0.5 rounded border border-[#302E31]">
                  ताज़ा रेट
                </span>
              </div>

              {/* 4 simple daily staples with clear large pricing */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#101014] p-3.5 rounded-xl border border-[#302E31]">
                  <span className="text-[#B0AAA1] font-semibold block text-xs">एमपी शरबती आटा</span>
                  <span className="text-[#D2AC68] font-bold text-lg tabular-nums mt-0.5 block">{currency}50 / किलो</span>
                  <span className="text-[#817C77] text-[11px] block mt-0.5">1 पाव: {currency}14</span>
                </div>

                <div className="bg-[#101014] p-3.5 rounded-xl border border-[#302E31]">
                  <span className="text-[#B0AAA1] font-semibold block text-xs">अरहर (तूर) दाल</span>
                  <span className="text-[#D2AC68] font-bold text-lg tabular-nums mt-0.5 block">{currency}155 / किलो</span>
                  <span className="text-[#817C77] text-[11px] block mt-0.5">1 पाव: {currency}40</span>
                </div>

                <div className="bg-[#101014] p-3.5 rounded-xl border border-[#302E31]">
                  <span className="text-[#B0AAA1] font-semibold block text-xs">उंझा स्पेशल जीरा</span>
                  <span className="text-[#D2AC68] font-bold text-lg tabular-nums mt-0.5 block">{currency}42 / 100g</span>
                  <span className="text-[#817C77] text-[11px] block mt-0.5">20 ग्राम: {currency}10</span>
                </div>

                <div className="bg-[#101014] p-3.5 rounded-xl border border-[#302E31]">
                  <span className="text-[#B0AAA1] font-semibold block text-xs">फॉर्च्यून तेल</span>
                  <span className="text-[#D2AC68] font-bold text-lg tabular-nums mt-0.5 block">{currency}142 / लीटर</span>
                  <span className="text-[#817C77] text-[11px] block mt-0.5">5 लीटर जार: {currency}690</span>
                </div>
              </div>

              {/* Department Shortcut Pills */}
              <div className="pt-2 border-t border-[#302E31]">
                <span className="text-xs font-semibold text-[#817C77] block mb-2">
                  सामान की श्रेणी चुनें:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className="bg-[#202027] hover:bg-[#101014] hover:border-[#D2AC68]/40 text-[#B0AAA1] hover:text-[#F5F0E7] text-xs font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#302E31]"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
