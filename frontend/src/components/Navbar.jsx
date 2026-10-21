import React from 'react';
import { Search, Shield, Phone, MapPin, Store, Clock, Scale, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  storeSettings,
  searchQuery,
  onSearchChange,
  activeView,
  onNavigate,
  onOpenCalculator,
}) {
  const { isAuthenticated } = useAuth();

  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const tagline = storeSettings?.tagline || 'दुकान का पूरा सामान एवं आज का ताजा भाव';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const phone = storeSettings?.contact_phone || '6266444862';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#302E31] text-[#F5F0E7] w-full max-w-full overflow-hidden">
      {/* Top Bar for Address, Phone & Actions */}
      <div className="bg-[#101014] text-[#B0AAA1] text-xs py-1.5 sm:py-2 px-2.5 sm:px-4 border-b border-[#302E31]/70 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium gap-2 min-w-0 w-full">
          {/* Location & Timings */}
          <div className="flex items-center gap-2 sm:gap-3 truncate text-xs min-w-0 flex-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 truncate hover:text-[#D2AC68] transition-colors cursor-pointer min-w-0"
              title="गूगल मैप पर दुकान की लोकेशन खोलें"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D2AC68] shrink-0" />
              <span className="truncate text-[#F5F0E7]/90 hover:underline">{address}</span>
            </a>
            <span className="hidden md:inline text-[#302E31]">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#B0AAA1] shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#D2AC68]" />
              <span>{hours}</span>
            </span>
          </div>

          {/* Quick Buttons: Call, Calculator, Admin */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 sm:gap-1.5 text-[#F5F0E7] hover:text-[#D2AC68] bg-[#17171C] border border-[#302E31] px-2 sm:px-2.5 py-1 rounded-lg transition-colors text-xs font-semibold shrink-0"
                title="दुकान पर कॉल करें"
              >
                <Phone className="w-3.5 h-3.5 text-[#D2AC68]" />
                <span className="tabular-nums font-bold hidden sm:inline">{phone}</span>
                <span className="sm:hidden font-bold">कॉल</span>
              </a>
            )}

            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1 sm:gap-1.5 text-[#0A0A0C] bg-[#D2AC68] hover:bg-[#E8CA91] font-bold transition-colors cursor-pointer text-xs px-2 sm:px-2.5 py-1 rounded-lg shadow-xs shrink-0"
              title="रुपये से ग्राम वजन निकालें"
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">⚖️ कांटा कैलकुलेटर</span>
              <span className="sm:hidden">कैलकुलेटर</span>
            </button>

            <button
              onClick={() => onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="text-[#D2AC68] hover:text-[#E8CA91] font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs p-1 sm:px-2 sm:py-1 rounded-lg bg-[#17171C] border border-[rgba(210,172,104,0.3)] hover:border-[#D2AC68] shrink-0"
              title="दुकानदार पोर्टल"
            >
              <Shield className="w-3.5 h-3.5 text-[#D2AC68]" />
              <span className="hidden md:inline">{isAuthenticated ? 'कंट्रोल रूम' : 'मालिक लॉगिन'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 w-full">
          {/* Logo & Store Branding */}
          <div
            onClick={() => onNavigate('products')}
            className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3 cursor-pointer min-w-0 group"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#17171C] border border-[#302E31] group-hover:border-[#D2AC68] text-[#D2AC68] flex items-center justify-center transition-all shadow-sm shrink-0">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-[#F5F0E7] group-hover:text-[#E8CA91] transition-colors truncate">
                    {storeName}
                  </span>
                  <span className="text-[10px] font-bold text-[#70C69A] bg-[#101014] px-1.5 py-0.5 rounded border border-[#70C69A]/30 shrink-0">
                    आज का ताजा भाव
                  </span>
                </div>
                <span className="text-xs text-[#B0AAA1] block font-medium mt-0.5 truncate max-w-[200px] xs:max-w-xs sm:max-w-md">
                  {tagline}
                </span>
              </div>
            </div>

            {/* Mobile Direction Button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center gap-1 text-[11px] font-bold text-[#D2AC68] bg-[#17171C] border border-[#302E31] px-2.5 py-1.5 rounded-lg shrink-0 ml-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>रास्ता</span>
            </a>
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:flex-1 md:max-w-lg lg:max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D2AC68]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="दुकान का सामान खोजें (जैसे आटा, दाल, तेल, जीरा, चीनी)..."
                className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-[#141418] text-[#F5F0E7] placeholder-[#817C77] rounded-xl border border-[#3A383E] focus:border-[#D2AC68] focus:bg-[#1A1A20] focus:ring-1 focus:ring-[#D2AC68]/30 outline-none font-medium transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#817C77] hover:text-[#E8CA91] cursor-pointer bg-[#202027] px-2 py-0.5 rounded"
                >
                  हटाएं
                </button>
              ) : null}
            </div>
          </div>

          {/* Directions Button for Desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#D2AC68] hover:text-[#E8CA91] bg-[#17171C] hover:bg-[#202027] border border-[#302E31] hover:border-[#D2AC68]/50 px-3 py-2.5 rounded-xl transition-all shadow-xs"
              title="गूगल मैप्स पर दुकान का रास्ता देखें"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>दुकान का रास्ता</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
