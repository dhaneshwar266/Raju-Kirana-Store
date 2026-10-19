import React from 'react';
import { Phone, MapPin, Clock, Shield, Navigation } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function Footer({ storeSettings, onNavigate }) {
  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const tagline = storeSettings?.tagline || 'दुकान का पूरा सामान एवं आज का ताजा भाव';
  const phone = storeSettings?.contact_phone || '6266444862';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const whatsappNumber = storeSettings?.whatsapp_number || '6266444862';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';

  return (
    <footer className="bg-[#0A0A0C] text-[#B0AAA1] pt-8 pb-10 border-t border-[#302E31] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Footer Block */}
        <div className="bg-[#121216] border border-[#302E31] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Store Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17171C] border border-[#302E31] text-[#D2AC68] flex items-center justify-center font-bold text-sm shadow-xs">
                राजू
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F5F0E7] tracking-tight">{storeName}</h3>
                <p className="text-xs text-[#D2AC68] font-medium">{tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#B0AAA1] flex-wrap pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D2AC68] shrink-0" />
                <span>{address}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D2AC68] shrink-0" />
                <span>{hours}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Maps, Call, WhatsApp */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#17171C] hover:bg-[#202027] text-[#D2AC68] hover:text-[#E8CA91] border border-[#302E31] hover:border-[#D2AC68]/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
              title="गूगल मैप्स पर दुकान देखें"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>मैप पर रास्ता देखें</span>
            </a>

            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 bg-[#17171C] hover:bg-[#202027] text-[#F5F0E7] hover:text-[#70C69A] border border-[#302E31] px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                title="फोन कॉल करें"
              >
                <Phone className="w-3.5 h-3.5 text-[#70C69A]" />
                <span className="tabular-nums">कॉल: {phone}</span>
              </a>
            )}

            {whatsappNumber && (
              <WhatsAppButton
                whatsappNumber={whatsappNumber}
                storeName={storeName}
                className="text-xs py-2 px-3.5"
              />
            )}
          </div>
        </div>

        {/* Bottom bar with Copyright & Owner login */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#817C77] gap-3 px-1">
          <div>
            © {new Date().getFullYear()} {storeName} • आपकी अपनी किराना दुकान
          </div>

          <div className="flex items-center gap-4">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D2AC68] transition-colors"
            >
              Google Maps
            </a>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-[#D2AC68] hover:text-[#E8CA91] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Shield className="w-3 h-3 text-[#D2AC68]" />
              <span>मालिक लॉगिन (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
