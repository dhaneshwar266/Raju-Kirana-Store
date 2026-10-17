import React, { useState } from 'react';
import { Search, Menu, X, Shield, Phone, MapPin, Store, Clock, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  storeSettings,
  searchQuery,
  onSearchChange,
  activeView,
  onNavigate,
  onOpenCalculator,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleNavClick = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const tagline = storeSettings?.tagline || 'घर का शुद्ध राशन • आज का ताज़ा भाव';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const phone = storeSettings?.contact_phone || '6266444862';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#302E31] text-[#F5F0E7]">
      {/* Top Bar for Address, Phone & Owner Login */}
      <div className="bg-[#101014] text-[#B0AAA1] text-xs py-2 px-4 border-b border-[#302E31]/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-3 truncate text-xs">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 truncate hover:text-[#D2AC68] transition-colors cursor-pointer"
              title="गूगल मैप पर दुकान की लोकेशन खोलें"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D2AC68] shrink-0" />
              <span className="truncate text-[#F5F0E7]/90 hover:underline">{address}</span>
            </a>
            <span className="hidden md:inline text-[#302E31]">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#B0AAA1]">
              <Clock className="w-3.5 h-3.5 text-[#D2AC68]" />
              <span>{hours}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 text-[#F5F0E7] hover:text-[#D2AC68] bg-[#17171C] border border-[#302E31] px-2.5 py-1 rounded-lg transition-colors text-xs font-semibold"
                title="दुकान पर कॉल करें"
              >
                <Phone className="w-3.5 h-3.5 text-[#D2AC68]" />
                <span className="tabular-nums font-bold">{phone}</span>
              </a>
            )}

            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 text-[#0A0A0C] bg-[#D2AC68] hover:bg-[#E8CA91] font-bold transition-colors cursor-pointer text-xs px-2.5 py-1 rounded-lg shadow-xs"
              title="रुपये से ग्राम वजन निकालें"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>⚖️ कांटा कैलकुलेटर</span>
            </button>

            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="text-[#D2AC68] hover:text-[#E8CA91] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs px-2.5 py-1 rounded-lg bg-[#17171C] border border-[rgba(210,172,104,0.3)] hover:border-[#D2AC68]"
            >
              <Shield className="w-3.5 h-3.5 text-[#D2AC68]" />
              <span>{isAuthenticated ? 'कंट्रोल रूम (Admin)' : 'मालिक लॉगिन'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Store Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            {/* Simple Store Monogram Icon */}
            <div className="w-11 h-11 rounded-xl bg-[#17171C] border border-[#302E31] group-hover:border-[#D2AC68] text-[#D2AC68] flex items-center justify-center transition-all shadow-sm shrink-0">
              <Store className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F0E7] group-hover:text-[#E8CA91] transition-colors whitespace-nowrap">
                  {storeName}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-[#D2AC68] bg-[#17171C] px-2 py-0.5 rounded border border-[rgba(210,172,104,0.3)] whitespace-nowrap">
                  किराना दुकान
                </span>
              </div>
              <span className="text-xs text-[#B0AAA1] hidden xl:block truncate max-w-56 font-medium mt-0.5">
                {tagline}
              </span>
            </div>
          </div>

          {/* Main Search Input - Never squished! */}
          <div className="hidden md:flex flex-1 min-w-[220px] max-w-sm lg:max-w-md mx-2 lg:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D2AC68]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeView !== 'products' && e.target.value) {
                    onNavigate('products');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && activeView !== 'products') {
                    onNavigate('products');
                  }
                }}
                placeholder="सामान खोजें (आटा, दाल, तेल, मसाले)..."
                className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm bg-[#141418] text-[#F5F0E7] placeholder-[#817C77] rounded-xl border border-[#3A383E] focus:border-[#D2AC68] focus:bg-[#1A1A20] focus:ring-1 focus:ring-[#D2AC68]/30 outline-none font-medium transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#817C77] hover:text-[#E8CA91] cursor-pointer bg-[#202027] px-1.5 py-0.5 rounded"
                >
                  हटाएं
                </button>
              ) : null}
            </div>
          </div>

          {/* Simple Clean Hindi Nav Buttons */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'home'
                  ? 'text-[#D2AC68] bg-[#17171C] border border-[#D2AC68] shadow-xs'
                  : 'text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              मुख्य पृष्ठ
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'products'
                  ? 'text-[#D2AC68] bg-[#17171C] border border-[#D2AC68] shadow-xs'
                  : 'text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              सामान व भाव
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'categories'
                  ? 'text-[#D2AC68] bg-[#17171C] border border-[#D2AC68] shadow-xs'
                  : 'text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              श्रेणियाँ
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'contact'
                  ? 'text-[#D2AC68] bg-[#17171C] border border-[#D2AC68] shadow-xs'
                  : 'text-[#B0AAA1] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              दुकान का पता
            </button>
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0A0A0C] bg-[#D2AC68] hover:bg-[#E8CA91] transition-all cursor-pointer shadow-xs whitespace-nowrap"
              title="रुपये से ग्राम वजन निकालें"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>कांटा कैलकुलेटर</span>
            </button>
          </nav>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#F5F0E7] bg-[#17171C] border border-[#302E31] transition-colors cursor-pointer"
              aria-label="मेनू खोलें"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D2AC68]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeView !== 'products' && e.target.value) {
                  onNavigate('products');
                }
              }}
              placeholder="सामान खोजें (आटा, दाल, तेल, मसाले)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#141418] text-[#F5F0E7] placeholder-[#817C77] rounded-xl border border-[#3A383E] outline-none focus:border-[#D2AC68] shadow-inner"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#817C77] hover:text-[#E8CA91] cursor-pointer bg-[#202027] px-1.5 py-0.5 rounded"
              >
                हटाएं
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#302E31] bg-[#101014] px-4 py-4 space-y-2 animate-fade-in shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
              activeView === 'home'
                ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68]'
                : 'text-[#F5F0E7] hover:bg-[#17171C]'
            }`}
          >
            🏠 मुख्य पृष्ठ (Home)
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
              activeView === 'products'
                ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68]'
                : 'text-[#F5F0E7] hover:bg-[#17171C]'
            }`}
          >
            📋 पूरा सामान और आज के भाव (All Rates)
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
              activeView === 'categories'
                ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68]'
                : 'text-[#F5F0E7] hover:bg-[#17171C]'
            }`}
          >
            📁 सामान की श्रेणियाँ (Categories)
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
              activeView === 'contact'
                ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68]'
                : 'text-[#F5F0E7] hover:bg-[#17171C]'
            }`}
          >
            📍 दुकान का पता और समय (Hours & Contact)
          </button>

          <button
            onClick={() => {
              onOpenCalculator();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-[#D2AC68] text-[#0A0A0C] flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0A0A0C]" />
              ⚖️ कांटा कैलकुलेटर (₹ से वजन निकालें)
            </span>
          </button>

          <div className="pt-2 border-t border-[#302E31]">
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-[#17171C] text-[#D2AC68] border border-[#D2AC68] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D2AC68]" />
                {isAuthenticated ? 'कंट्रोल रूम (Admin Dashboard)' : 'दुकानदार लॉगिन (मालिक लॉगिन)'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
