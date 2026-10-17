import React from 'react';
import { Phone, MapPin, Clock, Shield } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function Footer({ storeSettings, onNavigate, categories = [] }) {
  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const tagline = storeSettings?.tagline || 'घर का शुद्ध राशन • आज का ताज़ा भाव';
  const phone = storeSettings?.contact_phone || '6266444862';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const whatsappNumber = storeSettings?.whatsapp_number || '6266444862';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';

  return (
    <footer className="bg-[#0A0A0C] text-[#B0AAA1] pt-12 pb-8 border-t border-[#302E31] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[rgba(210,172,104,0.22)]">
          {/* Col 1: Store Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17171C] border border-[#302E31] text-[#D2AC68] flex items-center justify-center font-bold shadow-xs">
                <span className="font-bold text-base text-[#D2AC68]">राजू</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F5F0E7] tracking-tight">{storeName}</h3>
                <p className="text-xs text-[#D2AC68] font-medium">{tagline}</p>
              </div>
            </div>

            <p className="text-xs text-[#817C77] leading-relaxed font-normal">
              शुद्ध गेहूं का आटा, बिना पॉलिश दालें, ग्राम में खुले खड़े व पिसे मसाले, शुद्ध तेल और रोज़मर्रा की घरेलू जरूरतें।
            </p>

            {whatsappNumber && (
              <WhatsAppButton
                whatsappNumber={whatsappNumber}
                storeName={storeName}
                className="w-full text-xs py-2.5"
              />
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D2AC68] uppercase tracking-wider">
              दुकान के पेज (Navigation)
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#E8CA91] transition-colors cursor-pointer"
                >
                  मुख्य पृष्ठ (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#E8CA91] transition-colors cursor-pointer"
                >
                  पूरा सामान और भाव सूची (All Rates)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#E8CA91] transition-colors cursor-pointer"
                >
                  सामान की श्रेणियाँ (Categories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#E8CA91] transition-colors cursor-pointer"
                >
                  दुकान का पता व समय (Hours & Contact)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-[#D2AC68] hover:text-[#E8CA91] transition-colors flex items-center gap-1.5 cursor-pointer pt-1"
                >
                  <Shield className="w-3.5 h-3.5 text-[#D2AC68]" />
                  <span>दुकानदार लॉगिन (मालिक पोर्टल)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D2AC68] uppercase tracking-wider">
              श्रेणियाँ (Categories)
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onNavigate('products', { category_id: cat.id });
                    }}
                    className="hover:text-[#E8CA91] transition-colors cursor-pointer text-left truncate max-w-full block"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Store Visit & Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D2AC68] uppercase tracking-wider">
              दुकान का समय व संपर्क
            </h4>
            <div className="space-y-2.5 text-xs text-[#B0AAA1]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D2AC68] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#D2AC68] transition-colors hover:underline block"
                    title="गूगल मैप पर दुकान की लोकेशन खोलें"
                  >
                    {address}
                  </a>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#D2AC68] hover:text-[#E8CA91] font-bold inline-block mt-0.5"
                  >
                    📍 मैप पर रास्ता देखें (Open Map)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D2AC68] shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>

              {phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#D2AC68] shrink-0 mt-0.5" />
                  <a href={`tel:${phone}`} className="hover:text-[#E8CA91] transition-colors font-bold text-[#F5F0E7] tabular-nums">
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#817C77] gap-3">
          <div>
            © {new Date().getFullYear()} {storeName} • आपकी अपनी किराना दुकान
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('contact')} className="hover:text-[#E8CA91] transition-colors cursor-pointer">
              दुकान का समय
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('admin-login')} className="hover:text-[#E8CA91] transition-colors cursor-pointer text-[#D2AC68]">
              मालिक लॉगिन
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
